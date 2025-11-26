import React from "react";
import Select from "./Select";
import { ACHIEVEMENT_LEVEL, CHALLENGE_LEVEL } from "./data/breakpoints";

interface Props {
  challengeLevel: CHALLENGE_LEVEL | "";
  setChallengeLevel: React.Dispatch<React.SetStateAction<"" | CHALLENGE_LEVEL>>;
  disabled?: boolean;
}

const LevelSelector: React.FC<Props> = ({
  challengeLevel,
  setChallengeLevel,
  disabled = false,
}) => {
  const options = Object.values(ACHIEVEMENT_LEVEL)
    .filter((x) => x !== ACHIEVEMENT_LEVEL.KEEPING_PRACTICING && x !== ACHIEVEMENT_LEVEL.LIGHTNING)
    .map((level) => (
      <option key={level} value={level}>
        {level}
      </option>
    ));
  return (
    <Select
      defaultValue={challengeLevel}
      onChange={(e) => setChallengeLevel(e.target.value as CHALLENGE_LEVEL)}
      className="w-[250px]"
      disabled={disabled}
    >
      {!challengeLevel && (
        <option value="">--- Select your challenge level ---</option>
      )}
      {options}
    </Select>
  );
};

export default LevelSelector;
