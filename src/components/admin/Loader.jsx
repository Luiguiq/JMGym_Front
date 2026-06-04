const Loader = ({ size = 'md', text = 'Cargando...' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className={`${sizeClasses[size]} border-4 border-slate-200 border-t-brand-500 rounded-full animate-spin`} />
      {text && <p className="text-slate-600 text-sm font-medium">{text}</p>}
    </div>
  );
};

export default Loader;
