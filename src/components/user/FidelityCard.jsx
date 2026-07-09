import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Gift, Percent, Package, Trophy, Sparkles, ChevronDown, Clock, Plus, Users } from 'lucide-react';
import { fidelizacionService } from '../../services/fidelizacionService.js';

const ICONOS = { Gift, Percent, Users, Package, Trophy, Award };

const BADGE_NIVEL = {
  BRONCE: { bg: 'bg-amber-50 dark:bg-amber-500/10', text: 'text-amber-700 dark:text-amber-300', emoji: '🥉', bar: 'bg-amber-500' },
  PLATA: { bg: 'bg-slate-100 dark:bg-slate-500/20', text: 'text-slate-600 dark:text-slate-300', emoji: '🥈', bar: 'bg-slate-400' },
  ORO: { bg: 'bg-yellow-50 dark:bg-yellow-500/10', text: 'text-yellow-700 dark:text-yellow-300', emoji: '🥇', bar: 'bg-yellow-500' },
};

const BENEFICIO_COLOR = {
  BRONCE: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',
  PLATA: 'bg-slate-100 text-slate-600 dark:bg-slate-500/20 dark:text-slate-300',
  ORO: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-300',
};

function SkeletonFidelity() {
  return (
    <div className="animate-pulse rounded-2xl bg-card p-4 shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
      <div className="mb-4 flex items-center gap-3">
        <div className="h-5 w-5 rounded bg-border-light" />
        <div className="h-4 w-44 rounded bg-border-light" />
      </div>
      <div className="h-3 w-72 rounded bg-border-light" />
      <div className="mt-5 flex items-center gap-4">
        <div className="h-14 w-14 rounded-2xl bg-border-light" />
        <div className="space-y-2">
          <div className="h-5 w-28 rounded bg-border-light" />
          <div className="h-3 w-40 rounded bg-border-light" />
        </div>
      </div>
      <div className="mt-5 h-2 rounded-full bg-border-light" />
      <div className="mt-1 h-3 w-52 rounded bg-border-light" />
    </div>
  );
}

export default function FidelityCard({ horas, loading, horasBono = 0, clasesGratisRestantes = 0 }) {
  const [beneficiosAbierto, setBeneficiosAbierto] = useState(false);

  if (loading) return <SkeletonFidelity />;

  const nivel = fidelizacionService.obtenerNivel(horas);
  const progreso = fidelizacionService.obtenerProgreso(horas, nivel);
  const badge = BADGE_NIVEL[nivel.nivel];
  const beneficios = fidelizacionService.obtenerBeneficios(nivel);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="rounded-2xl bg-card p-4 shadow-[0_4px_16px_rgba(0,0,0,0.06)] sm:p-5"
    >
      <div className="flex items-start gap-3">
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${badge.bg}`}>
          <Award size={20} className={badge.text} />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold text-foreground">Programa de Beneficios</h3>
          <p className="mt-0.5 text-[13px] leading-relaxed text-muted">
            Acumula horas de entrenamiento durante el mes y desbloquea beneficios exclusivos.
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <div className="relative shrink-0">
          <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${badge.bg} text-2xl shadow-sm`}>
            {nivel.emoji}
          </div>
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-base font-black text-foreground">Nivel {nivel.nombre}</p>
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${badge.bg} ${badge.text}`}>
              {nivel.emoji} {nivel.nombre}
            </span>
          </div>
          <p className="mt-0.5 flex items-center gap-1 text-[13px] text-muted-foreground">
            <Clock size={13} />
            {Math.round(horas)} horas acumuladas este mes
            {horasBono > 0 && (
              <span className="ml-1 inline-flex items-center gap-0.5 rounded-full bg-green-50 px-1.5 py-0.5 text-[10px] font-semibold text-green-700 dark:bg-green-500/10 dark:text-green-300">
                <Plus size={10} />{horasBono}h bono
              </span>
            )}
          </p>
          {clasesGratisRestantes > 0 && nivel.nivel === 'ORO' && (
            <p className="mt-0.5 text-[11px] font-semibold text-yellow-600 dark:text-yellow-400">
              {clasesGratisRestantes}/2 clases gratis restantes este mes
            </p>
          )}
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-1.5 flex items-center justify-between text-[12px]">
          <span className="font-semibold text-muted-foreground">
            {Math.round(horas)}h {progreso.siguiente ? `/ ${progreso.siguiente.minHoras}h` : ''}
          </span>
          {progreso.siguiente && (
            <span className="font-bold text-muted-foreground">
              {nivel.emoji} → {progreso.siguiente.emoji}
            </span>
          )}
          {!progreso.siguiente && (
            <span className="flex items-center gap-1 font-bold text-yellow-600">
              <Sparkles size={13} />
              Max
            </span>
          )}
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-border-light">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progreso.porcentaje}%` }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
            className={`h-full rounded-full ${badge.bar}`}
          />
        </div>
        <p className="mt-1.5 text-[12px] font-semibold text-secondary">
          {progreso.mensaje}
        </p>
      </div>

      <div className="mt-4 border-t border-border-light pt-3">
        <button
          onClick={() => setBeneficiosAbierto(!beneficiosAbierto)}
          className="flex w-full items-center justify-between"
        >
          <span className="flex items-center gap-1.5 text-[13px] font-bold text-foreground">
            <Gift size={14} className="text-muted" />
            Beneficios {nivel.nombre}
          </span>
          <motion.span
            animate={{ rotate: beneficiosAbierto ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={16} className="text-muted-foreground" />
          </motion.span>
        </button>
        <AnimatePresence initial={false}>
          {beneficiosAbierto && (
            <motion.div
              key="beneficios"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="mt-3 space-y-1.5">
                {beneficios.length === 0 && (
                  <p className="text-[12px] text-muted-foreground">Sin beneficios disponibles para este nivel.</p>
                )}
                {beneficios.map((b, i) => {
                  const Icono = ICONOS[b.icono] || Gift;
                  return (
                    <div key={i} className="flex items-start gap-3 rounded-xl bg-surface px-3 py-2.5">
                      <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${BENEFICIO_COLOR[nivel.nivel]}`}>
                        <Icono size={13} />
                      </span>
                      <p className="text-[12px] leading-relaxed text-secondary">{b.texto}</p>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}