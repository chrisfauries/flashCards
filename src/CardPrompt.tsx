import React from "react";
import { CARD } from "./data/cards";
import { CARD_DISPLAY } from "./data/display";
import NoteCardGroup from "./NoteCardGroup";
import MarimbaKeyboard, { MARKER_STYLE } from "./MarimbaKeyboard";

interface Props {
  noteCards: CARD[];
  display: CARD_DISPLAY;
}

const CardPrompt: React.FC<Props> = ({ noteCards, display }) => {
  if (display === CARD_DISPLAY.MARIMBA) {
    // sharp/flat cards share a pitch, so a single bar is marked
    return (
      <div className="flex items-center justify-center w-full min-w-0">
        <div className="w-full max-w-3xl rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 bg-white">
          <MarimbaKeyboard
            markers={[{ pitch: noteCards[0].pitch, style: MARKER_STYLE.HIGHLIGHT }]}
          />
        </div>
      </div>
    );
  }

  return <NoteCardGroup noteCards={noteCards} />;
};

export default CardPrompt;
