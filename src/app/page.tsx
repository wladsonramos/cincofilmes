"use client";

import { useState, useEffect } from "react";
import MovieSlot from "@/components/MovieSlot";
import { THEMES, GOALS } from "@/utils/gameData";
import { MovieDetails, QualityGoal } from "@/types";
import { RotateCcw, Check, ChevronDown, Dices, Clapperboard } from "lucide-react";

export default function Home() {
  const [theme, setTheme] = useState<string>("");
  const [goal, setGoal] = useState<QualityGoal>(GOALS[0]);
  const [slots, setSlots] = useState<(MovieDetails | null)[]>(Array(5).fill(null));
  const [isRevealed, setIsRevealed] = useState(false);

  const pickRandomTheme = () => {
    let newTheme;
    do {
      newTheme = THEMES[Math.floor(Math.random() * THEMES.length)];
    } while (newTheme === theme && THEMES.length > 1);
    setTheme(newTheme);
  };

  useEffect(() => {
    pickRandomTheme();
  }, []);

  const resetBoard = () => {
    setSlots(Array(5).fill(null));
    setIsRevealed(false);
  };

  const handleSelectMovie = (index: number, movie: MovieDetails | null) => {
    const newSlots = [...slots];
    newSlots[index] = movie;
    setSlots(newSlots);
  };

  const allFilled = slots.every((slot) => slot !== null);

  const calculateScore = () => {
    if (!goal) return 0;
    return slots.filter((movie) => {
      if (!movie || movie.imdbRating === "N/A") return false;
      const rating = parseFloat(movie.imdbRating);
      return rating >= goal.min && rating <= goal.max;
    }).length;
  };

  return (
    <main 
      className="relative min-h-screen font-sans flex flex-col items-center pt-10 md:pt-16 pb-12 px-4 overflow-hidden"
      style={{ backgroundColor: '#f8f9fa', boxSizing: 'border-box' }} 
    >
      
      {/* Fundo com ícones flutuantes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 flex items-center justify-center">
        <div className="absolute top-[10%] left-[10%] transform -rotate-12 scale-150" style={{ opacity: 0.04 }}>
          <Clapperboard size={64} color="#000080" />
        </div>
        <div className="absolute top-[20%] right-[15%] transform rotate-12 scale-125" style={{ opacity: 0.04 }}>
          <Clapperboard size={56} color="#000080" />
        </div>
        <div className="absolute bottom-[20%] left-[15%] transform -rotate-12 scale-125" style={{ opacity: 0.04 }}>
          <Clapperboard size={64} color="#000080" />
        </div>
        <div className="absolute bottom-[10%] right-[10%] transform rotate-6 scale-150" style={{ opacity: 0.04 }}>
          <Clapperboard size={72} color="#000080" />
        </div>
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center" style={{ boxSizing: 'border-box' }}>

        {/* Cabeçalho */}
        <header className="text-center w-full" style={{ marginBottom: '40px', boxSizing: 'border-box' }}>
          <h1 
            style={{ 
              color: '#000080', 
              fontSize: 'clamp(2rem, 6vw, 2.5rem)', // Responsivo: encolhe em telas pequenas
              fontWeight: '900', 
              letterSpacing: '0.1em', 
              marginBottom: '30px' 
            }}
          >
            CINCO FILMES
          </h1>

          {/* Card Branco Central Totalmente Responsivo */}
          <div 
            style={{ 
              backgroundColor: '#ffffff', 
              borderRadius: '16px', 
              padding: '24px 20px', // Padding horizontal ajustado
              boxSizing: 'border-box', // Garante que não vaze a tela
              boxShadow: '0 12px 40px rgba(0,0,128,0.1)', 
              width: '100%', 
              maxWidth: '500px', 
              margin: '0 auto', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center' 
            }}
          >
            
            <span style={{ fontSize: 'clamp(16px, 4vw, 18px)', fontWeight: '500', color: '#000080', marginBottom: '16px', textAlign: 'center' }}>
              Existem 5 filmes de...
            </span>
            
            {/* Input de Tema */}
            <div 
              style={{ 
                display: 'flex', alignItems: 'center', width: '100%', backgroundColor: '#e8eef6', 
                border: '1.5px solid #000080', borderRadius: '10px', padding: '6px', marginBottom: '20px',
                boxSizing: 'border-box' // Garante que não vaze
              }}
            >
              <button
                onClick={pickRandomTheme}
                disabled={isRevealed}
                style={{ 
                  backgroundColor: '#000080', color: '#ffffff', borderRadius: '8px', width: '38px', height: '38px', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', flexShrink: 0
                }}
                title="Sortear tema aleatório"
              >
                <Dices size={20} />
              </button>
              
              <input
                type="text"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                disabled={isRevealed}
                placeholder="Digite um tema..."
                style={{ 
                  flex: 1, backgroundColor: 'transparent', border: 'none', outline: 'none', color: '#000080', 
                  fontWeight: '600', textAlign: 'center', fontSize: 'clamp(13px, 3.5vw, 15px)', // Fonte responsiva
                  width: '100%', boxSizing: 'border-box'
                }}
              />
              
              <div style={{ width: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000080', flexShrink: 0 }}>
                <ChevronDown size={20} />
              </div>
            </div>

            <span style={{ fontSize: 'clamp(14px, 3.5vw, 16px)', fontWeight: '500', color: '#000080', marginBottom: '12px' }}>
              com nota
            </span>

            {/* Input de Nota */}
            <div 
              style={{ 
                position: 'relative', display: 'flex', alignItems: 'center', width: '100%', 
                backgroundColor: '#e8eef6', border: '1.5px solid #000080', borderRadius: '10px', padding: '6px',
                boxSizing: 'border-box' // Garante que não vaze
              }}
            >
              <select
                value={goal.id}
                onChange={(e) => {
                  const selected = GOALS.find(g => g.id === e.target.value);
                  if (selected) setGoal(selected);
                }}
                disabled={isRevealed}
                style={{ 
                  width: '100%', backgroundColor: 'transparent', border: 'none', outline: 'none', 
                  color: '#000080', fontWeight: '600', textAlign: 'center', fontSize: 'clamp(13px, 3.5vw, 15px)', 
                  height: '38px', appearance: 'none', cursor: 'pointer', boxSizing: 'border-box'
                }}
              >
                {GOALS.map((g) => (
                  <option key={g.id} value={g.id} style={{ color: '#000080', backgroundColor: '#ffffff' }}>
                    {g.label}
                  </option>
                ))}
              </select>
              <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: '#000080', pointerEvents: 'none' }}>
                <ChevronDown size={20} />
              </div>
            </div>

          </div>
        </header>

        {/* Retângulos (Film Strip) */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', width: '100%', gap: '12px', boxSizing: 'border-box' }}>
          {slots.map((movie, index) => (
            <MovieSlot
              key={index}
              movie={movie}
              onSelectMovie={(selected) => handleSelectMovie(index, selected)}
              isRevealed={isRevealed}
              goal={goal}
            />
          ))}
        </div>

        {/* Botão Final */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '60px', width: '100%', boxSizing: 'border-box' }}>
          {!isRevealed ? (
            <button
              disabled={!allFilled}
              onClick={() => setIsRevealed(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 40px', borderRadius: '12px',
                fontSize: '15px', fontWeight: 'bold', letterSpacing: '1px', border: 'none', cursor: allFilled ? 'pointer' : 'not-allowed',
                backgroundColor: allFilled ? '#000080' : '#d1d5db',
                color: allFilled ? '#ffffff' : '#6b7280',
                boxShadow: allFilled ? '0 8px 20px rgba(0,0,128,0.2)' : 'none',
                transition: 'all 0.3s'
              }}
            >
              <Check size={20} strokeWidth={3} /> PRONTO
            </button>
          ) : (
            <div 
              style={{ 
                backgroundColor: '#ffffff', padding: '32px 20px', borderRadius: '24px', 
                boxShadow: '0 12px 40px rgba(0,0,128,0.15)', textAlign: 'center', width: '100%', maxWidth: '400px', boxSizing: 'border-box'
              }}
            >
              <p style={{ color: 'rgba(0,0,128,0.6)', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px' }}>
                Resultado
              </p>
              <h3 style={{ fontSize: 'clamp(28px, 8vw, 36px)', color: '#000080', margin: '0 0 24px 0', fontWeight: '300' }}>
                Você acertou <span style={{ fontWeight: '900', color: '#059669' }}>{calculateScore()}</span> de 5
              </h3>
              <button
                onClick={resetBoard}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px', margin: '0 auto', padding: '12px 24px', 
                  backgroundColor: '#000080', color: '#ffffff', borderRadius: '12px', fontSize: '14px', 
                  fontWeight: 'bold', border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,128,0.2)'
                }}
              >
                <RotateCcw size={16} strokeWidth={2.5} /> Tentar Novamente
              </button>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}