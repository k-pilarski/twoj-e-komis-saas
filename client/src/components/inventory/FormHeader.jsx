import { useNavigate } from 'react-router-dom';

export default function FormHeader({ title, description, backUrl }) {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center gap-4 mb-8">
      <button 
        onClick={() => navigate(backUrl)}
        className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container-low rounded-lg transition-colors tooltip"
        title="Wróć"
      >
        <span className="material-symbols-outlined">arrow_back</span>
      </button>
      <div>
        <h2 className="text-2xl font-bold text-primary">{title}</h2>
        <p className="text-on-surface-variant text-sm mt-1">{description}</p>
      </div>
    </div>
  );
}