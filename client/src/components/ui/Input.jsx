export default function Input({ label, id, error, ...props }) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="font-label-md text-sm text-primary font-semibold" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        name={id}
        className={`w-full px-4 py-3 bg-surface-container-lowest border ${
          error ? 'border-error' : 'border-outline-variant'
        } rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all placeholder-outline shadow-sm`}
        {...props}
      />
    </div>
  );
}