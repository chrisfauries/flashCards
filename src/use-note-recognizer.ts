import { useEffect, useRef, useState } from "react";
import { ACCIDENTAL, NOTE_NAME } from "./data/pitch";
import { parseNoteNames } from "./logic/parser";

export interface RecognizerUpdate {
  __processedResults: Set<SpeechRecognitionResult>;
  allFinalizedRecognizedNoteNames: Array<NOTE_NAME>;
  newestFinalizedRecognizedNoteNames: Array<NOTE_NAME>;
  newestFinzalizedRecognizedNoteNameAlternatives: Array<Array<NOTE_NAME>>;
  hasNewFinalizedRecognizedNoteNames: boolean;
  currentLowConfidenceNoteRecognitions: Array<NOTE_NAME>;
  hasNewLowConfidenceNoteRecognitions: boolean;
  currentHighConfidenceNoteRecognitions: Array<NOTE_NAME>;
  hasNewHighConfidenceNoteRecognitions: boolean;
}

interface RecognizerHook {
  start: () => void;
  stop: () => void;
  isRunning: boolean;
  supportsSpeechRecognition: boolean;
  isMicrophoneAvailable: boolean;
  results: RecognizerUpdate[];
  isCatchPhaseSpoken: boolean;
}

const CONFIDENCE_THRESHOLD = 0.5;

const areArraysEqualOrdered = (arr1: any[], arr2: any[]) => {
  if (arr1.length !== arr2.length) {
    return false;
  }

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }

  return true;
};

