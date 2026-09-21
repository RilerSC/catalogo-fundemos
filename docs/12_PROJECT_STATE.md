# 12_PROJECT_STATE.md

## 1. Propósito

Este documento registra el estado operativo actual del proyecto **Catálogo Web de Oferta Académica de Universidad FUNDEPOS**.

No sustituye al Brief ni a la Arquitectura. Su función es responder de forma breve y actualizable:

- dónde está el proyecto;
- qué está aprobado;
- qué existe actualmente;
- qué falta;
- cuál es el siguiente paso ejecutable.

---

## 2. Estado general

**Fase:** Catálogo público publicado  
**Estado:** PUBLIC CATALOG + LEADS-001 + SEO-001 + ANALYTICS-001 + DATA-007  
**Fecha de referencia:** 2026-09-21 (DATA-007)

El discovery, el scaffold, Neon, taxonomías, 32 programas, 32 aperturas y el precio opcional están cerrados. El inventario actual está publicado: Production ya no depende de preview para ver el catálogo. La interfaz conserva PUBLIC-004/005. El visitante puede solicitar información (LEADS-001). SEO técnico está implementado. La analítica es un contrato local privacy-first: GTM solo después de consentimiento y solo si existe un ID institucional. No hay Salesforce, proxy, WhatsApp, email, Ads, Search Console ni CMS. Publicar no valida editorialmente fechas prácticas, precios provisionales ni placeholders HV2.

---

## 3. Documentación canónica específica

### Completada

- `docs/10_PROJECT_BRIEF.md` — definición funcional y alcance del producto.
- `docs/11_ARCHITECTURE.md` — arquitectura técnica inicial.

### Documento actual

- `docs/12_PROJECT_STATE.md` — estado operativo vigente.

### Material fuente

- `docs/source/categorias-programas.md`
- `docs/source/HOJA DE VENTAS/` (23 programas de educación continua)
- `docs/source/HV2/` (9 programas de grado y posgrado)
- `docs/source/inicios.csv` (fechas de inicio 2027; el año lo confirmó el negocio)

No se requiere crear ADR, backlog, roadmap, runbooks u otra documentación adicional antes de continuar la implementación.

---

## 4. Producto definido

Se construirá un catálogo web público de oferta académica para Universidad FUNDEPOS orientado a:

- descubrimiento de programas;
- búsqueda;
- filtros facetados;
- consulta de fichas académicas;
- selección de programas de interés;
- captación de leads;
- continuación de contacto por correo o WhatsApp;
- administración del catálogo mediante CMS propio.

El visitante público no necesitará registrarse.

---

## 5. Inventario inicial

El inventario de referencia contiene **32 programas**:

- 23 de educación continua y certificación;
- 9 de grado y posgrado.

El sistema no estará limitado a este volumen.

---

## 6. Clasificación aprobada

### Campo de conocimiento

Relación muchos a muchos.

Un programa podrá pertenecer a uno o varios campos:

1. Gobierno, riesgos y cumplimiento.
2. Dirección, liderazgo y estrategia.
3. Finanzas, tributación y mercados.
4. Derecho, sector público y regulación.
5. Tecnología, datos e inteligencia artificial.
6. Operaciones, seguros y mercados de especialidad.

### Tipo de producto académico

Cada programa tendrá exactamente un tipo.

Tipos iniciales:

- Técnico;
- Diplomado;
- Especialista;
- Misión académica;
- Seminario;
- Programa ejecutivo;
- Bachillerato;
- Licenciatura;
- Maestría;
- Máster;
- Doctorado.

---

## 7. Decisiones funcionales cerradas

- Catálogo público sin autenticación.
- CMS administrativo protegido.
- Búsqueda textual.
- Filtros facetados combinables.
- Búsqueda y filtros podrán operar conjuntamente.
- Un programa puede pertenecer a múltiples campos de conocimiento.
- Cada programa tiene un único tipo académico.
- `Program` y `Offering` son conceptos separados.
- Las aperturas contienen información variable como fecha, modalidad, horario y precio.
- No es necesario recrear un programa cuando cambia su apertura.
- Un programa sin apertura vigente no deberá mostrarse públicamente.
- Las aperturas vencidas dejan de ser elegibles automáticamente.
- El visitante podrá mantener una selección de programas bajo “Mis programas de interés”.
- La selección anónima persistirá localmente en el mismo navegador/dispositivo.
- El lead se persistirá antes de depender de integraciones externas.
- El visitante podrá continuar por correo o WhatsApp.
- WhatsApp se abrirá después de registrar el lead.
- El CMS permitirá administrar programas, contenido, clasificaciones, aperturas, medios y datos asociados.
- La experiencia será responsive.
- SEO será parte del producto desde el inicio.
- La funcionalidad adicional de enlaces asociados a programas queda deliberadamente diferida para una etapa posterior.

