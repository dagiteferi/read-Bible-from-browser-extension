export const ProgressBar = ({ progress }) => {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
      <div className="bg-amber-warm h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
    </div>
  );
};