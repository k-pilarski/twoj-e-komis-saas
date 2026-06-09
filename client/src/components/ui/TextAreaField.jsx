export default function TextAreaField({ label, id, ...props }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-on-surface">
        {label}
      </label>
      <textarea
        id={id}
        className="p-3 bg-surface-container rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-y"
        {...props}
      />
    </div>
  );
}