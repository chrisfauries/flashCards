import React from "react";
import {
  INSTRUMENT_CARD,
  MISSED_INSTRUMENT_CARD,
} from "./data/instruments/instrument";
import { PHASE } from "./data/phase";
import { NavigationEvent, RecognizerUpdate } from "./use-recognizer";
import { MODE } from "./data/instruments/mode";
import TimeTrialQuizScreen from "./TimeTrialQuizScreen";
import ManualQuizScreen from "./ManualQuizScreen";
import ChallengeQuizScreen from "./ChallengeQuizScreen";
import { CHALLENGE_LEVEL } from "./data/breakpoints";

interface Props {
  mode: MODE;
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
  navigationEvent: NavigationEvent | null;
  challengeLevel: "" | CHALLENGE_LEVEL;
}

const QuizScreen: React.FC<Props> = ({
  mode,
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
          setPhase={setPhase}
          navigationEvent={navigationEvent}
        />
      );
  }
};

export default QuizScreen;
