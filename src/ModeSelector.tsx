import React from "react";
import { MODE } from "./data/instruments/mode";
import { CHALLENGE_LEVEL } from "./data/breakpoints";

interface Props {
  mode: MODE;
  setMode: React.Dispatch<React.SetStateAction<MODE>>;
  setChallengeLevel: React.Dispatch<React.SetStateAction<CHALLENGE_LEVEL | "">>;
  disabled?: boolean;
}

const getModeIcon = (mode: MODE) => {
  if (mode === MODE.TIME_TRIAL_MODE) {
    return (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  }
  if (mode === MODE.CHALLENGE_MODE) {
    return (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    );
  }
  if (mode === MODE.MANUAL_MODE) {
    return (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    );
  }
  return null;
};

const ModeSelector: React.FC<Props> = ({
  mode,
  setMode,
  disabled = false,
  setChallengeLevel,
}) => {
  const options = Object.values(MODE);

  return (
    <div className={`w-full transition-all duration-500 ${disabled ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
      <div className="mb-3 flex items-center justify-center">
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          Select Mode
        </h3>
      </div>
      
      <div className="flex flex-wrap justify-center items-center gap-3 px-2">
        {options.map((m) => {
          const isSelected = mode === m;
          return (
            <button
              key={m}
              type="button"
              aria-pressed={isSelected}
              onClick={() => {
                setMode(m);
                if (m !== MODE.CHALLENGE_MODE) {
                  setChallengeLevel("");
                }
              }}
              className={`
                relative flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border
                transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
                active:scale-95 outline-none select-none
                ${
                  isSelected
                    ? "bg-emerald-500 text-white border-emerald-400 shadow-lg shadow-emerald-500/30 scale-105 -translate-y-0.5 z-10"
                    : "bg-white text-slate-600 border-slate-200/80 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
                }
                focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900
              `}
            >
              {getModeIcon(m)}
              {m.replace(" Mode", "")}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ModeSelector;