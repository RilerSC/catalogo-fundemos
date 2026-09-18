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

**Fase:** Taxonomía académica inicial cargada  
**Estado:** TAXONOMY SEEDED  
**Fecha de referencia:** 2026-09-17

El discovery, la arquitectura, el scaffold Next.js, el esquema físico, la conexión a Neon y la taxonomía maestra inicial están cerrados. Existen 11 tipos académicos y 6 campos de conocimiento. Los 32 programas todavía no están ingeridos.

No existen actualmente decisiones funcionales o arquitectónicas fundamentales que bloqueen la siguiente iteración. El catálogo, CMS, leads e integraciones aún no están construidos.

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
- precio de apertura: `numeric(12,2)` obligatorio + `price_currency` texto mínimo

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

**Producto:** el catálogo público, CMS, autenticación, Blob, Salesforce, leads, WhatsApp, SEO completo y GA4 no están implementados.

No se deben confundir el esquema persistente con funcionalidades de negocio ya implementadas.

---

## 15. Próximo objetivo

DATA-003 ya dejó cargada la taxonomía maestra.

El próximo objetivo es una iteración funcional focal: ingerir los 32 programas (con asociaciones a campos de conocimiento y tipo académico canónico) o construir el catálogo público de solo lectura. No completar CMS, leads e integraciones en el mismo ciclo.

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

Ingerir los 32 programas iniciales a partir de `docs/source/categorias-programas.md` y las hojas de ventas, mapeando “Maestría profesional” a `Maestría` y “Máster ejecutivo” a `Máster`, sin abrir CMS ni catálogo público en el mismo ciclo.

No ejecutar ese paso en esta iteración.

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
PUBLIC CATALOG                    PENDING
SEARCH / FILTERS                  PENDING
PROGRAM DETAIL                    PENDING
CMS                               PENDING
MEDIA                             PENDING
LEADS                             PENDING
PROXY / SALESFORCE                PENDING
WHATSAPP                          PENDING
SEO IMPLEMENTATION                PENDING
GA4 / SEARCH CONSOLE              PENDING
PRODUCTION DEPLOYMENT             PENDING
```

**Estado operativo:** Neon conectado, migración inicial aplicada y taxonomía maestra cargada (11 tipos, 6 campos); listo para ingestión de programas o catálogo público de solo lectura.
