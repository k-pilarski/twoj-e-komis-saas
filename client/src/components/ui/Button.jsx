export default function Button({ children, isLoading, type = "button", ...props }) {
  return (
    <button
      type={type}
      disabled={isLoading}
      className={`w-full py-3 px-6 rounded-lg font-label-md font-semibold transition-all shadow-md flex justify-center items-center gap-2
        ${isLoading 
          ? 'bg-surface-tint text-surface-container cursor-not-allowed opacity-80' 
          : 'bg-secondary text-on-secondary hover:bg-secondary-container focus:ring-2 focus:ring-secondary focus:ring-offset-2'
        }`}
      {...props}
    >
      {isLoading && <span className="material-symbols-outlined animate-spin text-sm">autorenew</span>}
      {children}
    </button>
  );
}