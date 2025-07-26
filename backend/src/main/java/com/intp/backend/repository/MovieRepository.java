package com.intp.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.intp.backend.model.Movie;

public interface MovieRepository extends JpaRepository<Movie, Long> {
}
