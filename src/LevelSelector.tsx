import React from "react";
import { LEVEL } from "./data/instruments/level";

interface Props {
  levelCount: number;
  level: LEVEL | "";
  setLevel: React.Dispatch<React.SetStateAction<"" | LEVEL>>;
  disabled?: boolean;
}

const LEVEL_THEMES: Record<string, string> = {
  "One": "bg-rose-500 text-white border-rose-400 shadow-lg shadow-rose-500/30",
  "Two": "bg-orange-500 text-white border-orange-400 shadow-lg shadow-orange-500/30",
  "Three": "bg-amber-500 text-white border-amber-400 shadow-lg shadow-amber-500/30",
  "Four": "bg-lime-500 text-white border-lime-400 shadow-lg shadow-lime-500/30",
  "Five": "bg-emerald-500 text-white border-emerald-400 shadow-lg shadow-emerald-500/30",
  "Six": "bg-teal-500 text-white border-teal-400 shadow-lg shadow-teal-500/30",
  "Seven": "bg-cyan-500 text-white border-cyan-400 shadow-lg shadow-cyan-500/30",
  "Eight": "bg-sky-500 text-white border-sky-400 shadow-lg shadow-sky-500/30",
  "Nine": "bg-blue-500 text-white border-blue-400 shadow-lg shadow-blue-500/30",
  "Ten": "bg-indigo-500 text-white border-indigo-400 shadow-lg shadow-indigo-500/30",
  "Eleven": "bg-violet-500 text-white border-violet-400 shadow-lg shadow-violet-500/30",
  "Twelve": "bg-fuchsia-500 text-white border-fuchsia-400 shadow-lg shadow-fuchsia-500/30",
};

const LevelSelector: React.FC<Props> = ({
  levelCount,
  level,
  setLevel,
  disabled = false,
}) => {
  const options = Object.values(LEVEL).slice(0, levelCount);

  return (
    <div className={`w-full transition-all duration-500 ${disabled ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
      <div className="mb-3 flex items-center justify-center">
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          Select Level
        </h3>
      </div>
      
      <div className="flex flex-wrap justify-center items-center gap-2.5 px-2 max-w-2xl mx-auto">
        {options.map((lvl, index) => {
          const isSelected = level === lvl;
          const selectedTheme = LEVEL_THEMES[lvl] || "bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-500/30";
          const digit = index + 1;
          
          return (
            <button
              key={lvl}
              type="button"
              aria-pressed={isSelected}
              onClick={() => setLevel(lvl)}
              className={`
                relative flex items-center justify-center w-11 h-11 rounded-full text-base font-bold border
                transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
                active:scale-95 outline-none select-none
                ${
                  isSelected
                    ? `${selectedTheme} scale-110 -translate-y-1 z-10`
                    : "bg-white text-slate-600 border-slate-200/80 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 hover:-translate-y-0.5 dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
                }
                focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900
              `}
            >
              {digit}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default LevelSelector;