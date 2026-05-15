import React from 'react';

interface InputProps {
  label: string;
  children?: React.ReactNode;
  placeholder: string;
  type?: string;
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  mask?: (value: string) => string;
  maxLength?: number;
}

export default function Input({
  label,
  children,
  placeholder,
  type = "text",
  id,
  name,
  value,
  onChange,
  required,
  mask,
  maxLength
}: InputProps) {

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (mask) {
      e.target.value = mask(e.target.value);
    }
    onChange(e);
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <label htmlFor={id} className="ml-1 text-sm font-semibold text-zinc-900 transition-colors duration-300">
        {label}
      </label>
      <div className="relative">
        {children}
        <input
          type={type}
          id={id}
          placeholder={placeholder}
          name={name}
          value={value}
          onChange={handleInputChange}
          required={required}
          maxLength={maxLength}
          className="
            w-full pl-12 pr-4 py-3 rounded-lg text-sm transition-all duration-300
            bg-zinc-50
            border border-zinc-200 
            text-zinc-900
            placeholder:text-zinc-400 
            focus:outline-none focus:ring-2 focus:ring-zinc-900
            
            [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_var(--color-zinc-50)] 
            [&:-webkit-autofill]:[-webkit-text-fill-color:var(--color-zinc-900)]
          "
        />
      </div>
    </div>
  );
}