---

## 8. Arquitectura aprobada

### Aplicación

- Next.js con App Router.
- React.
- TypeScript.
- Tailwind CSS.
- Aplicación única para catálogo público y CMS.
- Despliegue en Vercel.

### Datos

- PostgreSQL.
- Neon.
- Drizzle ORM.
- Drizzle Kit para migraciones.

### Búsqueda

- Búsqueda inicial en memoria.
- Sin motor externo de búsqueda.
- Filtros facetados combinables.

### CMS

- CMS propio dentro de Next.js.
- Sin CMS externo.

### Autenticación administrativa

- Una única credencial administrativa.
- Configuración mediante variables de entorno de Vercel.
- Sin tabla de usuarios.
- Sin roles ni RBAC.
- Sin recuperación de contraseña en v1.

### Archivos

- Vercel Blob público.
- Imágenes, PDFs, brochures y demás recursos públicos fuera de PostgreSQL.
- PostgreSQL conservará metadata y relaciones cuando corresponda.

### Leads

- Persistencia inicial en Neon.
- Entrega posterior mediante proxy corporativo.
- Salesforce permanece detrás del proxy existente.
- Sin integración Salesforce directa desde la aplicación.

### Analítica y posicionamiento

- Google Analytics 4.
- Google Search Console.
- Vercel Analytics opcional.
- Metadata, canonical, sitemap, robots, Open Graph y datos estructurados cuando correspondan.

---

## 9. Modelo conceptual aprobado

Entidades iniciales:

```text
Program
AcademicType
KnowledgeField
ProgramKnowledgeField
Offering
MediaAsset
Lead
LeadProgram
LeadDelivery
```

Relaciones principales:

```text
AcademicType 1 ---- N Program

Program M ---- N KnowledgeField

Program 1 ---- N Offering

Program 1 ---- N MediaAsset

Lead M ---- N Program

Lead 1 ---- N LeadDelivery
```

La estructura física exacta de tablas, campos, restricciones e índices deberá definirse durante la implementación respetando este modelo conceptual.

---

## 10. Integraciones

### Aprobadas

```text
Vercel
├── aplicación Next.js
└── Blob público

Neon
└── PostgreSQL

Proxy corporativo
└── Salesforce downstream

Google
├── Analytics 4
└── Search Console
```

### Pendiente de configuración durante implementación

- credenciales y variables de entorno;
- contrato técnico concreto del proxy;
- identificadores/configuración de GA4;
- configuración de Search Console;
- configuración de Vercel Blob.

La conexión de Neon ya está configurada localmente mediante `.env.local` (fuera de Git). La variable en Vercel podrá definirse cuando se prepare el primer deployment.

Estas son tareas de implementación/configuración y no bloqueos arquitectónicos.

---

## 11. Fuera de alcance inicial

No forman parte de la arquitectura v1:

- compra de programas;
- pagos en línea;
- matrícula transaccional;
- LMS;
- expediente académico;
- cuentas de visitantes;
- sincronización de intereses entre dispositivos;
- Algolia;
- Elasticsearch;
- OpenSearch;
- Redis;
- Supabase;
- CMS externo;
- backend independiente;
- microservicios;
- tabla de usuarios administrativos;
- RBAC;
- recuperación de contraseña;
- proveedor adicional de email;
- integración directa con Salesforce;
- colas distribuidas;
- almacenamiento privado de medios.

No deberán incorporarse durante la implementación salvo que aparezca un requisito material y se apruebe explícitamente el cambio de alcance.

---

## 12. Investigación realizada

Se completó investigación de referencias y patrones para catálogos académicos modernos.

Entre las referencias principales estudiadas se encuentran:

- Stanford Root;
- UW Degree Planner;
- SearchNEU;
- NUSMods;
- classes.wtf.

La investigación general se considera suficiente.

No se requiere continuar buscando repositorios o arquitecturas alternativas antes de comenzar.

Investigaciones adicionales deberán ser específicas y responder a una decisión o problema concreto de implementación.

---

## 13. Estado del repositorio

**COMPLETE — inspeccionado en BOOTSTRAP-001; rama actualizada tras sincronización del usuario**

Repositorio Git real:

