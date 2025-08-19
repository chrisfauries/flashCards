import React from "react";
import { MISSED_INSTRUMENT_CARD } from "./data/instruments/instrument";
import { NOTE_NAME_STRING_MAP } from "./data/pitch";
import Note from "./Note";

interface Props {
  missedCard: MISSED_INSTRUMENT_CARD;
}

const MissedCard: React.FC<Props> = ({ missedCard }) => {
  const correctResponseString = missedCard.noteCards
    .map((noteCard) => NOTE_NAME_STRING_MAP[noteCard.noteName])
    .join("/");

  const actualResponseString = missedCard.givenAnswer
    .map((noteName) => NOTE_NAME_STRING_MAP[noteName])
    .join("/");

  return (
    <div className="flex flex-col items-center justify-between bg-gray-900 text-white font-sans m-4 p-4">
      <h5 className="text-2xl font-bold mb-2">
        {missedCard.instrument} #{missedCard.cardNumber}
      </h5>
      {missedCard.noteCards.map((noteCard) => (
        <Note key={noteCard.noteName + noteCard.pitch * 100} card={noteCard} />
      ))}

      <p className="text-sm mt-2">
        Correct answer is "{correctResponseString}" but you said "
        {actualResponseString}"
      </p>
    </div>
  );
};

export default MissedCard;
