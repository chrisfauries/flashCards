import React from "react";
import { INSTRUMENT } from "./data/instruments/instrument";
import Select from "./Select";

const options = Object.values(INSTRUMENT).map((instrument) => (
  <option key={instrument} value={instrument}>
    {instrument}
  </option>
));

interface Props {
  instrument: INSTRUMENT | "";
  setInstrument: React.Dispatch<React.SetStateAction<"" | INSTRUMENT>>;
}

const InstrumentSelector: React.FC<Props> = ({ instrument, setInstrument }) => {
  return (
    <Select onChange={(e) => setInstrument(e.target.value as INSTRUMENT)} className="w-[250px]">
      {!instrument && <option value="">--- Select your instrument ---</option>}
      {options}
    </Select>
  );
};

export default InstrumentSelector;
