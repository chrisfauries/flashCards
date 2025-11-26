
const CheckMark = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
      <svg
        className="w-60 h-60 text-white drop-shadow-[0_0_8px_rgba(0,0,0,1)]"
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
  );
};



export default CheckMark;
