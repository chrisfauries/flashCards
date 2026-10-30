import React from "react";
import {
  INSTRUMENT_CARD,
  TIMED_INSTRUMENT_CARD,
  MISSED_INSTRUMENT_CARD,
} from "./data/instruments/instrument";
import { PHASE } from "./data/phase";
import { NavigationEvent, RecognizerUpdate } from "./use-recognizer";
import { MODE } from "./data/instruments/mode";
import { CARD_DISPLAY } from "./data/display";
import TimeTrialQuizScreen from "./TimeTrialQuizScreen";
import ManualQuizScreen from "./ManualQuizScreen";
import ChallengeQuizScreen from "./ChallengeQuizScreen";
import TapQuizScreen from "./TapQuizScreen";
import { CHALLENGE_LEVEL } from "./data/breakpoints";

interface Props {
  mode: MODE;
  display: CARD_DISPLAY;
  instrumentCards: INSTRUMENT_CARD[];
  setPhase: React.Dispatch<React.SetStateAction<PHASE>>;
  pauseTimer: () => void;
  resetTimer: (offset?: Date, newAutoStart?: boolean) => void;
  minutes: number;
  seconds: number;
  correctAnswers: TIMED_INSTRUMENT_CARD[];
  addCorrectAnswer: React.ActionDispatch<[newValue: TIMED_INSTRUMENT_CARD | null]>;
  addMissedAnswer: React.ActionDispatch<
    [newValue: MISSED_INSTRUMENT_CARD | null]
  >;
  isCatchPhaseSpoken: boolean;
  resetCatchPhaseFlag: () => void;
  results: RecognizerUpdate[];
  resetResults: () => void;
  navigationEvent: NavigationEvent | null;
  challengeLevel: "" | CHALLENGE_LEVEL;
}

const QuizScreen: React.FC<Props> = ({
  mode,
  display,
  instrumentCards,
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
  navigationEvent,
  challengeLevel,
}) => {
  switch (mode) {
    case MODE.TIME_TRIAL_MODE:
      return (
        <TimeTrialQuizScreen
          instrumentCards={instrumentCards}
          display={display}
          setPhase={setPhase}
          pauseTimer={pauseTimer}
          resetTimer={resetTimer}
          minutes={minutes}
          seconds={seconds}
          correctAnswers={correctAnswers}
          addCorrectAnswer={addCorrectAnswer}
          addMissedAnswer={addMissedAnswer}
          isCatchPhaseSpoken={isCatchPhaseSpoken}
          resetCatchPhaseFlag={resetCatchPhaseFlag}
          results={results}
          resetResults={resetResults}
        />
      );
    case MODE.CHALLENGE_MODE:
      return (
        <ChallengeQuizScreen
          instrumentCards={instrumentCards}
          display={display}
          setPhase={setPhase}
          results={results}
          resetResults={resetResults}
          addCorrectAnswer={addCorrectAnswer}
          addMissedAnswer={addMissedAnswer}
          challengeLevel={challengeLevel}
        />
      );
    case MODE.MANUAL_MODE:
      return (
        <ManualQuizScreen
          instrumentCards={instrumentCards}
          display={display}
          setPhase={setPhase}
          navigationEvent={navigationEvent}
          results={results}
          resetResults={resetResults}
        />
      );
    case MODE.NOTE_TAP_MODE:
    case MODE.STAFF_TAP_MODE:
      return (
        <TapQuizScreen
          mode={mode}
          instrumentCards={instrumentCards}
          setPhase={setPhase}
          pauseTimer={pauseTimer}
          resetTimer={resetTimer}
          minutes={minutes}
          seconds={seconds}
          correctAnswers={correctAnswers}
          addCorrectAnswer={addCorrectAnswer}
          addMissedAnswer={addMissedAnswer}
        />
      );
  }
};

export default QuizScreen;