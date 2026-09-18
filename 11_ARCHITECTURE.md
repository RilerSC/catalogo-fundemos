# 11_ARCHITECTURE.md

## 1. Propósito

Este documento define la arquitectura técnica inicial del Catálogo Web de Oferta Académica de Universidad FUNDEPOS.

Su objetivo es establecer las decisiones técnicas necesarias para construir y operar el sistema descrito en `10_PROJECT_BRIEF.md`, manteniendo una arquitectura proporcional al alcance real del producto.

La arquitectura prioriza:

- simplicidad;
- mantenibilidad;
- buen desempeño;
- despliegue natural en Vercel;
- SEO;
- experiencia responsive;
- administración sencilla del catálogo;
- persistencia confiable de programas, aperturas y leads;
- capacidad de crecimiento sin introducir infraestructura prematuramente.

---

## 2. Estado de la arquitectura

**Versión:** v1  
**Estado:** Arquitectura inicial aprobada para implementación  
**Plataforma obligatoria:** Vercel

La solución se construirá inicialmente como una única aplicación web. No se utilizarán microservicios ni un backend independiente mientras no exista una necesidad material que lo justifique.

---

## 3. Arquitectura de alto nivel

```text
                           INTERNET
                              |
                              v
                       VERCEL / NEXT.JS
                  React + TypeScript + Tailwind
                              |
            +-----------------+-----------------+
            |                 |                 |
            v                 v                 v
      CATALOGO PUBLICO    CMS PROTEGIDO    SERVER LOGIC
            |                 |          Actions / Routes
            |                 |                 |
            +-----------------+-----------------+
                              |
                              v
                         DRIZZLE ORM
                              |
                              v
                       NEON POSTGRESQL
                              |
              +---------------+---------------+
              |               |               |
           Program         Offering          Lead
              |
       +------+------+
       |             |
 AcademicType   KnowledgeField


                       ARCHIVOS PUBLICOS
                              |
                              v
                         VERCEL BLOB


                         LEAD DELIVERY
                              |
                              v
                      PROXY CORPORATIVO
                              |
                              v
                          SALESFORCE


                           ANALITICA
                              |
                    +---------+---------+
                    |                   |
                    v                   v
                   GA4          GOOGLE SEARCH
                                  CONSOLE
```

---

## 4. Aplicación

### 4.1 Framework

La aplicación utilizará:

- Next.js con App Router;
- React;
- TypeScript;
- Tailwind CSS.

La versión concreta de cada dependencia se seleccionará al inicializar el proyecto utilizando versiones estables y compatibles en ese momento.

No se fijan versiones específicas en este documento para evitar convertir la arquitectura en un inventario de dependencias.

### 4.2 Aplicación única

El catálogo público y el CMS administrativo formarán parte de la misma aplicación Next.js.

Conceptualmente:

```text
/
├── catálogo público
├── programas/[slug]
├── admin/login
└── admin/*
```

La separación entre área pública y administrativa será lógica y de seguridad, no mediante aplicaciones independientes.

### 4.3 Renderizado

Las páginas públicas deberán aprovechar las capacidades de renderizado de Next.js de manera compatible con:

- SEO;
- velocidad de carga;
- indexación;
- actualización del contenido.

La estrategia concreta de renderizado podrá variar por ruta según la naturaleza del contenido.

No se establece como requisito que todas las páginas utilicen una única modalidad de renderizado.

---

## 5. Persistencia

### 5.1 Base de datos

La base de datos será PostgreSQL administrada mediante Neon.

La aplicación desplegada en Vercel deberá conectarse a Neon utilizando una configuración apropiada para entornos serverless.

Cuando sea posible, la región de la aplicación y la base de datos deberán mantenerse próximas para reducir latencia.

### 5.2 ORM y migraciones

Se utilizará:

**Drizzle ORM + Drizzle Kit**

Drizzle será la capa tipada de acceso a PostgreSQL y Drizzle Kit administrará las migraciones del esquema.

La arquitectura no incorporará una capa adicional de repositorios genéricos salvo que aparezca una necesidad concreta durante la implementación.

---

## 6. Modelo conceptual de datos

Las entidades iniciales son:

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

El esquema físico definitivo se definirá durante la implementación manteniendo estas relaciones conceptuales.

---

## 7. Programa

`Program` representa el producto académico estable.

Contendrá la información que no debe duplicarse cada vez que cambie una apertura, por ejemplo:

