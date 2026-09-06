// Contexto compartido entre ServiceCard y ContactForm. Cuando el usuario
// hace clic en "Contáctanos" desde una tarjeta de servicio, aquí se guarda
// el servicio elegido y se hace scroll al formulario, que lee este valor
// para pre-rellenar su campo "servicio" (tarea 1 del enunciado).
// Usar Context en vez de prop-drilling: ServiceCard vive dentro de la grilla
// de Servicios y ContactForm en otra sección; no tiene sentido pasar la
// función por 3-4 niveles de props intermedios.
import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const ContactContext = createContext(null);

// PROBLEMA TÉCNICO RESUELTO (documentado en README > "Problema técnico"):
// ContactForm se carga con React.lazy (code-splitting, ver App.jsx) para
// optimizar el tiempo de carga inicial. Esto significa que el elemento
// <section id="contacto"> puede NO existir todavía en el DOM en el instante
// exacto en que el usuario hace clic en "Contáctanos" (si su chunk JS aún
// no terminó de descargarse/montarse, p. ej. en una conexión lenta).
// Buscar el elemento una sola vez con document.getElementById fallaba
// silenciosamente en ese caso. La solución es un reintento acotado (polling
// corto) que espera a que el nodo aparezca sin bloquear la interacción ni
// eliminar la optimización de carga diferida.
function scrollToContactWhenReady(intentosRestantes = 20) {
  const formulario = document.getElementById('contacto');
  if (formulario) {
    formulario.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.setTimeout(() => {
      document.getElementById('contacto-nombre')?.focus();
    }, 450);
    return;
  }
  if (intentosRestantes <= 0) return; // se rinde con gracia: el valor ya quedó guardado en el contexto
  window.setTimeout(() => scrollToContactWhenReady(intentosRestantes - 1), 100);
}

export function ContactProvider({ children }) {
  const [servicioSeleccionado, setServicioSeleccionado] = useState('');

  const solicitarContacto = useCallback((tituloServicio) => {
    setServicioSeleccionado(tituloServicio);
    scrollToContactWhenReady();
  }, []);

  const value = useMemo(
    () => ({ servicioSeleccionado, solicitarContacto, limpiarServicio: () => setServicioSeleccionado('') }),
    [servicioSeleccionado, solicitarContacto]
  );

  return <ContactContext.Provider value={value}>{children}</ContactContext.Provider>;
}

export function useContact() {
  const ctx = useContext(ContactContext);
  if (!ctx) throw new Error('useContact debe usarse dentro de <ContactProvider>');
  return ctx;
}
