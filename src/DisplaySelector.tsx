import React from "react";
import { CARD_DISPLAY } from "./data/display";

interface Props {
  display: CARD_DISPLAY;
  setDisplay: React.Dispatch<React.SetStateAction<CARD_DISPLAY>>;
  disabled?: boolean;
}

const DisplaySelector: React.FC<Props> = ({
  display,
  setDisplay,
  disabled = false,
}) => {
  const options = Object.values(CARD_DISPLAY);

  return (
    <div className={`w-full transition-all duration-500 animate-in fade-in slide-in-from-top-4 ${disabled ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
      <div className="mb-3 flex items-center justify-center">
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          Show Notes On
        </h3>
      </div>

      <div className="flex flex-wrap justify-center items-center gap-3 px-2">
        {options.map((d) => {
          const isSelected = display === d;
          return (
            <button
              key={d}
              type="button"
              aria-pressed={isSelected}
              onClick={() => setDisplay(d)}
              className={`
                relative px-6 py-2.5 rounded-full text-sm font-bold border
                transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
                active:scale-95 outline-none select-none
                ${
                  isSelected
                    ? "bg-indigo-500 text-white border-indigo-400 shadow-lg shadow-indigo-500/30 scale-105 -translate-y-0.5 z-10"
                    : "bg-white text-slate-600 border-slate-200/80 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
                }
                focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900
              `}
            >
              {d}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DisplaySelector;
