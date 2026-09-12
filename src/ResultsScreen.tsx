import React, { JSX } from "react";
import {
  INSTRUMENT,
  INSTRUMENT_CARD,
  TIMED_INSTRUMENT_CARD,
  MISSED_INSTRUMENT_CARD,
} from "./data/instruments/instrument";
import MissedCard from "./MissedCard";
import {
  ACHIEVEMENT_LEVEL,
  ACHIEVEMENT_LEVEL_MULTIPLIER_MAP,
  CHALLENGE_LEVEL,
} from "./data/breakpoints";
import { PHASE } from "./data/phase";
import Time from "./Time";
import Score from "./Score";
import { LEVEL } from "./data/instruments/level";
import { QUIZ_CARD_ACTION, QuizCardAction } from "./App";
import { MODE } from "./data/instruments/mode";
import SpeedBreakdown from "./SpeedBreakdown";

const getAchievementLevel = (
  totalSeconds: number,
  totalCards: number
): ACHIEVEMENT_LEVEL => {
  let highestBreakpoint = ACHIEVEMENT_LEVEL.KEEPING_PRACTICING;

  for (const [achievementLevel, multiplier] of Object.entries(
    ACHIEVEMENT_LEVEL_MULTIPLIER_MAP
  )) {
    if (multiplier * totalCards >= totalSeconds) {
      highestBreakpoint = achievementLevel as ACHIEVEMENT_LEVEL;
    }
  }

  return highestBreakpoint;
};

interface Props {
  instrument: INSTRUMENT;
  level: LEVEL;
  mode: MODE;
  challengeLevel: CHALLENGE_LEVEL | "";
  correctAnswers: TIMED_INSTRUMENT_CARD[];
  missedAnswers: MISSED_INSTRUMENT_CARD[];
  minutes: number;
  seconds: number;
  setPhase: React.Dispatch<React.SetStateAction<PHASE>>;
  setQuizCards: React.ActionDispatch<[action: QuizCardAction]>;
}

