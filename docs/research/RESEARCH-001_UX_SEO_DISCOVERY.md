# RESEARCH-001 — Benchmark UX/UI, Mobile, SEO y Discoverability

- **STATUS:** RESEARCH / NON-CANONICAL
- **Fecha de referencia:** 2026-09-20
- **Propósito:** conservar evidencia y una dirección de diseño para decidir PUBLIC-005 y preparar SEO-001/ANALYTICS-001.
- **No autoriza implementación:** este documento no cambia el Brief, la Arquitectura ni decisiones de producto.

---

## 1. Resumen ejecutivo

PUBLIC-004 ya resolvió correctamente la base difícil: identidad académica propia, jerarquía visual legible, búsqueda prominente, filtros instantáneos, pricing transparente por componentes, fichas individuales, selección anónima y responsive. La evolución no debe sustituir esa identidad ni convertir FUNDEPOS en un marketplace genérico.

El benchmark converge en una dirección: **menos densidad simultánea, más orientación por intención y mejor continuidad entre descubrir, entender, guardar y contactar**. En desktop, conviene conservar el catálogo como núcleo, sumar entradas por campo de conocimiento y compactar las cards. En mobile, el cambio de mayor impacto es sacar los 17 controles del flujo vertical y llevarlos a un drawer/sheet accesible. En la ficha, quick facts, tabla de contenidos, secciones plegables cuando la estructura sea confiable y una acción persistente reducen la carga de las páginas largas.

Para SEO, las páginas de programa deben ser las unidades indexables principales. Los estados `q`, `type` y `field` son UX, no landings orgánicas por defecto. Google mantiene en 2026 el rich result **Course list**, pero exige una lista de al menos tres cursos y markup de lista/carrusel; no equivale a que cualquier schema educativo genere un resultado enriquecido. `BreadcrumbList` y `Organization` son la base de menor riesgo. Las taxonomías solo deberían convertirse en rutas indexables si tienen intención de búsqueda, contenido único y propietario editorial.

Para medición, el producto puede adoptar eventos recomendados de GA4 (`search`, `view_item_list`, `select_item`, `view_item`, `add_to_wishlist`, `generate_lead`) y limitar los custom events a filtros, retiro de interés, vista de shortlist y canales de contacto. El evento comercial primario debería ser `generate_lead` después de persistir correctamente el lead; “Me interesa” es una microseñal, no una conversión Ads. Por la previsión de GA4 + Ads + Consent Mode y administración universitaria, **GTM es la opción preferida como capa de entrega**, con un contrato de eventos controlado por código y sin tags arbitrarios.

### A. Qué está haciendo bien PUBLIC-004 y debe preservarse

- Identidad FUNDEPOS reconocible: azul académico, dorado como acento, logo/roseta y pareja tipográfica editorial.
- Catálogo disponible desde la entrada, sin landing intermedia que esconda los programas.
- Buscador visible y filtros locales sin latencia de red después de la carga inicial.
- Estado compartible en URL y resultados que reaccionan inmediatamente.
- Transparencia del precio por componentes, sin total inventado.
- Jerarquía de card consistente y páginas de programa con apertura destacada.
- Intereses anónimos sin cuenta ni fricción, con contador y página propia.
- Contenido inicial renderizado desde servidor y arquitectura proporcional a 32 programas.
- Contraste ya verificado y sistema visual coherente entre catálogo, detalle e intereses.

### B. Límites actuales observados

- El bloque de 32 cards mantiene demasiado ritmo uniforme: hay poco apoyo para explorar antes de filtrar.
- En mobile, el filtro inline expande 11 tipos + 6 campos y desplaza los resultados demasiado lejos.
- Las cards muestran casi toda la información disponible a la vez; en pantallas estrechas la jerarquía pierde fuerza.
- Falta una barra de resultados que reúna conteo, filtros activos, limpiar y una ordenación pequeña y útil.
- La ficha larga carece de tabla de contenidos/navegación de secciones y el CTA deja de estar disponible al avanzar.
- Algunos planes de estudio heredaron columnas colapsadas del PDF; una capa visual no puede reconstruir datos que no están estructurados.
- “Mis programas de interés” guarda, pero todavía no explica el siguiente paso ni facilita una comparación ligera.
- No hay aún una política ejecutada de canonical, sitemap, robots, Open Graph o datos estructurados.
- No hay contrato de analítica, control de duplicados de `page_view` ni preparación de consentimiento.

### C. Oportunidades priorizadas

| Prioridad | Oportunidad | Impacto esperado | Costo proporcional |
|---|---|---|---|
| HIGH | Reemplazar el filtro mobile inline por drawer/sheet con conteo, Aplicar, Limpiar y foco administrado | Devuelve los resultados al primer viewport y mejora la operación con una mano | Medio |
| HIGH | Simplificar la anatomía de card y aplicar progressive disclosure | Hace escaneables 32 programas sin perder información en la ficha | Medio |
| HIGH | Reestructurar la ficha con quick facts, contenidos, secciones y acción mobile persistente | Reduce paredes de texto y mantiene el siguiente paso visible | Medio |
| HIGH | Convertir Intereses en un puente explícito hacia la futura solicitud múltiple | Une descubrimiento e intención comercial sin pedir cuenta | Bajo/medio |
| HIGH | Definir y luego ejecutar la política SEO de canonicals, sitemap, filtros y páginas de programa | Evita duplicados y concentra descubrimiento orgánico en URLs útiles | Medio |
| HIGH | Crear un contrato pequeño de eventos + consentimiento antes de instalar tags | Evita telemetría inconsistente, PII accidental y doble conteo | Medio |
| MEDIUM | Añadir “Explorar por campo” y, si los datos lo soportan, “Próximos inicios” | Rompe la monotonía sin inventar promociones | Medio |
| MEDIUM | Añadir resultados relacionados por taxonomía en la ficha | Mejora recirculación e internal linking con reglas transparentes | Bajo |
| MEDIUM | Incorporar ordenación limitada a relevancia/nombre/próximo inicio | Da control sin simular un marketplace grande | Bajo/medio |
| MEDIUM | Diseñar compare-lite para 2–3 intereses, solo con datos comparables | Ayuda a decidir entre programas guardados | Medio |
| LOW | Probar sugerencias y sinónimos de búsqueda a partir de consultas reales | Puede elevar descubrimiento, pero 32 programas no justifican motor externo | Medio |
| LOW | Evaluar landings editoriales para algunas áreas/tipos | Puede capturar intención orgánica, pero solo si hay contenido único mantenible | Alto editorial |

