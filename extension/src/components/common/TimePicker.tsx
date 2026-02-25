import React from 'react';

interface TimePickerProps {
  label?: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export const TimePicker: React.FC<TimePickerProps> = ({ label, value, onChange, className = '' }) => {
  return (
    <div className={className}>
      {label && <label className="label">{label}</label>}
      <input
        type="time"
        value={value}
        onChange={onChange}
        className="input"
        style={{ paddingTop: 7, paddingBottom: 7 }}
      />
    </div>
  );
};
