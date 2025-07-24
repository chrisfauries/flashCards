import React, { use, useEffect, useRef, useState } from "react";
import { NOTE_NAME } from "./data/pitch";
import {
  INSTRUMENT_CARD,
  MISSED_INSTRUMENT_CARD,
} from "./data/instruments/instrument";
import { PHASE } from "./data/phase";
import arrayShuffle from "array-shuffle";
import Time from "./Time";
import Score from "./Score";
import { RecognizerUpdate, useNoteRecognizer } from "./use-note-recognizer";
import { useImagePreloader } from "./use-image-preloader";

interface Props {
  instrumentCards: INSTRUMENT_CARD[];
  setPhase: React.Dispatch<React.SetStateAction<PHASE>>;
  pauseTimer: () => void;
  resetTimer: (offset?: Date, newAutoStart?: boolean) => void;
  minutes: number;
  seconds: number;
  correctAnswers: INSTRUMENT_CARD[];
  addCorrectAnswer: React.ActionDispatch<[newValue: INSTRUMENT_CARD | null]>;
  addMissedAnswer: React.ActionDispatch<
    [newValue: MISSED_INSTRUMENT_CARD | null]
  >;
}

const QuizScreen: React.FC<Props> = ({
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
  const nextResultToHandle = useRef(0);
  const cardCount = orderedInstrumentCards.length;
  const [isPrimed, setIsPrimed] = useState(false);
  const [instrumentCards] = useState(arrayShuffle(orderedInstrumentCards));
  const [instrumentCardIndex, setCurrentCardIndex] = useState(0);
  const currentInstumentCard: INSTRUMENT_CARD | undefined =
    instrumentCards[instrumentCardIndex];
  const noteCards = currentInstumentCard.noteCards;
  const noteNames = new Set(noteCards.map((noteCard) => noteCard.noteName));

  const waitingForFinalResult = useRef<{
    i: number;
    checkedNoteNames: Set<NOTE_NAME>;
  }>({
    i: instrumentCardIndex,
    checkedNoteNames: new Set(),
  });

  const { isLoaded: isCardImagesPreloaded, hasFailures } = useImagePreloader(
    instrumentCards.flatMap((ic) => ic.noteCards.map((c) => c.img))
  );

  const {
    // TODO: handle no-specch at start
    isRunning,
    isMicrophoneAvailable,
    isCatchPhaseSpoken,
    supportsSpeechRecognition,
    start,
    stop, 
    results,
  } = useNoteRecognizer();

  const updater = (result: RecognizerUpdate) => {
    if (waitingForFinalResult.current.i > instrumentCardIndex) {
      console.warn("executing out of sync, this is a bug");
    }

    // For finalized values, we check all alternatives for a right answer.
    // If no answer is right, we do one of two things:
    // 1) if no wrong answer (all-empty), this is a no-op
    // 2) if wrong answers, use the first one as the default   TODO: sort by confidence score in the future.
    if (result.hasNewFinalizedRecognizedNoteNames) {
      // we need to determine if we are verifying a previous card or the current one.
      if (waitingForFinalResult.current.i < instrumentCardIndex) {
        // verifying old result
        const notesToVerify = new Set(
          instrumentCards[waitingForFinalResult.current.i].noteCards.map(
            (noteCard) => noteCard.noteName
          )
        );
        for (let alt of result.newestFinzalizedRecognizedNoteNameAlternatives) {
          if (alt.every((x) => notesToVerify.has(x))) {
            waitingForFinalResult.current = {
              i: instrumentCardIndex,
              checkedNoteNames: new Set(),
            };
            return;
          }
        }
        console.warn("unable to verify previous result");
      }

      let firstMatchedIncorrectAnswer: NOTE_NAME[] = [];
      for (let alt of result.newestFinzalizedRecognizedNoteNameAlternatives) {
        if (alt.length === 0) {
          continue;
        }
        // one of the alts matches correctly. break and return as correct.
        // first condition allows for the entire set of right responses to be in the answer.
        // second condition allows for each answer to be spoken individually
        if (alt.every((x) => noteNames.has(x))) {
          waitingForFinalResult.current = {
            i: instrumentCardIndex,
            checkedNoteNames: new Set([
              ...Array.from(waitingForFinalResult.current.checkedNoteNames),
              ...alt,
            ]),
          };

          advance(true, true, alt);
          return;
        } else {
          // this alt has the wrong answer it in. Save if the first one.
          if (firstMatchedIncorrectAnswer.length === 0) {
            firstMatchedIncorrectAnswer = alt;
          }
        }
      }

      // We couldn't find a right answer but we did find at least one wrong answer.
      if (firstMatchedIncorrectAnswer.length > 0) {
        advance(false, true, firstMatchedIncorrectAnswer);
      }
      return;
    }

    // For Low confidence, only match if it's correct
    // will advance if correct but will wait til finalized before allowing next low confidence check
    if (
      result.hasNewLowConfidenceNoteRecognitions &&
      waitingForFinalResult.current.i === instrumentCardIndex
    ) {
      if (
        result.currentLowConfidenceNoteRecognitions.every((x) =>
          noteNames.has(x)
        )
      ) {
        waitingForFinalResult.current = {
          i: instrumentCardIndex,
          checkedNoteNames: new Set([
            ...Array.from(waitingForFinalResult.current.checkedNoteNames),
            ...result.currentLowConfidenceNoteRecognitions,
          ]),
        };
        advance(true, false, result.currentLowConfidenceNoteRecognitions);
      }
      return;
    }
  };

  const advance = (
    isCorrect: boolean,
    isVerified: boolean,
    spokenNoteNames: NOTE_NAME[]
  ) => {
    if (!isCorrect) {
      addMissedAnswer({
        ...currentInstumentCard,
        givenAnswer: Array.from(
          new Set([
            ...Array.from(waitingForFinalResult.current.checkedNoteNames),
            ...spokenNoteNames,
          ])
        ),
      });
      if (isVerified) {
        waitingForFinalResult.current = {
          i: instrumentCardIndex + 1,
          checkedNoteNames: new Set(),
        };
      }
      advanceInstrumentCard();
    }

    // verifies every note card for this index was checked successfully
    if (
      noteNames.size === waitingForFinalResult.current.checkedNoteNames.size &&
      Array.from(noteNames).every((x) =>
        waitingForFinalResult.current.checkedNoteNames.has(x)
      )
    ) {
      addCorrectAnswer(currentInstumentCard);
      advanceInstrumentCard();

      if (isVerified) {
        waitingForFinalResult.current = {
          i: instrumentCardIndex + 1,
          checkedNoteNames: new Set(),
        };
      }
    }
  };

  const advanceInstrumentCard = () => {
    if (instrumentCardIndex + 1 === cardCount) {
      pauseTimer();
      setPhase(PHASE.RESULTS);
      stop();
    } else {
      setCurrentCardIndex(instrumentCardIndex + 1);
    }
  };

  useEffect(() => {
    if (!isPrimed && isCatchPhaseSpoken) {
      setIsPrimed(true);
      nextResultToHandle.current = results.length;
      return;
    }
    if (results.length - 1 < nextResultToHandle.current) return;
    for (let i = nextResultToHandle.current; i < results.length; i++) {
      updater(results[i]);
    }
    nextResultToHandle.current = results.length;
  }, [results, isPrimed, isCatchPhaseSpoken]);

  useEffect(() => {
    if (isPrimed) {
      resetTimer(undefined, true);
    }
  }, [isPrimed]);

  useEffect(() => {
    // start speech recognizer once images are loaded to prevent it from timing out during that time or listening to nonsense.
    isCardImagesPreloaded && start();
  }, [isCardImagesPreloaded]);

  useEffect(() => {
    // on mount, clear these values
    addCorrectAnswer(null);
    addMissedAnswer(null);
  }, []);

  if (cardCount === 0) {
    return <div>No cards found for this instrument and level.</div>;
  }

  if (!supportsSpeechRecognition) {
    return <div>Your browser does not support speech to text recognition</div>;
  }

  return (
    <>
      <h4 className="text-4xl font-bold m-2">
        {currentInstumentCard.instrument} #
        {isCatchPhaseSpoken ? currentInstumentCard.cardNumber : ""}
      </h4>
      <div className="flex flex-col items-center justify-center bg-gray-900 text-white font-sans m-4 p-4 min-h-[510px]">
        {isCardImagesPreloaded &&
          isCatchPhaseSpoken &&
          noteCards.map((noteCard) => (
            <img
              key={
                noteCard.octave * 100 +
                noteCard.pitch * 10 +
                noteCard.accidental
              }
              src={noteCard.img}
              className="w-[500px] h-[240px]"
              alt="card"
            />
          ))}
        {isCardImagesPreloaded && isRunning && isMicrophoneAvailable && !isCatchPhaseSpoken && (
          <p className="text-white font-sans">Say "because band" to start...</p>
        )}
        {isCardImagesPreloaded && (!isRunning || !isMicrophoneAvailable) && (
          <p className="text-white font-sans">Start speech recognition...</p>
        )}
        {!isCardImagesPreloaded && (
          <p className="text-white font-sans">Preloading images...</p>
        )}
        {/* TODO: handle failure states here as well (IE: no-speech, network, image load failure) */}
      </div>
      <div className="flex flex-col md:flex-row md:w-full justify-center">
        <Time minutes={minutes} seconds={seconds} />
        <Score correct={correctAnswers.length} total={instrumentCardIndex} />
      </div>
    </>
  );
};

export default QuizScreen;
