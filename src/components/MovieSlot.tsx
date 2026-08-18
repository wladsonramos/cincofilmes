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
    // Largura responsiva com clamp: Adapta-se para caber duas capas mesmo em telas muito pequenas (ex: iPhone SE)
    <div 
      style={{ 
        width: 'clamp(135px, 44vw, 160px)', // Flexível e Inteligente
        aspectRatio: '4/5', 
        backgroundColor: '#ffffff', 
        border: '1.5px solid #000080', 
        borderRadius: '12px', 
        display: 'flex', 
        flexDirection: 'column', 
        position: 'relative', 
        boxShadow: '0 8px 24px rgba(0,0,128,0.06)', 
        flexShrink: 0,
        boxSizing: 'border-box' // Proteção total contra overflow
      }}
    >
      
      {/* ESTADO 1: Filme Selecionado */}
      {movie ? (
        <div style={{ position: 'relative', width: '100%', height: '100%', boxSizing: 'border-box' }}>
          <div style={{ width: '100%', height: '100%', overflow: 'hidden', borderRadius: '10px' }}>
            {movie.Poster !== "N/A" ? (
              <img src={movie.Poster} alt={movie.Title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f9fa', padding: '16px', boxSizing: 'border-box' }}>
                <Film size={36} color="#000080" style={{ opacity: 0.3, marginBottom: '12px' }} />
                <span style={{ color: '#000080', fontSize: '12px', textAlign: 'center', fontWeight: 'bold' }}>{movie.Title}</span>
              </div>
            )}
          </div>

          {!isRevealed && (
            <button 
              onClick={handleClear} 
              title="Remover filme"
              style={{
                position: 'absolute', top: '8px', right: '8px', backgroundColor: '#e11d48', color: '#ffffff',
                border: 'none', padding: '6px', borderRadius: '50%', cursor: 'pointer', zIndex: 50,
                display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
              }}
            >
              <X size={14} strokeWidth={2.5} />
            </button>
          )}

          {/* Nota do Filme */}
          {isRevealed && (
            <div 
              style={{
                position: 'absolute', bottom: '-20px', left: '50%', transform: 'translateX(-50%)',
                display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '24px',
                backgroundColor: '#ffffff', border: '1.5px solid #000080', color: '#000080',
                boxShadow: '0 8px 16px rgba(0,0,128,0.15)', zIndex: 30, whiteSpace: 'nowrap'
              }}
            >
              <span style={{ fontSize: 'clamp(16px, 4vw, 20px)', fontWeight: '900' }}>{movie.imdbRating}</span>
              {isSuccess ? (
                <CheckCircle2 size={20} color="#10b981" strokeWidth={2.5} />
              ) : (
                <XCircle size={20} color="#f43f5e" strokeWidth={2.5} />
              )}
            </div>
          )}
        </div>
      ) : (
        /* ESTADO 2: Vazio */
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', position: 'relative', boxSizing: 'border-box' }}>
          
          {/* Ícone Centralizado */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clapperboard size={48} color="#000080" strokeWidth={1.5} />
          </div>

          {/* Barra de Busca Exata da Imagem */}
          <div style={{ padding: '10px', width: '100%', boxSizing: 'border-box' }}>
            <div 
              style={{ 
                display: 'flex', alignItems: 'center', width: '100%', backgroundColor: '#e8eef6', 
                border: '1.5px solid #000080', borderRadius: '8px', padding: '6px 8px', boxSizing: 'border-box' 
              }}
            >
              {isSearching ? (
                <Loader2 color="#000080" size={14} className="animate-spin flex-shrink-0" />
              ) : (
                <Search color="#000080" size={14} strokeWidth={2} className="flex-shrink-0" />
              )}
              
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => { if (results.length > 0) setShowDropdown(true); }}
                style={{ 
                  flex: 1, backgroundColor: 'transparent', color: '#000080', fontSize: '12px', 
                  fontWeight: '600', border: 'none', outline: 'none', marginLeft: '6px', width: '100%', boxSizing: 'border-box' 
                }}
              />
            </div>
          </div>

        </div>
      )}

      {/* DROPDOWN AUTOCOMPLETE - max-width garante que não vai vazar as bordas da tela */}
      {showDropdown && !movie && (
        <div 
          style={{ 
            position: 'absolute', top: '100%', marginTop: '8px', left: '50%', transform: 'translateX(-50%)', 
            width: '240px', maxWidth: '90vw', backgroundColor: '#ffffff', border: '1.5px solid #000080', borderRadius: '12px', 
            zIndex: 50, maxHeight: '240px', overflowY: 'auto', padding: '6px', boxShadow: '0 10px 25px rgba(0,0,128,0.15)',
            boxSizing: 'border-box'
          }}
          className="custom-scrollbar"
        >
          {!isSearching && results.length === 0 && searchTerm.length > 2 && (
             <div style={{ padding: '16px', textAlign: 'center', fontSize: '12px', fontWeight: '500', color: 'rgba(0,0,128,0.6)' }}>
               Nenhum filme encontrado.
             </div>
          )}
          {results.map((r) => (
            <button
              key={r.imdbID}
              onClick={() => handleSelect(r)}
              style={{ 
                width: '100%', textAlign: 'left', padding: '8px', fontSize: '14px', color: '#000080', 
                display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid #f1f5f9', 
                backgroundColor: 'transparent', border: 'none', cursor: 'pointer', boxSizing: 'border-box' 
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e8eef6'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              {r.Poster !== "N/A" ? (
                <img src={r.Poster} alt={r.Title} style={{ width: '36px', height: '48px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0 }} />
              ) : (
                <div style={{ width: '36px', height: '48px', backgroundColor: '#f1f5f9', borderRadius: '4px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Film size={12} color="rgba(0,0,128,0.4)" />
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <span style={{ fontSize: '12px', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.Title}</span>
                <span style={{ fontSize: '10px', color: 'rgba(0,0,128,0.6)', marginTop: '2px' }}>{r.Year}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}