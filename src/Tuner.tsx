import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PitchDetector } from 'pitchy';
import { Mic, MicOff, Activity } from 'lucide-react';

// ==========================================
// 1. Math & Music Utilities
// ==========================================

const A4 = 440;
const SEMITONES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

/**
 * Converts a frequency (Hz) to the nearest musical note and deviation in cents.
 */
export const getNoteFromFrequency = (frequency: number) => {
  const noteNum = 12 * (Math.log(frequency / A4) / Math.log(2)) + 69;
  const midi = Math.round(noteNum);
  const noteName = SEMITONES[midi % 12];
  const octave = Math.floor(midi / 12) - 1;
  
  // Calculate deviation in cents (100 cents = 1 semitone)
  const deviation = noteNum - midi;
  const cents = Math.floor(deviation * 100);

  return { noteName, octave, cents, frequency: Math.round(frequency) };
};

// ==========================================
// 2. Custom Hook: useTuner
// ==========================================

interface NoteData {
  noteName: string;
  octave: number;
  cents: number;
  frequency: number;
}

export const useTuner = () => {
  const [isListening, setIsListening] = useState(false);
  const [noteData, setNoteData] = useState<NoteData | null>(null);
  const [clarity, setClarity] = useState(0);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const pitchDetectorRef = useRef<PitchDetector<Float32Array> | null>(null);

  // Thresholds
  const CLARITY_THRESHOLD = 0.8; // Ignore noise below this clarity (0-1)
  const MIN_VOLUME_DB = -50;     // Ignore very quiet sounds

  const start = useCallback(async () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContext();
      audioContextRef.current = ctx;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048; // Higher = more precise but slower
      
      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);

      analyserRef.current = analyser;
      sourceRef.current = source;
      pitchDetectorRef.current = PitchDetector.forFloat32Array(analyser.fftSize);

      const buffer = new Float32Array(analyser.fftSize);

      const loop = () => {
        if (!analyserRef.current || !pitchDetectorRef.current || !ctx) return;

        // 1. Get audio data
        analyserRef.current.getFloatTimeDomainData(buffer);

        // 2. Detect Pitch
        const [pitch, pitchClarity] = pitchDetectorRef.current.findPitch(buffer, ctx.sampleRate);
        setClarity(pitchClarity);

        // 3. Process if signal is clear enough
        if (pitchClarity > CLARITY_THRESHOLD && pitch > 50 && pitch < 2000) {
           const data = getNoteFromFrequency(pitch);
           setNoteData(data);
        }

        rafIdRef.current = requestAnimationFrame(loop);
      };

      loop();
      setIsListening(true);
    } catch (err) {
      console.error("Error starting tuner:", err);
      setIsListening(false);
    }
  }, []);

  const stop = useCallback(() => {
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    if (sourceRef.current) {
        sourceRef.current.mediaStream.getTracks().forEach(track => track.stop());
        sourceRef.current.disconnect();
    }
    if (audioContextRef.current) audioContextRef.current.close();

    setIsListening(false);
    setNoteData(null);
    setClarity(0);
  }, []);

  useEffect(() => {
    return () => stop();
  }, [stop]);

  return { start, stop, isListening, noteData, clarity };
};

// ==========================================
// 3. React Component: Tuner
// ==========================================

const Tuner = () => {
  const { start, stop, isListening, noteData, clarity } = useTuner();

  // Color logic for "In Tune" vs "Out of Tune"
  const getStatusColor = (cents: number) => {
    const absCents = Math.abs(cents);
    if (absCents <= 5) return 'text-green-500';
    if (absCents <= 15) return 'text-yellow-400';
    return 'text-red-500';
  };

  const getNeedleColor = (cents: number) => {
    const absCents = Math.abs(cents);
    if (absCents <= 5) return 'bg-green-500';
    if (absCents <= 15) return 'bg-yellow-400';
    return 'bg-red-500';
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6 bg-slate-900 rounded-3xl shadow-2xl max-w-md mx-auto border border-slate-800">
      
      {/* Header / Controls */}
      <div className="mb-8 w-full flex justify-between items-center">
        <h2 className="text-slate-400 text-sm font-bold tracking-widest uppercase flex items-center gap-2">
          <Activity size={16} /> Chromatic Tuner
        </h2>
        <button
          onClick={isListening ? stop : start}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all ${
            isListening 
              ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' 
              : 'bg-emerald-500 text-slate-900 hover:bg-emerald-400'
          }`}
        >
          {isListening ? <><MicOff size={16} /> Stop</> : <><Mic size={16} /> Start</>}
        </button>
      </div>

      {/* Main Display */}
      <div className="relative w-full aspect-video flex flex-col items-center justify-center">
        
        {!isListening ? (
          <div className="text-slate-600 text-center animate-pulse">
            <p>Click Start to tune</p>
          </div>
        ) : !noteData ? (
           <div className="text-slate-500 flex flex-col items-center gap-2">
             <div className="w-8 h-8 border-4 border-slate-700 border-t-emerald-500 rounded-full animate-spin" />
             <span className="text-xs uppercase tracking-wider">Listening...</span>
           </div>
        ) : (
          <>
            {/* Note Name */}
            <div className={`text-9xl font-black tabular-nums tracking-tighter transition-colors duration-200 ${getStatusColor(noteData.cents)}`}>
              {noteData.noteName}
              <span className="text-3xl font-medium text-slate-500 ml-1 align-top absolute mt-4">
                {noteData.octave}
              </span>
            </div>

            {/* Hertz & Clarity */}
            <div className="mt-2 flex gap-4 text-xs font-mono text-slate-500">
              <span>{noteData.frequency} Hz</span>
              <span>Clarity: {Math.round(clarity * 100)}%</span>
            </div>
          </>
        )}
      </div>

      {/* Needle Gauge */}
      <div className="relative w-full h-16 mt-8 overflow-hidden">
        {/* Center Marker */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-4 bg-slate-700 rounded-full z-10" />
        
        {/* Ticks */}
        <div className="absolute top-0 left-1/4 w-px h-2 bg-slate-800" />
        <div className="absolute top-0 right-1/4 w-px h-2 bg-slate-800" />

        {/* The Needle */}
        {noteData && (
          <div 
            className={`absolute top-0 left-1/2 w-1 h-12 origin-top rounded-full transition-transform duration-300 ease-out ${getNeedleColor(noteData.cents)}`}
            style={{ 
              transform: `translateX(-50%) rotate(${noteData.cents * 1.5}deg)` // Multiply by 1.5 to make the needle move more visible
            }}
          >
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full shadow-lg" />
          </div>
        )}

        {/* Gauge Labels */}
        <div className="absolute bottom-0 w-full flex justify-between px-8 text-[10px] text-slate-600 font-mono">
          <span>Flat (b)</span>
          <span>Sharp (#)</span>
        </div>
      </div>
      
      {/* Cents Text Display */}
      <div className="h-6 mt-2">
        {noteData && (
            <span className={`text-sm font-bold ${getStatusColor(noteData.cents)}`}>
            {noteData.cents > 0 ? '+' : ''}{noteData.cents} cents
            </span>
        )}
      </div>

    </div>
  );
}

export default Tuner;