import React from "react";
import { MISSED_INSTRUMENT_CARD } from "./data/instruments/instrument";
import { NOTE_NAME_STRING_MAP } from "./data/pitch";
import Note from "./Note";
import MarimbaKeyboard, { MARIMBA_MARKER, MARKER_STYLE } from "./MarimbaKeyboard";
import { CARD_DISPLAY } from "./data/display";

interface Props {
  missedCard: MISSED_INSTRUMENT_CARD;
  display: CARD_DISPLAY;
}

const MissedCard: React.FC<Props> = ({ missedCard, display }) => {
  // Format the correct notes using your pitch.ts mapping
  const correctNotes = missedCard.noteCards
    .map((n) => NOTE_NAME_STRING_MAP[n.noteName])
    .join(", ");

  // Format what the user said using your pitch.ts mapping
  const givenNotes = missedCard.givenAnswer.length > 0 
    ? missedCard.givenAnswer.map((n) => NOTE_NAME_STRING_MAP[n]).join(", ") 
    : "Nothing";

  const isTapped = missedCard.givenPitch !== undefined;
  const correctPitch = missedCard.noteCards[0].pitch;

  // Tapped answers show the right bar in green and the tapped bar in red
  const markers: MARIMBA_MARKER[] =
    missedCard.givenPitch !== undefined
      ? [
          { pitch: missedCard.givenPitch, style: MARKER_STYLE.INCORRECT },
          { pitch: correctPitch, style: MARKER_STYLE.CORRECT },
        ]
      : [{ pitch: correctPitch, style: MARKER_STYLE.HIGHLIGHT }];

  return (
    <div className="flex flex-col items-center bg-white dark:bg-slate-900 rounded-[2rem] p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-200/60 dark:border-slate-800 transition-all duration-300 hover:shadow-lg w-full max-w-sm relative group">
      
      {/* Small header/badge */}
      <div className="absolute top-4 left-4 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
        Card #{missedCard.cardNumber}
      </div>

      {/* Visual representation of the note(s) */}
      <div className="mt-8 mb-6 flex flex-row flex-wrap justify-center gap-3 w-full px-2 min-w-0">
        {display === CARD_DISPLAY.MARIMBA ? (
          <div className="w-full bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700">
            <MarimbaKeyboard markers={markers} />
          </div>
        ) : (
          missedCard.noteCards.map((noteCard, idx) => (
            <div key={idx} className="flex flex-col items-center justify-center w-full max-w-[140px] sm:max-w-[180px] bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700">
              <Note card={noteCard} />
            </div>
          ))
        )}
      </div>

      {/* Side-by-side comparison of Given vs Correct */}
      <div className="w-full grid grid-cols-2 gap-4 mt-auto border-t border-slate-100 dark:border-slate-800/80 pt-6">
        
        {/* What the user said */}
        <div className="flex flex-col items-center text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
            {isTapped ? "You Tapped" : "You Said"}
          </span>
          <span className="text-xl font-black text-rose-500 drop-shadow-sm leading-tight">
            {givenNotes}
          </span>
        </div>

        {/* The right answer */}
        <div className="flex flex-col items-center text-center border-l border-slate-100 dark:border-slate-800/80">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
            Correct
          </span>
          <span className="text-xl font-black text-emerald-500 drop-shadow-sm leading-tight">
            {correctNotes}
          </span>
        </div>

      </div>
    </div>
  );
};

export default MissedCard;