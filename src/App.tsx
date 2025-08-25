import React, { useEffect, useReducer, useState } from "react";
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
import useIsMobile from "./use-is-mobile";

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

function App() {
  const isMobile = useIsMobile();
  const [queryParams, setQueryParams] = useSearchParams();
  const queryParamValues = Object.fromEntries(
    Array.from(queryParams.entries())
  );

  const [instrument, setInstrument] = useState<INSTRUMENT | "">(
    getInitInstrument(queryParamValues.instrument ?? "")
  );
  const [level, setLevel] = useState<LEVEL | "">(
    getInitLevel(queryParamValues.level ?? "")
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

  let phaseComponent;

  useEffect(() => {
    setQueryParams({
      instrument: instrument,
      level: level,
    });
  }, [instrument, level]);

  if (isMobile) {
    return (
      <div className="App">
        This app is currently not supported on Mobile devices. Please use your
        chromebook or another desktop/laptop device.
      </div>
    );
  }

  switch (phase) {
    case PHASE.SETUP:
      phaseComponent = (
        <SetupScreen
          setPhase={setPhase}
          instrument={instrument}
          setInstrument={setInstrument}
          level={level}
          setLevel={setLevel}
        />
      );
      break;
    case PHASE.QUIZZING:
      phaseComponent = (
        <QuizScreen
          instrumentCards={Object.values(
            getCardsForQuiz(instrument as INSTRUMENT, level as LEVEL) ?? {}
          )}
          setPhase={setPhase}
          pauseTimer={pause}
          resetTimer={reset}
          minutes={minutes}
          seconds={seconds}
          correctAnswers={correctAnswers}
          addCorrectAnswer={addCorrectAnswer}
          addMissedAnswer={addMissedAnswer}
        />
      );
      break;
    case PHASE.RESULTS:
      phaseComponent = (
        <ResultsScreen
          instrument={instrument as INSTRUMENT}
          level={level as LEVEL}
          seconds={seconds}
          minutes={minutes}
          correctAnswers={correctAnswers}
          missedAnswers={missedAnswers}
          setPhase={setPhase}
        />
      );
      break;
    default:
  }

  return <div className="App">{phaseComponent}</div>;
}

export default App;
