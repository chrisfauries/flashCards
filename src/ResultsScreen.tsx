import React from "react";
import {
  INSTRUMENT,
  INSTRUMENT_CARD,
  MISSED_INSTRUMENT_CARD,
} from "./data/instruments/instrument";
import MissedCard from "./MissedCard";
import {
  ACHIEVEMENT_LEVEL,
  ACHIEVEMENT_LEVEL_MULTIPLIER_MAP,
} from "./data/breakpoints";
import { PHASE } from "./data/phase";
import Button from "./Button";
import Time from "./Time";
import Score from "./Score";
import { LEVEL } from "./data/instruments/level";

const getAchievementLevel = (
  totalSeconds: number,
  totalCards: number
): ACHIEVEMENT_LEVEL => {
  let highestBreakpoint = ACHIEVEMENT_LEVEL.KEEPING_PRACTICING;
  for (const [achievementLevel, multiplier] of Object.entries(
    ACHIEVEMENT_LEVEL_MULTIPLIER_MAP
  )) {
    if (multiplier * totalCards >= totalSeconds) {
      highestBreakpoint = achievementLevel as ACHIEVEMENT_LEVEL;
    }
  }
  return highestBreakpoint;
};

const getAchievementColor = (achievementLevel: ACHIEVEMENT_LEVEL) => {
  switch (achievementLevel) {
    case ACHIEVEMENT_LEVEL.KEEPING_PRACTICING:
      return "text-stone-50";
    case ACHIEVEMENT_LEVEL.BRONZE:
      return "text-orange-900";
    case ACHIEVEMENT_LEVEL.SILVER:
      return "text-slate-400";
    case ACHIEVEMENT_LEVEL.GOLD:
      return "text-yellow-400";
    case ACHIEVEMENT_LEVEL.LIGHTNING:
      return "text-blue-600";
  }
};

interface Props {
  instrument: INSTRUMENT;
  level: LEVEL;
  correctAnswers: INSTRUMENT_CARD[];
  missedAnswers: MISSED_INSTRUMENT_CARD[];
  minutes: number;
  seconds: number;
  setPhase: React.Dispatch<React.SetStateAction<PHASE>>;
}

const ResultsScreen: React.FC<Props> = ({
  instrument,
  level,
  correctAnswers,
  missedAnswers,
  minutes,
  seconds,
  setPhase,
}) => {
  const achievementLevel = getAchievementLevel(
    seconds + minutes * 60,
    correctAnswers.length
  );

  return (
    <>
      <h1 className="text-6xl font-bold text-center mb-8">Results!</h1>
      <div className="flex flex-row w-full justify-center">
        <Time minutes={minutes} seconds={seconds} />
        <Score
          correct={correctAnswers.length}
          total={correctAnswers.length + missedAnswers.length}
        />
      </div>

      {missedAnswers.length ? (
        <div>
          <p className="mt-8">Here are the Cards you missed:</p>
          <div className="flex flex-row justify-center flex-wrap w-full mb-8">
            {missedAnswers.map((missedCard) => (
              <MissedCard key={missedCard.cardNumber} missedCard={missedCard} />
            ))}
          </div>
          <p>Keep practicing to improve your accuracy!</p>
        </div>
      ) : (
        <div>
          For {instrument} Level {level}, you are a{" "}
          {
            <span className={getAchievementColor(achievementLevel)}>
              {achievementLevel}
            </span>
          }{" "}
          level note reader!
        </div>
      )}
      <div className="flex flex-row w-full justify-center">
        <Button onClick={() => setPhase(PHASE.QUIZZING)}>Retry</Button>
        <Button onClick={() => setPhase(PHASE.SETUP)}>Reset</Button>
      </div>
    </>
  );
};

export default ResultsScreen;
