"use client";
import { apiURL } from "@/services/services";
import { FormEvent, useEffect, useState, useRef } from "react";
import { IMovie } from "@/services/types";
import { Loader } from "./Loader";
import { PulseLoader } from "react-spinners";

interface IMovieForm {
  id: number | null;
  getMovies: () => void;
}

const AddMovieForm = ({ id, getMovies }: IMovieForm) => {
  const [movie, setMovie] = useState<IMovie>();
  const [message, setMessage] = useState("");
  const [update, setUpdate] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    if (id) getMovie();
  }, [id]);

  const addMovie = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUpdate(true);

    const formData = new FormData(e.currentTarget);
    const obj: Record<string, string | number> = {};

    for (const [key, value] of formData.entries()) {
      obj[key] = key === "releaseYear" ? Number(value) : (value as string);
    }

    try {
      const endpoint = id ? `/${id}` : "";
      const response = await fetch(`${apiURL}/api/movies${endpoint}`, {
        method: id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(obj),
      });

      if (response.ok) {
        await response.json();
        setMessage(
          id ? "Movie updated successfully!" : "Movie added successfully!"
        );
        getMovies();
        if (!id && formRef.current) formRef.current.reset();
      } else {
        setMessage("Error saving movie.");
      }
    } catch (error) {
      setMessage("Error: " + error);
    } finally {
      setUpdate(false);
      setTimeout(() => setMessage(""), 2000);
    }
  };

  const getMovie = async () => {
    try {
      const response = await fetch(`${apiURL}/api/movies/${id}`);
      if (response.ok) {
        setMovie(await response.json());
      }
    } catch (error) {
      console.error("Error fetching movie", error);
    }
  };

  if (id && !movie) return <Loader />;

  return (
    <form ref={formRef} onSubmit={addMovie}>
      <h2>{id ? "Update" : "Add"} Movie</h2>
      {message && <p>{message}</p>}

      <div className="form-section">
        <label>Title</label>
        <input
          type="text"
          name="title"
          defaultValue={movie?.title}
          minLength={3}
          placeholder="Enter movie title"
          required
        />
      </div>

      <div className="form-section">
        <label>Release Year</label>
        <input
          type="number"
          name="releaseYear"
          min={1950}
          max={2030}
          defaultValue={movie?.releaseYear}
          placeholder="Enter year of release"
          required
        />
      </div>

      <div className="form-section">
        <label>Genre</label>
        <input
          type="text"
          name="genre"
          defaultValue={movie?.genre}
          minLength={4}
          placeholder="Enter genre of movie"
          required
        />
      </div>

      <div className="form-section">
        <label>Poster URL</label>
        <input
          type="text"
          name="posterUrl"
          defaultValue={movie?.posterUrl}
          minLength={10}
          placeholder="Poster link"
          required
        />
      </div>

      <div className="form-section">
        <label>Description</label>
        <textarea
          name="description"
          defaultValue={movie?.description}
          minLength={10}
          maxLength={300}
          placeholder="Enter description for movie"
          required
        />
      </div>

      <button type="submit">
        {update ? (
          <PulseLoader color="#ffffff" size={16} />
        ) : id ? (
          "Update Movie"
        ) : (
          "Add Movie"
        )}
      </button>
    </form>
  );
};

export default AddMovieForm;
