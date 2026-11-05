import React, { useEffect, useRef, useState } from "react";
import { PITCH } from "./data/pitch";
import {
  INSTRUMENT_CARD,
  TIMED_INSTRUMENT_CARD,
  MISSED_INSTRUMENT_CARD,
} from "./data/instruments/instrument";
import { PHASE } from "./data/phase";
import { MODE } from "./data/instruments/mode";
import arrayShuffle from "array-shuffle";
import Time from "./Time";
import Score from "./Score";
import Note from "./Note";
import MarimbaKeyboard, {
  MARIMBA_MARKER,
  MARKER_STYLE,
} from "./MarimbaKeyboard";
import { getNoteNamesForPitch, getPitchLabel } from "./data/marimba";

const CORRECT_FEEDBACK_MS = 250;
const INCORRECT_FEEDBACK_MS = 900;

interface Props {
  mode: MODE;
  instrumentCards: INSTRUMENT_CARD[];
  setPhase: React.Dispatch<React.SetStateAction<PHASE>>;
  pauseTimer: () => void;
  resetTimer: (offset?: Date, newAutoStart?: boolean) => void;
  minutes: number;
  seconds: number;
  correctAnswers: TIMED_INSTRUMENT_CARD[];
  addCorrectAnswer: React.ActionDispatch<[newValue: TIMED_INSTRUMENT_CARD | null]>;
  addMissedAnswer: React.ActionDispatch<
    [newValue: MISSED_INSTRUMENT_CARD | null]
  >;
}

