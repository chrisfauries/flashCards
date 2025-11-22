import { useEffect, useRef, useState } from "react";
import Vosk, { createModel } from "vosk-browser";

export enum VoskModelStatus {
  NOT_STARTED = "Preparing...",
  DOWNLOADING = "Downloading...",
  INITIALIZING = "Initializing...",
  READY = "Ready!",
  ERROR = "Error...",
}

export interface UseVoskModelReturn {
  model: Vosk.Model | null;
  progress: number; // 0 to 100
  modelStatus: VoskModelStatus;
  error: string | null;
}

const useVoskModel = (): UseVoskModelReturn => {
  const [model, setModel] = useState<any | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<VoskModelStatus>(
    VoskModelStatus.NOT_STARTED
  );
  const [error, setError] = useState<string | null>(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (loadedRef.current || model || status !== VoskModelStatus.NOT_STARTED)
      return;

    const init = async () => {
      setError(null);

      try {
        setStatus(VoskModelStatus.DOWNLOADING);
        setProgress(0);

        const response = await fetch("./model.tar.gz");

        const contentLength = response.headers.get("content-length");
        const total = contentLength ? parseInt(contentLength, 10) : 0;

        if (!response.body) throw new Error("Response body is empty");

        const reader = response.body.getReader();
        const chunks: Uint8Array[] = [];
        let receivedLength = 0;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          if (value) {
            chunks.push(value);
            receivedLength += value.length;
            if (total > 0) {
              setProgress(Math.round((receivedLength / total) * 100));
            }
          }
        }

        setStatus(VoskModelStatus.INITIALIZING);
        const blob = new Blob(chunks, { type: "application/gzip" });
        const blobUrl = URL.createObjectURL(blob);

        const loadedModel = await createModel(blobUrl);

        setModel(loadedModel);
        loadedRef.current = true;
        setStatus(VoskModelStatus.READY);
      } catch (err: any) {
        console.error("Vosk init failed:", err);
        setError(err.message || "Unknown error loading model");
        setStatus(VoskModelStatus.ERROR);
      }
    };

    init();
  }, [status]);

  return { model, progress, modelStatus:status, error };
};

export default useVoskModel;
