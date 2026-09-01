import React from "react";

const CheckMark = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50 animate-in zoom-in duration-300">
      <div className="bg-white/20 dark:bg-black/20 backdrop-blur-md rounded-full p-8 shadow-2xl border border-white/30">
        <svg
          className="w-32 h-32 text-white drop-shadow-md"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={4}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
    </div>
  );
};

export default CheckMark;