const TapQuizScreen: React.FC<Props> = ({
  mode,
  instrumentCards: orderedInstrumentCards,
  setPhase,
  pauseTimer,
  resetTimer,
  minutes,
  seconds,
  correctAnswers,
  addCorrectAnswer,
  addMissedAnswer,
}) => {
  const cardCount = orderedInstrumentCards.length;

  // Track how long each card is visible
  const cardStartTime = useRef<number>(Date.now());
  const feedbackTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isStarted, setIsStarted] = useState(false);
  const [instrumentCards] = useState(arrayShuffle(orderedInstrumentCards));
  const [instrumentCardIndex, setCurrentCardIndex] = useState(0);
  const [feedbackMarkers, setFeedbackMarkers] = useState<MARIMBA_MARKER[]>([]);
  const [isLocked, setIsLocked] = useState(false);

  const currentInstumentCard: INSTRUMENT_CARD | undefined =
    instrumentCards[instrumentCardIndex];
  const noteCards = currentInstumentCard?.noteCards;

  const isNoteTapMode = mode === MODE.NOTE_TAP_MODE;

  const start = () => {
    setIsStarted(true);
    resetTimer(undefined, true);
    cardStartTime.current = Date.now(); // Start tracking time the moment the quiz actually begins
  };

  const advanceInstrumentCard = () => {
    cardStartTime.current = Date.now(); // Reset timer for the next card
    if (instrumentCardIndex + 1 === cardCount) {
      pauseTimer();
      setPhase(PHASE.RESULTS);
    } else {
      setCurrentCardIndex(instrumentCardIndex + 1);
    }
  };

  const showFeedback = (markers: MARIMBA_MARKER[], durationMs: number) => {
    if (feedbackTimeout.current) clearTimeout(feedbackTimeout.current);
    setFeedbackMarkers(markers);
    feedbackTimeout.current = setTimeout(() => setFeedbackMarkers([]), durationMs);
  };

  const handleBarTap = (tappedPitch: PITCH) => {
    if (!currentInstumentCard || isLocked) return;

    const timeTakenMs = Date.now() - cardStartTime.current;
    const correctPitch = noteCards[0].pitch;

    // Octave matters, only the exact bar counts
    const isCorrect = tappedPitch === correctPitch;

    if (isCorrect) {
      addCorrectAnswer({
        ...currentInstumentCard,
        timeToAnswerMs: timeTakenMs,
      });
      showFeedback(
        [{ pitch: tappedPitch, style: MARKER_STYLE.CORRECT }],
        CORRECT_FEEDBACK_MS
      );
      advanceInstrumentCard();
      return;
    }

    addMissedAnswer({
      ...currentInstumentCard,
      givenAnswer: getNoteNamesForPitch(tappedPitch),
      givenPitch: tappedPitch,
    });

    // Hold on the card long enough to show where the right bar was
    if (feedbackTimeout.current) clearTimeout(feedbackTimeout.current);
    setIsLocked(true);
    setFeedbackMarkers([
      { pitch: tappedPitch, style: MARKER_STYLE.INCORRECT },
      { pitch: correctPitch, style: MARKER_STYLE.CORRECT },
    ]);
    feedbackTimeout.current = setTimeout(() => {
      setFeedbackMarkers([]);
      setIsLocked(false);
      advanceInstrumentCard();
    }, INCORRECT_FEEDBACK_MS);
  };

  useEffect(() => {
    addCorrectAnswer(null);
    addMissedAnswer(null);
    resetTimer(undefined, false);
    return () => {
      if (feedbackTimeout.current) clearTimeout(feedbackTimeout.current);
    };
  }, []);

  if (cardCount === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen text-slate-500">
        No cards found for this instrument and level.
      </div>
    );
  }

  const time = <Time minutes={minutes} seconds={seconds} />;
  const score = <Score correct={correctAnswers.length} total={instrumentCardIndex} />;

  // Sized to exactly one screen so the prompt and marimba are visible together without scrolling
  return (
    <div className="flex flex-col w-full h-[100dvh] px-2 sm:px-4 py-2 sm:py-3 gap-2 sm:gap-3 overflow-hidden animate-in fade-in duration-500">

      <div className="flex items-stretch justify-center gap-3 md:gap-4 shrink-0 h-[30dvh] min-h-[120px]">
        {/* On wider screens the time and score flank the prompt to save vertical space */}
        <div className="hidden md:flex items-center">{time}</div>

        <div className="flex flex-1 max-w-3xl items-center justify-center bg-white dark:bg-slate-900 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-slate-800 p-3 relative overflow-hidden transition-colors duration-500 min-w-0">
          {isStarted && (
            <div className="absolute top-3 left-3 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest z-10">
              #{currentInstumentCard.cardNumber}
            </div>
          )}

          {isStarted ? (
            isNoteTapMode ? (
              <span className="text-5xl md:text-7xl font-black text-indigo-600 dark:text-indigo-400 drop-shadow-sm">
                {getPitchLabel(noteCards[0].pitch)}
              </span>
            ) : (
              // Staves are sized by the row height, not the width, so they never push the marimba down
              <div className="flex h-full items-center justify-center gap-3 min-w-0">
                {noteCards.map((noteCard, idx) => (
                  <div
                    key={idx}
                    className="flex items-center h-full aspect-[44/30] min-w-0 rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 bg-white"
                  >
                    <Note card={noteCard} />
                  </div>
                ))}
              </div>
            )
          ) : (
            <button
              onClick={start}
              className="flex items-center justify-center px-8 py-4 rounded-full text-sm md:text-base font-bold transition-all duration-300 ease-out active:scale-95 outline-none bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 hover:scale-105 focus-visible:ring-4 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
            >
              Tap to start
            </button>
          )}
        </div>
        <div className="hidden md:flex items-center">{score}</div>
      </div>

      <div className="flex md:hidden justify-center gap-2 shrink-0">
        {time}
        {score}
      </div>

      <div
        className={`flex-1 min-h-0 w-full transition-opacity duration-300 ${
          isStarted ? "opacity-100" : "opacity-40"
        }`}
      >
        <MarimbaKeyboard
          markers={feedbackMarkers}
          onBarTap={handleBarTap}
          disabled={!isStarted || isLocked}
          fillContainer
        />
      </div>

    </div>
  );
};

export default TapQuizScreen;
