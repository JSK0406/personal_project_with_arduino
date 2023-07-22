package BackEndCode;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;  // Java 11
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Arrays;

public class ReceiveData {
    // 가장 최근의 데이터들을 받아오기 위해 끝에서 4개의 데이터만 받음
    public static String[] ExportData(String[] lines) {
        String ip = lines[lines.length - 4].split(":")[1];
        String count = lines[lines.length - 3].split(":")[1];
        String temp = lines[lines.length - 2].split(":")[1];
        String pr = lines[lines.length - 1].split(":")[1];

        String[] ExportArr = {ip, count, temp, pr};
        return ExportArr;
    }

    // 아두이노 웹서버에서 데이터를 가져오는 코드
    public static String[] fetchData() throws IOException, InterruptedException {
        String urlStr = "http://192.168.15.64:80/";

        HttpClient httpClient = HttpClient.newHttpClient();
        HttpRequest httpRequest = HttpRequest.newBuilder()
                .uri(URI.create(urlStr))
                .build();
        HttpResponse<String> response = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() == 200) {
            String[] lines = response.body().split("\n");
            if (lines.length >= 4) {
                return ExportData(lines); // ExportData 메소드의 리턴값을 반환합니다.
            } else {
                System.out.println("Response format error!");
            }
        } else {
            System.out.println("Http connection failed : " + response.statusCode());
        }
        return null;
    }

    public static void main(String[] args) {
        try {
            String[] DataArr = fetchData();
            if (DataArr != null) {
                System.out.println(Arrays.toString(DataArr));
            }
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
        }
    }
}