"use client";

import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import { Search, X, Film, Loader2, CheckCircle2, XCircle, Clapperboard } from "lucide-react";
import { searchMovies, getMovieDetails } from "@/services/omdb";
import { MovieDetails, MovieSearchResult, QualityGoal } from "@/types";

interface MovieSlotProps {
  movie: MovieDetails | null;
  onSelectMovie: (movie: MovieDetails | null) => void;
  isRevealed: boolean;
  goal: QualityGoal | null;
}

export default function MovieSlot({ movie, onSelectMovie, isRevealed, goal }: MovieSlotProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch] = useDebounce(searchTerm, 500);
  const [results, setResults] = useState<MovieSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      if (debouncedSearch.trim().length > 2) {
        setIsSearching(true);
        setShowDropdown(true);
        const data = await searchMovies(debouncedSearch);
        setResults(data);
        setIsSearching(false);
      } else {
        setResults([]);
        setShowDropdown(false);
      }
    };
    fetchResults();
  }, [debouncedSearch]);

  const handleSelect = async (selected: MovieSearchResult) => {
    setShowDropdown(false);
    setSearchTerm("");
    const details = await getMovieDetails(selected.imdbID);
    if (details) onSelectMovie(details);
  };

  const handleClear = () => {
    if (!isRevealed) {
      onSelectMovie(null);
      setSearchTerm("");
    }
  };

  const rating = movie && movie.imdbRating !== "N/A" ? parseFloat(movie.imdbRating) : 0;
  const isSuccess = goal && rating >= goal.min && rating <= goal.max;

  return (
    <div className="relative flex flex-col items-center w-[140px] md:w-[180px] shrink-0 aspect-[2/3] border border-slate-300 overflow-visible transition-all duration-500">
      
      {/* ESTADO 1: Filme Selecionado */}
      {movie ? (
        <div className="relative w-full h-full">
          <div className="relative w-full h-full overflow-hidden bg-[#0a0a0a]">
            {movie.Poster !== "N/A" ? (
              <img src={movie.Poster} alt={movie.Title} className="w-full h-full object-cover transition-transform duration-700" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-4">
                <Film size={36} className="text-slate-700 mb-3" />
                <span className="text-slate-400 text-xs text-center font-medium leading-relaxed">{movie.Title}</span>
              </div>
            )}
          </div>

          {!isRevealed && (
            <button 
              onClick={handleClear} 
              title="Remover filme"
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                backgroundColor: '#e11d48',
                color: '#ffffff',
                border: 'none',
                padding: '6px',
                borderRadius: '50%',
                cursor: 'pointer',
                zIndex: 50,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 6px rgba(0,0,0,0.5)'
              }}
            >
              <X size={16} />
            </button>
          )}

          {isRevealed && (
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-black shadow-xl border border-slate-700 bg-[#050505] text-white z-30 transition-all duration-500">
              <span>{movie.imdbRating}</span>
              {isSuccess ? (
                <CheckCircle2 size={16} className="text-emerald-500" />
              ) : (
                <XCircle size={16} className="text-rose-500" />
              )}
            </div>
          )}
        </div>
      ) : (
        /* ESTADO 2: Vazio */
        <div className="flex flex-col items-center justify-center h-full w-full p-2 bg-transparent hover:bg-slate-900/30 transition-colors">
          
          {/* Ícone de Claquete adicionado acima da barra de busca */}
          <Clapperboard size={32} className="text-slate-500 mb-4" strokeWidth={1.5} />

          {/* Barra de Busca diminuída (de w-[95%] para w-[85%]) e centralizada */}
          <div className="relative w-[85%] flex items-center bg-[#050505] border border-slate-500 rounded-full px-3 py-2.5 focus-within:border-slate-300 focus-within:bg-slate-900 transition-all shadow-inner">
            {isSearching ? (
              <Loader2 className="text-slate-400 animate-spin shrink-0" size={14} />
            ) : (
              <Search className="text-slate-400 shrink-0" size={14} />
            )}
            
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => { if (results.length > 0) setShowDropdown(true); }}
              className="w-full bg-transparent text-center text-slate-200 text-xs font-medium border-none outline-none focus:outline-none focus:ring-0 placeholder:text-slate-600 ml-1"
            />
          </div>

        </div>
      )}

      {/* DROPDOWN AUTOCOMPLETE */}
      {showDropdown && !movie && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 w-[240px] bg-slate-900 border border-slate-700 rounded-xl mt-2 z-50 max-h-60 overflow-y-auto shadow-2xl custom-scrollbar">
          {!isSearching && results.length === 0 && searchTerm.length > 2 && (
             <div className="p-4 text-center text-xs text-slate-400">Nenhum filme encontrado.</div>
          )}
          {results.map((r) => (
            <button
              key={r.imdbID}
              onClick={() => handleSelect(r)}
              className="w-full text-left p-2 text-sm text-slate-200 hover:bg-slate-800 flex items-center gap-3 border-b border-slate-800/50 last:border-0 transition-colors"
            >
              {r.Poster !== "N/A" ? (
                <img src={r.Poster} className="w-8 h-12 object-cover rounded shadow-sm flex-shrink-0" alt={r.Title} />
              ) : (
                <div className="w-8 h-12 bg-[#050505] rounded flex-shrink-0 flex items-center justify-center"><Film size={12} className="text-slate-600" /></div>
              )}
              <div className="flex flex-col truncate pr-2">
                <span className="truncate text-xs font-semibold">{r.Title}</span>
                <span className="text-[10px] text-slate-500 mt-0.5">{r.Year}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}