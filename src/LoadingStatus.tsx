import { AudioStatus } from "./use-recognizer";
import { VoskModelStatus } from "./use-vosk-model";

interface Props {
  progress: number;
  modelStatus: VoskModelStatus;
  audioStatus: AudioStatus;
  error: string | null;
}

const ModelLoadingBar: React.FC<Props> = ({
  progress,
  modelStatus,
  audioStatus,
  error,
}) => {
  if (error) {
    return (
      <div className="w-full max-w-md p-4 mb-4 bg-red-50 border border-red-200 rounded-md text-red-700">
        <strong>Error:</strong> {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-between bg-gray-900 text-white font-sans m-4 p-4 rounded-lg shadow-sm">
      <div className="text-base  mb-2">
        <span>Voice Recognizer: {modelStatus}</span>
      </div>
      <div className="text-base  mb-2">
        <span>Microphone: {audioStatus}</span>
      </div>
      {(modelStatus === VoskModelStatus.DOWNLOADING || progress < 100) && (
        <>
          <div className="text-base  mb-2">{progress > 0 && <span>Downloading... {progress}%</span>}</div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className="bg-blue-600 h-4 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </>
      )}
    </div>
  );
};

export default ModelLoadingBar;
