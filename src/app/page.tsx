"use client";

import { useState, useEffect } from "react";
import MovieSlot from "@/components/MovieSlot";
import { THEMES, GOALS } from "@/utils/gameData";
import { MovieDetails, QualityGoal } from "@/types";
import { RotateCcw, Check, ChevronDown, Dices } from "lucide-react";

export default function Home() {
  const [theme, setTheme] = useState<string>("");
  const [goal, setGoal] = useState<QualityGoal>(GOALS[0]);
  const [slots, setSlots] = useState<(MovieDetails | null)[]>(Array(5).fill(null));
  const [isRevealed, setIsRevealed] = useState(false);

  // Sorteia um tema aleatório garantindo que não seja igual ao atual
  const pickRandomTheme = () => {
    let newTheme;
    do {
      newTheme = THEMES[Math.floor(Math.random() * THEMES.length)];
    } while (newTheme === theme && THEMES.length > 1);
    setTheme(newTheme);
  };

  // Roda apenas uma vez ao carregar a página
  useEffect(() => {
    pickRandomTheme();
  }, []);

  // Limpa o tabuleiro mas SALVA o tema e a nota que o usuário escolheu
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
    <main className="min-h-screen bg-[#050505] text-slate-200 font-sans flex flex-col items-center pt-16 pb-8 px-4">
      <div className="w-full max-w-5xl mx-auto flex flex-col items-center">
        
        {/* Cabeçalho */}
        <header className="text-center w-full" style={{ marginBottom: '60px' }}>
          <h1 className="text-2xl font-bold tracking-widest text-slate-100 uppercase mb-12 opacity-80">
            Cinco Filmes
          </h1>
          
          <div className="space-y-6 flex flex-col items-center">
            
            {/* Seleção de Tema Interativa */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-3 text-3xl md:text-4xl font-light text-slate-300">
              <span className="text-xl md:text-3xl">Existem 5 filmes de...</span>
              
              <div className="flex items-center w-[280px] md:w-[380px] bg-transparent border border-slate-700 hover:border-slate-500 focus-within:border-slate-400 rounded-full p-1.5 transition-all shadow-inner mt-2 md:mt-0">
                
                <button
                  onClick={pickRandomTheme}
                  disabled={isRevealed}
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-slate-800/60 text-slate-400 hover:bg-slate-700 hover:text-slate-200 transition-colors disabled:opacity-50 shrink-0"
                  title="Sortear tema aleatório"
                >
                  <Dices size={18} />
                </button>

                <input
                  type="text"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  disabled={isRevealed}
                  placeholder="Digite um tema..."
                  className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-white font-bold text-center placeholder:text-slate-700 placeholder:font-light px-2 min-w-0"
                />

                <div className="flex items-center justify-center w-9 text-slate-500 shrink-0 pointer-events-none">
                  <ChevronDown size={18} />
                </div>
              </div>
            </div>
            
            {/* Seleção de Nota */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-3 text-xl md:text-2xl font-light text-slate-400 pt-2">
              <span>com nota</span>
              
              {/* O contêiner pai agora gerencia a borda principal */}
              <div className="flex items-center w-[260px] md:w-[280px] bg-transparent border border-slate-700 hover:border-slate-500 focus-within:border-slate-400 rounded-full p-1.5 transition-all shadow-inner mt-2 md:mt-0">
                
                <select
                  value={goal.id}
                  onChange={(e) => {
                    const selected = GOALS.find(g => g.id === e.target.value);
                    if (selected) setGoal(selected);
                  }}
                  disabled={isRevealed}
                  // CORREÇÃO: Adicionado 'border-none outline-none focus:outline-none focus:ring-0' para matar a borda interna
                  className="appearance-none flex-1 bg-transparent border-none outline-none focus:outline-none focus:ring-0 font-bold text-blue-400 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all text-center pl-8 min-w-0"
                >
                  {GOALS.map((g) => (
                    <option key={g.id} value={g.id} style={{textAlign: 'center', backgroundColor: '#ffffff', color: '#000000' }}>
                      {g.label}
                    </option>
                  ))}
                </select>
                
                {/* Seta posicionada dentro do Flexbox, na direita */}
                <div className="flex items-center justify-center w-8 text-blue-400 shrink-0 pointer-events-none">
                  <ChevronDown size={18} />
                </div>
              </div>
            </div>

          </div>
        </header>

        {/* Retângulos (Film Strip) */}
        <div className="flex flex-wrap justify-center w-full px-2" style={{ gap: '18px' }}>
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
        <div className="flex flex-col items-center" style={{ marginTop: '80px' }}>
          {!isRevealed ? (
            <button
              disabled={!allFilled}
              onClick={() => setIsRevealed(true)}
              className={`flex items-center gap-3 px-10 py-3 rounded-full text-sm font-semibold tracking-wide uppercase transition-all duration-300
                ${allFilled 
                  ? 'bg-slate-100 text-slate-900 hover:bg-white hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.1)]' 
                  : 'bg-slate-900 text-slate-600 cursor-not-allowed border border-slate-800'}`}
            >
              <Check size={16} /> Pronto
            </button>
          ) : (
            <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
              <p className="text-slate-400 uppercase tracking-widest text-xs mb-2">Resultado</p>
              <h3 className="text-4xl font-light mb-8 text-white">
                Você acertou <span className="font-bold text-emerald-400">{calculateScore()}</span> de 5
              </h3>
              <button
                onClick={resetBoard}
                className="flex items-center gap-2 mx-auto px-6 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-full text-sm font-medium transition-colors"
              >
                <RotateCcw size={14} /> Tentar Novamente
              </button>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}