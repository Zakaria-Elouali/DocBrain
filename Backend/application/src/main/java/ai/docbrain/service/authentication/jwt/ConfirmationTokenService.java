package ai.docbrain.service.authentication.jwt;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Random;

@RequiredArgsConstructor
@Service
public class ConfirmationTokenService {

    private final IConfirmationTokenRepository confirmationTokenRepository;

    public String generateUniquePasscode() {
        String passcode;
        do {
            passcode = generateRandomPasscodeWithTime();
        } while (confirmationTokenRepository.existsByConfirmationToken(passcode));

        return passcode;
    }

    private String generateRandomPasscodeWithTime() {
        Random random = new Random();
        int passcode = 100000 + random.nextInt(900000);
        long timestamp = System.currentTimeMillis();
        String lastTwoDigits = String.valueOf(timestamp).substring(String.valueOf(timestamp).length() - 2);
        return passcode + lastTwoDigits;
    }

}
