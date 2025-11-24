import React from "react";
import Select from "./Select";
import { MODE } from "./data/instruments/mode";

const options = Object.values(MODE).map((mode) => (
  <option key={mode} value={mode}>
    {mode}
  </option>
));

interface Props {
  mode: MODE;
  setMode: React.Dispatch<React.SetStateAction<MODE>>;
  disabled?: boolean;
}

const ModeSelector: React.FC<Props> = ({ mode, setMode, disabled = false }) => {
  return (
    <Select
      defaultValue={mode}
      onChange={(e) => setMode(e.target.value as MODE)}
      className="w-[250px]"
      disabled={disabled}
    >
      {options}
    </Select>
  );
};

export default ModeSelector;
