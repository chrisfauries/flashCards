import React, { useCallback, useEffect, useState, useRef } from "react";
import { INSTRUMENT_CARD } from "./data/instruments/instrument";
import { PHASE } from "./data/phase";
import arrayShuffle from "array-shuffle";
import Note from "./Note";
import { NavigationDirection, NavigationEvent } from "./use-recognizer";
import Button from "./Button";
import useIsMobile from "./use-is-mobile";

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
}

const ManualQuizScreen: React.FC<Props> = ({
  instrumentCards: orderedInstrumentCards,
  setPhase,
  navigationEvent,
}) => {
  const isMobile = useIsMobile();
  const [instrumentCards, __setInstrumentCards] = useState(
    arrayShuffle(orderedInstrumentCards)
  );

  const shuffleCards = useCallback(
    () => __setInstrumentCards((x) => [...arrayShuffle(x)]),
    [__setInstrumentCards]
  );

  const [instrumentCardIndex, __setCurrentCardIndex] = useState(0);

  const resetCardIndex = useCallback(
    () => __setCurrentCardIndex(0),
    [__setCurrentCardIndex]
  );

  const goToNextCard = useCallback(
    () =>
      __setCurrentCardIndex((x) => Math.min(x + 1, instrumentCards.length - 1)),
    [__setCurrentCardIndex, instrumentCards.length]
  );

  const goToPreviousCard = useCallback(
    () => __setCurrentCardIndex((x) => Math.max(x - 1, 0)),
    [__setCurrentCardIndex]
  );

  const lastNavigationEventByVoice = useRef<NavigationEvent | null>(navigationEvent);

  const currentInstumentCard: INSTRUMENT_CARD | undefined =
    instrumentCards[instrumentCardIndex];
  const noteCards = currentInstumentCard.noteCards;

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
      }
    },
    [goToPreviousCard, goToNextCard]
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
    }
  }, [navigationEvent, goToNextCard, goToPreviousCard]);

  const isFirstCard = instrumentCardIndex === 0;
  const isLastCard = instrumentCardIndex === instrumentCards.length - 1;

  return (
    <div className="flex flex-col items-center w-full max-w-6xl mx-auto px-2 md:px-4 py-8 md:py-12 animate-in fade-in duration-500">
      
      <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white text-center mb-8">
        {currentInstumentCard.instrument} 
        <span className="text-indigo-500 ml-2">#{currentInstumentCard.cardNumber}</span>
      </h2>

      {/* Added min-h-[900px] to strictly lock the carousel height */}
      <div className="flex flex-row items-center justify-center w-full gap-2 md:gap-6 mb-8 min-h-[900px]">
        
        <button
          onClick={goToPreviousCard}
          disabled={isFirstCard}
          aria-label="Previous card"
          className="flex items-center justify-center w-10 md:w-16 h-48 md:h-64 rounded-[1.5rem] bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-sm transition-all duration-300 ease-out hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95 disabled:opacity-30 disabled:pointer-events-none text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 flex-shrink-0"
        >
          <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex flex-col items-center justify-center flex-1 max-w-3xl bg-white dark:bg-slate-900 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-slate-800 p-4 md:p-12 min-h-[550px] md:min-h-[500px] relative overflow-hidden">
          <div className="flex flex-col md:flex-row flex-wrap items-center justify-center gap-2 w-full">
            {noteCards.map((noteCard) => (
              <div 
                key={
                  currentInstumentCard.frequency / 10000 +
                  currentInstumentCard.cardNumber +
                  noteCard.noteName * 100
                }
                className="p-4 md:p-8 flex items-center justify-center"
              >
                <div className="scale-[1.15] md:scale-150 rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 bg-white">
                  <Note card={noteCard} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={goToNextCard}
          disabled={isLastCard}
          aria-label="Next card"
          className="flex items-center justify-center w-10 md:w-16 h-48 md:h-64 rounded-[1.5rem] bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-sm transition-all duration-300 ease-out hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95 disabled:opacity-30 disabled:pointer-events-none text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 flex-shrink-0"
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
        <p className="mb-1">{forwardMessage(isMobile)}</p>
        <p>{backMessage(isMobile)}</p>
      </div>

    </div>
  );
};

export default ManualQuizScreen;