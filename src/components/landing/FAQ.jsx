import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  { q: '¿Necesito una membresía para reservar clases?', a: 'No, puedes reservar clases individuales sin compromiso. Si entrenas con frecuencia, ofrecemos planes mensuales con descuento.' },
  { q: '¿Puedo reservar desde mi celular?', a: 'Sí, toda la plataforma está optimizada para móviles. Puedes reservar, pagar y gestionar tus clases desde cualquier dispositivo.' },
  { q: '¿Cómo cancelo una reserva?', a: 'Desde tu perfil, en la sección "Mis reservas", puedes cancelar hasta 2 horas antes de la clase. Los reembolsos se procesan según nuestra política.' },
  { q: '¿Qué métodos de pago aceptan?', a: 'Aceptamos Yape, efectivo y próximamente tarjetas de crédito y débito. Todos los pagos son procesados de forma segura.' },
  { q: '¿Puedo cambiar mi reserva a otro horario?', a: 'Actualmente puedes cancelar y reservar de nuevo si hay espacio disponible. Estamos trabajando en un sistema de cambio directo.' },
  { q: '¿Hay instructores para entrenamiento personalizado?', a: 'Sí, contamos con personal trainers disponibles para sesiones个人izadas. Consulta los horarios y precios en nuestra sección de servicios.' },
];

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section id="faq" className="relative overflow-hidden px-5 py-20 lg:px-8">
      <div className="absolute inset-0 bg-[#07111f]" />

      <div className="relative z-10 mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="inline-flex rounded-full border border-cyan-200/30 bg-primary-foreground/8 px-5 py-2 text-xs font-black uppercase tracking-[0.28em] text-cyan-100">
            FAQ
          </span>
          <h2 className="mt-4 text-4xl font-black tracking-[-0.04em] text-primary-foreground sm:text-6xl sm:mt-6">
            Preguntas frecuentes
          </h2>
        </motion.div>

        <div className="mt-12 space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className={`overflow-hidden rounded-[24px] border border-primary-foreground/10 transition-colors ${
                openIndex === i ? 'bg-[#3b82f6]/10 border-primary/30' : 'bg-primary-foreground/5'
              }`}
            >
              <button
                onClick={() => toggle(i)}
                className="flex w-full items-center justify-between px-6 py-5 text-left"
                aria-expanded={openIndex === i}
              >
                <span className="pr-4 text-lg font-bold text-primary-foreground">{faq.q}</span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-cyan-200 transition duration-300 ${
                    openIndex === i ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-primary-foreground/10 px-6 pb-5 pt-4">
                      <p className="leading-7 text-primary-foreground/68">{faq.a}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FAQ;
