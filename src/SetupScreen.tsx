import React from "react";
import logo from "./static/walshBandLogo.png";
import "./App.css";
import InstrumentSelector from "./InstrumentSelector";
import { INSTRUMENT } from "./data/instruments/instrument";
import { LEVEL } from "./data/instruments/level";
import LevelSelector from "./LevelSelector";
import { PHASE } from "./data/phase";
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
  const isVoiceReady = 
    modelStatus === VoskModelStatus.READY && 
    audioStatus === AudioStatus.CONNECTED;

  const areOptionsSelected = 
    !!instrument && 
    !!level && 
    (mode !== MODE.CHALLENGE_MODE || !!challengeLevel);

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-5xl mx-auto px-4 py-8 md:py-12 min-h-screen">
      
      <style>{`
        @keyframes drawLine {
          0% { stroke-dashoffset: 1000; opacity: 0; }
          10% { opacity: 1; }
          100% { stroke-dashoffset: 0; opacity: 1; }
        }
        .draw-path {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: drawLine 3.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        @keyframes floatBlob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: floatBlob 10s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>

      {/* Ambient Color Orbs Background */}
      <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none flex items-center justify-center">
        <div className="absolute top-10 left-10 md:left-1/4 w-[300px] h-[300px] bg-[#006341]/10 dark:bg-[#006341]/20 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-[80px] animate-blob" />
        <div className="absolute top-10 right-10 md:right-1/4 w-[300px] h-[300px] bg-[#FFB81C]/10 dark:bg-[#FFB81C]/10 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-[80px] animate-blob animation-delay-2000" />
      </div>

      <header className="flex flex-col items-center text-center mb-8 w-full z-10">
        <div className="w-full max-w-lg px-6">
          <svg viewBox="0 0 380 70" className="w-full h-auto drop-shadow-xl overflow-visible">
            <defs>
              <linearGradient id="walshGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#006341" />
                <stop offset="100%" stopColor="#FFB81C" />
              </linearGradient>
              <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="1.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <g fill="none" stroke="url(#walshGrad)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" filter="url(#neonGlow)" transform="skewX(-12) translate(15, 0)">
              <path className="draw-path" d="M15,55 C15,30 15,10 15,10 C25,10 35,10 35,10 M10,30 C20,30 25,30 30,30" style={{ animationDelay: '0s' }} />
              <path className="draw-path" d="M45,10 C45,30 45,45 45,55 C45,60 55,55 55,55" style={{ animationDelay: '0.2s' }} />
              <path className="draw-path" d="M80,55 C80,30 60,20 60,35 C60,55 80,55 80,35 C80,55 80,55 90,55" style={{ animationDelay: '0.4s' }} />
              <path className="draw-path" d="M115,25 C100,20 95,30 105,35 C115,40 115,55 95,55" style={{ animationDelay: '0.6s' }} />
              <path className="draw-path" d="M130,10 C130,30 130,55 130,55 M130,35 C130,25 150,25 150,35 C150,45 150,55 150,55" style={{ animationDelay: '0.8s' }} />
              <path className="draw-path" d="M210,20 C190,10 180,30 180,40 C180,55 205,55 210,45" style={{ animationDelay: '1.2s' }} />
              <path className="draw-path" d="M240,55 C240,30 220,20 220,35 C220,55 240,55 240,35 C240,55 240,55 250,55" style={{ animationDelay: '1.4s' }} />
              <path className="draw-path" d="M260,55 C260,30 260,25 260,25 C260,15 280,20 280,30" style={{ animationDelay: '1.6s' }} />
              <path className="draw-path" d="M310,55 C310,30 290,20 290,35 C290,55 310,55 310,35 C310,10 310,10 310,10" style={{ animationDelay: '1.8s' }} />
              <path className="draw-path" d="M340,25 C325,20 320,30 330,35 C340,40 340,55 320,55" style={{ animationDelay: '2s' }} />
            </g>
          </svg>
        </div>

        <div className="mt-6 flex items-center justify-center w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-[#006341] to-emerald-900 shadow-[0_15px_40px_rgba(0,99,65,0.4)] border-2 border-white/20 dark:border-white/10 backdrop-blur-md transition-transform duration-500 hover:scale-105">
          <img src={logo} alt="Walsh Band" className="w-14 h-14 md:w-16 md:h-16 object-contain drop-shadow-md" />
        </div>
      </header>

      <InstrumentSelector
        instrument={instrument}
        setInstrument={setInstrument}
      />

      <div className="w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100/50 dark:border-slate-800/50 p-4 md:p-6 mb-4 z-10">
        <LevelSelector
          levelCount={
            instrument ? getLevelCount(instrument) : Object.keys(LEVEL).length
          }
          level={level}
          setLevel={setLevel}
          disabled={!instrument}
        />
      </div>
      
      <div className="w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100/50 dark:border-slate-800/50 p-4 md:p-6 mb-6 z-10 flex flex-col gap-4 md:gap-5">
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
      </div>

      <div className="relative flex items-center justify-center w-full max-w-lg min-h-[300px] z-10">
        <div 
          className={`absolute w-full transition-all duration-[1500ms] ease-in-out ${
            !isVoiceReady ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"
          }`}
        >
          <LoadingStatus
            progress={loadingProgress}
            modelStatus={modelStatus}
            audioStatus={audioStatus}
            error={loadingError}
          />
        </div>

        <div 
          className={`absolute transition-all duration-[1500ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
            isVoiceReady ? "opacity-100 scale-100" : "opacity-0 scale-50 pointer-events-none"
          }`}
        >
          <button
            onClick={() => setPhase(PHASE.QUIZZING)}
            disabled={!areOptionsSelected}
            title={areOptionsSelected ? "Start Session" : "Select your instrument and level to start"}
            className={`
              group relative flex items-center justify-center w-48 h-48 md:w-56 md:h-56 rounded-full border-none 
              transition-all duration-1000 ease-[cubic-bezier(0.34,1.56,0.64,1)] outline-none 
              ${areOptionsSelected 
                ? 'bg-gradient-to-br from-[#006341] to-emerald-600 text-white shadow-[0_0_60px_rgba(0,99,65,0.4)] hover:from-[#FFB81C] hover:to-amber-500 hover:shadow-[0_0_80px_rgba(255,184,28,0.5)] hover:scale-105 active:scale-95 focus-visible:ring-4 focus-visible:ring-emerald-500 focus-visible:ring-offset-4 dark:focus-visible:ring-offset-slate-900' 
                : 'bg-white/40 backdrop-blur-md border-4 border-dashed border-slate-300 text-slate-400 dark:bg-slate-800/40 dark:border-slate-700 dark:text-slate-600 cursor-not-allowed shadow-sm'
              }
            `}
          >
            {areOptionsSelected ? (
              <>
                <svg className="w-20 h-20 md:w-24 md:h-24 ml-4 absolute transition-all duration-1000 ease-in-out group-hover:scale-50 group-hover:opacity-0 group-hover:-rotate-90" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                <svg className="w-20 h-20 md:w-24 md:h-24 absolute opacity-0 scale-50 rotate-90 transition-all duration-1000 ease-in-out group-hover:scale-100 group-hover:opacity-100 group-hover:rotate-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                </svg>
              </>
            ) : (
              <svg className="w-16 h-16 md:w-20 md:h-20 transition-all duration-1000 opacity-60" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default SetupScreen;