import React from "react";
import { CARD } from "./data/cards";
import Note from "./Note";

interface Props {
  noteCards: CARD[];
}

const NoteCardGroup: React.FC<Props> = ({ noteCards }) => {
  return (
    <div className="flex flex-col lg:flex-row flex-wrap items-center justify-center gap-4 md:gap-8 w-full min-w-0">
      {noteCards.map((noteCard, idx) => (
        <div
          key={idx}
          className="flex flex-col items-center justify-center w-full max-w-[240px] sm:max-w-[320px] md:max-w-[440px] rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 bg-white"
        >
          <Note card={noteCard} />
        </div>
      ))}
    </div>
  );
};

export default NoteCardGroup;