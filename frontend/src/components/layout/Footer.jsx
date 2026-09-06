export function Footer({ about }) {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__col">
          <img src="/img/logo.svg" alt="Centro de Negocios Santiago SERCOTEC" width="180" height="40" />
          <p>{about?.direccion || 'Manuel Rodríguez Sur 749, Santiago (Metro Toesca).'}</p>
          <p>
            <a href={`mailto:${about?.correo || 'centro.santiago@centrossercotec.cl'}`}>
              {about?.correo || 'centro.santiago@centrossercotec.cl'}
            </a>
          </p>
        </div>
        <nav className="footer__col" aria-label="Enlaces del sitio">
          <h2>Navegación</h2>
          <ul>
            <li><a href="#servicios">Servicios</a></li>
            <li><a href="#nosotros">Nosotros</a></li>
            <li><a href="#testimonios">Testimonios</a></li>
            <li><a href="#preguntas-frecuentes">Preguntas frecuentes</a></li>
            <li><a href="#contacto">Contáctanos</a></li>
          </ul>
        </nav>
        <div className="footer__col">
          <h2>Fuente</h2>
          <p>
            Contenido basado en el{' '}
            <a href={about?.sitioOriginal || '#'} target="_blank" rel="noreferrer">
              sitio oficial del Centro de Negocios Santiago
            </a>.
          </p>
        </div>
      </div>
      <p className="footer__copy">© {year} Centro de Negocios Santiago · SERCOTEC. Proyecto académico — Instituto Profesional San Sebastián.</p>
    </footer>
  );
}
