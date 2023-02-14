import React from "react";

export default function Label({
  children,
  label,
  required,
}: {
  children: React.ReactNode;
  label: string;
  required?: boolean;
}) {
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