export const useNoteRecognizer = (): RecognizerHook => {
  const SpeechRecognition =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition;

  // hook state
  const [results, setResults] = useState<RecognizerUpdate[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isMicrophoneAvailable, setIsMicrophoneAvailable] = useState(false);
  const [isCatchPhaseSpoken, setIsCatchPhaseSpoken] = useState(false);

  const startLock = useRef(false);
  const stopClicked = useRef(false);
  const processedFinalizedResults = useRef<Set<SpeechRecognitionResult>>(
    new Set()
  );
  const finalRecognizedNotes = useRef<NOTE_NAME[]>([]);
  const lowConfidenceNoteRecognitionsRef = useRef<NOTE_NAME[]>([]);
  const highConfidenceNoteRecognitionsRef = useRef<NOTE_NAME[]>([]);

  const recognitionRef = useRef(new SpeechRecognition());

  const checkForCatchPhase = (results: SpeechRecognitionResult[]) => {
    for (var result of results) {
      for (var version of Array.from(result)) {
        const transcript = version.transcript;
        if (/because\s(band|bad|banned|bant)/.test(transcript)) {
          setIsCatchPhaseSpoken(true);
          return;
        }
      }
    }
  };

  const recognize = (e: any) => {
    const pastLowConfidenceMatches = lowConfidenceNoteRecognitionsRef.current;
    const pastHighConfidenceMatches = highConfidenceNoteRecognitionsRef.current;
    let newestFinalizedRecognizedNoteNames: NOTE_NAME[] = [];
    let newestFinzalizedRecognizedNoteNameAlternatives: NOTE_NAME[][] = [];
    let lowConfidenceNoteRecognitions: NOTE_NAME[] = [];
    let highConfidenceNoteRecognitions: NOTE_NAME[] = [];
    let hasNewFinalizedRecognizedNoteNames = false;
    let hasNewLowConfidenceNoteRecognitions = false;
    let hasNewHighConfidenceNoteRecognitions = false;

    const results = e.results as SpeechRecognitionResult[];
    checkForCatchPhase(results);

    let lowConfidenceString = "";
    let highConfidenceString = "";

    for (var result of results) {
      if (result.isFinal) {
        if (processedFinalizedResults.current.has(result)) {
          // once a finalize result has been processed, there's no reason to do anything with them again.
          continue;
        } else {
          const versionedString: string[] = [];
          const versionedAnswers: NOTE_NAME[][] = [];

          for (var x of result as any) {
            const version = x as SpeechRecognitionAlternative;
            versionedString.push(version.transcript);
            const noteNames = parseNoteNames(version.transcript)!!;
            versionedAnswers.push(noteNames);
          }

          //   console.log("---Finalized Answers and parsings---");
          //   console.log(
          //     versionedString.reduce<any>((a, c, i) => {
          //       a[c] = versionedAnswers[i];
          //       return a;
          //     }, {})
          //   );

          processedFinalizedResults.current.add(result);
          finalRecognizedNotes.current = [
            ...finalRecognizedNotes.current,
            ...versionedAnswers[0],
          ];
          hasNewFinalizedRecognizedNoteNames = true;
          newestFinalizedRecognizedNoteNames = [...versionedAnswers[0]];
          newestFinzalizedRecognizedNoteNameAlternatives = [
            ...versionedAnswers,
          ];
        }

        continue;
      }

      const version = result[0];
      const transcript = version.transcript;
      const confidence = version.confidence;

      if (confidence > CONFIDENCE_THRESHOLD) {
        highConfidenceString += transcript;
        lowConfidenceString += transcript;
      } else {
        lowConfidenceString += transcript;
      }
    }

    const lowConfidentMatches = parseNoteNames(lowConfidenceString);
    if (lowConfidentMatches.length) {
      lowConfidenceNoteRecognitions = [...lowConfidentMatches];
      if (
        !areArraysEqualOrdered(
          pastLowConfidenceMatches,
          lowConfidenceNoteRecognitions
        )
      ) {
        hasNewLowConfidenceNoteRecognitions = true;
      }
    }
    const highConfidentMatches = parseNoteNames(highConfidenceString);
    if (highConfidentMatches.length) {
      highConfidenceNoteRecognitions = [...highConfidentMatches];
      if (
        !areArraysEqualOrdered(
          pastHighConfidenceMatches,
          highConfidenceNoteRecognitions
        )
      ) {
        hasNewHighConfidenceNoteRecognitions = true;
      }
    }

    setResults((prevResults) => [
      ...prevResults,
      {
        __processedResults: processedFinalizedResults.current,
        allFinalizedRecognizedNoteNames: finalRecognizedNotes.current,
        newestFinalizedRecognizedNoteNames: newestFinalizedRecognizedNoteNames,
        newestFinzalizedRecognizedNoteNameAlternatives:
          newestFinzalizedRecognizedNoteNameAlternatives,
        hasNewFinalizedRecognizedNoteNames: hasNewFinalizedRecognizedNoteNames,
        currentLowConfidenceNoteRecognitions: lowConfidenceNoteRecognitions,
        hasNewLowConfidenceNoteRecognitions:
          hasNewLowConfidenceNoteRecognitions,
        currentHighConfidenceNoteRecognitions: highConfidenceNoteRecognitions,
        hasNewHighConfidenceNoteRecognitions:
          hasNewHighConfidenceNoteRecognitions,
      },
    ]);
  };

  useEffect(() => {
    if (startLock.current) return;
    const recognition = recognitionRef.current;

    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 5;

    recognition.onstart = function (e: any) {
      setIsRunning(true);
    };

    recognition.onaudiostart = function (e: any) {
      setIsMicrophoneAvailable(true);
    };

    recognition.onspeechstart = function (e: any) {};

    recognition.onaudioend = function (e: any) {
      setIsMicrophoneAvailable(false);
    };

    recognition.onend = function (e: any) {
      if (!stopClicked.current) {
        recognition.start();
      } else {
        setIsRunning(false);
      }
      startLock.current = false;
    };

    // call continious as results are received during speech
    recognition.onresult = function (e: any) {
      recognize(e);
    };

    // for errors, haven't seen this called
    recognition.onerror = function (e: any) {
      console.warn(e);
    };

    // ???, haven't seen this called
    recognition.onnomatch = function (e: any) {};
  }, []);

  const supportsSpeechRecognition = () =>
    typeof window !== "undefined" &&
    (window.SpeechRecognition || window.webkitSpeechRecognition);

  return {
    results,
    isRunning,
    isCatchPhaseSpoken,
    supportsSpeechRecognition: !!supportsSpeechRecognition(),
    isMicrophoneAvailable,
    start: () => {
      if (!startLock.current) {
        startLock.current = true;
        recognitionRef.current.start();
        stopClicked.current = false;
      }
    },
    stop: () => {
      if (startLock.current && !isRunning) return;
      stopClicked.current = true;
      recognitionRef.current.stop();
    },
  };
};
