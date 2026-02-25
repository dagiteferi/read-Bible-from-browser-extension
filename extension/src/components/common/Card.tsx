export const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-white dark:bg-dark-surface rounded-lg shadow-md p-4 ${className}`}>
      {children}
    </div>
  );
};