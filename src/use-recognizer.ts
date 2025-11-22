import { useCallback, useEffect, useRef, useState } from "react";
import Vosk from "vosk-browser";
import useVoskModel, {
  UseVoskModelReturn,
  VoskModelStatus,
} from "./use-vosk-model";
import {
  ServerMessagePartialResult,
  ServerMessageResult,
} from "vosk-browser/dist/interfaces";
import { NOTE_NAME } from "./data/pitch";
import { parseNoteNames } from "./logic/parser";

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

export interface RecognizerUpdate {
  result: Array<NOTE_NAME>;
  isFinal: boolean;
}

export enum AudioStatus {
  NOT_STARTED = "Waiting...",
  CHECKING_PERMISSIONS = "Checking Permissions...",
  CONNECTING = "Connecting...",
  CONNECTED = "Connected!",
  ERROR = "Error...",
}

const MUSICAL_NOTE_GRAMMAR = [
  "c",
  "c natural",
  "c sharp",
  "d flat",
  "d",
  "d natural",
  "d sharp",
  "e flat",
  "e",
  "e natural",
  "f",
  "f natural",
  "f sharp",
  "g flat",
  "g",
  "g natural",
  "g sharp",
  "a flat",
  "a",
  "a natural",
  "a sharp",
  "b flat",
  "b",
  "b natural",
  "because band",
  "[unk]",
];

const VOSK_PROCESSOR_CODE = `
class VoskProcessor extends AudioWorkletProcessor {
  process(inputs, outputs, parameters) {
    const input = inputs[0];
    if (input.length > 0) {
      const inputChannel = input[0];
      this.port.postMessage(inputChannel);
    }
    return true;
  }
}
registerProcessor('vosk-processor', VoskProcessor);
`;

interface UseRecognizerReturn extends UseVoskModelReturn {
  audioStatus: AudioStatus;
  results: RecognizerUpdate[];
  resetResults: () => void;
  isCatchPhaseSpoken: boolean;
  resetCatchPhaseFlag: () => void;
}

const useRecognizer = (): UseRecognizerReturn => {
  const { model, modelStatus, ...restOfVoskModel } = useVoskModel();

  const [audioStatus, setAudioStatus] = useState<AudioStatus>(
    AudioStatus.NOT_STARTED
  );

  const [results, setResults] = useState<RecognizerUpdate[]>([]);
  const resetResults = useCallback(() => setResults([]), [setResults]);
  const [isCatchPhaseSpoken, setIsCatchPhaseSpoken] = useState(false);
  const resetCatchPhaseFlag = useCallback(
    () => setIsCatchPhaseSpoken(false),
    [setIsCatchPhaseSpoken]
  );

  const recognizerRef = useRef<any | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (
      model &&
      modelStatus === VoskModelStatus.READY &&
      audioStatus === AudioStatus.NOT_STARTED
    ) {
      startMicrophone(model);
    }
  }, [model, modelStatus, audioStatus]);

  const checkForCatchPhase = useCallback(
    (result: string) => {
      if (/because\sband/i.test(result)) {
        setIsCatchPhaseSpoken(true);
        return true;
      }
      return false;
    },
    [setIsCatchPhaseSpoken]
  );

  const processText = useCallback(
    (text: string, isFinal: boolean) => {
      if (text.length === 0) {
        return;
      }
      if (checkForCatchPhase(text)) {
        return;
      }

      const noteNames = parseNoteNames(text);

      if (noteNames.length === 0) {
        return;
      }

      setResults((prevResults) => {
        // We don't need to create duplicate intermediate results
        if (!isFinal && prevResults.length > 0) {
          var lastResult = prevResults[prevResults.length - 1];
          if (
            !lastResult.isFinal &&
            areArraysEqualOrdered(noteNames, lastResult.result)
          ) {
            return prevResults;
          }
        }

        return [
          ...prevResults,
          {
            result: noteNames,
            isFinal,
          },
        ];
      });
    },

    [checkForCatchPhase, setResults]
  );

  const startMicrophone = async (loadedModel: Vosk.Model) => {
    try {
      setAudioStatus(AudioStatus.CHECKING_PERMISSIONS);

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: false,
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          channelCount: 1,
          sampleRate: 16000,
        },
      });

      setAudioStatus(AudioStatus.CONNECTING);

      const grammar = JSON.stringify(MUSICAL_NOTE_GRAMMAR);

      const recognizer = new loadedModel.KaldiRecognizer(16000, grammar);

      recognizer.on("result", (r) =>
        processText((r as ServerMessageResult).result.text, true)
      );

      recognizer.on("partialresult", (r) =>
        processText((r as ServerMessagePartialResult).result.partial, false)
      );

      recognizer.on("error", (err: any) => {
        console.warn("Recognizer error:", err);
      });

      recognizerRef.current = recognizer;

      const audioContext = new AudioContext({ sampleRate: 16000 });
      audioContextRef.current = audioContext;

      const blob = new Blob([VOSK_PROCESSOR_CODE], {
        type: "application/javascript",
      });
      const blobUrl = URL.createObjectURL(blob);

      await audioContext.audioWorklet.addModule(blobUrl);

      const source = audioContext.createMediaStreamSource(mediaStream);
      const recognizerProcessor = new AudioWorkletNode(
        audioContext,
        "vosk-processor"
      );

      recognizerProcessor.port.onmessage = (event) => {
        const audioBufferShim = {
          getChannelData: (channel: number) => event.data,
          sampleRate: 16000,
        };

        try {
          if (recognizerRef.current) {
            recognizerRef.current.acceptWaveform(audioBufferShim);
          }
        } catch (error) {
          console.error("acceptWaveform failed", error);
        }
      };

      source.connect(recognizerProcessor);
      recognizerProcessor.connect(audioContext.destination);

      setAudioStatus(AudioStatus.CONNECTED);
      setIsCatchPhaseSpoken(false);
    } catch (e) {
      console.error("Error starting microphone:", e);
      setAudioStatus(AudioStatus.ERROR);
    }
  };

  return {
    model,
    modelStatus,
    ...restOfVoskModel,
    audioStatus,
    results,
    resetResults,
    isCatchPhaseSpoken,
    resetCatchPhaseFlag,
  };
};

export default useRecognizer;
