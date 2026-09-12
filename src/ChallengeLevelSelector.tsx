import React from "react";
import { ACHIEVEMENT_LEVEL, CHALLENGE_LEVEL } from "./data/breakpoints";

interface Props {
  challengeLevel: CHALLENGE_LEVEL | "";
  setChallengeLevel: React.Dispatch<React.SetStateAction<"" | CHALLENGE_LEVEL>>;
  disabled?: boolean;
}

const ChallengeLevelSelector: React.FC<Props> = ({
  challengeLevel,
  setChallengeLevel,
  disabled = false,
}) => {
  const options = Object.values(ACHIEVEMENT_LEVEL)
    .filter((x) => x !== ACHIEVEMENT_LEVEL.KEEPING_PRACTICING);

  return (
    <div className={`w-full transition-all duration-500 animate-in fade-in slide-in-from-top-4 ${disabled ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
      <div className="mb-3 flex items-center justify-center">
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          Challenge Difficulty
        </h3>
      </div>
      
      <div className="flex flex-wrap justify-center items-center gap-3 px-2">
        {options.map((level) => {
          const isSelected = challengeLevel === level;
          
          let baseClass = "";
          let selectedClass = "";
          
          if (level === ACHIEVEMENT_LEVEL.BRONZE) {
            baseClass = "border-orange-700/30 text-orange-800 bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/30 dark:text-orange-300";
            selectedClass = "bg-orange-600 text-white border-orange-500 shadow-lg shadow-orange-600/30 scale-105 -translate-y-0.5 z-10";
          } else if (level === ACHIEVEMENT_LEVEL.SILVER) {
            baseClass = "border-slate-400/50 text-slate-600 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/80 dark:border-slate-600 dark:text-slate-300";
            selectedClass = "bg-slate-400 text-white border-slate-300 shadow-lg shadow-slate-400/30 scale-105 -translate-y-0.5 z-10";
          } else if (level === ACHIEVEMENT_LEVEL.GOLD) {
            baseClass = "border-yellow-500/40 text-yellow-700 bg-yellow-50 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-300";
            selectedClass = "bg-yellow-400 text-yellow-950 border-yellow-300 shadow-lg shadow-yellow-400/30 scale-105 -translate-y-0.5 z-10";
          } else if (level === ACHIEVEMENT_LEVEL.LIGHTNING) {
            baseClass = "border-yellow-500/40 text-blue-700 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300";
            selectedClass = "bg-blue-400 text-blue-950 border-blue-300 shadow-lg shadow-blue-400/30 scale-105 -translate-y-0.5 z-10";
          }

          return (
            <button
              key={level}
              type="button"
              aria-pressed={isSelected}
              onClick={() => setChallengeLevel(level as CHALLENGE_LEVEL)}
              className={`
                relative px-6 py-2.5 rounded-full text-sm font-bold border
                transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
                active:scale-95 outline-none select-none
                ${isSelected ? selectedClass : baseClass}
                focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900
              `}
            >
              {level}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ChallengeLevelSelector;