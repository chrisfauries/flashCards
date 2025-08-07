import React from "react";
import { LEVEL } from "./data/instruments/level";
import Select from "./Select";

interface Props {
  levelCount: number;
  level: LEVEL | "";
  setLevel: React.Dispatch<React.SetStateAction<"" | LEVEL>>;
  disabled?: boolean;
}

const LevelSelector: React.FC<Props> = ({
  levelCount,
  level,
  setLevel,
  disabled = false,
}) => {
  const options = Object.values(LEVEL)
    .slice(0, levelCount)
    .map((level) => (
      <option key={level} value={level}>
        {level}
      </option>
    ));
  return (
    <Select
      defaultValue={level}
      onChange={(e) => setLevel(e.target.value as LEVEL)}
      className="w-[250px]"
      disabled={disabled}
    >
      {!level && <option value="">--- Select your level ---</option>}
      {options}
    </Select>
  );
};

export default LevelSelector;
