export const TimePicker = ({ label, value, onChange }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary">{label}</label>
      <input
        type="time"
        value={value}
        onChange={onChange}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-deep focus:ring-indigo-deep dark:bg-dark-surface dark:border-dark-border"
      />
    </div>
  );
};