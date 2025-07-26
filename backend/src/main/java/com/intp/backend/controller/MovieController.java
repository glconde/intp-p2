package com.intp.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

import com.intp.backend.model.Movie;
import com.intp.backend.repository.MovieRepository;

@RestController
@RequestMapping("/api/movies")
public class MovieController {
    private final MovieRepository movieRepo;

    public MovieController(MovieRepository movieRepo) {
        this.movieRepo = movieRepo;
    }

    @GetMapping
    public List<Movie> getAll() {
        return movieRepo.findAll();
    }

    @PostMapping
    public Movie create(@RequestBody Movie movie) {
        return movieRepo.save(movie);
    }
}
