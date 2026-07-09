import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import trenSuperiorImage from '../../assets/images/trensuperior.jpg';
import cardioImage from '../../assets/images/cardio.jpg';
import zumbaImage from '../../assets/images/zumba.jpg';
import heroBg from '../../assets/images/jmworkoutparatras.jpg';
import sedeBg from '../../assets/images/jmworkoutport2.jpg';

const gallery = [
  { src: trenSuperiorImage, alt: 'Entrenamiento de fuerza' },
  { src: cardioImage, alt: 'Cardio' },
  { src: zumbaImage, alt: 'Zumba' },
  { src: heroBg, alt: 'Entrenamiento funcional' },
  { src: sedeBg, alt: 'Instalaciones JMGym' },
];

function Galeria() {
  return (
    <section className="relative overflow-hidden px-5 py-20 lg:px-8">
      <div className="absolute inset-0 bg-[#07111f]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,211,238,.08),transparent_30%)]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="inline-flex rounded-full border border-cyan-200/30 bg-primary-foreground/8 px-5 py-2 text-xs font-black uppercase tracking-[0.28em] text-cyan-100">
            Galeria
          </span>
          <h2 className="mt-4 text-4xl font-black tracking-[-0.04em] text-primary-foreground sm:text-6xl sm:mt-6 lg:text-6xl">
            Conoce nuestras instalaciones
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10"
        >
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={16}
            slidesPerView={1}
            pagination={{ clickable: true, dynamicBullets: true }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="rounded-[32px]"
          >
            {gallery.map((img, i) => (
              <SwiperSlide key={i} className="overflow-hidden rounded-[24px]">
                <div className="group relative h-80 w-full overflow-hidden rounded-[24px]">
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition group-hover:opacity-100" />
                  <p className="absolute bottom-4 left-4 text-lg font-bold text-white opacity-0 transition group-hover:opacity-100">
                    {img.alt}
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </section>
  );
}

export default Galeria;