- remoto: `https://github.com/RilerSC/catalogo-fundemos.git`
- rama de trabajo: `main`
- historial preservado
- no existía aplicación Next.js, `package.json`, TypeScript, Tailwind ni Drizzle antes del bootstrap
- no se encontró trabajo de aplicación que debiera preservarse por encima del material documental y fuente

La raíz del repositorio es ahora la raíz de la aplicación Next.js.

---

## 14. Estado de implementación

**Scaffold técnico:** COMPLETE (BOOTSTRAP-001)

Existe una aplicación Next.js ejecutable en la raíz, con App Router, TypeScript, Tailwind CSS, ESLint y `src/`.

**Esquema de datos:** COMPLETE (DATA-001)

- dependencias: `drizzle-orm` 0.45.2, `@neondatabase/serverless` 1.1.0, `drizzle-kit` 0.31.10, `dotenv` 18.0.0
- archivos: `drizzle.config.ts`, `src/db/schema.ts`, `src/db/index.ts` (cliente lazy)
- migración: `drizzle/0000_sweet_mathemanic.sql`
- variable documentada: `DATABASE_URL` en `.env.example`
- precio de apertura: componentes en `offering_price_components` (PUBLIC-001A). `offerings.price_amount` / `price_currency` permanecen nullable como columnas legacy y ya no alimentan la UI.

**Neon / migración aplicada:** COMPLETE (DATA-002)

- proyecto Neon: `catalogo-fundepos`
- región: `aws-us-east-1`
- base: `neondb` (rama `main`)
- `DATABASE_URL` configurada solo en `.env.local` (ignorado por Git)
- migración aplicada con `npm run db:migrate` / `drizzle-kit migrate` (no `drizzle push`)
- Drizzle registró `0000_sweet_mathemanic` en `drizzle.__drizzle_migrations`
- no hay tabla de usuarios administrativos en `public`; Neon Auth de consola existe en el esquema `neon_auth` y no es usado por la aplicación

**Taxonomía inicial:** COMPLETE (DATA-003)

- seed versionado: `src/db/seed.ts`
- comando: `npm run db:seed`
- idempotente por `slug` (`onConflictDoUpdate`)
- `academic_types`: 11 registros
- `knowledge_fields`: 6 registros
- programas, asociaciones, aperturas, medios y leads: 0
- lint, typecheck y build: PASS

**Programas iniciales:** COMPLETE (DATA-004)

- dataset versionado: `src/db/data/programs.ts`
- comando: `npm run db:seed:programs`
- idempotente por `slug` (`onConflictDoUpdate`) y asociaciones por PK compuesta (`onConflictDoNothing`)
- `programs`: 32 registros en `draft`
- `program_knowledge_fields`: 95 asociaciones
- distribución de tipos: Técnico 8, Diplomado 1, Especialista 10, Misión académica 2, Seminario 1, Programa ejecutivo 1, Bachillerato 2, Licenciatura 1, Maestría 3, Máster 2, Doctorado 1
- `offerings`, `media_assets` y leads: 0
- lint, typecheck y build: PASS

**Aperturas 2027:** COMPLETE (DATA-005) + fecha práctica 2027-01-05

- fechas 2027: `docs/source/inicios.csv` (filas reales: 30)
- fecha práctica autorizada `2027-01-05` para programas del inventario que no tenían fecha CSV
- datos comerciales: `offeringCandidate` en `src/db/data/programs.ts`
- dataset versionado: `src/db/data/offerings.ts`
- comando: `npm run db:seed:offerings`
- idempotente por `program_id + start_date` (lookup de aplicación; el schema no tiene unique de apertura)
- reconciliación vigente: MATCHED_EXISTING_PROGRAM 23, CSV_ONLY 7, NO_2027_START_DATE 0, DATE_WITHOUT_PRICE 0, PRICE_WITHOUT_CURRENCY 0, VALID_OFFERING 32
- `offerings`: 32 registros en `draft`, todos con `start_date` 2027
- 10 aperturas con fecha práctica `2027-01-05`
- `price_amount` del catálogo = matrícula + programa/materia cuando la hoja de ventas trae ambos (Técnico ₡132.000, Especialista ₡535.000, Diplomado ₡125.000). HV2 grados/másteres usan total práctico ₡2.000. Misiones, gerentes, seminario y doctorado conservan la inversión única de la hoja.
- CSV_ONLY no ingeridos: Auditoría Financiera Integral, Tecnologías de Semiconductores, Lean Practitioner, Gestión de Talento Humano, Ciberseguridad Empresarial, Auditoría del Sector Público, Misión Liderazgo financiero México
- `programs` permanece en 32; `program_knowledge_fields` permanece en 95; taxonomías 11 + 6; media/leads 0
- lint, typecheck y build: PASS

