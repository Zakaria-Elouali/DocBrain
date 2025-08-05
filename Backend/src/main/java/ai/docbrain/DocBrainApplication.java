package ai.docbrain;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
@EnableConfigurationProperties

public class DocBrainApplication {

	public static void main(String[] args) {
		SpringApplication.run(DocBrainApplication.class, args);
	}

}
