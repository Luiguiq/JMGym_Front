import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, HelpCircle, ChevronDown, ChevronRight, BookOpen, MessageCircle, Phone, Mail, Clock, MapPin } from 'lucide-react';

const FAQS = [
  {
    question: '¿Cómo reservar una clase?',
    answer: 'Ve a "Clases" desde el menú principal, selecciona la clase que te interese, elige tu espacio disponible y confirma la reserva. Recibirás un código QR de check-in.',
  },
  {
    question: '¿Cómo cancelar una reserva?',
    answer: 'Ingresa a "Mis reservas", selecciona la reserva que deseas cancelar y presiona el botón "Cancelar". Revisa nuestra política de cancelación para conocer plazos y condiciones.',
  },
  {
    question: '¿Cómo funcionan los pagos?',
    answer: 'Puedes pagar con YAPE o en efectivo. Al reservar, selecciona tu método de pago. Los pagos con YAPE se confirman automáticamente; en efectivo deberás pagar en recepción antes de la clase.',
  },
  {
    question: '¿Cómo cambio mi contraseña?',
    answer: 'Ve a "Perfil" > "Configuraciones" > "Cambiar contraseña". Ingresa tu contraseña actual y la nueva. Debe tener al menos 6 caracteres.',
  },
  {
    question: '¿Cuáles son los horarios del gym?',
    answer: 'Nuestro horario es de lunes a viernes de 6:00 a.m. a 10:00 p.m., y sábados de 8:00 a.m. a 8:00 p.m. Los domingos permanecemos cerrados.',
  },
  {
    question: '¿Cómo actualizar mis datos personales?',
    answer: 'Ve a "Perfil" > "Editar perfil". Desde allí puedes cambiar tu nombre, correo, DNI, teléfono y foto de perfil.',
  },
  {
    question: '¿Qué hago si no puedo asistir a una clase reservada?',
    answer: 'Cancela tu reserva desde la sección "Mis reservas" con al menos 2 horas de anticipación para evitar cargos.',
  },
  {
    question: '¿Cómo contactar con soporte?',
    answer: 'Puedes escribirnos al correo soporte@jmgym.pe, llamarnos al (01) 555-1234, o visitarnos en Av. Principal 123, Lima.',
  },
  {
    question: '¿Puedo reservar para otra persona?',
    answer: 'Actualmente las reservas son personales y están vinculadas a tu cuenta. Cada persona debe tener su propio registro.',
  },
  {
    question: '¿Cómo veo mi historial de pagos?',
    answer: 'Ve a "Perfil" > "Historial de pagos". Allí encontrarás todos tus pagos realizados, su estado y los detalles de cada uno.',
  },
];

function AyudaSoporte() {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(null);

  function toggleFaq(index) {
    setOpenIndex(openIndex === index ? null : index);
  }

  return (
    <main className="min-h-screen bg-surface pb-20">
      <section className="mx-auto max-w-2xl px-4 pt-8 sm:px-6 sm:pt-12">
        <div className="mb-6 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="grid h-11 w-11 place-items-center rounded-xl bg-card text-secondary shadow-[0_4px_12px_rgba(33,45,58,0.08)] transition hover:bg-border-light"
          >
            <ArrowLeft size={22} />
          </button>
          <div>
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">Ayuda y soporte</h2>
            <p className="mt-1 text-secondary">Respuestas a tus preguntas frecuentes</p>
          </div>
        </div>

        <div className="mb-6 overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-brand-700 px-5 py-6 text-primary-foreground shadow-lg">
          <div className="flex items-center gap-3">
            <HelpCircle size={28} />
            <div>
              <h3 className="text-lg font-black">¿Necesitas ayuda?</h3>
              <p className="mt-0.5 text-sm text-primary-foreground/80">Encuentra respuestas rápidas aquí abajo</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="overflow-hidden rounded-2xl bg-card shadow-[0_4px_12px_rgba(33,45,58,0.06)] transition"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="flex w-full items-center gap-3 px-5 py-4 text-left transition hover:bg-border-light"
                >
                  <BookOpen size={18} className="shrink-0 text-brand-500" />
                  <span className="flex-1 text-sm font-bold text-foreground">{faq.question}</span>
                  {isOpen ? (
                    <ChevronDown size={18} className="shrink-0 text-muted" />
                  ) : (
                    <ChevronRight size={18} className="shrink-0 text-muted" />
                  )}
                </button>
                {isOpen && (
                  <div className="border-t border-border-light px-5 py-4">
                    <p className="text-sm leading-relaxed text-muted">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 overflow-hidden rounded-3xl bg-card shadow-[0_14px_32px_rgba(33,45,58,0.1)]">
          <div className="border-b border-border-light px-5 py-4">
            <h3 className="flex items-center gap-2 font-bold text-foreground">
              <MessageCircle size={18} className="text-brand-600" />
              Contacto directo
            </h3>
          </div>
          <div className="divide-y divide-border-light">
            <a href="mailto:soporte@jmgym.pe" className="flex items-center gap-3 px-5 py-4 text-sm font-semibold text-foreground transition hover:bg-border-light">
              <Mail size={18} className="text-muted" />
              soporte@jmgym.pe
            </a>
            <a href="tel:+51015551234" className="flex items-center gap-3 px-5 py-4 text-sm font-semibold text-foreground transition hover:bg-border-light">
              <Phone size={18} className="text-muted" />
              (01) 555-1234
            </a>
            <div className="flex items-center gap-3 px-5 py-4 text-sm font-semibold text-foreground">
              <MapPin size={18} className="text-muted" />
              Av. Principal 123, Lima
            </div>
            <div className="flex items-center gap-3 px-5 py-4 text-sm font-semibold text-foreground">
              <Clock size={18} className="text-muted" />
              Lun - Sáb: 6:00 a.m. - 8:00 p.m.
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default AyudaSoporte;
