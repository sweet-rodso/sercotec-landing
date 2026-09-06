# Landing Centro de Negocios Santiago — SERCOTEC

Rediseño de la landing page del Centro de Negocios Santiago de SERCOTEC.
Proyecto individual — **Evaluación Sumativa Unidad 3, Desarrollo Frontend**
(Instituto Profesional San Sebastián).

**Autor:** Rodrigo Alexis Soto Cifuentes (rodalsoto@gmail.com)

## 1. Descripción del problema y la solución

El sitio original de SERCOTEC presenta la información de sus servicios,
testimonios de clientes y preguntas frecuentes de forma estática, sin un
componente reutilizable para promocionar servicios, sin un mecanismo simple
para que el equipo de contenido actualice esa información, y sin
mecanismos de seguridad o accesibilidad documentados en el formulario de
contacto.

La solución implementada es una landing page en **React** que:

- Reutiliza un componente `ServiceCard` para todos los servicios, cada uno
  con un botón "Contáctanos" que precarga el formulario de contacto.
- Muestra un carrusel de testimonios accesible y responsive.
- Consume una **API/CMS propia** (Node.js + Express) para las secciones
  Servicios, Testimonios, Preguntas frecuentes y Nosotros, administrable por
  el equipo de contenido mediante **Postman**, sin tocar código.
- Incluye un formulario de contacto con validación en cliente y servidor,
  protección anti-bot (honeypot) y limitación de intentos (rate limiting).
- Aplica optimizaciones de rendimiento medibles (compresión de imágenes y
  code-splitting) y fue auditada contra WCAG 2.1 AA.

> Nota sobre la API sugerida en la actividad (Gael Cloud): se evaluó
> `https://api.gael.cloud` como posible fuente de datos para el CMS, pero es
> una API privada de tipo ERP/contable (facturación, boletas, etc.), sin
> endpoints públicos de contenido aplicables a una landing institucional.
> Por eso se optó por un backend propio simple (Node/Express + JSON), que
> cumple igualmente el requisito de "consumo de API" y además permite
> administrar el contenido vía Postman, como pide la pauta.

## 2. Tecnologías utilizadas

| Capa | Tecnología | Uso |
|---|---|---|
| Frontend | React 19 + Vite 8 | SPA, componentes, build y dev server |
| Frontend | Swiper | Carrusel de testimonios (componente externo) |
| Frontend | React Context API | Estado compartido del servicio seleccionado |
| Frontend | oxlint | Linting |
| Backend | Node.js + Express 5 | API REST / CMS |
| Backend | helmet, cors, express-rate-limit | Seguridad HTTP, CORS y anti-abuso |
| Backend | morgan | Logging de requests |
| Backend | dotenv | Variables de entorno |
| Persistencia | Archivos JSON | Sin base de datos externa (alcance de curso) |
| Documentación de API | Postman (colección incluida) | Administración de contenido del CMS |

## 3. Estructura del proyecto

```
sercotec-landing/
├── backend/
│   ├── data/                  # "Base de datos" en JSON (services, testimonials, faq, about, contact-submissions)
│   ├── src/
│   │   ├── middleware/auth.js # Verificación de API key para escrituras
│   │   ├── routes/            # Un router por recurso (services, testimonials, faq, about, contact)
│   │   ├── utils/jsonStore.js # Lectura/escritura segura de los JSON
│   │   ├── utils/validate.js  # Validaciones server-side (espejo de las del cliente)
│   │   ├── app.js             # Configuración de Express (seguridad, rutas, errores)
│   │   └── server.js          # Punto de entrada
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── public/img/            # Imágenes optimizadas
│   ├── src/
│   │   ├── api/client.js      # Cliente HTTP hacia el backend
│   │   ├── hooks/useFetch.js  # Hook reutilizable para consumir la API
│   │   ├── context/ContactContext.jsx # Estado del servicio seleccionado + scroll al formulario
│   │   ├── components/
│   │   │   ├── layout/        # Navbar, Footer
│   │   │   ├── hero/          # Hero
│   │   │   ├── services/      # ServiceCard, ServicesSection
│   │   │   ├── testimonials/  # TestimonialCarousel (Swiper), TestimonialsSection
│   │   │   ├── about/         # AboutSection, StatCounter
│   │   │   ├── faq/           # FaqAccordion, FaqSection
│   │   │   ├── contact/       # ContactForm
│   │   │   └── common/        # AsyncState, StatusMessage
│   │   ├── App.jsx            # Composición de la app + code-splitting
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
├── postman/
│   └── SERCOTEC-CMS.postman_collection.json
└── README.md
```

## 4. Componentes principales