const ResultsScreen: React.FC<Props> = ({
  instrument,
  level,
  mode,
  challengeLevel,
  correctAnswers,
  missedAnswers,
  minutes,
  seconds,
  setPhase,
  setQuizCards,
}) => {
  const totalSeconds = seconds + minutes * 60;
  const totalCards = correctAnswers.length + missedAnswers.length;

  const calculatedAchievement = getAchievementLevel(
    totalSeconds,
    correctAnswers.length
  );

  const activeAchievement =
    mode === MODE.CHALLENGE_MODE
      ? (challengeLevel as string)
      : calculatedAchievement;

  const allCorrect = missedAnswers.length === 0;

  // Visual Theme Setup based on Achievement
  let themeClass = "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-slate-900 dark:text-white";
  let achievementColor = "text-indigo-500";
  let icon = null;
  let overlayAnimation = null;

  if (allCorrect) {
    switch (activeAchievement) {
      case ACHIEVEMENT_LEVEL.LIGHTNING:
        themeClass = "bg-gradient-to-br from-cyan-400 to-blue-600 shadow-[0_10px_50px_rgba(6,182,212,0.5)] border-cyan-300 text-white relative z-20";
        achievementColor = "text-cyan-100 font-black drop-shadow-md";
        icon = (
          <svg className="w-20 h-20 mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        );
        overlayAnimation = (
          <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden mix-blend-screen">
            {/* Ambient slow pulse (Safe) */}
            <div className="absolute inset-0 bg-cyan-400/10 animate-pulse" style={{ animationDuration: '4s' }} />
            
            {/* Colossal Lightning Bolts with smooth, slow glowing animation instead of strobing */}
            <svg className="absolute top-[-20%] left-[10%] w-48 md:w-96 h-[150%] text-cyan-300 animate-electric-glow" style={{ animationDelay: '0s', animationDuration: '6s' }} fill="currentColor" preserveAspectRatio="none" viewBox="0 0 24 24">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            <svg className="absolute top-[-10%] right-[5%] w-64 md:w-[32rem] h-[120%] text-cyan-50 animate-electric-glow" style={{ animationDelay: '2s', animationDuration: '7s' }} fill="currentColor" preserveAspectRatio="none" viewBox="0 0 24 24">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            <svg className="absolute top-[-30%] left-[45%] w-32 md:w-64 h-[180%] text-blue-300 animate-electric-glow" style={{ animationDelay: '4s', animationDuration: '5s' }} fill="currentColor" preserveAspectRatio="none" viewBox="0 0 24 24">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
        );
        break;
      case ACHIEVEMENT_LEVEL.GOLD:
        themeClass = "bg-gradient-to-br from-yellow-300 to-amber-500 shadow-[0_10px_50px_rgba(251,191,36,0.5)] border-yellow-200 text-amber-950";
        achievementColor = "text-white font-black drop-shadow-md";
        icon = (
          <svg className="w-20 h-20 mb-4 animate-in zoom-in duration-700 drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        );
        overlayAnimation = (
          <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            <div className="absolute top-[-10%] left-[20%] w-4 h-12 bg-yellow-300/60 rounded-full animate-fall blur-[2px]" style={{ animationDelay: '0s', animationDuration: '3s' }} />
            <div className="absolute top-[-10%] left-[50%] w-6 h-6 bg-yellow-200/80 rounded-full animate-fall blur-[1px]" style={{ animationDelay: '0.5s', animationDuration: '4s' }} />
            <div className="absolute top-[-10%] left-[80%] w-3 h-10 bg-amber-300/60 rounded-full animate-fall blur-[2px]" style={{ animationDelay: '1s', animationDuration: '3.5s' }} />
          </div>
        );
        break;
      case ACHIEVEMENT_LEVEL.SILVER:
        themeClass = "bg-gradient-to-br from-slate-300 to-slate-500 shadow-[0_10px_50px_rgba(148,163,184,0.5)] border-slate-200 text-slate-900";
        achievementColor = "text-white font-black drop-shadow-md";
        icon = (
          <svg className="w-20 h-20 mb-4 animate-in zoom-in duration-700 drop-shadow-lg" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        );
        break;
      case ACHIEVEMENT_LEVEL.BRONZE:
        themeClass = "bg-gradient-to-br from-orange-400 to-orange-700 shadow-[0_10px_50px_rgba(234,88,12,0.4)] border-orange-300 text-white";
        achievementColor = "text-orange-100 font-black drop-shadow-md";
        icon = (
          <svg className="w-20 h-20 mb-4 animate-in zoom-in duration-700 drop-shadow-lg" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        );
        break;
      case ACHIEVEMENT_LEVEL.KEEPING_PRACTICING:
      default:
        themeClass = "bg-gradient-to-br from-emerald-400 to-teal-600 shadow-[0_10px_50px_rgba(16,185,129,0.4)] border-emerald-300 text-white";
        achievementColor = "text-emerald-100 font-black drop-shadow-md";
        icon = (
          <svg className="w-20 h-20 mb-4 animate-in zoom-in duration-700 drop-shadow-lg" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
          </svg>
        );
        break;
    }
  }

  let allCorrectSubTitle: JSX.Element = <></>;
  if (allCorrect) {
    if (mode === MODE.TIME_TRIAL_MODE) {
      allCorrectSubTitle = (
        <p className="text-xl md:text-2xl font-medium mt-4 tracking-wide text-center">
          For {instrument} Level {level}, you are a <span className={achievementColor}>{activeAchievement}</span> level note reader!
        </p>
      );
    } else if (mode === MODE.CHALLENGE_MODE) {
      allCorrectSubTitle = (
        <p className="text-xl md:text-2xl font-medium mt-4 tracking-wide text-center">
          For {instrument} Level {level}, you are a <span className={achievementColor}>{activeAchievement}</span> level note reader!
        </p>
      );
    }
  }

  return (
    <div className="flex flex-col items-center w-full max-w-6xl mx-auto px-4 py-12 md:py-16 min-h-screen animate-in fade-in duration-700">
      
      {/* Full-Screen Effects for High Achievements */}
      <style>{`
        /* Gold Particles */
        @keyframes fall {
          0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
        }
        .animate-fall {
          animation-name: fall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        /* Safe Electric Glow (Replaces hazardous strobing flashes) */
        @keyframes electricGlow {
          0%, 100% { opacity: 0.5; filter: drop-shadow(0 0 30px rgba(34,211,238,0.5)) scale(1); }
          50% { opacity: 0.9; filter: drop-shadow(0 0 80px rgba(34,211,238,1)) scale(1.05); }
        }
        .animate-electric-glow {
          animation: electricGlow 4s ease-in-out infinite;
          transform-origin: center;
        }
      `}</style>
      
      {overlayAnimation}

      {/* Metrics Row (Time & Score side-by-side) */}
      <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 w-full mb-10 z-10">
        {mode !== MODE.CHALLENGE_MODE && (
          <Time minutes={minutes} seconds={seconds} />
        )}
        <Score
          correct={correctAnswers.length}
          total={totalCards}
        />
      </div>

      {/* Primary Result Banner / Hero Card */}
      {allCorrect ? (
        <div className="flex flex-col items-center w-full z-10">
          <div className={`flex flex-col items-center justify-center w-full max-w-4xl rounded-[3rem] p-10 md:p-16 mb-12 border relative overflow-hidden transition-all duration-500 z-10 ${themeClass}`}>
            {icon}
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-2 text-center drop-shadow-sm">
              Results!
            </h1>
            {allCorrectSubTitle}
          </div>

          {/* New Stats Component for Time Trial mode */}
          {mode === MODE.TIME_TRIAL_MODE && correctAnswers.length > 0 && (
            <SpeedBreakdown correctAnswers={correctAnswers} />
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center w-full max-w-4xl rounded-[3rem] p-10 md:p-14 mb-12 border bg-white dark:bg-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-none border-slate-200 dark:border-slate-800 relative overflow-hidden transition-all duration-500 z-10">
          <svg className="w-16 h-16 md:w-20 md:h-20 mb-6 text-indigo-500 dark:text-indigo-400 animate-in zoom-in duration-700 drop-shadow-sm" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
          </svg>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-slate-900 dark:text-white text-center">
            Keep Going!
          </h1>
          <p className="text-base md:text-lg font-medium text-slate-500 dark:text-slate-400 tracking-wide text-center max-w-xl">
            Mistakes are just proof that you're trying. Review the cards you missed below, practice them, and you'll get it perfect next time!
          </p>
        </div>
      )}

      {/* Missed Cards Section */}
      {missedAnswers.length > 0 && (
        <div className="w-full flex flex-col items-center z-10 animate-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both">
          
          <div className="flex items-center gap-4 mb-8 px-2 w-full max-w-4xl">
            <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
            <h3 className="text-sm md:text-base font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500">
              Cards You Missed ({missedAnswers.length})
            </h3>
            <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
          </div>
          
          <div className="flex flex-row justify-center flex-wrap w-full gap-6 md:gap-8 mb-12">
            {missedAnswers.map((missedCard) => (
              <MissedCard key={missedCard.cardNumber} missedCard={missedCard} />
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap flex-row items-center justify-center gap-4 w-full mb-16 z-10">
        
        <button
          title="Test yourself again using the same set of flashcards in a different order!"
          onClick={() => setPhase(PHASE.QUIZZING)}
          className="flex items-center justify-center px-8 py-4 rounded-full text-sm md:text-base font-bold transition-all duration-300 ease-out active:scale-95 outline-none bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 hover:scale-105 focus-visible:ring-4 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
        >
          Retry
        </button>
        
        <button
          title="Go back to the main screen to choose a different instrument or level"
          onClick={() => setPhase(PHASE.SETUP)}
          className="flex items-center justify-center px-8 py-4 rounded-full text-sm md:text-base font-bold transition-all duration-300 ease-out active:scale-95 outline-none bg-slate-200 text-slate-800 shadow-sm hover:bg-slate-300 hover:scale-105 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:border-slate-700 focus-visible:ring-4 focus-visible:ring-slate-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
        >
          Reset
        </button>

        {missedAnswers.length > 0 && (
          <button
            title="Practice just the missed cards from above"
            onClick={() => {
              setQuizCards({
                type: QUIZ_CARD_ACTION.SET_FOR_PRACTICE_MODE,
                missedAnswers,
              });
              setPhase(PHASE.QUIZZING);
            }}
            className="flex items-center justify-center px-8 py-4 rounded-full text-sm md:text-base font-bold transition-all duration-300 ease-out active:scale-95 outline-none bg-rose-600 text-white shadow-lg shadow-rose-600/30 hover:bg-rose-500 hover:scale-105 focus-visible:ring-4 focus-visible:ring-rose-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
          >
            Practice Missed
          </button>
        )}
      </div>

    </div>
  );
};

export default ResultsScreen;