No se recomienda añadir carruseles promocionales, personalización opaca, scores, reviews, badges de “popular” sin evidencia, ni un motor Algolia/Elastic para el volumen actual.

---

## 2. Método, alcance y evidencia

### Estado Git inicial

El repositorio estaba **dirty antes de RESEARCH-001**: `docs/12_PROJECT_STATE.md`, varios archivos de `src/app` y `src/components/catalog` estaban modificados, y existían cambios no rastreados en branding, intereses y recursos públicos. Se trataron como trabajo preexistente del usuario. Esta tarea solo agrega este artefacto y un ajuste mínimo al estado del proyecto.

### Herramientas utilizadas

- Codex con Computer Use / navegador real.
- Viewport desktop y mobile emulado a 390 × 844 para validar cambios de jerarquía y controles.
- Sitios activos de universidades y productos como evidencia primaria.
- Google Search Central, Google Analytics/Tag Platform, Google Ads Help, W3C/WAI y web.dev como documentación oficial vigente.
- Inspección read-only del repositorio y del render local de PUBLIC-004.

No se usaron cuentas, credenciales, propiedades GA4/Ads, formularios reales ni producción.

### Muestra examinada y saturación

Se examinaron **16 experiencias**. Se hizo interacción visual profunda en seis (ASU Online, Imperial College, University of London, MIT Professional Education, Tecnológico de Monterrey y Coursera), incluyendo desktop/mobile y uso de filtros o navegación. Las restantes se revisaron de forma focal sobre sus superficies activas y documentación oficial. La exploración se detuvo por saturación: los sitios adicionales repetían los mismos patrones de búsqueda visible, filtros agrupados, drawer mobile, cards de metadata limitada, quick facts y CTA persistente.