**Precio opcional de Offering:** COMPLETE (DATA-006)

- `price_amount` y `price_currency` aceptan NULL
- consistencia: ambos NULL o ambos con valor (`offerings_price_amount_currency_chk`)
- `start_date` sigue NOT NULL
- migración incremental: `drizzle/0001_optimal_sinister_six.sql` (no `drizzle push`; `0000_sweet_mathemanic` no se modificó)
- 32 Offerings conservados; UUID y precios existentes no se borraron ni se convirtieron a NULL
- cero no se usa como precio desconocido
- visibilidad futura no depende del precio: publicado + Offering publicado + `start_date >= hoy`
- UI futura: si `priceAmount !== null` mostrar el valor; si es NULL, ocultar el bloque de precio (sin “Consultar precio”, “₡0”, “Gratis” ni equivalentes)
- `price_amount` es un importe de referencia provisional, no el modelo comercial definitivo
- lint, typecheck y build: PASS

**Catálogo público preview:** COMPLETE (PUBLIC-001)

- rutas: `/`, `/programas`, `/programas/[slug]`
- lectura server-side desde Neon (`src/lib/catalog/`)
- preview de `draft` si `VERCEL_ENV !== production` o `CATALOG_PREVIEW=true`; en producción Vercel solo valen publicados + fecha vigente
- búsqueda textual accent-insensitive; filtros combinables por tipo (OR) y campo (OR); AND entre dimensiones y con la búsqueda
- estado en query: `q`, `type`, `field`
- precio: se muestra cada componente (Matrícula, Programa, Materia o Inversión) cuando existe; cero componentes no renderiza bloque
- sin CMS, leads, intereses, imágenes ni analytics
- lint, typecheck y build: PASS

**Precios desglosados y catálogo como home:** COMPLETE (PUBLIC-001A)

- tabla `offering_price_components` (`kind`, `label`, `amount`, `currency`, `sort_order`); identidad `offering_id + kind`
- migración incremental: `drizzle/0002_luxuriant_sersi.sql` (no `drizzle push`; `0000` y `0001` no se modificaron)
- 27 Offerings MULTI_COMPONENT, 5 SINGLE_COMPONENT, 0 NO_PRICE
- técnicos: Matrícula ₡60.000 + Programa ₡72.000
- especialistas: Matrícula ₡35.000 + Programa ₡500.000
- diplomado: Matrícula ₡50.000 + Materia ₡75.000 (la hoja dice Materia, no Programa)
- HV2 grados/másteres: Matrícula ₡1.000 + Materia ₡1.000 (importes prácticos ya autorizados; las hojas HV2 no traen precio)
- misiones, Gerentes Líderes, Seminario y Doctorado: un solo componente Inversión
- graduación no se modela como componente de catálogo
- no se genera un total sintético
- columnas `price_amount` / `price_currency` quedan en NULL y deprecadas para presentación
- `/` renderiza el catálogo completo (buscador, filtros, contador, 32 cards) reutilizando `CatalogScreen`
- `/programas` permanece como alias del mismo catálogo
- 32 Offerings y UUID conservados; Programs 32; asociaciones 95
- lint, typecheck y build: PASS

**Latencia de filtros:** COMPLETE (PUBLIC-001B)

- causa: cada checkbox/tecla hacía `router.replace`, navegación App Router, re-render de Server Component, `getCatalogPrograms()` y consulta a Neon; `loading.tsx` podía tapar el catálogo
- corrección: estado local inmediato + `applyCatalogFilters` en memoria; URL vía `history.replaceState` (API nativa integrada en Next.js 16)
- búsqueda visual sin debounce; debounce 200 ms solo para sincronizar `q` en la URL
- query params `q`, `type`, `field` se conservan; URL directa, refresh, back/forward y limpiar filtros siguen funcionando
- tras la carga inicial, un cambio de filtro no consulta Neon
- lint, typecheck y build: PASS

**Primera iteración visual/UX:** COMPLETE (PUBLIC-002)

- catálogo y ficha con jerarquía más clara; buscador prominente; filtros desktop sticky y mobile con contador
- cards: título dominante, descripción con line-clamp, metadata etiquetada, precios por componente, campos secundarios
- grid 1 / 2 / 3 columnas; empty state intencional
- filtrado local de PUBLIC-001B y pricing de PUBLIC-001A preservados
- sin imágenes, sin branding inventado, sin cambios DB
- lint, typecheck y build: PASS

**Mis programas de interés:** COMPLETE (PUBLIC-003)

