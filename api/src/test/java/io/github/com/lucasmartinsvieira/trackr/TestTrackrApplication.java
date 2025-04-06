package io.github.com.lucasmartinsvieira.trackr;

import org.springframework.boot.SpringApplication;

public class TestTrackrApplication {

	public static void main(String[] args) {
		SpringApplication.from(TrackrApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