| Familia | Experiencias examinadas | Patrones buscados |
|---|---|---|
| University program finders | [ASU Online](https://asuonline.asu.edu/online-degree-programs/), [Northeastern Graduate Programs](https://graduate.northeastern.edu/programs/), [Imperial College Course Search](https://www.imperial.ac.uk/study/courses/), [University of London Courses](https://www.london.ac.uk/study/courses), [Monash Find a Course](https://www.monash.edu/study/courses/find-a-course), [RMIT Study](https://www.rmit.edu.au/study-with-us/levels-of-study), [Tecnológico de Monterrey Posgrados](https://maestriasydiplomados.tec.mx/programas/posgrados), [Harvard Extension Graduate Degrees](https://extension.harvard.edu/academics/academics-graduate-degrees/) | Catálogo, filtros, comparación, autoridad académica, detalle largo |
| Executive / continuing education | [MIT Professional Education](https://professional.mit.edu/course-catalog), [ESADE Executive Education](https://www.esade.edu/executive-education/en/find-your-programme), [IE Lifelong Learning](https://www.ie.edu/lifelong-learning/), [Harvard Professional Development](https://professional.dce.harvard.edu/leadership-management-programs/) | Fecha, duración, formato, inversión, estado, contacto |
| Discovery fuera de educación | [Coursera Courses](https://www.coursera.org/courses), [Udemy Course Search Help](https://support.udemy.com/hc/en-us/articles/115012244007-How-to-search-for-courses-on-Udemy), [Airbnb Wishlists](https://www.airbnb.com/help/article/137), [Booking.com](https://www.booking.com/) | Progressive disclosure, favoritos, filtros mobile, feedback de resultados |

### Evidencia visual material

- **PUBLIC-004 desktop:** hero académico, buscador muy visible, sidebar de filtros y grid de tres columnas; el conjunto es coherente, pero la densidad de metadata compite dentro de cada card.
- **PUBLIC-004 mobile:** el filtro usa un disclosure inline; al abrirlo, los 17 controles empujan los resultados varios viewports. La ficha coloca los quick facts antes del contenido, pero no conserva CTA al hacer scroll.
- **ASU:** búsqueda primero, filtros con conteo y Clear all; en mobile, drawer independiente y una barra inferior de acciones.
- **Imperial:** resultados compactos, filtros agrupados, compare explícito; en mobile, dos acciones principales “Compare” y “Filter Results”, con panel dedicado.
- **University of London:** detalle con propuesta, CTA inmediato, tabla de contenidos, quick facts y módulos largos organizados.
- **MIT Professional Education:** para educación ejecutiva prioriza fecha, duración, formato, precio y estado; el desktop tolera tabla, el mobile la reduce a cards.
- **Tecnológico de Monterrey:** drawer con escuela/tipo/modalidad, Limpiar y Aplicar; las cards exponen brochure, información y detalle, aunque con demasiadas rutas de contacto para FUNDEPOS.
- **Coursera:** filtros de acceso rápido más panel completo, cards con metadata progresiva y una pregunta de intención dentro de resultados; demuestra escalabilidad, no una estética a copiar.

No se guardaron screenshots en el repositorio: las capturas eran auxiliares, los hallazgos quedaron descritos y versionar imágenes de terceros agregaba peso y envejecimiento sin mejorar la decisión.

---

## 3. Hallazgos por dimensión

### 3.1 Primera impresión y descubrimiento visual

Los catálogos eficaces permiten llegar a programas en el primer viewport. La autoridad académica se construye con jerarquía editorial, copy concreto, tipografía y consistencia, no con un hero excesivamente alto. Cuando todos los programas reciben la misma caja y peso visual, la exploración depende demasiado de que el usuario ya sepa qué buscar.

Para FUNDEPOS, el catálogo debe seguir siendo la entrada. Antes del listado completo puede existir un bloque liviano “Explorar por campo” con los seis campos reales y, si la fecha es suficientemente confiable, un grupo “Próximos inicios”. No debe llamarse “Destacados” sin una regla editorial aprobada.

### 3.2 Búsqueda

En ASU, University of London y Coursera la búsqueda domina la entrada al catálogo. Los productos grandes agregan autocomplete, tolerancia a errores y sinónimos porque tienen cientos o miles de resultados; con 32 programas, FUNDEPOS obtiene casi todo el valor con búsqueda local accent-insensitive, resultados inmediatos y un placeholder orientador.

Recomendación: conservar la búsqueda actual, hacer visible cómo se combina con filtros y mostrar la consulta como estado activo. No añadir un motor externo. Registrar términos reales antes de decidir sinónimos/autocomplete. En mobile, la búsqueda debe aparecer antes del botón de filtros y permanecer fácil de recuperar.

### 3.3 Filtros

El patrón dominante es sidebar sticky en desktop y drawer/sheet en mobile. Los buenos paneles agrupan facetas, muestran selección y conteo, permiten limpiar y no alteran el contexto hasta Aplicar en mobile. Los chips superiores funcionan bien para facetas frecuentes, pero 11 tipos + 6 campos no caben como chips completos.

Para FUNDEPOS: sidebar desktop con dos grupos, resultados instantáneos y filtros activos fuera del panel; drawer mobile a pantalla completa o sheet alto con encabezado fijo, “Limpiar”, botón “Ver N programas”, scroll interno, cierre con Escape y retorno de foco. Los conteos por opción pueden diferirse hasta contar con una definición estable; el conteo total sí aporta de inmediato.

### 3.4 Cards

Las cards premium no son las que muestran más, sino las que permiten comparar rápido. En educación ejecutiva, fecha, duración, formato y costo pesan más que descripciones largas. Imperial y MIT compactan el inventario; Coursera expone más metadata porque el volumen y la prueba social lo justifican.

Para FUNDEPOS, la card debe priorizar: tipo, título, una línea de propuesta, próximo inicio, modalidad/duración, precio desglosado resumido y acciones. Campos de conocimiento pueden reducirse a uno o dos más “+N”, dejando el detalle completo para la ficha. La card completa puede ser navegable sin hacer que los controles de interés disparen navegación.

### 3.5 Detalle de programa

University of London y Harvard Extension muestran el patrón más transferible: hero con título/propuesta, CTA, quick facts, tabla de contenidos y secciones largas con encabezados claros. Los accordions son útiles para currículum, admisión o fechas, pero no deben esconder la información principal ni compensar datos de origen defectuosos.

Para FUNDEPOS: breadcrumb; hero corto; resumen; apertura/quick facts; acción primaria; contenido con tabla de contenidos; objetivo, perfil, plan, inversión y datos de apertura; programas relacionados. En mobile, una barra de acción inferior puede mantener “Me interesa” y luego “Solicitar información” cuando LEADS-001 exista.

### 3.6 Intereses, favoritos y comparación

Wishlist/shortlist funcionan cuando dan feedback inmediato y un siguiente paso. El contador de header y la página dedicada actuales son correctos. Un drawer adicional no es necesario. La comparación de Imperial y Monash sirve cuando los atributos son homogéneos; no conviene comparar texto libre o precios no equivalentes.

La mejora inmediata es feedback después de guardar (“Añadido a intereses” + enlace a la lista), resumen de selección y futura CTA única para consultar varios programas. Compare-lite puede ser una fase posterior para 2–3 programas y solo con tipo, modalidad, duración, próximo inicio y componentes de precio comparables.

### 3.7 Desktop vs mobile

**Desktop:** puede sostener sidebar y más metadata, pero el grid de tres cards densas debe reservarse para ancho amplio. El toolbar de resultados necesita conteo, filtros activos, limpiar y, como máximo, una ordenación corta.

**Mobile:** una columna, búsqueda primero, filtros en overlay, cards más cortas, objetivos táctiles generosos y acción persistente en detalle. No se debe trasladar la sidebar al flujo vertical ni conservar una tabla de contenido horizontal. El drawer necesita foco inicial, trampa de foco, Escape, cierre explícito y retorno al disparador.

### 3.8 Accesibilidad

- Usar `fieldset`/`legend` o grupos con nombre para las dos dimensiones de filtro.
- Anunciar el nuevo conteo de resultados de forma no intrusiva (`aria-live`), sin anunciar cada tecla.
- En accordions, el control debe ser un botón con `aria-expanded` y `aria-controls`, operable con Enter/Espacio, según [WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/).
- Mantener foco visible, orden lógico, navegación completa con teclado y estados seleccionados que no dependan solo del color.
- El drawer debe ser un diálogo correctamente nombrado, con foco contenido y retorno al botón que lo abrió.
- WCAG 2.2 AA establece un mínimo de 24 × 24 CSS px o espaciado equivalente; para mobile conviene diseñar controles principales cerca de 44 px cuando la composición lo permita. Véase [Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum).
- Respetar `prefers-reduced-motion`; evitar carruseles automáticos, animaciones de conteo y cambios de layout que desorienten.

### 3.9 Performance y Core Web Vitals

Los umbrales vigentes de “bueno” son LCP ≤ 2,5 s, INP ≤ 200 ms y CLS ≤ 0,1 en el percentil 75, separados por mobile/desktop ([web.dev](https://web.dev/articles/vitals)). No se midieron scores de producción porque esta tarea no tiene un deployment productivo comparable.

Guardrails para PUBLIC-005:

- mantener contenido inicial y páginas de programa renderizados en servidor;
- conservar filtrado local para 32 programas y evitar fetch por interacción;
- no hidratar secciones puramente editoriales;
- reservar dimensiones de imágenes y no depender de un hero fotográfico para comunicar autoridad;
- limitar scripts de terceros y cargar medición con consentimiento;
- no añadir carruseles, video de fondo o librerías de animación;
- medir INP real en filtros y drawer, CLS al cargar fuentes/activos y LCP de hero/título;
- evitar instrumentar cada pulsación, hover o scroll, que añade ruido y trabajo al main thread.

---

## 4. Pattern library para FUNDEPOS

### 1. Header

- **CURRENT:** logo/roseta, Catálogo e Intereses con contador.
- **OBSERVED PATTERNS:** navegación corta; CTA comercial visible solo donde el contexto lo justifica.
- **RECOMMENDATION:** conservar header sobrio; Catálogo e Intereses como rutas persistentes; en mobile usar roseta y etiquetas claras, no solo iconos.
- **WHY:** ya sostiene marca y orientación sin ocupar demasiado espacio.
- **DO NOT COPY:** megamenús, múltiples CTAs de admisión/contacto o header comercial sticky agresivo.

### 2. Catalog intro

- **CURRENT:** hero editorial con mensaje, cifras y buscador montado en el borde.
- **OBSERVED PATTERNS:** autoridad + acceso rápido; los mejores héroes no retrasan resultados.
- **RECOMMENDATION:** mantener identidad y mensaje, reducir cualquier altura que esconda el primer resultado; agregar seis entradas “Explorar por campo” debajo del buscador.
- **WHY:** rompe el patrón de 32 cajas sin inventar contenido.
- **DO NOT COPY:** sliders, rankings promocionales o fotografía genérica de campus.

### 3. Search

- **CURRENT:** búsqueda inmediata, accent-insensitive y sincronizada con `q`.
- **OBSERVED PATTERNS:** búsqueda visible, placeholder con ejemplos, consulta preservada.
- **RECOMMENDATION:** conservar lógica; añadir estado/limpiar y medir consultas estables antes de introducir sinónimos.
- **WHY:** el volumen no justifica autocomplete complejo.
- **DO NOT COPY:** motores externos, sugerencias vacías o search-as-you-type que anuncie cada tecla.

### 4. Desktop filters

- **CURRENT:** sidebar sticky con tipos y campos.
- **OBSERVED PATTERNS:** grupos plegables, selección visible, clear-all y conteo.
- **RECOMMENDATION:** conservar sidebar; encabezado “Filtrar”, selección por grupo, limpiar, y resumen de activos en el toolbar.
- **WHY:** 17 opciones encajan bien en dos grupos cuando hay ancho.
- **DO NOT COPY:** cinco o más dimensiones, conteos no confiables o aplicación con round-trip.

### 5. Mobile filters

- **CURRENT:** disclosure inline que empuja resultados.
- **OBSERVED PATTERNS:** drawer/sheet aislado con acciones fijas y scroll interno.
- **RECOMMENDATION:** diálogo de filtros con “Limpiar”, cierre, grupos, “Ver N programas”, foco administrado y estado preservado.
- **WHY:** es la corrección móvil de mayor impacto.
- **DO NOT COPY:** panel que ocupa el documento completo, cerrar al marcar cada opción o acción principal fuera del alcance del pulgar.

### 6. Result controls

- **CURRENT:** conteo y chips aparecen, pero no forman una barra de control completa.
- **OBSERVED PATTERNS:** count, selected filters, clear-all, sort y ocasional list/grid.
- **RECOMMENDATION:** toolbar compacto; ordenar solo por relevancia/nombre/próximo inicio si la semántica es estable. No añadir selector list/grid en v1.
- **WHY:** da feedback sin multiplicar opciones.
- **DO NOT COPY:** docenas de sorts, paginación para 32 elementos o toggles de vista sin necesidad.

### 7. Cards

- **CURRENT:** card rica con tipo, título, descripción, apertura, precio, campos y dos acciones.
- **OBSERVED PATTERNS:** escaneo por 3–5 atributos y detalle progresivo.
- **RECOMMENDATION:** tipo + título + propuesta breve + inicio/modalidad/duración + precio resumido + Ver/Interés; truncar campos secundarios con “+N”.
- **WHY:** reduce ruido manteniendo lo necesario para decidir abrir.
- **DO NOT COPY:** ratings, volumen de alumnos, badges de popularidad o imágenes decorativas sin fuente.

### 8. Pricing

- **CURRENT:** componentes visibles y honestos, sin total sintético.
- **OBSERVED PATTERNS:** educación ejecutiva expone inversión; universidades separan matrícula, fees o costo por unidad.
- **RECOMMENDATION:** conservar componentes; en card usar versión compacta y en detalle la explicación completa, con moneda/periodicidad explícitas.
- **WHY:** es una fortaleza diferencial y reduce ambigüedad.
- **DO NOT COPY:** “desde” o cuotas calculadas sin regla de negocio; sumar componentes incompatibles.

### 9. Interest behavior

- **CURRENT:** toggle, localStorage, contador y `/intereses`.
- **OBSERVED PATTERNS:** feedback inmediato, shortlist persistente y CTA posterior.
- **RECOMMENDATION:** toast/status accesible con enlace a la lista; en `/intereses`, resumen y futura consulta múltiple.
- **WHY:** preserva la baja fricción y crea continuidad comercial.
- **DO NOT COPY:** login obligatorio, drawer redundante o considerar el guardado como lead.

### 10. Program detail

- **CURRENT:** hero, contenido editorial y panel de apertura sticky en desktop.
- **OBSERVED PATTERNS:** breadcrumb, propuesta, quick facts, TOC, CTA y contenido modular.
- **RECOMMENDATION:** esa secuencia, más relacionados por taxonomía y jerarquía clara de información operativa.
- **WHY:** ayuda tanto a personas como a internal linking/SEO.
- **DO NOT COPY:** héroes de pantalla completa, múltiples formularios o CTAs con igual peso.

### 11. Long curriculum

- **CURRENT:** headings solo cuando la fuente tiene cuatrimestres exactos; algunos PDFs colapsaron columnas.
- **OBSERVED PATTERNS:** accordions, módulos numerados y navegación de sección.
- **RECOMMENDATION:** accordion únicamente con estructura verificable; contenido esencial abierto por defecto; elevar los PDFs colapsados como deuda de datos.
- **WHY:** la UI no debe inventar materias ni relaciones.
- **DO NOT COPY:** cortar texto arbitrariamente o reconstruir dos columnas por heurísticas visuales.

### 12. CTA / conversion path

- **CURRENT:** “Me interesa” y navegación al programa; no existe lead.
- **OBSERVED PATTERNS:** CTA persistente y solicitud de información cerca de quick facts.
- **RECOMMENDATION:** hoy, Interés es la acción primaria no comercial; tras LEADS-001, “Solicitar información” debe ser primaria en shortlist/detalle y persistente en mobile.
- **WHY:** distingue intención de conversión real.
- **DO NOT COPY:** WhatsApp antes de persistir lead, formularios repetidos o “Aplicar ahora” si el proceso no existe.

### 13. Empty states

- **CURRENT:** estados de cero resultados e intereses vacíos.
- **OBSERVED PATTERNS:** explicación breve, preservar contexto y una recuperación clara.
- **RECOMMENDATION:** mostrar qué combinación no produjo resultados; acciones “Limpiar filtros” y “Ver todos”; no esconder búsqueda/filtros.
- **WHY:** convierte un callejón sin salida en recuperación.
- **DO NOT COPY:** recomendaciones personalizadas inventadas o mensajes de error genéricos.

### 14. Mobile navigation

- **CURRENT:** header reducido y scroll de página convencional.
- **OBSERVED PATTERNS:** header compacto, una acción de catálogo y barra inferior solo en momentos de decisión.
- **RECOMMENDATION:** mantener navegación simple; barra sticky en detalle, no en todo el catálogo; respetar safe areas y teclado virtual.
- **WHY:** conserva espacio y pone acciones donde la intención es alta.
- **DO NOT COPY:** bottom nav de app con cinco destinos o barras promocionales permanentes.

---

## 5. Dirección propuesta para PUBLIC-005

### Principio

**“Exploración académica editorial con decisión asistida.”** FUNDEPOS debe sentirse universitaria y premium, con la claridad transaccional de un buen producto digital, sin adoptar estética ni mecánicas de e-commerce masivo.

### Jerarquía de información

1. Identidad + orientación.
2. Promesa breve del catálogo.
3. Búsqueda.
4. Explorar por campo.
5. Controles y conteo de resultados.
6. Cards escaneables.
7. Detalle con hechos rápidos y narrativa académica.
8. Guardado y siguiente paso comercial.

### Desktop

- Header actual y hero más contenido.
- Buscador como puente entre hero y catálogo.
- Seis accesos por campo como banda editorial, no como cards de programa.
- Zona de resultados con sidebar sticky y toolbar superior.
- Grid de dos columnas en ancho de trabajo habitual; tres solo cuando cada card conserva aire y línea de lectura.
- Sin paginación para 32 programas; el filtrado local debe seguir inmediato.

### Mobile

- Header compacto, hero, buscador y fila sticky de “Filtros (N)” + “Ordenar”.
- Drawer/sheet accesible, con acciones persistentes y selección temporal hasta Aplicar.
- Una card por fila, metadata priorizada y campos secundarios colapsados.
- En detalle: quick facts primero, contenidos en select/accordion o índice vertical, y barra de acción inferior.

### Anatomía de card

1. Tipo académico.
2. Título.
3. Propuesta de una o dos líneas.
4. Próximo inicio.
5. Modalidad + duración.
6. Precio por componentes en versión compacta.
7. Campo principal + “+N” si aplica.
8. “Ver programa” y control de interés con estado explícito.

### Comportamiento de filtros

- OR dentro de tipo y dentro de campo; AND entre dimensiones, igual que hoy.
- Resultados instantáneos en desktop.
- En mobile, selección dentro del drawer y aplicación conjunta para evitar saltos.
- URL preserva el estado, pero la interfaz no necesita convertir cada opción en enlace crawlable.
- Conteo visible y filtros activos removibles en ambos breakpoints.

### Anatomía de ficha

1. Breadcrumb.
2. Tipo, H1 y propuesta.
3. Quick facts de apertura: inicio, modalidad, duración y precio.
4. CTA de interés/solicitud.
5. Tabla de contenidos.
6. Descripción/objetivo.
7. Perfil o audiencia, si existe.
8. Plan de estudio con estructura verificable.
9. Inversión y condiciones de apertura.
10. Programas relacionados por campo/tipo.

### Viaje de intereses

- Guardar desde card/detalle → feedback accesible → contador de header.
- `/intereses` sigue siendo la superficie central.
- Mostrar atributos comparables en filas consistentes.
- Diseñar espacio para “Solicitar información sobre N programas” sin activarlo hasta LEADS-001.
- Compare-lite se decide después de auditar consistencia de modalidad, duración, fechas y pricing.

### Ritmo visual, densidad y CTA

- Mantener azul académico como ancla, dorado como acento y rojo solo para remoción/riesgo.
- Alternar banda editorial, controles, resultados y espacios de respiro; no alternar estilos de card arbitrariamente.
- Una acción primaria por contexto: “Ver programa” en exploración; “Me interesa”/“Solicitar información” en decisión.
- Imágenes solo cuando existan activos propios con un sistema consistente; no usar stock para diferenciar cards.

### Criterios de aceptación de diseño para PUBLIC-005

- Al abrir filtros en mobile, los resultados no cambian hasta Aplicar y el conteo esperado es visible.
- Una card puede escanearse por título, próximo inicio, modalidad/duración y precio sin leer la descripción completa.
- Desde cualquier punto de una ficha mobile larga existe un camino claro al CTA.
- No se inventan promociones, rankings, testimonios, salidas laborales, materias ni totales de precio.
- Todas las mejoras mantienen filtrado local, URL state, intereses y datos existentes.

---

## 6. Blueprint conceptual para SEO-001

### 6.1 Estado actual observado

- El catálogo y las fichas se renderizan desde servidor y los filtros operan localmente: buena base para indexabilidad y performance.
- Las fichas generan `title` y `description`, pero no se observó política ejecutada de canonical, Open Graph, breadcrumbs estructurados, sitemap o robots.
- `/` y `/programas` exponen el mismo catálogo; antes de publicar debe elegirse una única URL canónica.
- `q`, `type` y `field` producen múltiples estados de la misma superficie.

### 6.2 Crawl, index, rutas y canonical

1. Elegir `/` como catálogo canónico, salvo decisión explícita de preferir `/programas`; redirigir permanentemente el alias o declararlo canonical de forma consistente.
2. Añadir canonical absoluto y autorreferente a cada URL indexable.
3. Mantener `/programas/[slug]` como unidad indexable principal, con 200 para contenido vigente, 404 real para inexistente y una política editorial para programas retirados.
4. Generar sitemap solo con URLs canónicas públicas: catálogo, fichas publicadas y futuras landings editoriales aprobadas. Google recomienda incluir las URLs que se quieren mostrar en Search ([sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)).
5. `robots.txt` debe permitir el contenido indexable y referenciar el sitemap; no usarlo como sustituto de canonical.
6. Mantener contenido esencial, links y metadata en HTML server-rendered. Google puede renderizar JavaScript, pero recomienda SSR/pre-render por velocidad y compatibilidad con otros bots ([JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)).

### 6.3 Política específica para URLs filtradas

| Variante | Intención | Recomendación |
|---|---|---|
| `/` | Catálogo canónico | `index,follow`, canonical autorreferente, en sitemap |
| `/programas` | Alias actual | redirección permanente a `/` o canonical a `/`; no mantener dos señales competidoras |
| `?type=...` / `?field=...` | Estado UX facetado | no incluir en sitemap ni enlazar como navegación crawlable; canonical a `/`; no usar `noindex` por defecto como sustituto de canonical |
| `?q=...` | Resultado de búsqueda interna | no promover ni incluir en sitemap; preferir `noindex,follow` porque no es landing orgánica y evitar enviar el término libre en telemetría/URL reportada |
| combinaciones sin resultados | Estado UX | respuesta útil para usuario; no landing indexable; si en el futuro se habilita crawl de facetas, devolver 404 a combinaciones inválidas |

Google advierte que la navegación facetada puede crear espacios casi infinitos y ralentizar el descubrimiento; si las variantes no necesitan indexarse, recomienda evitar que el crawler las descubra o gestionar el rastreo. También indica que canonical puede consolidar señales y que `robots.txt` no es un mecanismo de canonicalización ([faceted navigation](https://developers.google.com/search/blog/2024/12/crawling-december-faceted-nav), [canonical](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)).

Para este catálogo pequeño no se justifica bloquear parámetros preventivamente en `robots.txt` si los controles no generan anchors crawlables. Primero aplicar canonical, sitemap e internal links consistentes; después observar Search Console. Si apareciera una explosión real de crawl, decidir bloqueo explícito sabiendo que un URL bloqueado no permite leer su canonical.

### 6.4 On-page para `/programas/[slug]`

- **Title:** `{Nombre del programa} | Universidad FUNDEPOS`; incluir tipo solo si evita ambigüedad y no duplica el nombre.
- **Meta description:** resumen único, factual y mantenible; Google puede elegir contenido de página en su lugar ([snippets](https://developers.google.com/search/docs/appearance/snippet)).
- **H1:** un solo título visual principal, consistente con title/OG. Google usa title, H1, texto prominente, links y `og:title` como señales ([title links](https://developers.google.com/search/docs/appearance/title-link)).
- **Headings:** H2 por objetivo, perfil, plan, inversión/apertura; H3 para periodos/módulos reales.
- **Breadcrumb visible:** Catálogo → tipo o área cuando exista una ruta real → programa.
- **Internal links:** desde catálogo/landings al detalle; desde detalle a áreas/tipos reales y 2–4 programas relacionados por reglas transparentes.
- **Social:** `og:title`, `og:description`, URL canónica y una imagen institucional/programa válida; Twitter/X card equivalente.
- **Freshness:** mostrar fecha de inicio, modalidad, duración y pricing desde Offering; no insertar fechas en title salvo que la página represente una cohorte específica.
- **Contenido:** propuesta, objetivo, audiencia y currículum únicos; no duplicar texto de otras fichas ni rellenar secciones vacías.
- **FAQ:** solo con preguntas y respuestas reales visibles. No es requisito y no debe crearse por expectativa de rich result: Google retiró ese feature de Search en junio de 2026.

### 6.5 Structured data: estado verificado en 2026

| Tipo | Estado para Google Search | Uso recomendado |
|---|---|---|
| `BreadcrumbList` | Rich result soportado | Sí, en fichas y futuras landings; reflejar rutas reales ([Google](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb)) |
| `Organization` | Feature soportada para información institucional | Sí, una representación canónica de Universidad FUNDEPOS, normalmente en home/about; datos oficiales y logo ([Search gallery](https://developers.google.com/search/docs/appearance/structured-data/search-gallery)) |
| `Course` + `ItemList`/Carousel | **Course list rich result soportado actualmente**; mínimo tres cursos, nombre/description y URLs canónicas únicas | Piloto solo si los programas cumplen definición de course y puede mantenerse el markup del catálogo; validar Rich Results Test ([Google Course list](https://developers.google.com/search/docs/appearance/structured-data/course)) |
| `Course` aislado en cada ficha | Schema.org semánticamente válido; el feature de Google documentado es una **lista** de cursos, no una promesa de rich result individual | Opcional como semántica después del piloto; no venderlo como mejora garantizada |
| `EducationalOccupationalProgram` | Tipo válido en schema.org, pero no figura como feature independiente en la galería actual de rich results de Google | Opcional para semántica de programas académicos; no priorizarlo como mejora de visibilidad en Google |
| Course info | Google retiró su documentación en septiembre de 2025 porque dejó de mostrarse en Search; es distinto del **Course list** que sí continúa soportado | No implementar ni confundir con Course list |
| `FAQPage` | El contenido FAQ puede ser útil, pero Google retiró el rich result y su documentación en junio de 2026 | No crear FAQs ni markup para perseguir un enhancement inexistente |
| `Product` / `AggregateRating` inventados | No corresponden al producto/datos actuales | No usar |

Google registra esos retiros en su [historial oficial de documentación](https://developers.google.com/search/updates). Tampoco garantiza un rich result aunque el markup sea válido. Validar sintaxis en Schema Markup Validator, elegibilidad en Rich Results Test y comportamiento real en Search Console.

### 6.6 Landings de taxonomía

No crear automáticamente 17 páginas. Candidatas razonables: algunos de los seis campos de conocimiento y tipos con intención clara (por ejemplo, maestrías o técnicos), solo si cada página tiene:

- demanda/intención identificable;
- introducción y orientación únicas, no un bloque generado con nombres sustituidos;
- suficientes programas vigentes;
- enlaces a fichas y relación editorial clara;
- propietario y proceso de actualización.

Si no cumple, el filtro sigue siendo mejor. Páginas delgadas que replican el catálogo fragmentan señales y crean deuda editorial.

### 6.7 Checklist técnico futuro

- Dominio/HTTPS final y `metadataBase` correctos.
- Una URL canónica por contenido; enlaces internos y sitemap apuntan a ella.
- Sitemap y robots accesibles, sin preview/draft.
- Search Console de la Universidad, inspección de URLs y métricas de indexación.
- `BreadcrumbList` y `Organization`; piloto controlado de Course list.
- OG completo y URLs absolutas.
- 404/redirects correctos al retirar o renombrar slugs.
- Datos esenciales visibles sin interacción y HTML inicial verificable.
- CWV de campo y mobile como fuente de verdad; lab como diagnóstico.

---

## 7. Blueprint conceptual de GA4, Ads y consentimiento

### 7.1 Principios

- Medir decisiones y etapas, no cada interacción de interfaz.
- Usar eventos recomendados de GA4 cuando el significado coincide; preservan reportes e integraciones ([recommended events](https://support.google.com/analytics/answer/9267735)).
- Ningún evento debe contener nombre, email, teléfono, documento, mensaje libre u otro PII.
- El contrato de eventos pertenece al producto/código; GTM decide destinos y reglas de activación.
- Elegir una sola estrategia de `page_view` para App Router y verificar en DebugView; Google advierte que history tracking automático + implementación manual puede duplicar vistas ([SPA measurement](https://developers.google.com/analytics/devguides/collection/ga4/single-page-applications)).

### 7.2 Taxonomía pequeña propuesta

| Evento | Tipo | Disparo | Parámetros clave |
|---|---|---|---|
| `view_item_list` | GA4 recomendado | primera vista útil del catálogo/lista, no cada tecla | `item_list_id`, `item_list_name`, `items`, `results_count` |
| `search` | GA4 recomendado | consulta estable tras pausa/Enter/blur y cambio de resultados | `search_term` sanitizado, `results_count` |
| `filter_programs` | custom | cambio consolidado en desktop o Aplicar en mobile | `type_count`, `field_count`, `results_count` |
| `select_item` | GA4 recomendado | abrir un programa desde una lista | `item_list_id`, `items` con un programa |
| `view_item` | GA4 recomendado | vista de ficha de programa | `items` con un programa |
| `add_to_wishlist` | GA4 recomendado | programa añadido a Intereses | `items`, `interest_count` |
| `remove_interest` | custom | programa retirado de Intereses | `program_id`, `interest_count`, `source` |
| `view_interests` | custom | vista útil de `/intereses` | `interest_count` |
| `generate_lead` | GA4 recomendado | **solo después** de persistencia exitosa del lead | `program_count`, `lead_source`; `value` solo con regla comercial aprobada |
| `contact_whatsapp` | custom | apertura intencional del canal tras el lead, si ese flujo se aprueba | `program_count`, `source` |

Para `items`, usar `item_id` estable, `item_name` y `item_category` como tipo académico. No forzar un “campo principal” cuando la relación es muchos-a-muchos. Modalidad, fecha de inicio y cantidad de campos pueden ser parámetros de baja cardinalidad. No enviar descripción, currículum, lista completa de campos como dimensión de alto cardinality ni un precio total inventado.

`search_term` requiere límite y sanitización de patrones de email/teléfono. Además, la configuración de page location debe remover `q` antes de enviarla, porque hoy la búsqueda queda en URL. Si no puede garantizarse esa sanitización, medir búsqueda sin el término.

### 7.3 Funnel propuesto

```text
view_item_list
  -> search / filter_programs
  -> select_item
  -> view_item
  -> add_to_wishlist
  -> view_interests
  -> generate_lead (persistencia OK)
  -> contact_whatsapp / futura solicitud por email
  -> qualify_lead / close_convert_lead (futuro, desde CRM/proxy)
```

La secuencia es analítica, no obliga a que todas las personas pasen por Intereses. Debe permitirse lead desde una ficha y desde shortlist.

### 7.4 Key events y conversiones Ads

- **GA4 key event primario:** `generate_lead` después de confirmación del backend.
- **Google Ads primary candidate:** el mismo lead importado desde GA4 o medido con tag Ads; elegir una sola fuente de verdad para optimización y deduplicar.
- **Secondary/observation:** `contact_whatsapp` hasta demostrar que representa contacto real y no solo apertura accidental.
- **Futuro:** `qualify_lead` o conversión offline desde el flujo corporativo cuando exista calidad/estado en CRM.
- **No conversión Ads:** búsqueda, filtro, vista de ficha, add interest o vista de intereses.

Google Ads permite crear conversiones a partir de eventos/key events GA4; solo los marcados como key events son elegibles para importar ([Google Ads](https://support.google.com/google-ads/answer/2375435)). Definir counting, attribution y primary/secondary en el momento de conectar cuentas, no en esta investigación.

### 7.5 Eventos que no vale la pena recolectar

- hover de card, foco de inputs, cada tecla o cada scroll;
- abrir/cerrar cada accordion salvo una pregunta de producto explícita;
- impresiones de cada chip o faceta;
- clicks duplicados en contenedores cuando ya existe `select_item`;
- error de validación de cada campo con su contenido;
- `add_to_wishlist` como conversión;
- precio sintético o “valor de lead” sin definición comercial;
- PII o texto libre de formularios, WhatsApp y email.

### 7.6 GTM vs gtag directo

**Recomendación: GTM**, bajo estas condiciones:

- un wrapper de aplicación emite un objeto estable al `dataLayer`;
- GTM usa plantillas nativas de GA4/Ads, no Custom HTML arbitrario;
- acceso, workspaces, ambientes, preview y publicación quedan gobernados por la Universidad;
- el código mantiene nombres, parámetros, sanitización y momento de disparo;
- se documenta una sola fuente de `page_view` y se valida en DebugView/Tag Assistant;
- Consent Mode bloquea o adapta tags antes de que disparen.

GTM es preferible por la combinación prevista de GA4, Ads, posible CMP/Consent Mode y mantenimiento posterior sin despliegue de código. Google documenta el `dataLayer` como interfaz estructurada para eventos y variables ([Tag Platform](https://developers.google.com/tag-platform/tag-manager/datalayer)).

`gtag.js` directo sería razonable si el alcance quedara permanentemente en una única propiedad GA4 y un equipo de desarrollo controlara cada cambio. No es la expectativa más probable aquí. GTM no debe convertirse en una segunda aplicación sin control: el contrato sigue en código y los tags deben ser mínimos.

### 7.7 Consent/privacy readiness

- Diseñar un consent state central antes de cargar destinos no esenciales.
- Consent Mode v2 necesita estados para `analytics_storage`, `ad_storage`, `ad_user_data` y `ad_personalization`; definir default y update según política aplicable ([Google](https://developers.google.com/tag-platform/security/guides/consent)).
- Elegir implementación básica o avanzada con revisión legal/política institucional. En básica no se cargan tags antes de consentir; en avanzada pueden enviarse pings sin cookies con defaults denegados.
- Persistir preferencia de consentimiento, ofrecer reapertura/revocación y asegurar que el update ocurra antes de navegación.
- No inferir consentimiento por uso del sitio ni mezclar Intereses en localStorage con consentimiento de Analytics/Ads.
- Minimizar retención, limitar acceso y documentar destinos; revisar Costa Rica y visitantes internacionales antes del go-live.
- No activar enhanced conversions ni enviar hashes de email/teléfono hasta contar con base legal, disclosure, consentimiento/configuración apropiados y decisión explícita.

---

## 8. Referentes finales para PUBLIC-005

| Referente | Pantalla/capacidad | Patrón útil | Aprendizaje para FUNDEPOS | No copiar |
|---|---|---|---|---|
| [ASU Online](https://asuonline.asu.edu/online-degree-programs/) | Finder desktop/mobile | búsqueda primero, sidebar, drawer mobile, Clear all, conteo | separar filtros del flujo mobile y mantener estado visible | taxonomía enorme, estética ASU, barra comercial agresiva |
| [Imperial College](https://www.imperial.ac.uk/study/courses/) | Resultados + compare | cards compactas, filtros agrupados, compare count | compare-lite solo tras guardar y con datos homogéneos | selector list/grid y paginación innecesarios para 32 |
| [University of London](https://www.london.ac.uk/study/courses) | Catálogo y ficha larga | entradas por modalidad, TOC, quick facts, CTA | mejor modelo para detalle editorial y contenido largo | hero sobredimensionado y profundidad de contenido no disponible |
| [MIT Professional Education](https://professional.mit.edu/course-catalog) | Catálogo ejecutivo | fecha, duración, formato, fee y status como atributos principales | priorizar información operativa en cards | tabla desktop densa e instructores en catálogo |
| [Tecnológico de Monterrey](https://maestriasydiplomados.tec.mx/programas/posgrados) | Filtros y contacto | drawer por escuela/tipo/modalidad, Limpiar/Aplicar | panel mobile con acciones fijas | múltiples CTAs, chat y brochure en cada card |
| [Coursera](https://www.coursera.org/courses) | Discovery a gran escala | chips rápidos + panel completo, metadata progresiva, objetivo del usuario | progressive disclosure y orientación por intención | ratings, promociones, volumen y lógica de marketplace |
| [Harvard Extension](https://extension.harvard.edu/academics/academics-graduate-degrees/) | Degree finder/detail | quick facts, contenido académico y Get Info | combinar autoridad con hechos rápidos y CTA sobrio | copy/credenciales que FUNDEPOS no posee en la fuente |

---

## 9. Decisiones que PUBLIC-005 debe cerrar

1. Confirmar drawer/sheet mobile y su modelo de Aplicar vs instantáneo.
2. Aprobar la anatomía reducida de card y qué campos pasan al detalle.
3. Aprobar entradas “Explorar por campo” y regla de “Próximos inicios”, si aplica.
4. Decidir si compare-lite entra ahora o después de LEADS-001.
5. Definir CTA principal antes y después de que exista persistencia de lead.
6. Escoger `/` o `/programas` como URL canónica del catálogo.
7. Confirmar qué taxonomías merecen evaluación editorial para SEO, sin crearlas aún.
8. Aprobar GTM como entrega y el contrato de eventos antes de instrumentar.

### Cambios que esta investigación no recomienda

- Rebrand, cambio de paleta o tipografías por imitación de otra universidad.
- E-commerce visual, ratings, stock photography, badges o urgencia inventada.
- Motor de búsqueda externo, paginación o arquitectura de catálogo masivo.
- Indexar todas las combinaciones de filtros.
- Crear 17 landings delgadas de taxonomía.
- Marcar Intereses como conversión Ads.
- Instalar GA4/GTM sin contrato, sanitización, consentimiento y control de page views.
- Usar accordions para esconder contenido esencial o “arreglar” datos no estructurados.
- Implementar Course/Product/FAQ schema sin verificar elegibilidad, visibilidad y contenido real.

---

## 10. Fuentes normativas principales

- Google Search Central: [Course list](https://developers.google.com/search/docs/appearance/structured-data/course), [structured data gallery](https://developers.google.com/search/docs/appearance/structured-data/search-gallery), [documentation updates](https://developers.google.com/search/updates), [Breadcrumb](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb), [canonical URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls), [faceted navigation](https://developers.google.com/search/blog/2024/12/crawling-december-faceted-nav), [JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics), [sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap), [title links](https://developers.google.com/search/docs/appearance/title-link), [snippets](https://developers.google.com/search/docs/appearance/snippet).
- Google Analytics / Tag Platform: [recommended events](https://support.google.com/analytics/answer/9267735), [SPA measurement](https://developers.google.com/analytics/devguides/collection/ga4/single-page-applications), [dataLayer](https://developers.google.com/tag-platform/tag-manager/datalayer), [Consent Mode](https://developers.google.com/tag-platform/security/concepts/consent-mode), [Consent Mode setup](https://developers.google.com/tag-platform/security/guides/consent).
- Google Ads: [GA4 events as conversions](https://support.google.com/google-ads/answer/2375435), [website conversion measurement](https://support.google.com/google-ads/answer/7521212), [conversion/key-event implementation](https://developers.google.com/tag-platform/devguides/conversions).
- W3C/WAI: [Accordion APG](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/), [WCAG 2.2 Target Size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum).
- web.dev: [Core Web Vitals](https://web.dev/articles/vitals), [LCP](https://web.dev/articles/optimize-lcp), [INP](https://web.dev/articles/inp).

---

## 11. Cierre de investigación

RESEARCH-001 alcanzó saturación suficiente para decidir PUBLIC-005: seis experiencias se inspeccionaron con Computer Use de forma profunda y diez adicionales aportaron contraste focal, cubriendo higher education, educación ejecutiva y productos de discovery. No hubo cambios de app, UI, datos, arquitectura, SEO o analítica; tampoco se guardaron capturas por no aportar suficiente valor frente a su peso y obsolescencia.

**Siguiente paso recomendado:** una decisión explícita de PUBLIC-005 sobre drawer mobile, densidad/anatomía de cards, estructura de ficha, viaje de Intereses y límites de alcance. Después, separar ejecución visual de SEO-001 y de la futura instrumentación ANALYTICS-001.