- selección anónima en el mismo navegador/dispositivo; sin cuenta, sesión, cookies ni DB
- identidad persistida: `program.id` (UUID del read model público)
- key: `fundepos.catalog.interests`; formato `{ version: 1, programIds: [...] }`
- toggle `Me interesa` / `En mis intereses` en cards y ficha; no navega ni altera filtros/URL
- indicador global `Mis programas de interés` con contador solo si hay selección
- ruta `/intereses`: resuelve IDs contra `getCatalogPrograms()` (respeta preview vs producción); empty state; quitar uno; limpiar todos
- JSON corrupto, duplicados o storage no disponible fallan a selección vacía o a estado de sesión sin romper la UI
- IDs inexistentes o no visibles se ignoran; en `/intereses` se podan del storage
- same-tab vía store en memoria; multi-tab vía evento `storage`
- DB, Neon, API y pricing sin cambios; filtros de PUBLIC-001B se conservan
- lint, typecheck y build: PASS

**Identidad visual v1 del catálogo:** COMPLETE (PUBLIC-004)

- activos oficiales del usuario en `branding/`; versiones web derivadas (recorte del margen transparente + reescalado proporcional, sin recolorear) en `public/branding/`: `fundepos-logo.png`, `fundepos-roseta.png`, `fundepos-roseta-blanca.png`
- colores institucionales aplicados: azul académico `#0F1E3D` (ancla), dorado académico `#D3AF37` (acento), azul institucional `#4A5E7F` (metadata/enlaces), rojo institucional `#930A20` (solo quitar filtro/quitar interés)
- `#D3AF37` no se usa como texto sobre superficies claras: medido 2,1:1 contra blanco; sobre azul académico rinde 7,8:1
- tokens en `src/app/globals.css` (`--brand-*`, superficies, líneas, `--gold-ink`, `--gold-veil`) reutilizando los nombres Tailwind ya existentes
- tipografía UI v1: Source Serif 4 (títulos) + Source Sans 3 (interfaz) vía `next/font`
- **Tipografía, tokens, radios, sombras y reglas de uso son decisiones de diseño de este catálogo, no un manual de marca oficial de FUNDEPOS** (no existe manual formal suministrado)
- header con logotipo completo (roseta en mobile), banda editorial azul con buscador montado sobre el borde, filtros en tarjeta con estado seleccionado en velo dorado, chips como controles
- cards con regla dorada, título serif, metadata etiquetada, bloque de precio en superficie suave y par `Ver programa` / `Me interesa`
- ficha con apertura azul, panel de apertura (fechas, modalidad, duración, precios y CTA) lateral sticky en escritorio y primero en mobile, secciones con ritmo editorial
- textos de párrafo recompuestos en presentación (los saltos duros del PDF se unen salvo en bloques con viñetas); el dato no cambia
- plan de estudios: solo se reconocen encabezados exactos `I…X CUATRIMESTRE` para dar estructura; no se infieren materias, créditos ni requisitos
- `/intereses` con la misma identidad, estado vacío con roseta y acción `Quitar` por programa
- corrección de cascada: `a { color: inherit }` movido a `@layer base` porque anulaba las utilidades de color en enlaces
- contraste verificado en render real: todos los pares medidos cumplen AA (mínimo observado 4,81:1)
- filtros, búsqueda, URL sync, intereses, visibilidad, pricing y DB sin cambios; 32 programas, 32 aperturas, 59 componentes de precio
- lint, typecheck y build: PASS

**Benchmark UX/UI + Mobile + SEO + Discoverability:** COMPLETE (RESEARCH-001)

- benchmark disponible en `docs/research/RESEARCH-001_UX_SEO_DISCOVERY.md`; artefacto research/non-canonical
- sin cambios de código, UI, datos, arquitectura, SEO o analítica

**Evolución UX del catálogo público:** COMPLETE (PUBLIC-005)

