// client/src/components/ui/InputField.jsx
export default function InputField({ label, id, rightElement, integerOnly = false, onKeyDown, ...props }) {
  const handleKeyDown = (e) => {
    if (props.type === 'number') {
      const blockedKeys = ['e', 'E', '+', '-'];
      if (integerOnly) {
        blockedKeys.push('.', ',');
      }
      if (blockedKeys.includes(e.key)) {
        e.preventDefault();
      }
    }
    if (onKeyDown) {
      onKeyDown(e);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-medium text-on-surface">
          {label}
        </label>
        {rightElement && (
          <span className="text-xs font-semibold text-secondary bg-secondary-container/30 px-2 py-0.5 rounded">
            {rightElement}
          </span>
        )}
      </div>
      <input
        id={id}
        onKeyDown={handleKeyDown}
        className="p-3 bg-surface-container rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
        {...props}
      />
    </div>
  );
}