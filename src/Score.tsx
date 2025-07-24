import React from "react";

interface Props {
  correct: number;
  total: number;
}

const Score: React.FC<Props> = ({ correct, total }) => {
  return (
    <div className="flex items-center justify-center bg-gray-900 text-white font-sans m-2">
      <div className="text-center">
        <div className="bg-gray-800 p-2">
          <div className="flex items-end space-x-2">
            <div className="flex flex-col items-center">
              <span className="text-5xl md:text-3xl font-mono font-bold tracking-widest">
                {correct}
              </span>
              <span className="text-sm text-gray-400 uppercase">Correct</span>
            </div>
            <span className="text-5xl md:text-3xl font-mono font-bold pb-2 self-baseline">
              -
            </span>

            <div className="flex flex-col items-center">
              <span className="text-5xl md:text-3xl font-mono font-bold tracking-widest">
                {total}
              </span>
              <span className="text-sm text-gray-400 uppercase">Total</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Score;
