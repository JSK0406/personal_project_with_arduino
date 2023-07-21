// -------------------------------------------------------------------------
// 처음 작동하면 기본 상태는 카운트 모드
// 파란 버튼을 누르면 카운트 모드(yellow_led) => 온도 모드(blue_led) => 조도 모드(green_led) => 카운트 모드 => ... 왼쪽과 같은 순서로 바뀜
// 각 모드에서 다음 모드로 전환할 때는 잠시 현재 모드의 led와 다음 모드의 led가 같이 켜짐
// 빨간(리셋) 버튼을 누르면 5초간 모든 led가 깜빡거리며 5초 뒤에는 count가 0으로 초기화 되고 카운트 모드로 다시 돌아감
// now_status = 0 : 카운트 모드, 1 : 온도 모드, 2 : 조도 모드, 3 : 리셋을 위한 상태
// 요청을 할 때마다 IP, count, temp, pr의 값이 text 형태로 날라감
// -------------------------------------------------------------------------

/////////////// 라이브러리 선언 부분 /////////////////

// wifi library
#include <WiFi.h>
#include <WiFiClient.h>
#include <WebServer.h>
WebServer server(80);  // create WebServer instance

// OLED library
#include "oled_u8g2.h"
OLED_U8G2 oled;  // create oled instance

/////////////   변수 선언 부분   ////////////////

// wifi setting 
const char* ssid = ".";
const char* password = "aaaaaaaa";

// 초음파 센서를 위한 변수
int count = 0;  // 카운터용 변수
int pre_time = 0;  // 이전에 물건이 지나간 시간
long duration, distance;  // 거리를 계산하기 위한 변수들

// 온도 센서를 위한 변수
float R1 = 10000;
float logR2, R2, T, Tc;
float c1 = 1.009249522e-03, c2 = 2.378405444e-04, c3 = 2.019202697e-07;

// 센서 값 선언 부분
int photoresistor_result;
int temp_result;

// 버튼 선언 부분
int reset_button = D6;  // 빨간버튼을 누르면 상황 리셋(리셋하면 카운팅으로)
int blue_button = D7;  // 파란버튼을 누르면 카운팅 -> 온도 -> 습도 모드로 차례로 바뀜

// 센서 선언 부분
int echo_sensor = D8;  // 초음파 센서 수신부
int trig_sensor = D9;  // 초음파 센서 송신부
int temp_sensor = A2;  // 온도 센서
int photoresistor_sensor = A1;  // 조도 센서

// led 선언 부분
int red_led = D2;  // 빨강 LED
int blue_led   = D3;  // 파랑 LED
int green_led  = D4;  // 초록 LED
int yellow_led = D5;  // 노랑 LED

// 현재의 모드를 저장하기 위한 값
int now_status = 0;  // 0 : 카운트 모드, 1 : 온도 모드, 2 : 습도 모드
int red_status = 0;  // 0 : 기본값(문제 없음), 1 : 문제 발생

// 전달할 데이터를 저장하기 위한 변수
String message = "";

/////////////// 데이터를 전달하기 위한 함수 ////////////////

// void handleRootEvent(count, Tc, photoresistor_result) {                       
void handleRootEvent() {                       
  String ClientIP = server.client().remoteIP().toString();

  // 메세지에 데이터들을 저장
  message += "IP:" + ClientIP + "\n";
  message += "count:" + String(count) + "\n";
  message += "Temperature:" + String(Tc) + "\n";
  message += "PR:" + String(photoresistor_result) + "\n";

  server.send(200, "text/plain", message);  // status code 200(OK), format, message
}

///////////// led를 제어하는 함수 ////////////////
// void controlLed(String r, String b, String g, String y) {
//     digitalWrite(red_led, r);
//     digitalWrite(blue_led, b);
//     digitalWrite(green_led, g);
//     digitalWrite(yellow_led, y);
// }

///////////// wifi를 연결하는 함수 ////////////////
void connectWifi() {
  // wifi connecting
  WiFi.mode(WIFI_STA);                          
  WiFi.begin(ssid, password);

  int sec = 0;
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print("접속중입니다  /  " + String(sec) + "초 경과\n");
    sec += 1;
  }

  Serial.println("접속되었습니다.");
  Serial.print("접속하실 IP는 // ");
  Serial.print(WiFi.localIP());
  Serial.println("// 입니다.");
  
  server.on("/", handleRootEvent);
  server.begin();
}

