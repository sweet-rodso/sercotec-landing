import { memo } from 'react';
import { useContact } from '../../context/ContactContext.jsx';

// Componente reutilizable (tarea 1): imagen, título, descripción y botón
// "Contáctanos" que pre-rellena el campo "servicio" del formulario de
// contacto. Se usa tanto en la grilla de Servicios como, potencialmente, en
// cualquier otra sección que necesite promocionar un servicio puntual —
// de ahí que reciba sus datos por props en vez de hacer fetch propio
// (responsabilidad única: solo presenta, no obtiene datos).
//
// React.memo evita re-renderizar cada tarjeta cuando cambia el estado de
// otra parte de la página (p. ej. al escribir en el formulario de contacto),
// ya que sus props no cambian entre renders (CE8 — optimización de
// renderizados innecesarios).
function ServiceCardBase({ servicio }) {
  const { solicitarContacto } = useContact();

  return (
    <article className="service-card">
      <img
        src={servicio.imagen}
        alt=""
        width="640"
        height="400"
        loading="lazy"
        className="service-card__image"
      />
      <div className="service-card__body">
        <p className="service-card__category">{servicio.categoria}</p>
        <h3 className="service-card__title">{servicio.titulo}</h3>
        <p className="service-card__description">{servicio.descripcion}</p>
        <button
          type="button"
          className="btn btn--primary btn--small"
          onClick={() => solicitarContacto(servicio.titulo)}
        >
          Contáctanos
          <span className="sr-only"> sobre {servicio.titulo}</span>
        </button>
      </div>
    </article>
  );
}

export const ServiceCard = memo(ServiceCardBase);
