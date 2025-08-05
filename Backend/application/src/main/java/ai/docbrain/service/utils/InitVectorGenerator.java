package ai.docbrain.service.utils;

import java.security.SecureRandom;
import java.util.Base64;

public class InitVectorGenerator {
    public static void main(String[] args) {
        byte[] iv = new byte[16]; // 16 bytes for AES
        SecureRandom random = new SecureRandom();
        random.nextBytes(iv);
        String base64Iv = Base64.getEncoder().encodeToString(iv);
        System.out.println("Base64 Encoded Init Vector: " + base64Iv);
    }
}