- identidad FUNDEPOS, tipografías, pricing, taxonomías, búsqueda, visibilidad e intereses de PUBLIC-004 preservados
- mobile: `details` inline sustituido por drawer/sheet accesible; la selección es temporal hasta `Ver N programas`; desktop sigue inmediato
- toolbar de resultados: conteo, chips (incluido `q`) y limpiar, junto al disparador mobile
- `Explorar por campo`: los 6 campos reales; toggle inmediato sobre `field` y la URL existente
- cards con progressive disclosure: tipo, título, 2 líneas, inicio/modalidad/duración, precio compacto, un campo +`N`
- ficha: breadcrumb `Catálogo / nombre`, resumen, quick facts, TOC solo de secciones presentes, CTA sticky mobile, relacionados
- relacionados: máximo 3; más campos compartidos, luego mismo tipo, luego nombre `es`; solo programas ya visibles
- feedback de intereses: aviso `aria-live` + enlace a `/intereses` al agregar; persistencia localStorage sin cambios
- `/intereses` conserva lista, quitar y limpiar; reserva textual del futuro lead sin CTA inactivo
- no se implementaron próximos inicios, compare-lite, leads, SEO técnico ni analytics
- DB, migraciones y seeds sin cambios; 32 programas, 32 aperturas, 59 componentes de precio
- lint, typecheck y build: PASS

**Captura mínima de interesados:** COMPLETE (LEADS-001)

- formulario solo en `/intereses` y solo con ≥1 programa visible; campos: nombre, correo, teléfono
- `Me interesa` en catálogo/ficha sigue guardando localmente; la conversión real es `Solicitar información`
- endpoint `POST /api/leads`; request `{ name, email, phone, programIds }`; éxito `201 { ok: true, leadId }`; validación `400 { ok: false, error, fields? }`; interno `500 { ok: false, error: "internal" }`
- validación server-side independiente: trim/normalización, límites, UUID, deduplicación, máximo 32 programas, elegibilidad vía `getCatalogPrograms()` (preview vs production)
- payload mixto (válidos + inválidos) se rechaza completo; no se crean asociaciones parciales
- persistencia atómica Lead + LeadProgram con `db.batch()` (neon-http no expone `db.transaction()` interactivo); UUID generado en aplicación
- `contact_channel` es NOT NULL (`email` | `whatsapp`); se persiste `email` porque el formulario recolecta correo y no hay elección de canal ni entrega externa
- schema existente suficiente; cero migraciones; no se escriben snapshots de programa; no se crea `LeadDelivery`
- honeypot `website`: si viene poblado responde `201` con UUID ficticio y no inserta; POST + JSON + 8 KB; sin IP, fingerprint, CAPTCHA ni rate limiter externo
- UI: loading `Enviando…`, errores junto al campo + summary, éxito `Solicitud recibida`; el fallo conserva valores; el submit usa los IDs actuales
- tras éxito: sessionStorage `fundepos.catalog.leadRequest.v1` oculta el formulario para la misma selección; localStorage de intereses no se borra
- logs: `console.error("lead-create-failed")` sin PII; la respuesta de éxito no devuelve nombre/email/teléfono
- no Salesforce, proxy, WhatsApp, email, GA4/GTM/Ads, seeds de leads ni secrets client-side
- lint, typecheck y build: PASS; prueba real Neon + API + Chrome (375/430/768/1440)

**Fundamentos SEO técnicos:** COMPLETE (SEO-001)

- `/` es el catálogo canónico (`index,follow` en production); `/programas` redirige 308 a `/` conservando query
- fichas: canonical autorreferente `/programas/{slug}`; title `{nombre|seoTitle} | Universidad FUNDEPOS`; description desde `seoDescription` o resumen real compactado
- `/intereses`: `noindex,follow`; fuera de sitemap; no se canonicaliza a `/`
- `type`/`field`: estado UX; canonical `/`; no landings ni sitemap
- `q` significativo: `noindex,follow` + canonical `/`; la búsqueda sigue funcionando
- preview/development: `noindex,nofollow` global y `robots.txt` `Disallow: /`
- `SITE_URL` server-side (no `NEXT_PUBLIC_`); obligatoria si `VERCEL_ENV=production`; documentada en `.env.example`; no se inventó dominio
- sitemap (`src/app/sitemap.ts`): `/` + fichas públicamente elegibles (`getCatalogPrograms({ preview: false })`); desde DATA-007 son 33 URLs (`/` + 32 fichas); sin `lastModified`/`priority`; sin `/intereses`, `/api`, filtros ni drafts
- robots production: `Allow: /` + sitemap absoluto; no bloquea `q`/`type`/`field`
- JSON-LD: `Organization` (name, url, logo institucional) en `/`; `BreadcrumbList` Catálogo → programa en fichas
- Course List: evaluado y diferido (rich result de Google documentado en inglés; exige definición de course + ItemList/carrusel; el inventario mezcla tipos que no deben marcarse automáticamente)
- no Product, Offer, AggregateRating, FAQ, Event, LocalBusiness ni EducationalOccupationalProgram
- OG/Twitter derivados de la misma metadata; sin imagen OG dedicada (logo horizontal no se forzó como hero); sin cuentas X inventadas
- 404 real para slug inexistente y para drafts en production; se retiró `loading.tsx` raíz/`programas` porque el streaming devolvía 200
- LEADS-001 y DB sin cambios de escritura; `/api/leads` fuera de sitemap
- lint, typecheck y build: PASS; HTML/head, robots y sitemap inspeccionados en preview y con `VERCEL_ENV=production`

