import React, { forwardRef } from "react";

interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "id"> {
  id: string;
  label: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ id, label, error, className = "", ...props }, ref) => {
    return (
      <div className="mb-4">
        <label
          htmlFor={id}
          className="block text-[var(--gray-dark-more)] font-medium mb-1"
        >
          {label}
        </label>
        <input
          id={id}
          ref={ref}
          className={`border border-[var(--gray-border)] rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[var(--blue-pastel)] text-[var(--blue-dark)] ${
            error &&
            "border border-[var(--red)] focus:ring-2 focus:ring-[var(--red)]"
          } ${className}`}
          {...props}
        />
        {error ? <p className="text-[var(--red)] text-sm mt-1">{error}</p> : ""}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