- nombre;
- slug;
- descripción;
- tipo académico;
- información académica;
- perfil de ingreso;
- perfil de salida;
- requisitos;
- plan de estudios o contenido;
- información SEO;
- estado editorial;
- información complementaria.

La URL pública del programa deberá mantenerse estable aunque cambien sus aperturas.

Ejemplo conceptual:

```text
/programas/maestria-direccion-empresas
```

---

## 8. Tipo de producto académico

`AcademicType` representa la dimensión:

**¿Qué tipo de programa quiero estudiar?**

Cada programa tendrá exactamente **un tipo académico**.

Relación:

```text
AcademicType 1 ---- N Program
```

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

La clasificación por tipo académico es independiente de los campos de conocimiento.

---

## 9. Campos de conocimiento

`KnowledgeField` representa la dimensión:

**¿Sobre qué quiero estudiar?**

Un programa podrá pertenecer a **uno o varios campos de conocimiento**.

La relación será muchos a muchos:

```text
Program
   |
   | M:N
   |
KnowledgeField
```

mediante:

```text
ProgramKnowledgeField
```

Los campos iniciales son:

1. Gobierno, riesgos y cumplimiento.
2. Dirección, liderazgo y estrategia.
3. Finanzas, tributación y mercados.
4. Derecho, sector público y regulación.
5. Tecnología, datos e inteligencia artificial.
6. Operaciones, seguros y mercados de especialidad.

El CMS deberá permitir seleccionar múltiples campos al crear o editar un programa.

---

## 10. Programa y apertura

`Program` y `Offering` representan conceptos diferentes.

### Program

Es la identidad académica permanente.

### Offering

Representa una apertura vigente o programada y contiene información variable en el tiempo.

Una apertura podrá contener, según corresponda:

- fecha de inicio;
- modalidad;
- horario;
- precio;
- estado;
- otros datos variables asociados a esa apertura.

Relación:

```text
Program 1 ---- N Offering
```

Actualizar una fecha, precio, horario o nueva apertura no requerirá duplicar el programa.

El modelo permitirá representar más de una apertura para un mismo programa cuando exista esa necesidad.

---

## 11. Regla de visibilidad pública

La publicación editorial de un programa y su elegibilidad temporal son conceptos distintos.

Un programa será elegible para mostrarse públicamente cuando:

1. esté habilitado/publicado editorialmente; y
2. disponga de una apertura válida conforme a las reglas del producto.

Una apertura cuya fecha de inicio sea anterior a la fecha actual dejará de considerarse vigente para la presentación pública.

El programa permanecerá registrado en el CMS.

Cuando se configure una nueva apertura válida, el programa podrá volver a mostrarse sin recrear su contenido académico.

La lógica de vigencia deberá resolverse en la aplicación a partir de los datos persistidos y no depender de que un operador desactive manualmente cada programa vencido.

---

## 12. Búsqueda

La versión inicial utilizará **búsqueda en memoria** sobre el conjunto de programas públicos disponibles.

No se utilizará inicialmente:

- Algolia;
- Elasticsearch;
- OpenSearch;
- servicio externo de búsqueda;
- infraestructura especializada de indexación.

El volumen inicial del catálogo no justifica esa complejidad.

La búsqueda deberá normalizar adecuadamente el texto necesario para localizar programas por su contenido relevante.

Si el volumen o las necesidades de relevancia cambian materialmente, la estrategia podrá reevaluarse.

---

## 13. Filtros facetados

El catálogo utilizará filtros combinables.

Las dos dimensiones iniciales principales son:

```text
CAMPO DE CONOCIMIENTO
        +
TIPO DE PRODUCTO ACADEMICO
```

La selección de filtros deberá poder combinarse con búsqueda textual.

Cuando resulte apropiado para la experiencia, el estado de búsqueda y filtros podrá representarse en la URL para permitir navegación reproducible y enlaces compartibles.

Ejemplo conceptual:

```text
/catalogo?campo=tecnologia&tipo=maestria
```

La implementación concreta de sincronización con URL se resolverá sin introducir una dependencia especializada salvo que aporte valor suficiente.

---

## 14. CMS administrativo

El CMS será construido dentro de la propia aplicación Next.js.

No se utilizará inicialmente un CMS externo.

El área administrativa permitirá como mínimo:

```text
/admin

Programas
├── listar
├── crear
├── editar
├── publicar / despublicar
├── asignar tipo académico
├── asignar uno o varios campos de conocimiento
├── administrar contenido académico
├── administrar SEO
├── administrar medios
└── administrar aperturas

Leads
└── consulta operativa según necesidades de v1
```

