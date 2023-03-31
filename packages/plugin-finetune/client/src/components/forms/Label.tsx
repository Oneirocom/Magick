// DOCUMENTED 
/**
 * A label component that adds semantic meaning to an HTML form control.
 * @param children The children components that will appear inside the label
 * @param label The text that will describe the purpose of the form control
 * @param required Indicates if the field is mandatory
 */
import React from "react";

interface LabelProps {
  children: React.ReactNode;
  label: string;
  required?: boolean;
}

export default function Label({ children, label, required = false }: LabelProps) {
  return (
    <label className="block my-4">
      <div className="mb-2 text-sm font-bold capitalize">
        {label}
        {required && <span className="ml-1 text-blue-500">*</span>}
      </div>
      {children}
    </label>
  );
}

/**
 * The LabelProps interface defines the expected props for the Label component
 * @interface LabelProps
 * @property children - The children components that will appear inside the label
 * @property label - The text that will describe the purpose of the form control
 * @property required - Indicates if the field is mandatory
 */

/**
 * The Label component adds semantic meaning to an HTML form control
 * @param props - The props of the Label component
 * @returns A Label component with the given label and children components
 */