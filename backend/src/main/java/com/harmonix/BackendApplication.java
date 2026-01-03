package com.harmonix;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		// Load .env file if it exists
		Dotenv dotenv = Dotenv.configure()
				.ignoreIfMissing()
				.load();

		// Set system properties from .env
		dotenv.entries().forEach(entry ->
				System.setProperty(entry.getKey(), entry.getValue())
		);

		SpringApplication.run(BackendApplication.class, args);
	}

}