La interfaz estará orientada a personal no técnico.

---

## 15. Autenticación del CMS

La versión inicial utilizará **una única credencial administrativa configurada mediante variables de entorno de Vercel**.

No existirá tabla de usuarios.

No existirá CRUD de usuarios.

No existirán inicialmente:

- roles;
- RBAC;
- recuperación de contraseña;
- registro de usuarios;
- gestión de usuarios desde el CMS;
- cuentas administrativas múltiples con identidad individual.

Variables conceptuales:

```text
ADMIN_USERNAME=...
ADMIN_PASSWORD_HASH=...
AUTH_SECRET=...
```

La contraseña administrativa no deberá almacenarse en texto plano cuando pueda almacenarse de forma segura como hash.

El formulario `/admin/login` recibirá usuario y contraseña, validará las credenciales del lado servidor y establecerá una sesión segura para acceder a `/admin/*`.

Las variables administrativas deberán permanecer exclusivamente en contexto servidor y nunca exponerse al bundle público.

Si en el futuro aparece una necesidad real de múltiples administradores, roles o trazabilidad individual, la autenticación podrá evolucionar a un modelo persistido.

---

## 16. Medios y documentos

Los archivos públicos asociados al catálogo utilizarán **Vercel Blob público**.

Ejemplos:

- imágenes;
- fotografías;
- brochures;
- PDFs;
- documentos descargables;
- otros recursos públicos de programas.

Los archivos binarios no se almacenarán en PostgreSQL.

La base de datos almacenará únicamente la información necesaria para relacionarlos con el catálogo, por ejemplo:

```text
MediaAsset
├── url
├── filename
├── contentType
├── size
├── altText
└── relación con Program
```

La implementación deberá aprovechar el mecanismo de autenticación recomendado por Vercel para las operaciones de escritura disponibles al momento de construir el proyecto.

No se introduce almacenamiento privado mientras el producto solo requiera recursos públicos.

---

## 17. Mis programas de interés

La selección anónima del visitante se almacenará localmente en el navegador.

La versión inicial utilizará almacenamiento local apropiado del navegador, conceptualmente:

```text
localStorage
   |
   +-- IDs de programas seleccionados
```

No se creará:

- cuenta del visitante;
- sesión anónima persistida en servidor;
- tabla temporal de carritos;
- infraestructura adicional para sincronización entre dispositivos.

La selección persistirá únicamente dentro de las posibilidades del mismo navegador/dispositivo.

---

## 18. Leads

Cuando un visitante complete el formulario de contacto, el sistema deberá persistir el lead antes de depender de servicios externos.

Flujo:

```text
Formulario
    |
    v
Validación
    |
    v
Crear Lead en Neon
    |
    v
Intentar entrega al proxy
```

El lead deberá conservar:

- datos mínimos de contacto;
- programas seleccionados;
- canal de contacto;
- información operativa necesaria para procesar la solicitud.

La relación entre leads y programas será muchos a muchos:

```text
Lead M ---- N Program
```

mediante `LeadProgram`.

---

## 19. Integración con Salesforce

La aplicación **no se integrará directamente con Salesforce**.

Utilizará el proxy corporativo previamente definido como frontera de integración.

Flujo:

```text
Catálogo FUNDEPOS
       |
       v
Proxy corporativo
       |
       v
Salesforce
```

El contrato concreto del proxy deberá configurarse durante la implementación de acuerdo con el canal ya disponible.

La aplicación deberá conservar localmente el lead antes de realizar la entrega externa para evitar perder la intención comercial ante un fallo transitorio.

---

## 20. Estado de entrega de leads

`LeadDelivery` permitirá mantener una trazabilidad proporcional del intento de entrega.

Estados iniciales conceptuales:

```text
PENDING
SENT
FAILED
```

Podrá conservar información como:

- canal;
- estado;
- fecha del intento;
- fecha de entrega;
- error técnico relevante.

No se implementará inicialmente infraestructura de colas distribuida.

Si el volumen o criticidad futura lo requiere, podrá incorporarse un mecanismo de reintentos más sofisticado.

---

## 21. Correo

El formulario podrá utilizar el canal de correo previsto mediante el **proxy corporativo**, permitiendo que la consulta o lead llegue al flujo ya contemplado hacia Salesforce.

