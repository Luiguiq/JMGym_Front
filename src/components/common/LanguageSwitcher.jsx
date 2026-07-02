import { Languages } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

function LanguageSwitcher({ compact }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function switchLang(code) {
    const el = document.querySelector('.goog-te-combo');
    if (el) {
      el.value = code;
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }
    setOpen(false);
  }

  if (compact) {
    return (
      <div className="relative" ref={ref}>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1 rounded-full border border-primary-foreground/20 px-3 py-1.5 text-xs font-bold uppercase text-primary-foreground/80 transition hover:border-primary-foreground/40 hover:text-primary-foreground"
          aria-label="Cambiar idioma"
        >
          <Languages size={14} />
          <span>ES</span>
        </button>
        {open && (
          <div className="absolute right-0 top-full mt-1 min-w-[80px] overflow-hidden rounded-xl border border-primary-foreground/10 bg-[#111418] shadow-xl">
            <button type="button" onClick={() => switchLang('es')} className="block w-full px-3 py-2 text-left text-xs font-bold uppercase text-primary-foreground/60 transition hover:bg-primary-foreground/10">Español</button>
            <button type="button" onClick={() => switchLang('en')} className="block w-full px-3 py-2 text-left text-xs font-bold uppercase text-primary-foreground/60 transition hover:bg-primary-foreground/10">English</button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-secondary transition hover:bg-border-light"
        aria-label="Cambiar idioma"
      >
        <Languages size={16} />
        <span className="uppercase">ES</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 min-w-[120px] overflow-hidden rounded-lg border border-border bg-card shadow-lg">
          <button type="button" onClick={() => switchLang('es')} className="block w-full px-4 py-2 text-left text-sm font-medium text-secondary transition hover:bg-surface">Español</button>
          <button type="button" onClick={() => switchLang('en')} className="block w-full px-4 py-2 text-left text-sm font-medium text-secondary transition hover:bg-surface">English</button>
        </div>
      )}
    </div>
  );
}

export default LanguageSwitcher;