| Componente | Responsabilidad | Datos que recibe | Relación con otros |
|---|---|---|---|
| `ServiceCard` | Mostrar un servicio y su botón "Contáctanos" | prop `servicio` (objeto) | Llama a `useContact().solicitarContacto()` |
| `ServicesSection` | Obtener y listar todos los servicios | `useFetch(api.getServices)` | Renderiza `ServiceCard` por cada item |
| `TestimonialCarousel` | Carrusel accesible de testimonios | prop `testimonios` (array) | Usado por `TestimonialsSection` |
| `AboutSection` / `StatCounter` | Sección institucional con cifras animadas | `useFetch(api.getAbout)` | `StatCounter` anima al entrar en viewport |
| `FaqSection` / `FaqAccordion` | Acordeón de preguntas frecuentes | `useFetch(api.getFaq)` | Controla `openId` (un panel abierto a la vez) |
| `ContactForm` | Formulario de contacto validado | `useContact().servicioSeleccionado` | Envía con `api.sendContact()` |
| `Navbar` / `Footer` | Navegación global | prop `about` (Footer) | — |
| `ContactContext` | Comparte el servicio elegido entre `ServiceCard` y `ContactForm` | — | Evita prop drilling entre secciones |

## 5. Instalación y ejecución

Requiere Node.js 18 o superior.

```bash
# 1) Backend
cd backend
cp .env.example .env      # y edita CMS_API_KEY por una clave propia
npm install
npm run dev                # http://localhost:4000

# 2) Frontend (en otra terminal)
cd frontend
cp .env.example .env
npm install
npm run dev                # http://localhost:5173
```

Build de producción del frontend:

```bash
cd frontend
npm run build      # genera frontend/dist
npm run preview    # sirve el build para verificarlo
```

## 6. Endpoints de la API

Todas las respuestas usan el formato `{ data: ... }` en éxito y
`{ error: { type, message, details? } }` en error. Las rutas marcadas como
**protegidas** requieren el header `X-Api-Key: <CMS_API_KEY>`.

| Método | URL | Propósito | Parámetros | Envía | Recibe |
|---|---|---|---|---|---|
| GET | `/api/health` | Verificar que el servidor está activo | — | — | `{status, timestamp}` |
| GET | `/api/services` | Listar servicios (ordenados) | — | — | `{data: Servicio[], total}` |
| GET | `/api/services/:id` | Detalle de un servicio | `id` en la URL | — | `{data: Servicio}` |
| POST | `/api/services` | Crear servicio (protegido) | — | `{titulo, descripcion, categoria?, imagen?}` | `{data: Servicio}` |
| PUT | `/api/services/:id` | Editar servicio (protegido) | `id` en la URL | Campos a actualizar | `{data: Servicio}` |
| DELETE | `/api/services/:id` | Eliminar servicio (protegido) | `id` en la URL | — | `{data: Servicio eliminado}` |
| GET | `/api/testimonials` | Listar testimonios | — | — | `{data: Testimonio[], total}` |
| POST/PUT/DELETE | `/api/testimonials(/:id)` | Administrar testimonios (protegido) | — | Igual patrón que servicios | — |
| GET | `/api/faq` | Listar preguntas frecuentes | — | — | `{data: Faq[], total}` |
| POST/PUT/DELETE | `/api/faq(/:id)` | Administrar FAQ (protegido) | — | Igual patrón que servicios | — |
| GET | `/api/about` | Datos institucionales (misión, visión, estadísticas) | — | — | `{data: About}` |
| PUT | `/api/about` | Editar datos institucionales (protegido) | — | Campos a actualizar | `{data: About}` |
| POST | `/api/contact` | Enviar formulario de contacto (público, limitado a 5/10min por IP) | — | `{nombre, correo, empresa?, servicio, mensaje, _hp}` | `{data:{id, recibido}}` o `422`/`429` |
| GET | `/api/contact` | Ver mensajes recibidos (protegido, uso interno) | — | — | `{data: Mensaje[], total}` |

La colección de Postman en `postman/SERCOTEC-CMS.postman_collection.json`
incluye ejemplos listos para cada uno de estos endpoints, usando las
variables de colección `base_url` y `api_key`.

## 7. Buenas prácticas aplicadas

1. **Componentización y reutilización** — `ServiceCard`, `FaqAccordion` y
   `StatCounter` se escriben una sola vez y se reutilizan con distintos
   datos, en vez de duplicar JSX por cada servicio o pregunta. Ejemplo:
   `ServicesSection` renderiza `<ServiceCard servicio={s} />` dentro de un
   `.map()`.
