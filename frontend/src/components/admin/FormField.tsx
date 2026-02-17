'use client';

import { ReactNode } from 'react';

interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'number' | 'url' | 'textarea' | 'select' | 'toggle';
  value: string | number | boolean;
  onChange: (value: string | number | boolean) => void;
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  rows?: number;
  error?: string;
  helpText?: string;
}

export default function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required,
  options,
  rows = 4,
  error,
  helpText,
}: FormFieldProps) {
  const inputClasses = `w-full rounded-lg border px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
    error ? 'border-red-500' : 'border-gray-300'
  }`;

  const renderInput = (): ReactNode => {
    switch (type) {
      case 'textarea':
        return (
          <textarea
            id={name}
            name={name}
            value={value as string}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            rows={rows}
            className={inputClasses}
          />
        );

      case 'select':
        return (
          <select
            id={name}
            name={name}
            value={value as string}
            onChange={(e) => onChange(e.target.value)}
            required={required}
            className={inputClasses}
          >
            {options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'toggle':
        return (
          <button
            type="button"
            onClick={() => onChange(!value)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              value ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                value ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        );

      case 'number':
        return (
          <input
            type="number"
            id={name}
            name={name}
            value={value as number}
            onChange={(e) => onChange(parseInt(e.target.value) || 0)}
            placeholder={placeholder}
            required={required}
            className={inputClasses}
          />
        );

      default:
        return (
          <input
            type={type}
            id={name}
            name={name}
            value={value as string}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            className={inputClasses}
          />
        );
    }
  };

  return (
    <div className="mb-4">
      <label
        htmlFor={name}
        className="mb-1 block text-sm font-medium text-gray-700"
      >
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      {renderInput()}
      {helpText && <p className="mt-1 text-sm text-gray-500">{helpText}</p>}
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