No se incorporará inicialmente un proveedor independiente como:

- SendGrid;
- Resend;
- Postmark;
- infraestructura SMTP propia.

La aplicación dependerá únicamente del contrato definido con el proxy para este flujo.

---

## 22. WhatsApp

Cuando el visitante seleccione WhatsApp:

1. se validará el formulario;
2. se persistirá el lead;
3. se realizará la entrega correspondiente al proxy;
4. se construirá el mensaje contextual;
5. se abrirá WhatsApp para que el visitante continúe la conversación.

El mensaje podrá incorporar los programas seleccionados.

La apertura de WhatsApp no será utilizada como sustituto de la persistencia del lead.

Por tanto, si el visitante abandona WhatsApp sin enviar el mensaje, FUNDEPOS conservará el registro de la intención comercial capturada previamente.

---

## 23. SEO

SEO es una capacidad de primera clase de la arquitectura.

Cada programa público deberá disponer de una URL estable basada en slug.

La solución deberá contemplar:

- metadata por página;
- title y description;
- canonical URLs;
- Open Graph;
- sitemap;
- robots;
- contenido indexable;
- datos estructurados cuando correspondan semánticamente;
- imágenes y textos alternativos apropiados.

La información SEO editable de cada programa deberá poder administrarse desde el CMS cuando corresponda.

La implementación deberá utilizar las capacidades nativas de Next.js siempre que sean suficientes antes de incorporar herramientas adicionales.

---

## 24. Google Search Console

La aplicación deberá quedar preparada para su incorporación a Google Search Console.

Esto incluye mantener:

- URLs indexables estables;
- sitemap accesible;
- robots correctamente configurado;
- canonicalización coherente;
- metadata consistente.

Search Console será un servicio externo de observación/indexación y no una dependencia operativa del catálogo.

---

## 25. Analítica

La arquitectura quedará preparada para integrar **Google Analytics 4**.

Se podrán instrumentar eventos como:

```text
view_program
search
filter
add_to_interest
remove_from_interest
start_lead
lead_email
lead_whatsapp
```

Los nombres finales y propiedades de eventos se definirán durante la implementación de analítica.

**Vercel Analytics** podrá utilizarse como complemento opcional, pero no constituye una dependencia obligatoria del producto.

La analítica no deberá bloquear la experiencia principal del visitante.

---

## 26. Responsive

La aplicación será responsive desde su diseño inicial.

Deberá funcionar adecuadamente en:

- teléfonos;
- tabletas;
- laptops;
- escritorios;
- pantallas 1920 x 1080;
- resoluciones comunes inferiores.

La arquitectura frontend no asumirá una única resolución objetivo.

---

## 27. Seguridad

Para el alcance inicial deberán aplicarse controles proporcionales, incluyendo:

- secretos únicamente en variables de entorno servidor;
- protección de rutas administrativas;
- sesión administrativa segura;
- validación de entradas del lado servidor;
- credencial administrativa no expuesta al cliente;
- consultas parametrizadas mediante la capa de datos;
- validación de archivos cargados;
- control de operaciones administrativas;
- protección razonable de endpoints públicos susceptibles a abuso;
- tratamiento apropiado de datos personales de leads.

No se incorporará infraestructura de seguridad empresarial que no corresponda al riesgo real del producto.

---

## 28. Validación de datos

Las entradas provenientes del CMS y formularios públicos deberán validarse antes de persistirse o enviarse a integraciones externas.

La biblioteca concreta de validación podrá seleccionarse durante la implementación.

La validación deberá ser compartible entre servidor y formularios cuando esto reduzca duplicación sin aumentar innecesariamente la complejidad.

---

## 29. Despliegue

La aplicación se desplegará en Vercel.

Componentes externos aprobados:

```text
Vercel
├── Next.js application
└── Blob público

Neon
└── PostgreSQL

Proxy corporativo
└── Salesforce

Google
├── Analytics 4
└── Search Console
```

Los secretos y configuraciones de cada ambiente deberán administrarse mediante las capacidades de variables de entorno de Vercel.

---

## 30. Ambientes

Como mínimo deberán distinguirse configuraciones de desarrollo y producción.

La necesidad de ambientes adicionales deberá justificarse por el flujo real del proyecto.

No se establece inicialmente una topología compleja de ambientes.

Las migraciones de base de datos deberán ejecutarse de forma controlada y reproducible.

---

## 31. Dependencias deliberadamente excluidas

La arquitectura inicial no requiere:

