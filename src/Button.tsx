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
      className={`flex m-8 ${containerProps?.className}`}
    >
      <button
        {...restButtonProps}
        type="button"
        className={`text-white text-lg bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-7 py-2.5 text-center me-2 mb-2 dark:bg-green-800 dark:hover:bg-green-600 dark:focus:ring-green-800 disabled:bg-gray-800 disabled:hover:bg-gray-800 disabled:text-gray-400 disabled:border-gray-600 ${restButtonProps.className}}`}
      >
        {children}
      </button>
    </div>
  );
};

export default Button;
