import { useEffect, useRef, useState } from 'react';
import { api, ApiError } from '../../api/client.js';
import { useContact } from '../../context/ContactContext.jsx';
import { StatusMessage } from '../common/StatusMessage.jsx';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MENSAJE_MAX = 1000;
const SERVICIOS_FALLBACK = [
  'Acompañamiento Preventivo',
  'Acompañamiento Correctivo',
  'Gestión y Administración',
  'Innovación y Procesos',
  'Eficiencia y Sostenibilidad',
  'Vinculación Empresarial',
];

// Validación del lado del cliente: da retroalimentación inmediata sin
// esperar al servidor. El backend repite EXACTAMENTE las mismas reglas
// (ver backend/src/utils/validate.js) porque nunca hay que confiar solo en
// lo que valida el navegador (tarea 10 — seguridad, validación cliente Y
// servidor).
function validar(values) {
  const errors = {};
  if (!values.nombre.trim()) errors.nombre = 'El nombre es requerido.';
  else if (values.nombre.trim().length > 100) errors.nombre = 'Máximo 100 caracteres.';

  if (!values.correo.trim()) errors.correo = 'El correo es requerido.';
  else if (!EMAIL_RE.test(values.correo.trim())) errors.correo = 'Ingresa un correo electrónico válido.';

  if (!values.servicio) errors.servicio = 'Selecciona un servicio de interés.';

  if (!values.mensaje.trim()) errors.mensaje = 'El mensaje es requerido.';
  else if (values.mensaje.length > MENSAJE_MAX) errors.mensaje = `Máximo ${MENSAJE_MAX} caracteres.`;

  return errors;
}

