import React from "react";
import { INSTRUMENT } from "./data/instruments/instrument";

interface Props {
  instrument: INSTRUMENT | "";
  setInstrument: React.Dispatch<React.SetStateAction<"" | INSTRUMENT>>;
}

const INSTRUMENT_THEMES: Record<
  INSTRUMENT,
  {
    selected: string;
    hover: string;
    focus: string;
  }
> = {
  [INSTRUMENT.FLUTE]: {
    selected: "bg-cyan-500 text-white border-cyan-400 shadow-lg shadow-cyan-500/30 scale-105 -translate-y-0.5",
    hover: "hover:border-cyan-300 hover:text-cyan-600 dark:hover:text-cyan-300",
    focus: "focus-visible:ring-cyan-500",
  },
  [INSTRUMENT.CLARINET]: {
    selected: "bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-500/30 scale-105 -translate-y-0.5",
    hover: "hover:border-indigo-300 hover:text-indigo-600 dark:hover:text-indigo-300",
    focus: "focus-visible:ring-indigo-500",
  },
  [INSTRUMENT.SAXOPHONE]: {
    selected: "bg-amber-500 text-white border-amber-400 shadow-lg shadow-amber-500/30 scale-105 -translate-y-0.5",
    hover: "hover:border-amber-300 hover:text-amber-600 dark:hover:text-amber-300",
    focus: "focus-visible:ring-amber-500",
  },
  [INSTRUMENT.OBOE]: {
    selected: "bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-500/30 scale-105 -translate-y-0.5",
    hover: "hover:border-emerald-300 hover:text-emerald-600 dark:hover:text-emerald-300",
    focus: "focus-visible:ring-emerald-500",
  },
  [INSTRUMENT.BASSOON]: {
    selected: "bg-rose-600 text-white border-rose-500 shadow-lg shadow-rose-500/30 scale-105 -translate-y-0.5",
    hover: "hover:border-rose-300 hover:text-rose-600 dark:hover:text-rose-300",
    focus: "focus-visible:ring-rose-500",
  },
  [INSTRUMENT.TRUMPET]: {
    selected: "bg-orange-500 text-white border-orange-400 shadow-lg shadow-orange-500/30 scale-105 -translate-y-0.5",
    hover: "hover:border-orange-300 hover:text-orange-600 dark:hover:text-orange-300",
    focus: "focus-visible:ring-orange-500",
  },
  [INSTRUMENT.HORN]: {
    selected: "bg-violet-600 text-white border-violet-500 shadow-lg shadow-violet-500/30 scale-105 -translate-y-0.5",
    hover: "hover:border-violet-300 hover:text-violet-600 dark:hover:text-violet-300",
    focus: "focus-visible:ring-violet-500",
  },
  [INSTRUMENT.TROMBONE]: {
    selected: "bg-red-500 text-white border-red-400 shadow-lg shadow-red-500/30 scale-105 -translate-y-0.5",
    hover: "hover:border-red-300 hover:text-red-600 dark:hover:text-red-300",
    focus: "focus-visible:ring-red-500",
  },
  [INSTRUMENT.EUPHONIUM]: {
    selected: "bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/30 scale-105 -translate-y-0.5",
    hover: "hover:border-blue-300 hover:text-blue-600 dark:hover:text-blue-300",
    focus: "focus-visible:ring-blue-500",
  },
  [INSTRUMENT.TUBA]: {
    selected: "bg-fuchsia-600 text-white border-fuchsia-500 shadow-lg shadow-fuchsia-500/30 scale-105 -translate-y-0.5",
    hover: "hover:border-fuchsia-300 hover:text-fuchsia-600 dark:hover:text-fuchsia-300",
    focus: "focus-visible:ring-fuchsia-500",
  },
  [INSTRUMENT.PERCUSSION]: {
    selected: "bg-teal-600 text-white border-teal-500 shadow-lg shadow-teal-500/30 scale-105 -translate-y-0.5",
    hover: "hover:border-teal-300 hover:text-teal-600 dark:hover:text-teal-300",
    focus: "focus-visible:ring-teal-500",
  },
};

const InstrumentSelector: React.FC<Props> = ({ instrument, setInstrument }) => {
  const instruments = Object.values(INSTRUMENT);

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-slate-800 p-6 md:p-8 mb-8">
      <div className="mb-4 flex items-center justify-center">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          Select Instrument
        </h3>
      </div>

      <div className="flex flex-wrap justify-center items-center gap-2.5 sm:gap-3">
        {instruments.map((inst) => {
          const isSelected = instrument === inst;
          const theme = INSTRUMENT_THEMES[inst];

          return (
            <button
              key={inst}
              type="button"
              aria-pressed={isSelected}
              onClick={() => setInstrument(inst)}
              className={`
                relative px-5 py-2.5 rounded-full text-sm font-semibold border
                transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
                active:scale-95 outline-none select-none
                ${
                  isSelected
                    ? theme.selected
                    : `bg-white text-slate-600 border-slate-200/80 hover:bg-slate-50 hover:shadow-sm scale-100 translate-y-0 dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700 ${theme.hover}`
                }
                focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 ${theme.focus}
              `}
            >
              {inst}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default InstrumentSelector;