void operateTempsensor() {
    // 온도 센서를 통해 온도 측정
  R2 = R1 * (4095.0 / (float)temp_result - 1.0);
  logR2 = log(R2);
  T = (1.0 / (c1 + c2*logR2 + c3*logR2*logR2*logR2));
  Tc = T - 273.15; 
  delay(200);                                            // 0.2초대기
}

//////////// 초음파를 통해 카운팅하는 함수 ///////////
void operateUltrasonic() {
  // 초음파 센서 작동
  digitalWrite(trig_sensor, LOW);                // operate sensor
  delayMicroseconds(2);
  digitalWrite(trig_sensor, HIGH);
  delayMicroseconds(10);
  digitalWrite(trig_sensor, LOW);                // stop sensor
  
  // 거리와 카운트 계싼
  duration = pulseIn (echo_sensor, HIGH);        // 반사되어 돌아온 초음파의 시간을 저장
  distance = duration * 0.017;    // 거리를 cm로 변환

  // 거리를 통해 카운트 측정
  if(distance > 2 && distance < 8)            // 2 < distance < 10 
  {
      int now_time = millis();
      if(now_time - pre_time > 500)           // 중복 방지 
      {
          count += 1;                         
          pre_time = now_time;                // 이전 시각에 현재 시각 저장
      }
  }
}

void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200); // 시리얼 통신 준비
  oled.setup();  // oled 설정 준비

  //-----핀 모드 설정-----//

  // led
  pinMode(red_led,OUTPUT);           
  pinMode(blue_led,OUTPUT);           
  pinMode(green_led,OUTPUT);          
  pinMode(yellow_led,OUTPUT);          
  
  // button
  pinMode(reset_button, INPUT);
  pinMode(blue_button, INPUT);

  // ultrasonic sensor
  pinMode(trig_sensor, OUTPUT);
  pinMode(echo_sensor, INPUT);

  connectWifi(); 
}

// String makeText(int inp, String sensor_type) {
//   char text[32] = sensor_type + " : ";
//   char value[32];
//   String str = String(inp, DEC);
//   str.toCharArray(value, 6);
//   strcat(text, value);
//   return text;
// }

String intMakeText(int inp, String sensor_type) {
  String text = sensor_type + " : " + String(inp, DEC);
  return text;
}

String floatMakeText(float inp, String sensor_type) {
  String text = sensor_type + " : " + String(inp, DEC);
  return text;
}


