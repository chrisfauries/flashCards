import React from "react";
import Select from "./Select";
import { MODE } from "./data/instruments/mode";
import { CHALLENGE_LEVEL } from "./data/breakpoints";

const options = Object.values(MODE).map((mode) => (
  <option key={mode} value={mode}>
    {mode}
  </option>
));

interface Props {
  mode: MODE;
  setMode: React.Dispatch<React.SetStateAction<MODE>>;
  setChallengeLevel: React.Dispatch<React.SetStateAction<CHALLENGE_LEVEL | "">>;
  disabled?: boolean;
}

const ModeSelector: React.FC<Props> = ({
  mode,
  setMode,
  disabled = false,
  setChallengeLevel,
}) => {
  return (
    <Select
      defaultValue={mode}
      onChange={(e) => {
        const newMode = e.target.value as MODE;
        setMode(newMode);
        if (newMode !== MODE.CHALLENGE_MODE) {
          setChallengeLevel("");
        }
      }}
      className="w-[250px]"
      disabled={disabled}
    >
      {options}
    </Select>
  );
};

export default ModeSelector;
