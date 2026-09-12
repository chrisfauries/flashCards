import React, { useState } from "react";
import { TIMED_INSTRUMENT_CARD } from "./data/instruments/instrument";
import { NOTE_NAME_STRING_MAP } from "./data/pitch";
import Note from "./Note";

interface Props {
  correctAnswers: TIMED_INSTRUMENT_CARD[];
}

const SpeedBreakdown: React.FC<Props> = ({ correctAnswers }) => {
  const [selectedCard, setSelectedCard] = useState<TIMED_INSTRUMENT_CARD | null>(null);

  const sortedCorrectAnswers = [...correctAnswers].sort(
    (a, b) => b.timeToAnswerMs - a.timeToAnswerMs
  );
  const maxTime = sortedCorrectAnswers.length > 0 ? sortedCorrectAnswers[0].timeToAnswerMs : 0;

  return (
    <>
      <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-200/60 dark:border-slate-800 p-6 md:p-10 mb-12 animate-in slide-in-from-bottom-8 duration-700 delay-300">
        <h3 className="text-lg md:text-xl font-extrabold text-slate-800 dark:text-slate-100 mb-1 text-center uppercase tracking-widest">
          Speed Breakdown
        </h3>
        <p className="text-xs font-medium text-slate-400 dark:text-slate-500 text-center mb-6 tracking-wide">
          Click a row for more details
        </p>

        <div className="grid grid-cols-[40px_80px_1fr] items-center gap-4 mb-2 pb-3 border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-widest px-2">
          <div className="text-center">#</div>
          <div>Note</div>
          <div>Time</div>
        </div>

        <div className="flex flex-col gap-1">
          {sortedCorrectAnswers.map((card) => {
            const timeMs = card.timeToAnswerMs;
            const percentage = maxTime > 0 ? (timeMs / maxTime) * 100 : 0;
            const noteNames = card.noteCards
              .map((n) => NOTE_NAME_STRING_MAP[n.noteName])
              .join(", ");

            return (
              <div
                key={card.cardNumber}
                onClick={() => setSelectedCard(card)}
                className="grid grid-cols-[40px_80px_1fr] items-center gap-4 p-2 md:px-2 -mx-2 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
              >
                <div className="text-sm font-bold text-slate-400 text-center transition-colors group-hover:text-slate-600 dark:group-hover:text-slate-300">
                  {card.cardNumber}
                </div>
                <div className="text-base font-black text-indigo-500 dark:text-indigo-400">
                  {noteNames}
                </div>
                <div className="flex items-center gap-3 w-full">
                  <div className="flex-1 h-3 bg-slate-100 dark:bg-slate-800/80 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="text-xs font-mono font-bold text-slate-500 w-12 text-right transition-colors group-hover:text-slate-700 dark:group-hover:text-slate-300">
                    {(timeMs / 1000).toFixed(1)}s
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dialog Modal for clicked card */}
      {selectedCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          {/* Dark Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm cursor-pointer"
            onClick={() => setSelectedCard(null)}
          />

          {/* Modal Container */}
          <div className="relative bg-white dark:bg-slate-900 rounded-[2rem] p-6 md:p-8 shadow-2xl border border-slate-200/60 dark:border-slate-800 w-full max-w-sm flex flex-col items-center animate-in zoom-in-95 duration-200">
            
            {/* Badges and Close Button */}
            <div className="absolute top-4 left-4 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
              Card #{selectedCard.cardNumber}
            </div>

            <button
              onClick={() => setSelectedCard(null)}
              className="absolute top-3 right-3 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Note Canvas Rendering */}
            <div className="mt-10 mb-8 flex flex-row flex-wrap justify-center gap-3 w-full px-2 min-w-0">
              {selectedCard.noteCards.map((noteCard, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center justify-center w-full max-w-[140px] sm:max-w-[180px] bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700"
                >
                  <Note card={noteCard} />
                </div>
              ))}
            </div>

            {/* Time and Note Details */}
            <div className="w-full grid grid-cols-2 gap-4 mt-auto border-t border-slate-100 dark:border-slate-800/80 pt-6">
              <div className="flex flex-col items-center text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                  Note
                </span>
                <span className="text-xl font-black text-indigo-500 dark:text-indigo-400 drop-shadow-sm leading-tight">
                  {selectedCard.noteCards
                    .map((n) => NOTE_NAME_STRING_MAP[n.noteName])
                    .join(", ")}
                </span>
              </div>

              <div className="flex flex-col items-center text-center border-l border-slate-100 dark:border-slate-800/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                  Time
                </span>
                <span className="text-xl font-black text-emerald-500 drop-shadow-sm leading-tight">
                  {(selectedCard.timeToAnswerMs / 1000).toFixed(1)}s
                </span>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default SpeedBreakdown;