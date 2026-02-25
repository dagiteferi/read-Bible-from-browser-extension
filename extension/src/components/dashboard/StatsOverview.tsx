export const StatsOverview = () => {
  return (
    <div className="p-4 bg-white dark:bg-dark-surface rounded-lg shadow-md">
      <h2 className="text-lg font-semibold text-indigo-deep dark:text-dark-indigo">Your Journey So Far</h2>
      <div className="mt-2 grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-text-secondary dark:text-dark-text-secondary">Verses Read</p>
          <p className="text-xl font-bold text-amber-warm">0</p>
        </div>
        <div>
          <p className="text-sm text-text-secondary dark:text-dark-text-secondary">Units Completed</p>
          <p className="text-xl font-bold text-amber-warm">0</p>
        </div>
      </div>
    </div>
  );
};