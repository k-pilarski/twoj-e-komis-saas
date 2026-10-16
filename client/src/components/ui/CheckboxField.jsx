export default function CheckboxField({ label, id, ...props }) {
  return (
    <div className="flex items-center gap-3 bg-surface-container-low p-4 rounded-lg border border-outline-variant transition-colors hover:bg-surface-container cursor-pointer">
      <input
        type="checkbox"
        id={id}
        className="w-5 h-5 text-primary rounded border-outline focus:ring-primary cursor-pointer"
        {...props}
      />
      <label htmlFor={id} className="text-sm font-medium text-on-surface cursor-pointer select-none w-full">
        {label}
      </label>
    </div>
  );
}