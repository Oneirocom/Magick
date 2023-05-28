// DOCUMENTED 
/**
 * @description Functional component that renders a labeled input or group of inputs
 * @param {object} props Props to pass to the component
 * @param {*} props.children React node(s) representing the input or group of inputs to be labeled
 * @param {string} props.label The label text for the input or group of inputs
 * @param {boolean} [props.required=false] Whether or not the input or group of inputs is required
 * @returns A react component that consists of a label and its corresponding input or group of inputs
 */
import React, { ReactNode } from "react";

interface LabelProps {
  children: ReactNode;
  label: string;
  required?: boolean;
}

export default function Label(props: LabelProps): JSX.Element {
  const { children, label, required = false } = props;

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