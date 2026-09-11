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
import { RecognizerUpdate } from "./use-recognizer";
import NoteCardGroup from "./NoteCardGroup";

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

const TimeTrialQuizScreen: React.FC<Props> = ({
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

  const noteCards = currentInstumentCard?.noteCards;
  const noteNames = new Set(noteCards?.map((noteCard) => noteCard.noteName));

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

    if (result.isFinal) {
      const notesToVerify = new Set(
        instrumentCards[waitingForFinalResult.current.i].noteCards.map(
          (noteCard) => noteCard.noteName
        )
      );

      if (waitingForFinalResult.current.i < instrumentCardIndex) {
        if (result.result.every((x) => notesToVerify.has(x))) {
          waitingForFinalResult.current = {
            i: instrumentCardIndex,
            checkedNoteNames: new Set(),
          };
          return;
        }

        if (instrumentCards.length >= waitingForFinalResult.current.i + 1) {
          const combinedNotesToVerify = new Set(notesToVerify);
          const nextNoteCards = instrumentCards[
            waitingForFinalResult.current.i + 1
          ].noteCards.map((noteCard) => noteCard.noteName);

          nextNoteCards.forEach((x) => combinedNotesToVerify.add(x));

          if (result.result.every((x) => combinedNotesToVerify.has(x))) {
            waitingForFinalResult.current = {
              i: instrumentCardIndex,
              checkedNoteNames: new Set(nextNoteCards),
            };

            advance(true, true, nextNoteCards);

            return;
          }
        }
        waitingForFinalResult.current = {
          i: instrumentCardIndex,
          checkedNoteNames: new Set(),
        };
      }

      if (waitingForFinalResult.current.i === instrumentCardIndex) {
        const notesVerified = waitingForFinalResult.current.checkedNoteNames;

        let resultContainsWrongAnswsers = false;
        result.result.forEach((result) => {
          if (notesToVerify.has(result)) {
            notesVerified.add(result);
          } else {
            resultContainsWrongAnswsers = true;
          }
        });

        if (resultContainsWrongAnswsers) {
          const allAnswers = [...result.result];

          waitingForFinalResult.current.checkedNoteNames.forEach((nn) =>
            allAnswers.push(nn)
          );
          advance(false, true, allAnswers);
          return;
        }

        if (notesVerified.size > 0) {
          if (notesVerified.size > notesToVerify.size) {
            console.warn("Verified more notes than were possible, this is a bug");
          } else if (
            notesVerified.size === notesToVerify.size &&
            Array.from(notesVerified).reduce(
              (acc, verifiedNote) => notesToVerify.has(verifiedNote) && acc,
              true
            )
          ) {
            advance(true, true, Array.from(notesVerified));
            return;
          } else {
            waitingForFinalResult.current = {
              ...waitingForFinalResult.current,
              checkedNoteNames: notesVerified,
            };
            return;
          }
        }
      }

      return;
    }

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
    addCorrectAnswer(null);
    addMissedAnswer(null);
    setIsPrimed(false);
    resetCatchPhaseFlag();
  }, []);

  if (cardCount === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen text-slate-500">
        No cards found for this instrument and level.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto px-4 py-8 md:py-12 animate-in fade-in duration-500">
      
      <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white text-center mb-8">
        {currentInstumentCard.instrument}
        {isCatchPhaseSpoken && (
          <span className="text-indigo-500 ml-2">#{currentInstumentCard.cardNumber}</span>
        )}
      </h2>

      <div className="flex flex-col items-center justify-center w-full max-w-4xl bg-white dark:bg-slate-900 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-slate-800 p-4 sm:p-6 md:p-12 min-h-[300px] mb-8 relative overflow-hidden transition-colors duration-500">
        {isCatchPhaseSpoken ? (
          <div className="w-full min-w-0">
            <NoteCardGroup noteCards={noteCards} />
          </div>
        ) : (
          <div className="flex flex-col items-center text-slate-400 dark:text-slate-500 animate-pulse">
            <svg className="w-16 h-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
            </svg>
            <p className="text-xl font-medium tracking-wide">Say "because band" to start...</p>
          </div>
        )}
      </div>

      <div className="flex flex-wrap w-full justify-center gap-4">
        <Time minutes={minutes} seconds={seconds} />
        <Score correct={correctAnswers.length} total={instrumentCardIndex} />
      </div>

    </div>
  );
};

export default TimeTrialQuizScreen;