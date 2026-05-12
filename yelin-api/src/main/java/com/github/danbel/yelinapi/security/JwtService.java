package com.github.danbel.yelinapi.security;

import com.github.danbel.yelinapi.model.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;

@Service
public class JwtService {
    private final String secret;

    public JwtService(@Value("${app.jwt.secret:yelin-secret-key-for-diploma-project}") String secret) {
        this.secret = secret;
    }

    public String generate(User user) {
        long exp = Instant.now().plus(3650, ChronoUnit.DAYS).getEpochSecond();
        String header = base64Url("{\"alg\":\"HS256\",\"typ\":\"JWT\"}");
        String payload = base64Url(String.format(
                "{\"sub\":\"%s\",\"userId\":%d,\"role\":\"%s\",\"exp\":%d}",
                user.email(), user.id(), user.role(), exp
        ));
        String signature = sign(header + "." + payload);
        return header + "." + payload + "." + signature;
    }

    public String extractEmail(String token) {
        String[] parts = token.split("\\.");
        if (parts.length != 3 || !sign(parts[0] + "." + parts[1]).equals(parts[2])) {
            throw new IllegalArgumentException("Некорректный JWT");
        }
        String payload = new String(Base64.getUrlDecoder().decode(parts[1]), StandardCharsets.UTF_8);
        long exp = Long.parseLong(readJsonValue(payload, "exp"));
        if (Instant.now().getEpochSecond() > exp) {
            throw new IllegalArgumentException("JWT истек");
        }
        return readJsonString(payload, "sub");
    }

    private String sign(String value) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(mac.doFinal(value.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception ex) {
            throw new IllegalStateException("Не удалось подписать JWT", ex);
        }
    }

    private String base64Url(String value) {
        return Base64.getUrlEncoder().withoutPadding().encodeToString(value.getBytes(StandardCharsets.UTF_8));
    }

    private String readJsonString(String json, String key) {
        String marker = "\"" + key + "\":\"";
        int start = json.indexOf(marker) + marker.length();
        int end = json.indexOf("\"", start);
        return json.substring(start, end);
    }

    private String readJsonValue(String json, String key) {
        String marker = "\"" + key + "\":";
        int start = json.indexOf(marker) + marker.length();
        int end = json.indexOf(",", start);
        if (end < 0) {
            end = json.indexOf("}", start);
        }
        return json.substring(start, end);
    }
}
