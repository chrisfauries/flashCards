import React from "react";

interface Props
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  containerProps?: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >;
}

const Button: React.FC<Props> = ({
  containerProps,
  children,
  ...restButtonProps
}) => {
  return (
    <div
      {...containerProps}
      className={`flex ${containerProps?.className || ""}`}
    >
      <button
        {...restButtonProps}
        type="button"
        className={`w-full md:w-auto text-white text-base font-semibold bg-indigo-600 hover:bg-indigo-500 rounded-xl px-8 py-3.5 shadow-md shadow-indigo-500/20 transition-all active:scale-[0.98] disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none dark:disabled:bg-slate-800/50 dark:disabled:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${restButtonProps.className || ""}`}
      >
        {children}
      </button>
    </div>
  );
};

export default Button;