export function ContactForm() {
  const { servicioSeleccionado, limpiarServicio } = useContact();
  const [values, setValues] = useState({ nombre: '', correo: '', empresa: '', servicio: '', mensaje: '', honeypot: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitState, setSubmitState] = useState('idle'); // idle | sending | success | error
  const [submitMessage, setSubmitMessage] = useState('');
  const [servicioPrellenado, setServicioPrellenado] = useState(false);
  const liveRegionRef = useRef(null);

  // Cuando el usuario hace clic en "Contáctanos" desde una tarjeta de
  // servicio, el contexto entrega el título elegido y lo reflejamos aquí.
  useEffect(() => {
    if (servicioSeleccionado) {
      setValues((prev) => ({ ...prev, servicio: servicioSeleccionado }));
      // Mejora de usabilidad (hallazgo de prueba con usuario externo, ver
      // README > "Accesibilidad y usabilidad"): la persona no entendía por
      // qué el campo "servicio" ya aparecía lleno al llegar desde una
      // tarjeta. Se agrega un aviso visible y se retira solo si la persona
      // cambia el valor manualmente.
      setServicioPrellenado(true);
    }
  }, [servicioSeleccionado]);

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (name === 'servicio') setServicioPrellenado(false);
  }

  function handleBlur(e) {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors(validar({ ...values }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validation = validar(values);
    setErrors(validation);
    setTouched({ nombre: true, correo: true, servicio: true, mensaje: true });

    if (Object.keys(validation).length > 0) {
      setSubmitState('error');
      setSubmitMessage('Revisa los campos marcados antes de continuar.');
      return;
    }

    setSubmitState('sending');
    try {
      await api.sendContact(values);
      setSubmitState('success');
      setSubmitMessage('¡Mensaje enviado! Te contactaremos a la brevedad.');
      setValues({ nombre: '', correo: '', empresa: '', servicio: '', mensaje: '', honeypot: '' });
      setTouched({});
      setServicioPrellenado(false);
      limpiarServicio();
    } catch (err) {
      setSubmitState('error');
      if (err instanceof ApiError && err.status === 429) {
        setSubmitMessage('Enviaste varios mensajes en poco tiempo. Intenta nuevamente en unos minutos.');
      } else if (err instanceof ApiError && err.status === 422) {
        setSubmitMessage('El servidor rechazó algunos datos. Revisa el formulario e intenta de nuevo.');
      } else {
        setSubmitMessage('No pudimos enviar tu mensaje. Intenta nuevamente más tarde.');
      }
    }
  }

  const showError = (field) => touched[field] && errors[field];

  return (
    <section id="contacto" className="section section--alt" aria-labelledby="contacto-titulo">
      <div className="section__inner section__inner--narrow">
        <h2 id="contacto-titulo">Contáctanos</h2>
        <p className="section__lead">
          Cuéntanos sobre tu negocio y el equipo del Centro se pondrá en contacto contigo.
        </p>

        <form noValidate onSubmit={handleSubmit} className="contact-form">
          <div className="form-field">
            <label htmlFor="contacto-nombre">Nombre completo *</label>
            <input
              id="contacto-nombre"
              name="nombre"
              type="text"
              autoComplete="name"
              required
              aria-required="true"
              aria-invalid={Boolean(showError('nombre'))}
              aria-describedby={showError('nombre') ? 'error-nombre' : undefined}
              value={values.nombre}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {showError('nombre') && <p id="error-nombre" className="field-error">{errors.nombre}</p>}
          </div>

          <div className="form-field">
            <label htmlFor="contacto-correo">Correo electrónico *</label>
            <input
              id="contacto-correo"
              name="correo"
              type="email"
              autoComplete="email"
              required
              aria-required="true"
              aria-invalid={Boolean(showError('correo'))}
              aria-describedby={showError('correo') ? 'error-correo' : undefined}
              value={values.correo}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {showError('correo') && <p id="error-correo" className="field-error">{errors.correo}</p>}
          </div>

          <div className="form-field">
            <label htmlFor="contacto-empresa">Empresa (opcional)</label>
            <input
              id="contacto-empresa"
              name="empresa"
              type="text"
              autoComplete="organization"
              value={values.empresa}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label htmlFor="contacto-servicio">Servicio de interés *</label>
            <select
              id="contacto-servicio"
              name="servicio"
              required
              aria-required="true"
              aria-invalid={Boolean(showError('servicio'))}
              aria-describedby={showError('servicio') ? 'error-servicio' : undefined}
              value={values.servicio}
              onChange={handleChange}
              onBlur={handleBlur}
            >
              <option value="">-- Selecciona una opción --</option>
              {SERVICIOS_FALLBACK.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            {showError('servicio') && <p id="error-servicio" className="field-error">{errors.servicio}</p>}
            {servicioPrellenado && !showError('servicio') && (
              <p className="field-hint field-hint--info" role="status">
                Preseleccionamos este servicio porque lo elegiste desde "Contáctanos". Puedes cambiarlo si quieres.
              </p>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="contacto-mensaje">Mensaje *</label>
            <textarea
              id="contacto-mensaje"
              name="mensaje"
              rows={4}
              maxLength={MENSAJE_MAX}
              required
              aria-required="true"
              aria-invalid={Boolean(showError('mensaje'))}
              aria-describedby={`${showError('mensaje') ? 'error-mensaje ' : ''}contador-mensaje`}
              value={values.mensaje}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <p id="contador-mensaje" className="field-hint">{values.mensaje.length} / {MENSAJE_MAX}</p>
            {showError('mensaje') && <p id="error-mensaje" className="field-error">{errors.mensaje}</p>}
          </div>

          {/* Honeypot: campo invisible para personas, oculto con CSS (no con
              type="hidden", que algunos bots detectan y evitan). Si llega
              relleno, el backend lo trata como spam sin avisar al bot. */}
          <div className="form-field form-field--honeypot" aria-hidden="true">
            <label htmlFor="contacto-web">Sitio web (dejar en blanco)</label>
            <input
              id="contacto-web"
              name="honeypot"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={values.honeypot}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn btn--primary" disabled={submitState === 'sending'}>
            {submitState === 'sending' ? 'Enviando…' : 'Enviar mensaje'}
          </button>

          <div ref={liveRegionRef}>
            {(submitState === 'success' || submitState === 'error') && (
              <StatusMessage type={submitState === 'success' ? 'success' : 'error'}>
                {submitMessage}
              </StatusMessage>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
