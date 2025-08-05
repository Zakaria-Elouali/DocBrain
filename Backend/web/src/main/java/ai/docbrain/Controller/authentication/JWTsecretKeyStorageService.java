package ai.docbrain.Controller.authentication;

import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.Base64;

@Service
public class JWTsecretKeyStorageService {

    @Value("${jwt.secret-file:jwt-secret.key}")
    private String secretKeyFilePath;

    public SecretKey getStoredKey() {
        try {
            // Use absolute file path instead of ClassPathResource
            Path keyPath = Paths.get(secretKeyFilePath);
            File keyFile = keyPath.toFile();

            // If file doesn't exist or is empty, generate and write a new key
            if (!keyFile.exists() || keyFile.length() == 0) {
                return generateAndStoreNewKey(keyFile);
            }

            // Read the existing key
            String encodedKey = Files.readString(keyPath).trim();

            // Validate key is not empty
            if (encodedKey.isEmpty()) {
                return generateAndStoreNewKey(keyFile);
            }

            // Decode and return the key
            byte[] keyBytes = Base64.getDecoder().decode(encodedKey);
            return Keys.hmacShaKeyFor(keyBytes);

        } catch (IOException e) {
            // Fallback to generating a new key if file operations fail
            System.err.println("Error reading JWT secret key: " + e.getMessage());
            try {
                File keyFile = new File(secretKeyFilePath);
                return generateAndStoreNewKey(keyFile);
            } catch (IOException ioException) {
                System.err.println("Critical error generating JWT secret key: " + ioException.getMessage());
                throw new RuntimeException("Unable to generate JWT secret key", ioException);
            }
        }
    }

    private SecretKey generateAndStoreNewKey(File keyFile) throws IOException {
        // Ensure the parent directory exists
        if (keyFile.getParentFile() != null) {
            keyFile.getParentFile().mkdirs();
        }

        // Generate a new key
        SecretKey newKey = Keys.secretKeyFor(SignatureAlgorithm.HS512);

        // Encode the key
        String encodedKey = Base64.getEncoder().encodeToString(newKey.getEncoded());

        // Write the key to the file with explicit path
        Files.writeString(
                keyFile.toPath(),
                encodedKey,
                StandardOpenOption.CREATE,
                StandardOpenOption.TRUNCATE_EXISTING,
                StandardOpenOption.WRITE
        );

        System.out.println("Generated and stored a new JWT secret key at: " + keyFile.getAbsolutePath());
        return newKey;
    }
}





//---------------------this is the old code saving the secret code in Environment----------------------------------------
//
//    private final Environment env;
//
//    public JWTsecretKeyStorageService(Environment env) {
//        this.env = env;
//    }
///*
//At startup, the application checks if the key exists.
//If the key does not exist, it generates a new key and stores it in system environment.
//The JWTHelper class retrieves the key from the storage location and uses it
// for creating and verifying JWTs.
// */
//    public SecretKey getStoredKey() {
//        String encodedKey = env.getProperty("JWT_SECRET");
//
//        // If the key is not set, generate a new one
//        if (encodedKey == null || encodedKey.isEmpty()) {
//            SecretKey newKey = Keys.secretKeyFor(SignatureAlgorithm.HS512);
//            encodedKey = Base64.getEncoder().encodeToString(newKey.getEncoded());
//
//            // Store the key in the environment variable (for the current session)
//            System.setProperty("JWT_SECRET", encodedKey);
//            System.out.println("Generated and stored a new JWT key.");
//        }
//
//        // Decode the key and create a SecretKey
//        byte[] keyBytes = Base64.getDecoder().decode(encodedKey);
//        return Keys.hmacShaKeyFor(keyBytes);
//    }
//}