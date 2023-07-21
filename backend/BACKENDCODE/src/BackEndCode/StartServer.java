package BackEndCode;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;
import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class StartServer {
    public static void main(String[] args) throws IOException {
        // 8000번 포트 사용
        int port = 8000;
        HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);

        // 루트 경로에 대한 핸들러 등록
        server.createContext("/", new DataHandler());

        // 서버 시작
        server.start();
        System.out.println("Server started on port " + port);
    }

    // root 경로에 대한 핸들러 클래스
    static class DataHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            try {
                String[] dataArr = ReceiveData.fetchData();

                // DataArr 배열의 값을 JSON 형태로 변환
                String data = "{ " +
                        "\"ip\": \"" + dataArr[0] + "\", " +
                        "\"count\": \"" + dataArr[1] + "\", " +
                        "\"temp\": \"" + dataArr[2] + "\", " +
                        "\"pr\": \"" + dataArr[3] + "\", " +
                        "\"time\": \"" + getCurrentTime() + "\"" + // 현재 시간을 time 필드로 포함
                        " }";

                // 클라이언트에게 JSON 형태의 데이터를 전송합니다
                exchange.getResponseHeaders().set("Content-Type", "application/json");
                exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*"); // 모든 도메인에서 요청 허용
                exchange.sendResponseHeaders(200, data.getBytes().length);
                OutputStream outputStream = exchange.getResponseBody();
                outputStream.write(data.getBytes());
                outputStream.close();
            } catch (IOException e) {
                e.printStackTrace();
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
        }

        // 현재 시간을 문자열로 반환하는 메소드
        private String getCurrentTime() {
            LocalDateTime now = LocalDateTime.now();
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm:ss");
            return now.format(formatter);
        }

    }
}
