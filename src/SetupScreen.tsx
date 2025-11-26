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
import { VoskModelStatus } from "./use-vosk-model";
import { AudioStatus } from "./use-recognizer";
import LoadingStatus from "./LoadingStatus";
import { MODE } from "./data/instruments/mode";
import ModeSelector from "./ModeSelector";
import { CHALLENGE_LEVEL } from "./data/breakpoints";
import ChallengeLevelSelector from "./ChallengeLevelSelector";

interface Props {
  instrument: INSTRUMENT | "";
  setInstrument: React.Dispatch<React.SetStateAction<"" | INSTRUMENT>>;
  level: LEVEL | "";
  setLevel: React.Dispatch<React.SetStateAction<"" | LEVEL>>;
  modelStatus: VoskModelStatus;
  audioStatus: AudioStatus;
  loadingProgress: number;
  loadingError: string | null;
  setPhase: React.Dispatch<React.SetStateAction<PHASE>>;
  mode: MODE;
  setMode: React.Dispatch<React.SetStateAction<MODE>>;
  challengeLevel: CHALLENGE_LEVEL | "";
  setChallengeLevel: React.Dispatch<React.SetStateAction<CHALLENGE_LEVEL | "">>;
}

const SetupScreen: React.FC<Props> = ({
  instrument,
  setInstrument,
  level,
  setLevel,
  loadingProgress,
  loadingError,
  modelStatus,
  audioStatus,
  setPhase,
  mode,
  setMode,
  challengeLevel,
  setChallengeLevel
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
            instrument ? getLevelCount(instrument) : Object.keys(LEVEL).length
          }
          level={level}
          setLevel={setLevel}
          disabled={!instrument}
        />
        <ModeSelector
          mode={mode}
          setMode={setMode}
          setChallengeLevel={setChallengeLevel}
          disabled={!instrument || !level}
        />
        {mode === MODE.CHALLENGE_MODE && (
          <ChallengeLevelSelector
            challengeLevel={challengeLevel}
            setChallengeLevel={setChallengeLevel}
            disabled={!instrument || !level}
          />
        )}
        <Button
          onClick={() => setPhase(PHASE.QUIZZING)}
          disabled={
            !instrument ||
            !level ||
            (mode === MODE.CHALLENGE_MODE && !challengeLevel) ||
            modelStatus !== VoskModelStatus.READY ||
            audioStatus !== AudioStatus.CONNECTED
          }
        >
          Start
        </Button>
      </div>
      <LoadingStatus
        progress={loadingProgress}
        modelStatus={modelStatus}
        audioStatus={audioStatus}
        error={loadingError}
      />
    </>
  );
};

export default SetupScreen;
