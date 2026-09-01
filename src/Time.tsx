import React from "react";

interface Props {
  minutes: number;
  seconds: number;
}

const Time: React.FC<Props> = ({ minutes, seconds }) => {
  return (
    <div className="flex items-center justify-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm p-2.5 min-w-[170px] transition-colors duration-300">
      
      {/* Digital Screen Inner Bezel */}
      <div className="flex w-full items-center justify-center bg-slate-950 border border-slate-800/80 rounded-[1.25rem] px-5 py-3 shadow-[inset_0_4px_15px_rgba(0,0,0,0.6)]">
        
        <div className="grid grid-cols-[1fr_auto_1fr] gap-x-2 items-center justify-items-center w-full">
          
          {/* Row 1: Glowing Numbers & Blinking Separator */}
          <span className="text-4xl md:text-5xl font-mono font-bold tracking-wider text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
            {minutes.toString().padStart(2, '0')}
          </span>
          
          <span className="text-3xl md:text-4xl font-mono font-bold text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] -translate-y-0.5 md:-translate-y-1 animate-pulse">
            :
          </span>
          
          <span className="text-4xl md:text-5xl font-mono font-bold tracking-wider text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
            {seconds.toString().padStart(2, '0')}
          </span>
          
          {/* Row 2: Dimmed Screen Labels */}
          <span className="text-[9px] font-bold text-cyan-800 dark:text-cyan-900 uppercase tracking-[0.2em] mt-1.5">
            Min
          </span>
          <span /> {/* Empty grid cell for the colon column */}
          <span className="text-[9px] font-bold text-cyan-800 dark:text-cyan-900 uppercase tracking-[0.2em] mt-1.5">
            Sec
          </span>

        </div>
      </div>

    </div>
  );
};

export default Time;