2. **Separación de responsabilidades (API / UI / estado)** — `api/client.js`
   concentra las llamadas HTTP, `hooks/useFetch.js` maneja los estados de
   carga, y los componentes solo se preocupan de renderizar. Esto evita
   mezclar `fetch()` directamente dentro de los componentes visuales.
3. **Validación duplicada (cliente + servidor)** — `ContactForm.jsx` valida
   antes de enviar (mejor UX), y `backend/src/utils/validate.js` repite las
   mismas reglas en el servidor, porque la validación de cliente puede ser
   evadida (DevTools, Postman, scripts). Nunca se confía solo en el cliente.
4. **Principio de menor privilegio en la API** — las lecturas (`GET`) son
   públicas, pero toda escritura (`POST/PUT/DELETE`) exige `X-Api-Key` vía
   el middleware `requireApiKey`, de forma que solo quien administra el
   contenido puede modificarlo.
5. **Manejo centralizado de errores sin fuga de información** — el
   middleware de errores en `app.js` registra el detalle en el log del
   servidor (`console.error`) pero responde al cliente un mensaje genérico,
   evitando exponer stack traces o rutas internas.
6. **Código dividido por rutas lógicas (code-splitting)** — `App.jsx` usa
   `React.lazy` + `Suspense` para diferir los chunks de Testimonios,
   Nosotros, FAQ y Contacto, en lugar de enviar todo el JavaScript en un
   solo bundle inicial.
7. **Accesibilidad como requisito, no como extra** — atributos ARIA
   (`aria-expanded`, `aria-controls`, `aria-live`, `aria-invalid`), foco
   visible, skip link y respeto a `prefers-reduced-motion` se incorporan
   directamente en los componentes, no se agregan después.
8. **Variables de entorno para configuración y secretos** — `CMS_API_KEY`,
   `FRONTEND_ORIGIN` y `VITE_API_URL` viven en `.env` (ignorado por Git);
   los `.env.example` documentan qué valores se necesitan sin exponer los
   reales.

## 8. Seguridad

| Medida | Dónde | Riesgo que mitiga |
|---|---|---|
| API key en escrituras (`requireApiKey`) | `backend/src/middleware/auth.js` | Que cualquiera modifique o borre contenido del CMS |
| Validación server-side (espejo de la del cliente) | `backend/src/utils/validate.js` | Envíos manipulados que evaden la validación del navegador |
| Honeypot (`_hp`) | `routes/contact.js` + campo oculto en `ContactForm.jsx` | Bots que rellenan formularios automáticamente (spam) |
| Rate limiting (5 envíos/10min por IP) | `routes/contact.js` (express-rate-limit) | Abuso/flood del formulario de contacto |
| Cabeceras de seguridad HTTP (helmet) | `backend/src/app.js` | Clickjacking, sniffing de MIME type, etc. |
| CORS restringido a `FRONTEND_ORIGIN` | `backend/src/app.js` | Que otros sitios consuman la API desde el navegador del usuario |
| Límite de tamaño de payload (100kb) | `backend/src/app.js` (`express.json`) | Peticiones excesivamente grandes (DoS simple) |
| Errores genéricos al cliente, detalle solo en logs | `backend/src/app.js` | Fuga de información técnica interna (stack traces, rutas) |
| Secretos fuera del código (`.env`, `.gitignore`) | `backend/.env`, `frontend/.env` | Exposición de credenciales en el repositorio |

## 9. Optimizaciones de rendimiento

| Situación inicial | Optimización aplicada | Beneficio medido |
|---|---|---|
| Imágenes de servicios/testimonios sin comprimir, a resolución original | Recompresión JPEG + redimensionado a los tamaños reales de uso | **~91.6% menos peso** total en `public/img/` |
| Todo el JavaScript de la app en un solo bundle inicial | `React.lazy` + `Suspense` para Testimonios, Nosotros, FAQ y Formulario de contacto | **~113 KB de JS** diferidos hasta que el usuario los necesita |
| Componentes de solo-lectura (`ServiceCard`, `FaqAccordion`, `StatCounter`) re-renderizando en cada cambio de estado del padre | Envueltos en `React.memo` | Evita renders innecesarios cuando cambia estado no relacionado (p. ej. abrir/cerrar el menú) |
| Imagen del Hero cargando igual que el resto (lazy) | Carga `eager` + `fetchpriority="high"` solo para el Hero | Mejora el LCP (la imagen más importante sobre el pliegue carga primero) |

## 10. Dificultades técnicas y soluciones

**Problema:** `ContactForm` se carga de forma diferida (`React.lazy`). Al
hacer clic en "Contáctanos" desde un `ServiceCard`, el elemento
`#contacto` podía no existir todavía en el DOM si el chunk aún no había
terminado de montarse (por ejemplo, en una conexión lenta), por lo que el
scroll automático hacia el formulario fallaba en silencio.

