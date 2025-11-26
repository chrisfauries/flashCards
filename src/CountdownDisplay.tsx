import React from "react";

interface Props {
  milliseconds: number;
}

const CountdownDisplay: React.FC<Props> = ({ milliseconds }) => {
  // Calculate display values derived purely from props
  // Ensure we don't display negative numbers
  const safeTime = Math.max(0, milliseconds);
  
  const seconds = Math.floor(safeTime / 1000);
  
  // 1. Get the remainder milliseconds (0-999)
  const msPart = safeTime % 1000;
  
  // 2. Divide by 10 to get centiseconds (0-99.9) and round as requested
  let centiseconds = Math.round(msPart / 10);

  // 3. Edge case: If 995ms-999ms rounds up to 100, clamp it to 99 
  // to prevent layout breakage or showing "100" inside a 2-digit field.
  if (centiseconds === 100) {
    centiseconds = 99;
  }

  return (
    <div className="flex items-center justify-center bg-gray-900 text-white font-sans m-2">
      <div className="text-center">
        <div className="bg-gray-800 p-2">
          <div className="flex items-end space-x-2">
            
            {/* Seconds Group */}
            <div className="flex flex-col items-center">
              <span className="text-5xl md:text-3xl font-mono font-bold tracking-widest w-12">
                {seconds}
              </span>
              <span className="text-sm text-gray-400 uppercase">Sec</span>
            </div>

            {/* Separator */}
            <span className="text-5xl md:text-3xl font-mono font-bold pb-2 self-baseline">
              :
            </span>

            {/* Milliseconds (Centiseconds) Group */}
            <div className="flex flex-col items-center">
              {/* Width reduced from w-24 to w-20 for tighter fit */}
              <span className="text-5xl md:text-3xl font-mono font-bold tracking-widest w-12">
                {centiseconds.toString().padStart(2, '0')}
              </span>
              <span className="text-sm text-gray-400 uppercase">Ms</span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CountdownDisplay;