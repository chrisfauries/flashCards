import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  INSTRUMENT_CARD,
  MISSED_INSTRUMENT_CARD,
} from "./data/instruments/instrument";
import { PHASE } from "./data/phase";
import arrayShuffle from "array-shuffle";
import Note from "./Note";
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

interface Props {
  instrumentCards: INSTRUMENT_CARD[];
  setPhase: React.Dispatch<React.SetStateAction<PHASE>>;
  addCorrectAnswer: React.ActionDispatch<[newValue: INSTRUMENT_CARD | null]>;
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
    if (isCorrect) {
      addCorrectAnswer(currentInstumentCard);
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
      // End this round
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
  ]);

  useHighPrecisionInterval(advance, timePerCard);

  const handleResult = useCallback(
    (result: RecognizerUpdate) => {
      // No time to wait for a final result
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
    <>
      <h4 className="text-4xl font-bold m-2">
        {currentInstumentCard.instrument} #{currentInstumentCard.cardNumber}
      </h4>
      <div
        className={`
          flex flex-col items-center justify-center 
          transition-colors duration-300 ease-in-out
          font-sans m-4 p-4 min-h-[632px] relative
          ${isCorrect ? "bg-green-600" : "bg-gray-900"}
          text-white
        `}
      >
        {noteCards.map((noteCard) => (
          <Note
            key={
              currentInstumentCard.frequency / 10000 +
              currentInstumentCard.cardNumber +
              noteCard.noteName * 100
            }
            card={noteCard}
          />
        ))}
        {isCorrect && <CheckMark />}
      </div>
      <div className="flex flex-col md:flex-row md:w-full justify-center">
        <CountdownDisplay milliseconds={timeLeft} />
        <Score correct={correctAnswers} total={instrumentCardIndex + 1} />
      </div>
    </>
  );
};

export default ChallengeQuizScreen;