**Contrato de medición + consentimiento:** COMPLETE (ANALYTICS-001) — implementation ready; Google property not activated

- GTM es la única capa de entrega prevista; no hay gtag directo paralelo
- Basic consent: `analytics` `granted|denied|unset` en `fundepos.consent.v1`; independiente de intereses
- UI: aviso inicial con `Permitir analítica` / `No permitir` equivalentes; reapertura en footer `Preferencias de privacidad`
- GTM carga solo si `consent === granted` y `NEXT_PUBLIC_GTM_ID` es un `GTM-…` válido; sin ID no hay requests a Google
- Ads, `ad_storage`, `ad_user_data` y `ad_personalization` permanecen denied; no Enhanced Conversions
- Contrato tipado `track()` → `dataLayer`; componentes no hacen push arbitrario
- Eventos: `page_view`, `view_item_list`, `search`, `filter_programs`, `select_item`, `view_item`, `add_to_wishlist`, `remove_interest`, `view_interests`, `generate_lead`
- `generate_lead` solo tras HTTP 201; el refresh del success no lo reemite; `Me interesa` no es conversión
- `search_term` se omite si parece email, teléfono o es demasiado largo; `page_location` elimina `q` y conserva `type`/`field`
- `page_view` solo por cambio de pathname; filtros y búsqueda no inflan vistas
- Sin replay de eventos anteriores al consentimiento; debug en development / `NEXT_PUBLIC_ANALYTICS_DEBUG`
- Configuración institucional de cuenta GTM/GA4 y key event pendiente; no se inventaron IDs
- lint, typecheck y build: PASS; Chrome: consentimiento, PII, generate_lead y cero requests Google sin ID

**Publicación del inventario actual:** COMPLETE (DATA-007)

- decisión editorial explícita: publicar el inventario actual aunque parte del contenido siga siendo provisional
- no se cambió la lógica de visibilidad ni se creó staging; Production sigue siendo `published` + `start_date >= hoy`
- operación acotada a los 32 Programs y 32 Offerings existentes (todos estaban en `draft`; cero aperturas vencidas)
- 32 Programs `published`; 32 Offerings `published`; `getCatalogPrograms({ preview: false })` = 32
- no se modificaron nombres, textos, fechas, precios, taxonomías, componentes de precio ni leads
- sitemap pasó de `/` a 33 URLs canónicas por elegibilidad real; no se editó `sitemap.ts`
- el deployment Vercel existente (`force-dynamic`, `no-store`) mostró el catálogo sin redeploy
- los seeds versionados siguen diciendo `draft`; un re-seed revertiría la publicación
- CMS continúa pendiente

No se deben confundir el esquema persistente con funcionalidades de negocio ya implementadas.

---

## 15. Próximo objetivo

DATA-007 publicó el inventario actual. ANALYTICS-001 dejó el contrato y el consentimiento listos; falta la activación operativa institucional de GTM/GA4. Search Console, imagen OG y corrección editorial de datos provisionales siguen pendientes. La siguiente frontera no está ejecutada: hay que decidir la secuencia entre integración proxy/Salesforce, WhatsApp y CMS.

La ejecución deberá respetar `docs/10_PROJECT_BRIEF.md`, `docs/11_ARCHITECTURE.md` y las políticas universales del proyecto.

---

## 16. Criterio para las siguientes iteraciones

BOOTSTRAP-001 ya obtuvo la base técnica limpia y validada.

Las siguientes iteraciones no deberán intentar completar simultáneamente:

- catálogo;
- CMS;
- leads;
- Salesforce;
- WhatsApp;
- analítica;
- SEO completo;
- medios;
- todas las entidades y flujos.

Las capacidades funcionales deberán incorporarse mediante iteraciones focales.

---

## 17. Riesgo y proporcionalidad actuales

El producto combina principalmente:

- capacidades R1 en catálogo, presentación, búsqueda, filtros y responsive;
- capacidades R2 en CMS, persistencia, formularios y administración ordinaria.

Las integraciones de leads deberán recibir validación focal adicional por manejar datos de contacto y comunicación con sistemas externos.

El nivel de rigor deberá aumentar únicamente cuando una capacidad concreta introduzca un riesgo material mayor.

