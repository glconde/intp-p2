package com.intp.backend.service;

import com.intp.backend.model.Movie;
import com.intp.backend.repository.MovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MovieService {
    
	@Autowired
	private MovieRepository movieRepository;
	
	public List<Movie> getAllMovies() {
        return movieRepository.findAll();
    }
	
	public Optional<Movie> getMovieById(Long id) {
        return movieRepository.findById(id);
    }
	
	public Movie createMovie(Movie movie) {
        return movieRepository.save(movie);
    }

    public Movie updateMovie(Long id, Movie updatedMovie) {
        updatedMovie.setId(id);
        return movieRepository.save(updatedMovie);
    }

    public void deleteMovie(Long id) {
        movieRepository.deleteById(id);
    }
}