**Causa:** condición de carrera entre la carga asíncrona del chunk
(code-splitting) y la búsqueda síncrona del nodo vía
`document.getElementById('contacto')`.

**Alternativas consideradas:**
1. Cargar `ContactForm` de forma eager (sin `lazy`) — descartada porque
   anula la optimización de rendimiento de la sección 9.
2. Usar una `ref` global fijada al montar el formulario — no resuelve el
   problema si el usuario hace clic *antes* de que el formulario exista.

**Solución implementada:** `scrollToContactWhenReady()` en
`ContactContext.jsx` reintenta la búsqueda del nodo cada 100ms hasta 20
veces (2 segundos máx.) antes de desistir; el servicio elegido siempre
queda guardado en el contexto, así que el precargado del campo nunca se
pierde aunque el scroll no llegue a ejecutarse.

**Resultado:** verificado manualmente simulando "Slow 3G" en las
herramientas de desarrollo; el scroll y el foco en el campo nombre ocurren
de forma consistente incluso con el chunk cargando en caliente.

## 11. Accesibilidad y usabilidad

Se realizó una auditoría de contraste WCAG 2.1 AA con un script propio
(cálculo de luminancia relativa) sobre los colores del sitio:

- `.service-card__category` (#B8860C sobre blanco, 12px negrita) dio
  **3.25:1**, insuficiente para texto pequeño (mínimo exigido 4.5:1). Se
  agregó la variable `--color-accent-text` (#8a6508), verificada en
  **5.32:1**, y se aplicó a ese elemento.
- El color dorado en los contadores de estadísticas (2rem/32px negrita,
  **3.09:1**) se dejó sin cambios porque califica como "texto grande"
  (umbral 3.0:1 según WCAG).

Otras prácticas de accesibilidad aplicadas: skip link al contenido
principal, `aria-expanded`/`aria-controls` en el menú y el acordeón de
FAQ, `aria-live`/`role="status"`/`role="alert"` en los mensajes de
feedback del formulario, `:focus-visible` en todos los elementos
interactivos, y respeto a `prefers-reduced-motion` en las animaciones del
contador de estadísticas.

**Prueba de usabilidad:** se simuló una prueba con un usuario, que mostró
confusión al ver el campo "Servicio" del formulario ya rellenado sin saber
por qué. **Mejora implementada:** se agregó un aviso contextual
("Preseleccionamos este servicio porque lo elegiste desde 'Contáctanos'.
Puedes cambiarlo si quieres.") que desaparece si el usuario edita el
campo manualmente.

## 12. Retrospectiva y plan de mejora continua

| Situación | Mejora propuesta | Prioridad | Responsable | Estado |
|---|---|---|---|---|
| El campo "servicio" precargado generaba confusión en la prueba de usabilidad | Agregar aviso contextual explicando por qué llegó prellenado | Alta | Rodrigo Soto | **Implementada** (ver sección 11) |
| No existe captcha visible ni verificación adicional más allá del honeypot | Evaluar un captcha invisible (p. ej. Cloudflare Turnstile) si el spam aumenta en producción | Media | Rodrigo Soto | Pendiente |
| Los datos se guardan en archivos JSON planos, sin control de concurrencia real | Migrar a una base de datos (SQLite/Postgres) si el CMS crece en volumen de contenido o editores simultáneos | Media | Rodrigo Soto | Pendiente |
| No hay pruebas automatizadas (unitarias/e2e) | Agregar pruebas con Vitest (componentes) y una suite básica de integración para los endpoints | Baja-Media | Rodrigo Soto | Pendiente |

Como actividad grupal permite hasta 3 integrantes; este proyecto se
desarrolló de forma individual, por lo que todos los roles (frontend,
backend/CMS, control de calidad, documentación) fueron asumidos por el
mismo autor.

## 13. Control de versiones

El repositorio se desarrolló con un flujo de ramas por funcionalidad,
fusionadas a `main` mediante *merge commits* (`--no-ff`) para conservar el
historial de cada rama:

```
main
 ├── feature/cms-backend
 ├── feature/service-card
 ├── feature/testimonial-carousel
 ├── feature/dynamic-sections
 ├── feature/navigation-and-contact-form
 ├── fix/contact-scroll-race-condition
 ├── feature/performance-optimizations
 ├── feature/accessibility-audit
 └── docs/postman-collection
```

Cada commit usa mensajes descriptivos con prefijo (`feat`, `fix`, `perf`,
`a11y`, `docs`, `chore`) indicando el tipo de cambio.

Para revisar el historial completo:

```bash
git log --oneline --graph --all
```
