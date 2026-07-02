import { useAccessibility } from '../../context/AccessibilityContext.jsx';

function TextSizeSetting() {
  const { textSizeLevel, cycleTextSizeLevel, maxTextSizeLevel } = useAccessibility();

  return (
    <div className="mb-5 overflow-hidden rounded-3xl bg-card shadow-[0_14px_32px_rgba(33,45,58,0.1)] dark:bg-card dark:shadow-[0_14px_32px_rgba(0,0,0,0.3)]">
      <div className="flex items-center gap-3 border-b border-border-light px-5 py-4 dark:border-border">
        <span className="grid h-5 w-5 place-items-center text-sm font-black leading-none text-brand-600">Tt</span>
        <h3 className="font-bold text-foreground dark:text-foreground">Tamaño de texto</h3>
      </div>
      <div className="flex items-center justify-between gap-4 px-5 py-4">
        <div className="min-w-0">
          <p className="text-sm font-bold text-foreground dark:text-foreground">Nivel {textSizeLevel}</p>
          <p className="text-xs text-muted dark:text-muted-foreground">Aumenta el tamaño de los textos de la aplicación</p>
          <div className="mt-3 flex gap-1.5" aria-hidden="true">
            {Array.from({ length: maxTextSizeLevel }, (_, index) => (
              <span
                key={index}
                className={`h-1.5 w-8 rounded-full ${index < textSizeLevel ? 'bg-brand-600' : 'bg-border dark:bg-border'}`}
              />
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={cycleTextSizeLevel}
          className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-50 text-xl font-black text-brand-700 transition hover:bg-brand-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 dark:bg-surface dark:text-brand-400 dark:hover:bg-border"
          aria-label={`Cambiar tamaño de texto. Nivel actual ${textSizeLevel} de ${maxTextSizeLevel}`}
        >
          Tt
        </button>
      </div>
    </div>
  );
}

export default TextSizeSetting;
