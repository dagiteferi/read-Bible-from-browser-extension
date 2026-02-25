export const Button = ({ children, onClick, className = '' }) => {
  return (
    <button className={`px-4 py-2 rounded-md bg-amber-warm text-white ${className}`} onClick={onClick}>
      {children}
    </button>
  );
};