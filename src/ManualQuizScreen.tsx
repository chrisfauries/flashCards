import React, { useCallback, useEffect, useState, useRef } from "react";
import { INSTRUMENT_CARD } from "./data/instruments/instrument";
import { PHASE } from "./data/phase";
import arrayShuffle from "array-shuffle";
import { NavigationDirection, NavigationEvent, RecognizerUpdate } from "./use-recognizer";
import Button from "./Button";
import useIsMobile from "./use-is-mobile";
import { NOTE_NAME_STRING_MAP } from "./data/pitch";
import NoteCardGroup from "./NoteCardGroup";

const flipMessage = (isMobile: boolean) => {
  return isMobile
    ? 'Tap the card or say "Flip" to see the answer'
    : 'Click the card, press "F", or say "Flip" to see the answer';
};

const forwardMessage = (isMobile: boolean) => {
  return isMobile
    ? 'Tap the right arrow or say "Next" to advance'
    : 'Click the right arrow, press Spacebar / Right Key, or say "Next" to advance';
};

const backMessage = (isMobile: boolean) => {
  return isMobile
    ? 'Tap the left arrow or say "Back" to return'
    : 'Click the left arrow, press Backspace / Left Key, or say "Back" to return';
};

interface Props {
  instrumentCards: INSTRUMENT_CARD[];
  setPhase: React.Dispatch<React.SetStateAction<PHASE>>;
  navigationEvent: NavigationEvent | null;
  results: RecognizerUpdate[];
  resetResults: () => void;
}