- Algolia;
- Elasticsearch;
- OpenSearch;
- Redis;
- Supabase;
- CMS externo;
- backend independiente;
- microservicios;
- cuentas de visitantes;
- tabla de usuarios administrativos;
- RBAC;
- recuperación de contraseña;
- proveedor adicional de email;
- integración directa con Salesforce;
- colas distribuidas;
- almacenamiento privado de medios;
- motor especializado de búsqueda.

Estas exclusiones responden al alcance y escala actuales.

Podrán revisarse únicamente si aparece una necesidad material que las justifique.

---

## 32. Principios arquitectónicos

### Simplicidad proporcional

La solución debe resolver el problema actual sin construir anticipadamente infraestructura para una escala hipotética.

### Una aplicación antes que múltiples servicios

Mientras el dominio pueda mantenerse claramente dentro de una aplicación Next.js, no se dividirá artificialmente.

### Persistir antes de integrar

Los leads se guardan antes de depender del proxy o de la continuación por WhatsApp.

### Programa estable, apertura variable

El contenido académico permanente no debe duplicarse cuando cambian fechas, precios u horarios.

### Contenido estructurado

Los programas deben administrarse mediante campos definidos y relaciones explícitas, no como páginas libres sin modelo.

### SEO desde el origen

La indexación no será una optimización posterior.

### Servicios externos con fronteras claras

Neon almacena datos, Blob almacena archivos, el proxy entrega leads y Google observa tráfico/indexación.

### Escalar por evidencia

Una nueva dependencia o componente de infraestructura deberá responder a un problema demostrado.

---

## 33. Decisiones que permanecen de implementación

Las siguientes decisiones no bloquean la arquitectura y se resolverán durante la implementación:

- versiones exactas de dependencias;
- biblioteca concreta para validación;
- mecanismo exacto de sesión administrativa compatible con la credencial por variables de entorno;
- forma exacta de sincronizar filtros con URL;
- estructura física final de tablas e índices;
- contrato técnico exacto del proxy corporativo;
- política concreta de reintentos de entregas fallidas;
- estructura final de eventos GA4;
- límites y validaciones concretas para archivos;
- detalles visuales y componentes del CMS;
- estrategia exacta de cache/revalidación por ruta.

Estas decisiones deberán respetar las restricciones y principios definidos en este documento.

---

## 34. Criterio de evolución

La arquitectura deberá revisarse únicamente cuando exista evidencia de que el modelo actual deja de satisfacer una necesidad material.

Ejemplos que podrían justificar evolución futura:

- crecimiento sustancial del catálogo que haga insuficiente la búsqueda en memoria;
- múltiples administradores que requieran identidad individual y roles;
- archivos privados;
- múltiples integraciones comerciales;
- volumen de leads que requiera colas/reintentos automatizados;
- requisitos de sincronización de intereses entre dispositivos;
- nuevas capacidades transaccionales.

La existencia hipotética de estos escenarios no constituye un requisito de la versión inicial.

---

## 35. Resumen tecnológico

```text
Frontend / Full-stack
    Next.js
    React
    TypeScript
    Tailwind CSS

Hosting
    Vercel

Database
    Neon PostgreSQL

ORM / migrations
    Drizzle ORM
    Drizzle Kit

Search
    En memoria

Filters
    Facetados
    Campo de conocimiento: M:N
    Tipo académico: N:1

CMS
    Propio dentro de Next.js

CMS authentication
    Credencial única
    Variables de entorno de Vercel
    Sin tabla de usuarios

Files
    Vercel Blob público

Anonymous interests
    Browser local storage

Leads
    Neon PostgreSQL

Commercial integration
    Proxy corporativo
    Salesforce downstream

SEO
    Next.js metadata
    canonical
    sitemap
    robots
    Open Graph
    structured data cuando corresponda

Analytics
    Google Analytics 4
    Google Search Console
    Vercel Analytics opcional
```

---

## 36. Relación con otros documentos canónicos

- `10_PROJECT_BRIEF.md` define qué producto debe construirse y sus requisitos funcionales.
- `11_ARCHITECTURE.md` define cómo se estructurará técnicamente la solución.
- `12_PROJECT_STATE.md` registrará el estado operativo vigente del proyecto.

Ante una nueva necesidad funcional, primero deberá verificarse su coherencia con el Brief.

Ante un cambio técnico material, deberá evaluarse su impacto sobre este documento antes de modificar la arquitectura canónica.
