// src/components/UpdateMovieForm.tsx
'use client';
import { apiURL } from '@/services/services';
import { FormEvent } from 'react';
import { IMovie } from '@/services/types';

// Define the shape of the movie data
interface MovieData {
  title: string;
  releaseYear: number;
  genre: string;
  posterUrl?: string;
  description: string;
}

// Props for the client component
interface UpdateMovieFormProps {
  id: string;
  initialData: MovieData | null;
}

export default function UpdateMovieForm({ id, initialData }: UpdateMovieFormProps) {
  const addMovie = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const obj: MovieData = {
      title: '',
      releaseYear: 0,
      genre: '',
      posterUrl: '',
      description: '',
    };

    for (const [key, value] of formData.entries()) {
      if (typeof value === 'string') {
        if (key === 'releaseYear') {
          obj[key] = Number(value);
        } else {
          obj[key as keyof MovieData] = value;
        }
      }
    }

    try {
      const response = await fetch(`${apiURL}/api/movies/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Success:', data, 'Sent:', obj);
      alert('Movie updated successfully!');
      //e.currentTarget.reset(); // Reset form after successful submission
    } catch (error) {
      console.error('Error updating movie:', error);
      alert(`Failed to update movie: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <>
      <form onSubmit={addMovie}>
        <div className="form-section">
          <label>Title</label>
          <input
            type="text"
            name="title"
            placeholder="Enter movie title"
            defaultValue={initialData?.title || ''}
            required
          />
        </div>
        <div className="form-section">
          <label>Release Year</label>
          <input
            type="number"
            name="releaseYear"
            placeholder="Enter year of release"
            defaultValue={initialData?.releaseYear || ''}
            required
          />
        </div>
        <div className="form-section">
          <label>Genre</label>
          <input
            type="text"
            name="genre"
            placeholder="Enter genre of movie"
            defaultValue={initialData?.genre || ''}
            required
          />
        </div>
        <div className="form-section">
          <label>Poster URL</label>
          <input
            type="text"
            placeholder="Poster link"
            name="posterUrl"
            defaultValue={initialData?.posterUrl || ''}
          />
        </div>
        <div className="form-section">
          <label>Description</label>
          <textarea
            name="description"
            placeholder="Enter description for movie"
            defaultValue={initialData?.description || ''}
            required
          />
        </div>
        <button type="submit">Update Movie</button>
      </form>
    </>
  );
}