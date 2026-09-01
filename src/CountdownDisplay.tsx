import React from "react";

interface Props {
  milliseconds: number;
}

const CountdownDisplay: React.FC<Props> = ({ milliseconds }) => {
  const safeTime = Math.max(0, milliseconds);
  const seconds = Math.floor(safeTime / 1000);
  const msPart = safeTime % 1000;
  let centiseconds = Math.round(msPart / 10);

  if (centiseconds === 100) {
    centiseconds = 99;
  }

  return (
    <div className="flex items-center justify-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm p-2.5 min-w-[170px] transition-colors duration-300">
      
      {/* Stopwatch Inner Bezel */}
      <div className="flex w-full items-center justify-center bg-slate-950 border border-slate-800/80 rounded-[1.25rem] px-5 py-3 shadow-[inset_0_4px_15px_rgba(0,0,0,0.6)]">
        
        <div className="grid grid-cols-[1fr_auto_1fr] gap-x-2 items-center justify-items-center w-full">
          
          {/* Row 1: Glowing Race-Clock Red Numbers & Decimal */}
          <span className="text-4xl md:text-5xl font-mono font-bold tracking-wider text-rose-500 dark:text-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]">
            {seconds.toString().padStart(2, '0')}
          </span>
          
          {/* Decimal sits slightly lower to match the optical baseline of the digits */}
          <span className="text-3xl md:text-4xl font-mono font-bold text-rose-500 dark:text-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.6)] translate-y-1 md:translate-y-2">
            .
          </span>
          
          <span className="text-4xl md:text-5xl font-mono font-bold tracking-wider text-rose-500 dark:text-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]">
            {centiseconds.toString().padStart(2, '0')}
          </span>
          
          {/* Row 2: Dimmed Stopwatch Painted Labels */}
          <span className="text-[9px] font-bold text-rose-800 dark:text-rose-900 uppercase tracking-[0.2em] mt-1.5">
            Sec
          </span>
          <span /> {/* Empty grid cell for the period column */}
          <span className="text-[9px] font-bold text-rose-800 dark:text-rose-900 uppercase tracking-[0.2em] mt-1.5">
            Ms
          </span>

        </div>
      </div>

    </div>
  );
};

export default CountdownDisplay;