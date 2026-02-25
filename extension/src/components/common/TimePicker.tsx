import React from 'react';

interface TimePickerProps {
  label: string;
  value: string; // e.g., "HH:mm"
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export const TimePicker: React.FC<TimePickerProps> = ({ label, value, onChange, className = '' }) => {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary">
        {label}
      </label>
      <input
        type="time"
        value={value}
        onChange={onChange}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-deep focus:ring-indigo-deep dark:bg-dark-surface dark:border-dark-border dark:text-dark-text"
      />
    </div>
  );
};
