import React, { useEffect, useRef, useState } from "react";
import { NOTE_NAME } from "./data/pitch";
import {
  INSTRUMENT_CARD,
  MISSED_INSTRUMENT_CARD,
} from "./data/instruments/instrument";
import { PHASE } from "./data/phase";
import arrayShuffle from "array-shuffle";
import Time from "./Time";
import Score from "./Score";
import Note from "./Note";
import { RecognizerUpdate } from "./use-recognizer";

interface Props {
  instrumentCards: INSTRUMENT_CARD[];
  setPhase: React.Dispatch<React.SetStateAction<PHASE>>;
  pauseTimer: () => void;
  resetTimer: (offset?: Date, newAutoStart?: boolean) => void;
  minutes: number;
  seconds: number;
  correctAnswers: INSTRUMENT_CARD[];
  addCorrectAnswer: React.ActionDispatch<[newValue: INSTRUMENT_CARD | null]>;
  addMissedAnswer: React.ActionDispatch<
    [newValue: MISSED_INSTRUMENT_CARD | null]
  >;
  isCatchPhaseSpoken: boolean;
  resetCatchPhaseFlag: () => void;
  results: RecognizerUpdate[];
  resetResults: () => void;
}

const QuizScreen: React.FC<Props> = ({
  instrumentCards: orderedInstrumentCards,
  setPhase,
  pauseTimer,
  resetTimer,
  minutes,
  seconds,
  correctAnswers,
  addCorrectAnswer,
  addMissedAnswer,
  isCatchPhaseSpoken,
  resetCatchPhaseFlag,
  results,
  resetResults,
}) => {
  const nextResultToHandle = useRef(0);
  const cardCount = orderedInstrumentCards.length;
  const [isPrimed, setIsPrimed] = useState(false);
  const [instrumentCards] = useState(arrayShuffle(orderedInstrumentCards));
  const [instrumentCardIndex, setCurrentCardIndex] = useState(0);
  const currentInstumentCard: INSTRUMENT_CARD | undefined =
    instrumentCards[instrumentCardIndex];
  const noteCards = currentInstumentCard.noteCards;
  const noteNames = new Set(noteCards.map((noteCard) => noteCard.noteName));

  const waitingForFinalResult = useRef<{
    i: number;
    checkedNoteNames: Set<NOTE_NAME>;
  }>({
    i: instrumentCardIndex,
    checkedNoteNames: new Set(),
  });

  const updater = (result: RecognizerUpdate) => {
    if (waitingForFinalResult.current.i > instrumentCardIndex) {
      console.warn("executing out of sync, this is a bug");
    }

    // For finalized values: if wrong answers, mark as wrong and advance
    if (result.isFinal) {
      // we need to determine if we are verifying a previous card or the current one.
      if (waitingForFinalResult.current.i < instrumentCardIndex) {
        // verifying old result
        const notesToVerify = new Set(
          instrumentCards[waitingForFinalResult.current.i].noteCards.map(
            (noteCard) => noteCard.noteName
          )
        );

        if (result.result.every((x) => notesToVerify.has(x))) {
          waitingForFinalResult.current = {
            i: instrumentCardIndex,
            checkedNoteNames: new Set(),
          };
          return;
        }

        console.warn("unable to verify previous result");
      }

      advance(false, true, result.result);

      return;
    }

    // For Intermediate results, only match if it's correct
    // will advance if correct but will wait til finalized before allowing next low confidence check
    if (
      !result.isFinal &&
      waitingForFinalResult.current.i === instrumentCardIndex
    ) {
      if (result.result.every((x) => noteNames.has(x))) {

        waitingForFinalResult.current = {
          i: instrumentCardIndex,
          checkedNoteNames: new Set([
            ...Array.from(waitingForFinalResult.current.checkedNoteNames),
            ...result.result,
          ]),
        };
        advance(true, false, result.result);
      }
      return;
    }
  };

  const advance = (
    isCorrect: boolean,
    isVerified: boolean,
    spokenNoteNames: NOTE_NAME[]
  ) => {
    if (!isCorrect) {
      addMissedAnswer({
        ...currentInstumentCard,
        givenAnswer: Array.from(
          new Set([
            ...Array.from(waitingForFinalResult.current.checkedNoteNames),
            ...spokenNoteNames,
          ])
        ),
      });
      if (isVerified) {
        waitingForFinalResult.current = {
          i: instrumentCardIndex + 1,
          checkedNoteNames: new Set(),
        };
      }
      advanceInstrumentCard();
    }

    // verifies every note card for this index was checked successfully
    if (
      noteNames.size === waitingForFinalResult.current.checkedNoteNames.size &&
      Array.from(noteNames).every((x) =>
        waitingForFinalResult.current.checkedNoteNames.has(x)
      )
    ) {
      addCorrectAnswer(currentInstumentCard);
      advanceInstrumentCard();

      if (isVerified) {
        waitingForFinalResult.current = {
          i: instrumentCardIndex + 1,
          checkedNoteNames: new Set(),
        };
      }
    }
  };

  const advanceInstrumentCard = () => {
    if (instrumentCardIndex + 1 === cardCount) {
      pauseTimer();
      setPhase(PHASE.RESULTS);
    } else {
      setCurrentCardIndex(instrumentCardIndex + 1);
    }
  };

  useEffect(() => {
    if (!isPrimed && isCatchPhaseSpoken) {
      setIsPrimed(true);
      resetResults();
      nextResultToHandle.current = 0;
      return;
    }
    if (results.length - 1 < nextResultToHandle.current) return;
    for (let i = nextResultToHandle.current; i < results.length; i++) {
      updater(results[i]);
    }
    nextResultToHandle.current = results.length;
  }, [results, isPrimed, isCatchPhaseSpoken]);

  useEffect(() => {
    if (isPrimed) {
      resetTimer(undefined, true);
    }
  }, [isPrimed]);

  useEffect(() => {
    // on mount, clear these values
    addCorrectAnswer(null);
    addMissedAnswer(null);
    setIsPrimed(false);
    resetCatchPhaseFlag();
  }, []);

  if (cardCount === 0) {
    return <div>No cards found for this instrument and level.</div>;
  }

  return (
    <>
      <h4 className="text-4xl font-bold m-2">
        {currentInstumentCard.instrument} #
        {isCatchPhaseSpoken ? currentInstumentCard.cardNumber : ""}
      </h4>
      <div className="flex flex-col items-center justify-center bg-gray-900 text-white font-sans m-4 p-4 min-h-[632px]">
        {isCatchPhaseSpoken &&
          noteCards.map((noteCard) => <Note key={noteCard.pitch} card={noteCard} />)}
        {!isCatchPhaseSpoken && (
          <p className="text-white font-sans">Say "because band" to start...</p>
        )}
      </div>
      <div className="flex flex-col md:flex-row md:w-full justify-center">
        <Time minutes={minutes} seconds={seconds} />
        <Score correct={correctAnswers.length} total={instrumentCardIndex} />
      </div>
    </>
  );
};

export default QuizScreen;
