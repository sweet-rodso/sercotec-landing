import { useEffect, useState } from 'react';

// Navegación principal: colapsa a menú hamburguesa en móvil, cierra al
// seleccionar un enlace o al presionar Escape, y marca aria-expanded para
// tecnología asistiva (tarea 6 — navegación interactiva y centrada en el
// usuario; CE3/CE7 accesibilidad).
const LINKS = [
  { href: '#servicios', label: 'Servicios' },
  { href: '#nosotros', label: 'Nosotros' },
  { href: '#testimonios', label: 'Testimonios' },
  { href: '#preguntas-frecuentes', label: 'Preguntas frecuentes' },
  { href: '#contacto', label: 'Contáctanos' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <a href="#contenido-principal" className="skip-link">Saltar al contenido</a>
      <div className="navbar__inner">
        <a href="#inicio" className="navbar__brand" aria-label="Centro de Negocios Santiago SERCOTEC, ir al inicio">
          <img src="/img/logo.svg" alt="" width="180" height="40" />
        </a>

        <button
          type="button"
          className="navbar__toggle"
          aria-expanded={open}
          aria-controls="navbar-menu"
          aria-label={open ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
          onClick={() => setOpen((v) => !v)}
        >
          <span aria-hidden="true">{open ? '✕' : '☰'}</span>
        </button>

        <nav id="navbar-menu" className={`navbar__menu ${open ? 'navbar__menu--open' : ''}`} aria-label="Navegación principal">
          <ul>
            {LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} onClick={() => setOpen(false)}>{link.label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
