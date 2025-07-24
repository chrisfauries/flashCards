import React from "react";

interface Props {
  minutes: number;
  seconds: number;
}

const Time: React.FC<Props> = ({ minutes, seconds }) => {
  return (
    <div className="flex items-center justify-center bg-gray-900 text-white font-sans m-2">
      <div className="text-center">
        <div className="bg-gray-800 p-2">
          <div className="flex items-end space-x-2">
            <div className="flex flex-col items-center">
              <span className="text-5xl md:text-3xl font-mono font-bold tracking-widest">
                {minutes}
              </span>
              <span className="text-sm text-gray-400 uppercase">Minutes</span>
            </div>
            <span className="text-5xl md:text-3xl font-mono font-bold pb-2 self-baseline">
              :
            </span>

            <div className="flex flex-col items-center">
              <span className="text-5xl md:text-3xl font-mono font-bold tracking-widest">
                {seconds.toString().padStart(2, '0')}
              </span>
              <span className="text-sm text-gray-400 uppercase">Seconds</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Time;
