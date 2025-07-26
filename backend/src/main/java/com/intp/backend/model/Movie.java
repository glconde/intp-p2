package com.intp.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;

@Entity
public class Movie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private int releaseYear;
    private String genre;
    private String posterUrl;
    private String description;
    
    public Movie() {
    	
    }
    
    public Movie(String title, int releaseYear, String genre, String posterUrl, String description) {
        this.setTitle(title);
        this.setReleaseYear(releaseYear);
        this.setGenre(genre);
        this.setPosterUrl(posterUrl);
        this.setDescription(description);
    }
    
    /**
	 * @return the id
	 */
    public Long getId() {
        return id;
    }

	/**
	 * @return the title
	 */
	public String getTitle() {
		return title;
	}

	/**
	 * @param title the title to set
	 */
	public void setTitle(String title) {
		this.title = title;
	}

	/**
	 * @return the releaseYear
	 */
	public int getReleaseYear() {
		return releaseYear;
	}

	/**
	 * @param releaseYear the releaseYear to set
	 */
	public void setReleaseYear(int releaseYear) {
		this.releaseYear = releaseYear;
	}

	/**
	 * @return the genre
	 */
	public String getGenre() {
		return genre;
	}

	/**
	 * @param genre the genre to set
	 */
	public void setGenre(String genre) {
		this.genre = genre;
	}

	/**
	 * @return the posterUrl
	 */
	public String getPosterUrl() {
		return posterUrl;
	}

	/**
	 * @param posterUrl the posterUrl to set
	 */
	public void setPosterUrl(String posterUrl) {
		this.posterUrl = posterUrl;
	}

	/**
	 * @return the description
	 */
	public String getDescription() {
		return description;
	}

	/**
	 * @param description the description to set
	 */
	public void setDescription(String description) {
		this.description = description;
	}


}
