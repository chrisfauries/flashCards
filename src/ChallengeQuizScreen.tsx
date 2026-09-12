import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  INSTRUMENT_CARD,
  TIMED_INSTRUMENT_CARD,
  MISSED_INSTRUMENT_CARD,
} from "./data/instruments/instrument";
import { PHASE } from "./data/phase";
import arrayShuffle from "array-shuffle";
import useHighPrecisionInterval from "./useHighPrecisionInternal";
import Score from "./Score";
import CheckMark from "./CheckMark";
import { RecognizerUpdate } from "./use-recognizer";
import { NOTE_NAME } from "./data/pitch";
import {
  CHALLENGE_LEVEL,
  LEVEL_MILLISECOND_TIME_PER_CARD_MAP,
} from "./data/breakpoints";
import CountdownDisplay from "./CountdownDisplay";
import useCountdown from "./use-countdown";
import NoteCardGroup from "./NoteCardGroup";

interface Props {
  instrumentCards: INSTRUMENT_CARD[];
  setPhase: React.Dispatch<React.SetStateAction<PHASE>>;
  addCorrectAnswer: React.ActionDispatch<[newValue: TIMED_INSTRUMENT_CARD | null]>;
  addMissedAnswer: React.ActionDispatch<
    [newValue: MISSED_INSTRUMENT_CARD | null]
  >;
  results: RecognizerUpdate[];
  resetResults: () => void;
  challengeLevel: "" | CHALLENGE_LEVEL;
}

const ChallengeQuizScreen: React.FC<Props> = ({
  instrumentCards: orderedInstrumentCards,
  setPhase,
  addCorrectAnswer,
  addMissedAnswer,
  results,
  resetResults,
  challengeLevel,
}) => {
  const [isPrimed, setisPrimed] = useState(false);
  const nextResultToHandle = useRef(0);

  const [instrumentCards] = useState(arrayShuffle(orderedInstrumentCards));
  const [instrumentCardIndex, __setCurrentCardIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const lastCorrectnessState = useRef(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const lastWrongAnswersGiven = useRef<Set<NOTE_NAME> | null>(null);

  const currentInstumentCard: INSTRUMENT_CARD | undefined =
    instrumentCards[instrumentCardIndex];

  const noteCards = currentInstumentCard.noteCards;
  const timePerCard =
    LEVEL_MILLISECOND_TIME_PER_CARD_MAP[challengeLevel as CHALLENGE_LEVEL];
  const { timeLeft, start, reset } = useCountdown(timePerCard);

  const advance = useCallback(() => {
    if (!currentInstumentCard) return;
    const timeTakenMs = timePerCard - timeLeft; // Calculate time taken

    if (isCorrect) {
      addCorrectAnswer({
        ...currentInstumentCard,
        timeToAnswerMs: timeTakenMs,
      });
    } else {
      addMissedAnswer({
        ...currentInstumentCard,
        givenAnswer: lastWrongAnswersGiven.current
          ? Array.from(lastWrongAnswersGiven.current)
          : [],
      });
    }

    reset();
    setIsCorrect(false);
    lastWrongAnswersGiven.current = null;
    
    if (instrumentCardIndex >= instrumentCards.length - 1) {
      setPhase(PHASE.RESULTS);
      setisPrimed(false);
      resetResults();
    } else {
      __setCurrentCardIndex((x) => Math.min(x + 1, instrumentCards.length - 1));
      start();
    }
  }, [
    addCorrectAnswer,
    addMissedAnswer,
    currentInstumentCard,
    __setCurrentCardIndex,
    instrumentCards.length,
    setPhase,
    isCorrect,
    instrumentCardIndex,
    setisPrimed,
    resetResults,
    reset,
    start,
    timePerCard,
    timeLeft,
  ]);

  useHighPrecisionInterval(advance, timePerCard);

  const handleResult = useCallback(
    (result: RecognizerUpdate) => {
      if (result.isFinal) return;

      const spokenCards = new Set(result.result);

      if (noteCards.every((nc) => spokenCards.has(nc.noteName))) {
        setIsCorrect(true);
      } else {
        lastWrongAnswersGiven.current = spokenCards;
      }
      nextResultToHandle.current += 1;
    },
    [noteCards]
  );

  useEffect(() => {
    if (!isPrimed) {
      addCorrectAnswer(null);
      addMissedAnswer(null);
      resetResults();
      setisPrimed(true);
      start();
      nextResultToHandle.current = 0;
      return;
    }

    if (results.length - 1 < nextResultToHandle.current) return;

    for (let i = nextResultToHandle.current; i < results.length; i++) {
      handleResult(results[i]);
    }

    nextResultToHandle.current = results.length;
  }, [
    addCorrectAnswer,
    addMissedAnswer,
    isPrimed,
    results,
    handleResult,
    resetResults,
    start,
  ]);

  useEffect(() => {
    if (isCorrect) {
      if (!lastCorrectnessState.current) {
        setCorrectAnswers((x) => x + 1);
        lastCorrectnessState.current = true;
      }
    } else {
      lastCorrectnessState.current = false;
    }
  }, [isCorrect, setCorrectAnswers]);

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto px-4 py-8 md:py-12 animate-in fade-in duration-500">
      
      <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white text-center mb-8">
        {currentInstumentCard.instrument}
        <span className="text-indigo-500 ml-2">#{currentInstumentCard.cardNumber}</span>
      </h2>

      <div
        className={`
          flex flex-col items-center justify-center w-full max-w-4xl rounded-[2rem] p-4 sm:p-6 md:p-12 min-h-[300px] mb-8 relative overflow-hidden
          transition-all duration-300 ease-out border
          ${isCorrect 
            ? "bg-emerald-500 border-emerald-400 shadow-[0_0_40px_rgba(16,185,129,0.4)] dark:bg-emerald-600 dark:border-emerald-500" 
            : "bg-white dark:bg-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border-slate-100 dark:border-slate-800"
          }
        `}
      >
        <div className="w-full z-10 min-w-0">
          <NoteCardGroup noteCards={noteCards} />
        </div>
        
        {isCorrect && <CheckMark />}
      </div>

      <div className="flex flex-wrap w-full justify-center gap-4">
        <CountdownDisplay milliseconds={timeLeft} />
        <Score correct={correctAnswers} total={instrumentCardIndex + 1} />
      </div>

    </div>
  );
};

export default ChallengeQuizScreen;