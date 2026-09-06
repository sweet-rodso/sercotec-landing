import { Suspense, lazy } from 'react';
import { ContactProvider } from './context/ContactContext.jsx';
import { Navbar } from './components/layout/Navbar.jsx';
import { Footer } from './components/layout/Footer.jsx';
import { Hero } from './components/hero/Hero.jsx';
import { ServicesSection } from './components/services/ServicesSection.jsx';
import { LoadingState } from './components/common/AsyncState.jsx';

// Code-splitting (tarea 7 / CE8 optimización): las secciones bajo el pliegue
// (Testimonios, Nosotros, FAQ, Contacto) no son necesarias para el primer
// pintado de la página. React.lazy + Suspense las separa en chunks propios
// que el navegador descarga en paralelo mientras el usuario ve el Hero y
// Servicios, en vez de bloquear la carga inicial con JS que aún no se usa.
// El resultado (tamaño de bundle antes/después) se documenta en README.md.
const TestimonialsSection = lazy(() =>
  import('./components/testimonials/TestimonialsSection.jsx').then((m) => ({ default: m.TestimonialsSection }))
);
const AboutSection = lazy(() =>
  import('./components/about/AboutSection.jsx').then((m) => ({ default: m.AboutSection }))
);
const FaqSection = lazy(() =>
  import('./components/faq/FaqSection.jsx').then((m) => ({ default: m.FaqSection }))
);
const ContactForm = lazy(() =>
  import('./components/contact/ContactForm.jsx').then((m) => ({ default: m.ContactForm }))
);

function App() {
  return (
    <ContactProvider>
      <Navbar />
      <main id="contenido-principal">
        <Hero />
        <ServicesSection />
        <Suspense fallback={<LoadingState label="Cargando testimonios…" />}>
          <TestimonialsSection />
        </Suspense>
        <Suspense fallback={<LoadingState label="Cargando información institucional…" />}>
          <AboutSection />
        </Suspense>
        <Suspense fallback={<LoadingState label="Cargando preguntas frecuentes…" />}>
          <FaqSection />
        </Suspense>
        <Suspense fallback={<LoadingState label="Cargando formulario de contacto…" />}>
          <ContactForm />
        </Suspense>
      </main>
      {/* El Footer usa valores de contacto por defecto (ver Footer.jsx) para
          no duplicar el fetch de /api/about que ya hace AboutSection —
          mantiene al Footer simple y sin estado propio. */}
      <Footer about={null} />
    </ContactProvider>
  );
}

export default App;
