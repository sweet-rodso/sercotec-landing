import { Swiper, SwiperSlide } from 'swiper/react';
import { Keyboard, A11y, Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Carrusel de testimonios (tarea 2). Se construye sobre Swiper —componente
// externo del framework (React) usado para la parte visual/de interacción,
// tal como pide la tarea 8— en vez de programar el slider a mano, lo que
// reduce código propio que mantener y aporta accesibilidad ya resuelta por
// la librería (roles ARIA, soporte de teclado) que reforzamos con los
// módulos Keyboard y A11y.
//
// Responsive: 1 testimonio visible en móvil, 2 en tablet, 3 en escritorio.
// Autoplay se pausa al enfocar/interactuar (comportamiento por defecto de
// Swiper con A11y) para no mover contenido bajo un lector de pantalla.
export function TestimonialCarousel({ testimonios }) {
  return (
    <Swiper
      modules={[Keyboard, A11y, Autoplay, Navigation, Pagination]}
      keyboard={{ enabled: true }}
      a11y={{
        prevSlideMessage: 'Testimonio anterior',
        nextSlideMessage: 'Siguiente testimonio',
        paginationBulletMessage: 'Ir al testimonio {{index}}',
      }}
      autoplay={{ delay: 6000, disableOnInteraction: true, pauseOnMouseEnter: true }}
      navigation
      pagination={{ clickable: true }}
      spaceBetween={24}
      slidesPerView={1}
      breakpoints={{
        640: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      }}
      aria-label="Testimonios de empresas atendidas"
      role="region"
    >
      {testimonios.map((t) => (
        <SwiperSlide key={t.id}>
          <blockquote className="testimonial-card">
            <img
              src={t.avatar}
              alt=""
              width="160"
              height="160"
              loading="lazy"
              className="testimonial-card__avatar"
            />
            <p className="testimonial-card__quote">“{t.testimonio}”</p>
            <footer>
              <span className="testimonial-card__name">{t.nombre}</span>
              <span className="testimonial-card__role">{t.cargo ? `${t.cargo}, ` : ''}{t.empresa}</span>
              <span className="testimonial-card__rating" aria-label={`Calificación: ${t.calificacion} de 5 estrellas`}>
                {'★'.repeat(t.calificacion)}{'☆'.repeat(5 - t.calificacion)}
              </span>
            </footer>
          </blockquote>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
