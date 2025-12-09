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

const CACHE_NAME = "vosk-model-v1";
const MODEL_URL = "./model.tar.gz";

const useVoskModel = (): UseVoskModelReturn => {
  const [model, setModel] = useState<Vosk.Model | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<VoskModelStatus>(
    VoskModelStatus.NOT_STARTED
  );
  const [error, setError] = useState<string | null>(null);
  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current || model || status !== VoskModelStatus.NOT_STARTED)
      return;

    const init = async () => {
      setError(null);
      initRef.current = true;

      try {
        let blob: Blob;

        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(MODEL_URL);

        if (cachedResponse) {
          setStatus(VoskModelStatus.INITIALIZING);
          setProgress(100);
          blob = await cachedResponse.blob();
        } else {
          setStatus(VoskModelStatus.DOWNLOADING);
          setProgress(0);

          const response = await fetch(MODEL_URL);

          if (!response.body) throw new Error("Response body is empty");

          const contentLength = response.headers.get("content-length");
          const total = contentLength ? parseInt(contentLength, 10) : 0;

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
                setProgress(
                  Math.min(100, Math.round((receivedLength / total) * 100))
                );
              }
            }
          }

          blob = new Blob(chunks, { type: "application/gzip" });

          try {
            await cache.put(
              MODEL_URL,
              new Response(blob, {
                headers: { "Content-Type": "application/gzip" },
              })
            );
          } catch (cacheErr) {
            console.warn("Failed to cache model (non-fatal):", cacheErr);
          }
        }

        setStatus(VoskModelStatus.INITIALIZING);
        const blobUrl = URL.createObjectURL(blob);

        const loadedModel = await createModel(blobUrl);

        setModel(loadedModel);
        setStatus(VoskModelStatus.READY);
      } catch (err: any) {
        console.error("Vosk init failed:", err);
        setError(err.message || "Unknown error loading model");
        setStatus(VoskModelStatus.ERROR);
      }
    };

    init();
  }, [status, model]);

  return { model, progress, modelStatus: status, error };
};

export default useVoskModel;