void loop() {
  // 센서가 측정한 값 저장
  temp_result = analogRead(temp_sensor); // 온도 센서 값 저장
  photoresistor_result = analogRead(photoresistor_sensor);  // 조도 센서 값 저장

  operateTempsensor();
  operateUltrasonic();

  // 화면에 표시할 텍스트 설정

  // String count_text = intMakeText(count, "cnt");
  // String temp_text = floatMakeText(Tc, "Temp");
  // String pr_text = intMakeText(photoresistor_result, "pr");

  // 카운트 모드
    char count_text[32] = "cnt : ";                // count 값 표시
    char count_value[32];
    String count_str = String(count, DEC);
    count_str.toCharArray(count_value, 6);
    strcat(count_text, count_value);

  // 온도 모드
    char temp_text[32] = "T : ";                // temperature 값 표시
    char temp_value[32];
    String temp_str = String(Tc, DEC);
    temp_str.toCharArray(temp_value, 6);
    strcat(temp_text, temp_value);

  // 조도 모드
    char pr_text[32] = "pr : ";                // photoresistor 값 표시
    char pr_value[32];
    String pr_str = String(photoresistor_result, DEC);
    pr_str.toCharArray(pr_value, 6);
    strcat(pr_text, pr_value);


  // 빨간 버튼(리셋 버튼)누르면 5초간 깜빡거림
  if (red_status == 1) {
    oled.setLine(1, "!!!reset!!!");
    oled.setLine(2, "5seconds later");
    oled.setLine(3, "will be reset");
    oled.display();
    count = 0;

    digitalWrite(red_led, HIGH);
    digitalWrite(blue_led, HIGH);
    digitalWrite(green_led, HIGH);
    digitalWrite(yellow_led, HIGH);
    delay(1000);

    digitalWrite(red_led, LOW);
    digitalWrite(blue_led, LOW);
    digitalWrite(green_led, LOW);
    digitalWrite(yellow_led, LOW);
    delay(1000);

    digitalWrite(red_led, HIGH);
    digitalWrite(blue_led, HIGH);
    digitalWrite(green_led, HIGH);
    digitalWrite(yellow_led, HIGH);
    delay(1000);

    digitalWrite(red_led, LOW);
    digitalWrite(blue_led, LOW);
    digitalWrite(green_led, LOW);
    digitalWrite(yellow_led, LOW);
    delay(1000);

    digitalWrite(red_led, HIGH);
    digitalWrite(blue_led, HIGH);
    digitalWrite(green_led, HIGH);
    digitalWrite(yellow_led, HIGH);
    delay(1000);

    red_status = 0;
    now_status = 0;

  // 온도 모드
  } else if (now_status == 1) {
    digitalWrite(red_led, LOW);
    digitalWrite(blue_led, HIGH);
    digitalWrite(green_led, LOW);
    digitalWrite(yellow_led, LOW);
    oled.setLine(1, "**temperature**");
    oled.setLine(2, temp_text);
    oled.setLine(3, "NextIsPR");
    oled.display();

  // 조도 모드
  } else if (now_status == 2) {
    digitalWrite(red_led, LOW);
    digitalWrite(blue_led, LOW);
    digitalWrite(green_led, HIGH);
    digitalWrite(yellow_led, LOW);
    oled.setLine(1, "**brightness**");
    oled.setLine(2, pr_text);
    oled.setLine(3, "NextIsCount");
    oled.display();

  // 카운트 모드
  } else if (now_status == 0) {
    digitalWrite(red_led, LOW);
    digitalWrite(blue_led, LOW);
    digitalWrite(green_led, LOW);
    digitalWrite(yellow_led, HIGH);
    oled.setLine(1, "**counting**");
    oled.setLine(2, count_text);
    oled.setLine(3, "NextIsTemp");
    oled.display();
  }


  // 리셋 버튼 누르면 반응하는 코드
  if (digitalRead(reset_button) == LOW && red_status == 0) {
    digitalWrite(red_led, HIGH);
    digitalWrite(blue_led, LOW);
    digitalWrite(green_led, LOW);
    digitalWrite(yellow_led, LOW);
 
    red_status = 1;
    now_status = 3;

  } else if (digitalRead(reset_button) == LOW && red_status == 1) {
    digitalWrite(red_led, LOW);
    digitalWrite(blue_led, LOW);
    digitalWrite(green_led, LOW);
    digitalWrite(yellow_led, LOW);


  // 카운트 모드 => 온도 모드
  } else if (digitalRead(blue_button) == LOW && now_status == 0) {
    digitalWrite(red_led, LOW);
    digitalWrite(blue_led, HIGH);
    digitalWrite(green_led, LOW);
    digitalWrite(yellow_led, HIGH);

    oled.setLine(1, "!!!change!!!");
    oled.setLine(2, "2sec later");
    oled.setLine(3, "WillBeChanged");
    oled.display();
    delay(2000);
    now_status = 1;

  // 온도 모드 => 조도 모드
  } else if (digitalRead(blue_button) == LOW && now_status == 1) {
    digitalWrite(red_led, LOW);
    digitalWrite(blue_led, HIGH);
    digitalWrite(green_led, HIGH);
    digitalWrite(yellow_led, LOW);

    oled.setLine(1, "!!!change!!!");
    oled.setLine(2, "2sec later");
    oled.setLine(3, "WillBeChanged");
    oled.display();
    delay(2000);
    now_status = 2;

  // 조도 모드 => 카운트 모드
  } else if (digitalRead(blue_button) == LOW && now_status == 2) {
    digitalWrite(red_led, LOW);
    digitalWrite(blue_led, LOW);
    digitalWrite(green_led, HIGH);
    digitalWrite(yellow_led, HIGH);

    oled.setLine(1, "!!!change!!!");
    oled.setLine(2, "2sec later");
    oled.setLine(3, "WillBeChanged");
    oled.display();
    delay(2000);
    now_status = 0;
  }

  server.handleClient();
  delay(2);

}
