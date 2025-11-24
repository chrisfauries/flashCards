import React, { useCallback, useEffect, useState, useRef } from "react";
import { INSTRUMENT_CARD } from "./data/instruments/instrument";
import { PHASE } from "./data/phase";
import arrayShuffle from "array-shuffle";
import Note from "./Note";
import { NavigationDirection, NavigationEvent } from "./use-recognizer";
import Button from "./Button";

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
  const lastNavigationEventByVoice = useRef<NavigationEvent | null>(null);
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

  return (
    <>
      <h4 className="text-4xl font-bold m-2">
        {currentInstumentCard.instrument} #{currentInstumentCard.cardNumber}
      </h4>
      <div className="flex flex-col items-center justify-center bg-gray-900 text-white font-sans m-4 p-4 min-h-[632px]">
        {noteCards.map((noteCard) => (
          <Note
            key={
              currentInstumentCard.frequency / 10000 +
              currentInstumentCard.cardNumber +
              noteCard.noteName * 100
            }
            card={noteCard}
          />
        ))}
      </div>
      <div className="flex flex-row w-full justify-center">
        <Button
          title="Shuffle the current cards and reset them from the beginning"
          onClick={() => {
            shuffleCards();
            resetCardIndex();
          }}
        >
          Shuffle
        </Button>
        <Button
          title="Go back to the main screen to choose a different instrument or level"
          onClick={() => setPhase(PHASE.SETUP)}
        >
          Reset
        </Button>
      </div>
      <div className="flex flex-col md:flex-row md:w-full justify-center">
        Press spacebar, the right arrow key, or say "Next" to show the next
        flash card
      </div>
      <div className="flex flex-col md:flex-row md:w-full justify-center">
        Press backspace, the left arrow key, or say "Back" to show the previous
        flash card
      </div>
    </>
  );
};

export default ManualQuizScreen;
