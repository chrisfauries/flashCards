import React, { JSX, useEffect, useReducer, useState } from "react";
import "./App.css";
import {
  INSTRUMENT,
  INSTRUMENT_CARD,
  MISSED_INSTRUMENT_CARD,
} from "./data/instruments/instrument";
import { LEVEL } from "./data/instruments/level";
import { PHASE } from "./data/phase";
import SetupScreen from "./SetupScreen";
import QuizScreen from "./QuizScreen";
import { getCardsForQuiz } from "./data/instruments/cardAccessor";
import ResultsScreen from "./ResultsScreen";
import { useStopwatch } from "react-timer-hook";
import { useSearchParams } from "react-router-dom";
import useRecognizer from "./use-recognizer";
import { MODE } from "./data/instruments/mode";
import { ACHIEVEMENT_LEVEL, CHALLENGE_LEVEL } from "./data/breakpoints";

const getInitInstrument = (instrument: string) => {
  if (!instrument) return "";

  for (const x of Object.values(INSTRUMENT)) {
    if (x.toLowerCase() === instrument.toLowerCase()) return x;
  }

  return "";
};
const getInitLevel = (level: string) => {
  if (!level) return "";

  for (const x of Object.values(LEVEL)) {
    if (x.toLowerCase() === level.toLowerCase()) return x;
  }

  return "";
};
const getInitMode = (mode: string) => {
  if (!mode) return MODE.TIME_TRIAL_MODE;

  for (const x of Object.values(MODE)) {
    if (x.toLowerCase() === mode.toLowerCase()) return x;
  }

  return MODE.TIME_TRIAL_MODE;
};
const getInitChallengeLevel = (
  challengeLevel: string
): CHALLENGE_LEVEL | "" => {
  if (!challengeLevel) return "";

  for (const x of Object.values(
    ACHIEVEMENT_LEVEL
  ) as unknown as CHALLENGE_LEVEL) {
    if (x.toLowerCase() === challengeLevel.toLowerCase())
      return x as CHALLENGE_LEVEL;
  }

  return "";
};

export enum QUIZ_CARD_ACTION {
  SET_FOR_INSTRUMENT_AND_LEVEL,
  SET_FOR_PRACTICE_MODE,
}

export type QuizCardAction =
  | {
      type: QUIZ_CARD_ACTION.SET_FOR_INSTRUMENT_AND_LEVEL;
      level: LEVEL | "";
      instrument: INSTRUMENT | "";
    }
  | {
      type: QUIZ_CARD_ACTION.SET_FOR_PRACTICE_MODE;
      missedAnswers: MISSED_INSTRUMENT_CARD[];
    };

function App() {
  const {
    modelStatus,
    audioStatus,
    progress,
    error,
    isCatchPhaseSpoken,
    resetCatchPhaseFlag,
    results,
    resetResults,
    navigationEvent,
  } = useRecognizer();
  const [queryParams, setQueryParams] = useSearchParams({
    instrument: "",
    level: "",
    mode: MODE.TIME_TRIAL_MODE,
    challengeLevel: "",
  });
  const queryParamValues = Object.fromEntries(
    Array.from(queryParams.entries())
  );

  const [instrument, setInstrument] = useState<INSTRUMENT | "">(
    getInitInstrument(queryParamValues.instrument ?? "")
  );
  const [level, setLevel] = useState<LEVEL | "">(
    getInitLevel(queryParamValues.level ?? "")
  );
  const [mode, setMode] = useState<MODE>(
    getInitMode(queryParamValues.mode ?? "")
  );
  const [challengeLevel, setChallengeLevel] = useState<CHALLENGE_LEVEL | "">(
    getInitChallengeLevel(queryParamValues.challengeLevel ?? "")
  );

  const [phase, setPhase] = useState<PHASE>(
    instrument && level && queryParamValues.autostart
      ? PHASE.QUIZZING
      : PHASE.SETUP
  );
  const { pause, reset, minutes, seconds } = useStopwatch({
    autoStart: false,
  });
  const [correctAnswers, addCorrectAnswer] = useReducer(
    (state: INSTRUMENT_CARD[], newValue: INSTRUMENT_CARD | null) =>
      newValue ? [...state, newValue] : [],
    []
  );
  const [missedAnswers, addMissedAnswer] = useReducer(
    (
      state: MISSED_INSTRUMENT_CARD[],
      newValue: MISSED_INSTRUMENT_CARD | null
    ) => (newValue ? [...state, newValue] : []),
    []
  );
  const [quizCards, setQuizCards] = useReducer(
    (state: INSTRUMENT_CARD[], action: QuizCardAction) => {
      switch (action.type) {
        case QUIZ_CARD_ACTION.SET_FOR_INSTRUMENT_AND_LEVEL: {
          if (action.instrument && action.level) {
            return getCardsForQuiz(instrument as INSTRUMENT, level as LEVEL);
          }
          return [];
        }
        case QUIZ_CARD_ACTION.SET_FOR_PRACTICE_MODE:
          return action.missedAnswers;
      }
    },
    []
  );

  let phaseComponent: JSX.Element = <></>;

  useEffect(() => {
    setQueryParams({
      instrument,
      level,
      mode,
      challengeLevel,
    });
  }, [setQueryParams, instrument, level, mode, challengeLevel]);

  useEffect(() => {
    setQuizCards({
      type: QUIZ_CARD_ACTION.SET_FOR_INSTRUMENT_AND_LEVEL,
      instrument,
      level,
    });
  }, [instrument, level]);

  switch (phase) {
    case PHASE.SETUP:
      phaseComponent = (
        <SetupScreen
          setPhase={setPhase}
          instrument={instrument}
          setInstrument={setInstrument}
          level={level}
          modelStatus={modelStatus}
          audioStatus={audioStatus}
          loadingProgress={progress}
          loadingError={error}
          setLevel={setLevel}
          mode={mode}
          setMode={setMode}
          challengeLevel={challengeLevel}
          setChallengeLevel={setChallengeLevel}
        />
      );
      break;
    case PHASE.QUIZZING:
      phaseComponent = (
        <QuizScreen
          mode={mode}
          instrumentCards={quizCards}
          setPhase={setPhase}
          pauseTimer={pause}
          resetTimer={reset}
          minutes={minutes}
          seconds={seconds}
          correctAnswers={correctAnswers}
          addCorrectAnswer={addCorrectAnswer}
          addMissedAnswer={addMissedAnswer}
          isCatchPhaseSpoken={isCatchPhaseSpoken}
          resetCatchPhaseFlag={resetCatchPhaseFlag}
          results={results}
          resetResults={resetResults}
          navigationEvent={navigationEvent}
          challengeLevel={challengeLevel}
        />
      );
      break;
    case PHASE.RESULTS:
      phaseComponent = (
        <ResultsScreen
          instrument={instrument as INSTRUMENT}
          level={level as LEVEL}
          mode={mode}
          challengeLevel={challengeLevel}
          seconds={seconds}
          minutes={minutes}
          correctAnswers={correctAnswers}
          missedAnswers={missedAnswers}
          setPhase={setPhase}
          setQuizCards={setQuizCards}
        />
      );
      break;
    default:
  }

  return <div className="App">{phaseComponent}</div>;
}

export default App;