const ManualQuizScreen: React.FC<Props> = ({
  instrumentCards: orderedInstrumentCards,
  setPhase,
  navigationEvent,
  results,
  resetResults
}) => {
  const isMobile = useIsMobile();
  const [instrumentCards, __setInstrumentCards] = useState(
    arrayShuffle(orderedInstrumentCards)
  );
  
  const [isFlipped, setIsFlipped] = useState(false);
  const [instrumentCardIndex, __setCurrentCardIndex] = useState(0);
  
  const currentInstumentCard: INSTRUMENT_CARD | undefined =
    instrumentCards[instrumentCardIndex];
  const noteCards = currentInstumentCard.noteCards;

  const [backfaceNoteCards, setBackfaceNoteCards] = useState(noteCards);

  // --- Voice Feedback Animation State ---
  const [animationState, setAnimationState] = useState<"idle" | "success" | "error">("idle");
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const animationStateRef = useRef<"idle" | "success" | "error">("idle");

  const triggerSuccess = useCallback(() => {
    // Prevent the animation from restarting if partial voice results trigger repeatedly
    if (animationStateRef.current === "success") return;
    
    animationStateRef.current = "success";
    setAnimationState("success");
    
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    animationTimeoutRef.current = setTimeout(() => {
      animationStateRef.current = "idle";
      setAnimationState("idle");
    }, 1000); // 1 second total duration for the smooth pulse and hold
  }, []);

  const triggerError = useCallback(() => {
    // Prevent the animation from restarting if we are already wiggling
    if (animationStateRef.current === "error") return;

    animationStateRef.current = "error";
    setAnimationState("error");
    
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    animationTimeoutRef.current = setTimeout(() => {
      animationStateRef.current = "idle";
      setAnimationState("idle");
    }, 400); // 400ms duration for the fast wiggle
  }, []);

  // --- Voice Recognition Logic ---
  const nextResultToHandle = useRef(0);

  // Fast-forward the results pointer whenever the card changes so we don't accidentally grade old speech
  useEffect(() => {
    nextResultToHandle.current = results.length;
  }, [instrumentCardIndex, instrumentCards]);

  useEffect(() => {
    if (results.length - 1 < nextResultToHandle.current) return;

    for (let i = nextResultToHandle.current; i < results.length; i++) {
      const result = results[i];
      if (result.result.length === 0) continue;

      const expectedNotes = new Set(noteCards.map((n) => n.noteName));
      let isWrong = false;
      let correctCount = 0;

      const uniqueSpokenNotes = new Set(result.result);

      uniqueSpokenNotes.forEach((spokenNote) => {
        if (expectedNotes.has(spokenNote)) {
          correctCount++;
        } else {
          isWrong = true;
        }
      });

      // To prevent flashing red while a user says "C" on their way to saying "C Sharp", 
      // we only trigger errors on the final result string. Successes can trigger immediately on partials.
      if (isWrong && result.isFinal) {
        triggerError();
      } else if (!isWrong && correctCount === expectedNotes.size) {
        triggerSuccess();
      }
    }

    nextResultToHandle.current = results.length;
  }, [results, noteCards, triggerError, triggerSuccess]);

  // --- Flip Delay Logic ---
  useEffect(() => {
    if (isFlipped) {
      setBackfaceNoteCards(noteCards);
    } else {
      const timer = setTimeout(() => {
        setBackfaceNoteCards(noteCards);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isFlipped, noteCards]);

  const shuffleCards = useCallback(
    () => __setInstrumentCards((x) => [...arrayShuffle(x)]),
    [__setInstrumentCards]
  );

  const toggleFlip = useCallback(() => setIsFlipped((prev) => !prev), []);

  const resetCardIndex = useCallback(() => {
    __setCurrentCardIndex(0);
    setIsFlipped(false);
  }, [__setCurrentCardIndex]);

  const goToNextCard = useCallback(() => {
    __setCurrentCardIndex((x) => Math.min(x + 1, instrumentCards.length - 1));
    setIsFlipped(false);
  }, [__setCurrentCardIndex, instrumentCards.length]);

  const goToPreviousCard = useCallback(() => {
    __setCurrentCardIndex((x) => Math.max(x - 1, 0));
    setIsFlipped(false);
  }, [__setCurrentCardIndex]);

  const lastNavigationEventByVoice = useRef<NavigationEvent | null>(
    navigationEvent
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      switch (event.code) {
        case "Space":
        case "ArrowRight":
          goToNextCard();
          break;
        case "ArrowLeft":
        case "Backspace":
          goToPreviousCard();
          break;
        case "KeyF":
          toggleFlip();
          break;
      }
    },
    [goToPreviousCard, goToNextCard, toggleFlip]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    if (
      navigationEvent === null ||
      navigationEvent?.time <= (lastNavigationEventByVoice.current?.time ?? 0)
    ) {
      return;
    }

    lastNavigationEventByVoice.current = navigationEvent;

    switch (navigationEvent.direction) {
      case NavigationDirection.FORWARD:
        goToNextCard();
        break;
      case NavigationDirection.BACK:
        goToPreviousCard();
        break;
      case NavigationDirection.FLIP:
        toggleFlip();
        break;
    }
  }, [navigationEvent, goToNextCard, goToPreviousCard, toggleFlip]);

  const isFirstCard = instrumentCardIndex === 0;
  const isLastCard = instrumentCardIndex === instrumentCards.length - 1;

  // --- Dynamic Color Classes ---
  const frontFaceClass = animationState === 'success' 
    ? 'bg-emerald-100 dark:bg-emerald-900/40 border-emerald-400 shadow-[0_0_40px_rgba(16,185,129,0.4)]'
    : animationState === 'error'
    ? 'bg-rose-100 dark:bg-rose-900/40 border-rose-400 shadow-[0_0_30px_rgba(244,63,94,0.5)]'
    : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none';

  const backFaceClass = animationState === 'success' 
    ? 'bg-emerald-100 dark:bg-emerald-900/40 border-emerald-400 shadow-[0_0_40px_rgba(16,185,129,0.4)]'
    : animationState === 'error'
    ? 'bg-rose-100 dark:bg-rose-900/40 border-rose-400 shadow-[0_0_30px_rgba(244,63,94,0.5)]'
    : 'bg-indigo-50 dark:bg-slate-800 border-indigo-100 dark:border-slate-700 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none';

  return (
    <div className="flex flex-col items-center w-full max-w-6xl mx-auto px-2 md:px-4 py-8 md:py-12 animate-in fade-in duration-500">
      
      <style>{`
        /* Custom keyframes for the slow pulse, hold, and fade */
        @keyframes card-success {
          0% { transform: scale(1); }
          30% { transform: scale(1.04); }
          60% { transform: scale(1.04); }
          100% { transform: scale(1); }
        }
        @keyframes card-wiggle {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-8px); }
          80% { transform: translateX(8px); }
        }
        .animate-card-success {
          animation: card-success 1s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .animate-card-wiggle {
          animation: card-wiggle 0.4s ease-in-out;
        }
      `}</style>

      <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white text-center mb-8">
        {currentInstumentCard.instrument}
        <span className="text-indigo-500 ml-2">
          #{currentInstumentCard.cardNumber}
        </span>
      </h2>

      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-stretch justify-items-center w-full gap-2 md:gap-6 mb-8 min-h-[350px] md:min-h-[400px]">
        <button
          onClick={goToPreviousCard}
          disabled={isFirstCard}
          aria-label="Previous card"
          className="flex items-center justify-center w-10 md:w-16 h-full rounded-[1.5rem] bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-sm transition-all duration-300 ease-out hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95 disabled:opacity-30 disabled:pointer-events-none text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 flex-shrink-0"
        >
          <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* --- Flippable Card Container --- */}
        <div
          className={`flex flex-col items-center justify-center w-full h-full max-w-4xl relative cursor-pointer group min-w-0 ${
            animationState === "success" ? "animate-card-success" : ""
          } ${animationState === "error" ? "animate-card-wiggle" : ""}`}
          onClick={toggleFlip}
          style={{ perspective: "1000px" }}
        >
          <div
            className="relative w-full h-full grid transition-transform duration-500 ease-out"
            style={{
              transformStyle: "preserve-3d",
              transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            }}
          >
            {/* Front of card (Notes) */}
            <div
              className={`col-start-1 row-start-1 flex flex-col items-center justify-center w-full h-full rounded-[2rem] transition-colors duration-300 border p-4 sm:p-6 md:p-12 min-h-[300px] ${frontFaceClass}`}
              style={{ backfaceVisibility: "hidden" }}
            >
              <NoteCardGroup noteCards={noteCards} />
            </div>

            {/* Back of card (Answers) */}
            <div
              className={`col-start-1 row-start-1 flex flex-col items-center justify-center w-full h-full rounded-[2rem] transition-colors duration-300 border p-4 sm:p-6 md:p-12 min-h-[300px] ${backFaceClass}`}
              style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
            >
              <div className="flex flex-wrap gap-6 justify-center items-center">
                {backfaceNoteCards.map((noteCard, index) => (
                  <span
                    key={index}
                    className="text-6xl md:text-8xl font-black text-indigo-600 dark:text-indigo-400 drop-shadow-sm"
                  >
                    {NOTE_NAME_STRING_MAP[noteCard.noteName]}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={goToNextCard}
          disabled={isLastCard}
          aria-label="Next card"
          className="flex items-center justify-center w-10 md:w-16 h-full rounded-[1.5rem] bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-sm transition-all duration-300 ease-out hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95 disabled:opacity-30 disabled:pointer-events-none text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 flex-shrink-0"
        >
          <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="flex flex-row w-full justify-center gap-4 mb-8">
        <Button
          title="Shuffle the current cards and reset them from the beginning"
          onClick={() => {
            shuffleCards();
            resetCardIndex();
          }}
          className="bg-slate-800 hover:bg-slate-700 text-white"
        >
          Shuffle
        </Button>
        <Button
          title="Go back to the main screen to choose a different instrument or level"
          onClick={() => setPhase(PHASE.SETUP)}
          className="bg-rose-600 hover:bg-rose-500 text-white"
        >
          Reset
        </Button>
      </div>

      <div className="flex flex-col items-center text-center text-sm font-medium text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 px-6 py-4 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm">
        <p className="mb-1">{flipMessage(isMobile)}</p>
        <p className="mb-1">{forwardMessage(isMobile)}</p>
        <p>{backMessage(isMobile)}</p>
      </div>
    </div>
  );
};

export default ManualQuizScreen;