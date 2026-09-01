import React from "react";

interface Props {
  correct: number;
  total: number;
}

const Score: React.FC<Props> = ({ correct, total }) => {
  return (
    <div className="flex items-center justify-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm p-2.5 min-w-[170px] transition-colors duration-300">
      
      {/* Scoreboard Inner Bezel */}
      <div className="flex w-full items-center justify-center bg-slate-950 border border-slate-800/80 rounded-[1.25rem] px-5 py-3 shadow-[inset_0_4px_15px_rgba(0,0,0,0.6)]">
        
        <div className="grid grid-cols-[1fr_auto_1fr] gap-x-3 items-center justify-items-center w-full">
          
          {/* Row 1: Glowing Amber Numbers & Separator */}
          <span className="text-4xl md:text-5xl font-mono font-bold tracking-wider text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]">
            {correct.toString().padStart(2, '0')}
          </span>
          
          {/* Dimmed separator so the numbers stand out */}
          <span className="text-3xl md:text-4xl font-mono font-bold text-amber-700/50 drop-shadow-none -translate-y-0.5 md:-translate-y-1">
            -
          </span>
          
          <span className="text-4xl md:text-5xl font-mono font-bold tracking-wider text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]">
            {total.toString().padStart(2, '0')}
          </span>
          
          {/* Row 2: Dimmed Scoreboard Painted Labels */}
          <span className="text-[9px] font-bold text-amber-800 dark:text-amber-900 uppercase tracking-[0.15em] mt-1.5">
            Correct
          </span>
          <span /> {/* Empty grid cell for the separator column */}
          <span className="text-[9px] font-bold text-amber-800 dark:text-amber-900 uppercase tracking-[0.15em] mt-1.5">
            Total
          </span>

        </div>
      </div>

    </div>
  );
};

export default Score;