import React from "react";
import logo from "./static/walshBandLogo.jpg";
import "./App.css";
import InstrumentSelector from "./InstrumentSelector";
import { INSTRUMENT } from "./data/instruments/instrument";
import { LEVEL } from "./data/instruments/level";
import LevelSelector from "./LevelSelector";
import { PHASE } from "./data/phase";
import Button from "./Button";
import { getLevelCount } from "./data/instruments/cardAccessor";

interface Props {
  instrument: INSTRUMENT | "";
  setInstrument: React.Dispatch<React.SetStateAction<"" | INSTRUMENT>>;
  level: LEVEL | "";
  setLevel: React.Dispatch<React.SetStateAction<"" | LEVEL>>;
  setPhase: React.Dispatch<React.SetStateAction<PHASE>>;
}

const SetupScreen: React.FC<Props> = ({
  instrument,
  setInstrument,
  level,
  setLevel,
  setPhase,
}) => {
  return (
    <>
      <header>
        <img src={logo} className="p-8" alt="logo" />
        <h1 className="text-4xl font-bold">Flash Cards Practice</h1>
      </header>
      <div className="flex flex-wrap flex-col md:flex-row w-full md:justify-center items-center">
        <InstrumentSelector
          instrument={instrument}
          setInstrument={setInstrument}
        />
        <LevelSelector
          levelCount={
            instrument
              ? getLevelCount(instrument)
              : Object.keys(LEVEL).length
          }
          level={level}
          setLevel={setLevel}
          disabled={!instrument}
        />
        <Button
          onClick={() => setPhase(PHASE.QUIZZING)}
          disabled={!instrument || !level}
        >
          Start
        </Button>
      </div>
    </>
  );
};

export default SetupScreen;
