import React, { use, useEffect, useRef, useState } from "react";

import Vosk, { createModel } from "vosk-browser";
import {
  ServerMessagePartialResult,
  ServerMessageResult,
} from "vosk-browser/dist/interfaces";

const VOSK_PROCESSOR_CODE = `
class VoskProcessor extends AudioWorkletProcessor {
  process(inputs, outputs, parameters) {
    const input = inputs[0];
    if (input.length > 0) {
      const inputChannel = input[0];
      // Post the raw float32 audio data back to the main thread
      this.port.postMessage(inputChannel);
    }
    // Return true to keep the processor alive
    return true;
  }
}
registerProcessor('vosk-processor', VoskProcessor);
`;

enum AUDIO {
  NOT_STARTED,
  CONNECTING,
  CONNECTED,
}

interface Props {}

const Test: React.FC<Props> = () => {
  const [audio, setAudio] = useState(AUDIO.NOT_STARTED);
  const [modelLoaded, setModelLoaded] = useState(false);
  const model = useRef<{ loading: boolean; model: Vosk.Model | null }>({
    loading: false,
    model: null,
  });

  const mediaStream = useRef<{
    loading: boolean;
    mediaStream: MediaStream | null;
  }>({ loading: false, mediaStream: null });

  const [result, setResult] = useState("");
  const [partialResult, setPartialResult] = useState("");

  useEffect(() => {
    async function getModel() {
      let loaded: Vosk.Model;
      try {
        loaded = await createModel("./model.tar.gz");
        setModelLoaded(true);
      } catch (e) {
        console.warn(e);
      }
      model.current = { loading: false, model: loaded!! };
    }

    if (model.current.loading === false && model.current.model === null) {
      console.log("loading model");
      model.current.loading = true;
      getModel();
    }
  }, []);

  useEffect(() => {
    async function getAudioStream() {
      const loaded = await navigator.mediaDevices.getUserMedia({
        video: false,
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          channelCount: 1,
          sampleRate: 16000,
        },
      });
      mediaStream.current = { loading: false, mediaStream: loaded };
    }

    if (
      mediaStream.current.loading === false &&
      mediaStream.current.mediaStream === null
    ) {
      mediaStream.current.loading = true;
      getAudioStream();
    }
  }, []);

  useEffect(() => {
    console.log(model.current.model);
    console.log("model: ", model);
  }, [model.current.model]);

  if (
    mediaStream.current.mediaStream &&
    model.current.model &&
    audio === AUDIO.NOT_STARTED
  ) {
    console.log("model loaded and media stream loaded");
    setAudio(AUDIO.CONNECTING);

    const grammar = JSON.stringify([
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
    ]);

    const recognizer = new model.current.model.KaldiRecognizer(16000, grammar);
    recognizer.on("result", (message) => {
      console.log(`Result: ${(message as ServerMessageResult).result.text}`);
      setResult((message as ServerMessageResult).result.text);
    });
    recognizer.on("partialresult", (message) => {
      const value = (message as ServerMessagePartialResult).result.partial;
      if (partialResult !== value) {
        console.log(`Partial result: ${value}`);
        setPartialResult(
          (message as ServerMessagePartialResult).result.partial
        );
      }
    });

    recognizer.on("error", console.warn);

    const audioContext = new AudioContext({ sampleRate: 16000 });

    // 3. Load the AudioWorklet using a Blob (The "Single File" Trick)
    // This avoids needing a separate .js file in your public folder
    const blob = new Blob([VOSK_PROCESSOR_CODE], {
      type: "application/javascript",
    });
    const blobUrl = URL.createObjectURL(blob);
    audioContext.audioWorklet.addModule(blobUrl).then(() => {
      // 4. Create the Source and Worklet Nodes
      const source = audioContext.createMediaStreamSource(
        mediaStream.current.mediaStream!!
      );
      const recognizerProcessor = new AudioWorkletNode(
        audioContext,
        "vosk-processor"
      );

      // 5. Handle the audio data sent from the Worklet
      // This replaces 'onaudioprocess'
      recognizerProcessor.port.onmessage = (event) => {
        const audioBufferShim = {
          getChannelData: (channel: number) => {
            // We assume mono (channel 0), so just return our data
            return event.data;
          },
          sampleRate: 16000, // Ensure this matches your context sample rate
        };
        try {
          // event.data is the Float32Array of audio
          recognizer.acceptWaveform(audioBufferShim as AudioBuffer);
        } catch (error) {
          console.error("acceptWaveform failed", error);
        }
      };

      // 6. Connect the graph
      source.connect(recognizerProcessor);
      // Connect to destination to prevent the browser from garbage collecting the node
      // (It won't output sound because the processor doesn't write to outputs)
      recognizerProcessor.connect(audioContext.destination);
      setAudio(AUDIO.CONNECTED);
    });
  }

  useEffect(() => {
    console.log("audio status: ", AUDIO[audio]);
  }, [audio]);

  return (
    <div>
      <p>Result: {result}</p>
      <p>Partial Result: {partialResult}</p>
    </div>
  );
};

export default Test;
