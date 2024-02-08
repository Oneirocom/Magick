import * as React from "react";

import { cn } from "../../utils/shadcn";

export const formInputStyles =
  "rounded-lg border-2 placeholder:font-montAlt border-[#3C3F41] bg-transparent py-2.5 h-11 px-3.5 text-base font-normal font-montAlt text-white focus:outline-none focus:border-[#1BC5EB]";

export const agentInputStyles =
  "focus:border-secondary-highlight placeholder:font-montserrat font-montserrat placeholder:text-black/70 dark:placeholder:text-white/70 w-full p-2 bg-transparent border-2 border-[#808f9a] rounded-[8px] dark:text-white";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-lg border-2 border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
