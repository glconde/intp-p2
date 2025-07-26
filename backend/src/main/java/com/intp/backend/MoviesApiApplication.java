package com.intp.backend;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.intp.backend.model.Movie;
import com.intp.backend.repository.MovieRepository;

import java.io.InputStream;
import java.util.List;


@SpringBootApplication
public class MoviesApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(MoviesApiApplication.class, args);
	}

	
	@Bean
	CommandLineRunner seedFromJson(MovieRepository movieRepo, ObjectMapper mapper) {
	    return args -> {
	    	// seed sample data if database is empty
	        if (movieRepo.count() == 0) {
	        	InputStream is = getClass().getResourceAsStream("/sample-action-movies.json");
	        	System.out.println("Found resource: " + getClass().getResource("/sample-action-movies.json"));
	            List<Movie> movies = mapper.readValue(is, new TypeReference<>() {});
	            movieRepo.saveAll(movies);
	            System.out.println("✔ Seeded movies from JSON.");
	        }
	    };
	}

}