La criticidad general del proyecto no deberá utilizarse para convertir cada cambio en una tarea de alta complejidad.

---

## 18. Definition of Ready para implementación

El proyecto se considera listo para comenzar porque:

- el propósito está definido;
- el alcance funcional está definido;
- los usuarios principales están definidos;
- las restricciones están definidas;
- la plataforma de despliegue está definida;
- el stack principal está definido;
- la persistencia está definida;
- el modelo conceptual está definido;
- el CMS está definido conceptualmente;
- la autenticación administrativa está definida;
- la estrategia de búsqueda está definida;
- el almacenamiento de archivos está definido;
- la frontera con Salesforce está definida;
- SEO y analítica están contemplados;
- las exclusiones iniciales están explícitas.

Las decisiones menores restantes pueden resolverse durante la implementación sin bloquear el inicio.

---

## 19. Documentación a mantener

Durante la ejecución:

- actualizar `12_PROJECT_STATE.md` cuando cambie materialmente el estado operativo;
- actualizar `11_ARCHITECTURE.md` únicamente ante cambios arquitectónicos reales;
- actualizar `10_PROJECT_BRIEF.md` únicamente cuando cambie el producto o su alcance funcional.

No crear documentación adicional automáticamente.

La necesidad de nuevos documentos deberá surgir de una necesidad real del proyecto.

---

## 20. Próximo paso ejecutable

Decidir la siguiente frontera, sin ejecutarla en esta iteración:

- integración proxy/Salesforce;
- WhatsApp posterior a persistencia;
- CMS;
- activación institucional de GTM/GA4 (sin cuenta personal);
- Search Console institucional cuando exista acceso (sin tokens personales).

Tampoco ingerir automáticamente los 7 programas `CSV_ONLY` detectados en `inicios.csv`.

---

## 21. Resumen de estado

```text
DISCOVERY                         COMPLETE
PRODUCT BRIEF                     COMPLETE
ARCHITECTURE                      COMPLETE
PROJECT STATE                     COMPLETE
GENERAL RESEARCH                  COMPLETE

REPOSITORY INSPECTION             COMPLETE
TECHNICAL SCAFFOLD                COMPLETE
DRIZZLE / NEON PREP               COMPLETE
DATABASE SCHEMA                   COMPLETE
NEON PROVISIONING                 COMPLETE
INITIAL MIGRATION APPLIED         COMPLETE
TAXONOMY SEED                     COMPLETE
PROGRAM INGESTION                 COMPLETE
OFFERING INGESTION                COMPLETE
OFFERING PRICE OPTIONAL           COMPLETE
PUBLIC CATALOG                    COMPLETE
SEARCH / FILTERS                  COMPLETE
PROGRAM DETAIL                    COMPLETE
PRICE COMPONENTS                  COMPLETE
HOME IS CATALOG                   COMPLETE
FILTER LATENCY                    COMPLETE
VISUAL / UX ITERATION             COMPLETE
ANONYMOUS INTERESTS               COMPLETE
BRAND IDENTITY V1                 COMPLETE
UX / SEO BENCHMARK RESEARCH       COMPLETE
PUBLIC UX EVOLUTION               COMPLETE
LEAD CAPTURE (NEON)               COMPLETE
SEO TECHNICAL FOUNDATIONS         COMPLETE
ANALYTICS CONTRACT + CONSENT      COMPLETE
CURRENT INVENTORY PUBLISHED       COMPLETE
GTM / GA4 PROPERTY ACTIVATION     PENDING
CMS                               PENDING
MEDIA                             PENDING
PROXY / SALESFORCE                PENDING
WHATSAPP                          PENDING
SEARCH CONSOLE                    PENDING
GOOGLE ADS                        PENDING
PRODUCTION DEPLOYMENT             PENDING
```

**Estado operativo:** `/` es el catálogo canónico con identidad PUBLIC-004/005; 32 programas y 32 aperturas publicados y elegibles en Production; leads en Neon; SEO técnico activo (sitemap 33 URLs); analítica local con consentimiento básico y dataLayer, sin GTM institucional todavía. CMS e integraciones externas no implementados. Fechas prácticas, precios provisionales y placeholders HV2 siguen sin validación de fuente.

**Limitaciones visuales conocidas:** sin fotografía ni imágenes de programa; los planes de estudio de grado siguen siendo texto plano (la tabla real de código/materia/créditos requiere trabajo de datos, no de UI); los bloques `Módulo I  Módulo VII` vienen con dos columnas colapsadas desde el PDF de origen; no hay compare-lite ni próximos inicios.
