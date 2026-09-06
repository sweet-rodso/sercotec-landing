// La imagen del hero es la única "above the fold": se carga con
// loading="eager" y fetchpriority="high" (a diferencia del resto de
// imágenes del sitio, que usan loading="lazy") — optimización de
// rendimiento documentada en el README (tarea 7).
export function Hero() {
  return (
    <section id="inicio" className="hero">
      <div className="hero__content">
        <p className="hero__eyebrow">SERCOTEC · Centro de Negocios Santiago</p>
        <h1>Impulsamos el crecimiento de tu empresa, paso a paso</h1>
        <p className="hero__lead">
          Acompañamiento gratuito en gestión, innovación y sostenibilidad para micro,
          pequeñas y medianas empresas de Santiago.
        </p>
        <div className="hero__actions">
          <a className="btn btn--primary" href="#servicios">Ver servicios</a>
          <a className="btn btn--ghost" href="#contacto">Contáctanos</a>
        </div>
      </div>
      <div className="hero__media">
        <img
          src="/img/hero.jpg"
          alt="Equipo del Centro de Negocios Santiago asesorando a una empresa"
          width="1280"
          height="800"
          loading="eager"
          fetchpriority="high"
        />
      </div>
    </section>
  );
}
