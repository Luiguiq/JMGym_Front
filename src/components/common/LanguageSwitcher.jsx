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
          className="flex items-center gap-1 rounded-full border border-white/20 px-3 py-1.5 text-xs font-bold uppercase text-white/80 transition hover:border-white/40 hover:text-white"
          aria-label="Cambiar idioma"
        >
          <Languages size={14} />
          <span>ES</span>
        </button>
        {open && (
          <div className="absolute right-0 top-full mt-1 min-w-[80px] overflow-hidden rounded-xl border border-white/10 bg-[#111418] shadow-xl">
            <button type="button" onClick={() => switchLang('es')} className="block w-full px-3 py-2 text-left text-xs font-bold uppercase text-white/60 transition hover:bg-white/10">Español</button>
            <button type="button" onClick={() => switchLang('en')} className="block w-full px-3 py-2 text-left text-xs font-bold uppercase text-white/60 transition hover:bg-white/10">English</button>
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
        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
        aria-label="Cambiar idioma"
      >
        <Languages size={16} />
        <span className="uppercase">ES</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 min-w-[120px] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
          <button type="button" onClick={() => switchLang('es')} className="block w-full px-4 py-2 text-left text-sm font-medium text-slate-600 transition hover:bg-slate-50">Español</button>
          <button type="button" onClick={() => switchLang('en')} className="block w-full px-4 py-2 text-left text-sm font-medium text-slate-600 transition hover:bg-slate-50">English</button>
        </div>
      )}
    </div>
  );
}

export default LanguageSwitcher;
