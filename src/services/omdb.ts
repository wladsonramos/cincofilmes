import axios from 'axios';
import { MovieSearchResult, MovieDetails } from '@/types';

const API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY;
const BASE_URL = 'https://www.omdbapi.com/';

// Função para buscar a lista de filmes pelo nome
export const searchMovies = async (query: string): Promise<MovieSearchResult[]> => {
  if (!query) return [];
  try {
    const response = await axios.get(`${BASE_URL}?s=${encodeURIComponent(query)}&type=movie&apikey=${API_KEY}`);
    return response.data.Search || [];
  } catch (error) {
    console.error("Erro na busca:", error);
    return [];
  }
};

// Função para pegar os detalhes completos de um filme (incluindo a nota do IMDb)
export const getMovieDetails = async (id: string): Promise<MovieDetails | null> => {
  try {
    const response = await axios.get(`${BASE_URL}?i=${id}&apikey=${API_KEY}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar detalhes:", error);
    return null;
  }
};