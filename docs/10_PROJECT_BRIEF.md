# 10_PROJECT_BRIEF.md

## 1. Identificación del proyecto

**Proyecto:** Catálogo Web de Oferta Académica  
**Organización:** Universidad FUNDEPOS  
**Estado del documento:** Inicial / v1  
**Estado del proyecto:** Discovery / Inicialización

---

## 2. Propósito

Construir un catálogo web público de la oferta académica de Universidad FUNDEPOS que permita a potenciales estudiantes descubrir, buscar, filtrar, consultar y seleccionar programas académicos de manera sencilla, visual e intuitiva.

La experiencia de descubrimiento tomará como referencia conceptual un catálogo de productos moderno, similar a la experiencia de navegación de Amazon, adaptado al contexto académico.

El catálogo debe permitir que una persona pueda explorar la oferta sin registrarse, comprender suficientemente cada programa dentro del propio portal y, cuando tenga interés, solicitar información sobre uno o varios programas mediante un proceso de baja fricción.

El sistema funcionará además como una herramienta de captación comercial, convirtiendo el interés de los visitantes en leads identificables para el equipo encargado de Universidad FUNDEPOS.

---

## 3. Objetivos

### 3.1 Objetivo principal

Facilitar el descubrimiento y consulta de la oferta académica de Universidad FUNDEPOS mediante una experiencia web pública, moderna, navegable, filtrable y orientada a conversión.

### 3.2 Objetivos específicos

- Centralizar la oferta académica disponible en un único catálogo web.
- Permitir navegación libre sin necesidad de registro.
- Facilitar el descubrimiento de programas mediante búsqueda textual.
- Permitir filtrado mediante diferentes dimensiones de clasificación.
- Proporcionar páginas individuales con información suficientemente completa sobre cada programa.
- Permitir seleccionar uno o varios programas de interés durante la navegación.
- Conservar localmente la última selección de programas realizada desde un mismo dispositivo/navegador.
- Capturar leads con la menor fricción razonable.
- Permitir iniciar contacto mediante correo electrónico o WhatsApp.
- Asociar cada lead con los programas que originaron su interés.
- Mantener automáticamente fuera del catálogo público programas cuya fecha de inicio ya haya pasado.
- Permitir que personal no técnico mantenga la oferta mediante un CMS.
- Garantizar una experiencia adecuada en dispositivos móviles, tabletas y computadoras.
- Permitir el crecimiento futuro del catálogo sin depender de modificaciones de código para las operaciones ordinarias de contenido.

---

## 4. Usuarios y consumidores

### 4.1 Visitante / potencial estudiante

Usuario público que desea conocer la oferta académica de Universidad FUNDEPOS.

No requiere cuenta ni autenticación para:

- acceder al catálogo;
- navegar ofertas;
- buscar;
- utilizar filtros;
- consultar fichas de programas;
- seleccionar programas de interés.

Solo deberá proporcionar información personal mínima cuando decida solicitar información.

### 4.2 Equipo comercial

Personal de Universidad FUNDEPOS encargado de atender solicitudes de potenciales estudiantes.

Debe recibir información suficiente para identificar:

- al interesado;
- sus datos de contacto;
- los programas en los que manifestó interés;
- el canal de contacto seleccionado.

### 4.3 Gestor de contenido

Personal autorizado de Universidad FUNDEPOS sin necesidad de conocimientos de programación.

Debe poder mantener la oferta académica utilizando un CMS con formularios y estructuras predefinidas.

---

## 5. Concepto de experiencia

El catálogo se concibe como un **marketplace de descubrimiento académico**, sin constituir un comercio electrónico.

La página de entrada debe permitir descubrir rápidamente la oferta disponible mediante elementos visuales, búsqueda, categorías, tipos de producto académico y otros mecanismos de navegación.

Cada oferta deberá presentarse como una unidad identificable dentro del catálogo y conducir a una ficha individual detallada.

La experiencia debe priorizar:

- descubrimiento;
- claridad;
- facilidad de navegación;
- búsqueda rápida;
- comparación visual;
- exploración progresiva;
- baja fricción;
- conversión a solicitud de información.

No se contempla inicialmente la compra directa de programas dentro del catálogo.

---

## 6. Alcance de la oferta académica

El sistema debe soportar diferentes tipos de productos académicos y no limitar su modelo a la oferta existente en el lanzamiento.

El catálogo debe poder contener, entre otros:

- Técnicos;
- Diplomados;
- Especialistas;
- Misiones académicas;
- Seminarios;
- Programas ejecutivos;
- Bachilleratos;
- Licenciaturas;
- Maestrías;
- Másteres;
- Doctorados.

La disponibilidad actual de un determinado tipo no condiciona la capacidad futura del sistema para administrarlo.

---

## 7. Clasificación y filtrado

La oferta utilizará dimensiones independientes y combinables de clasificación.

### 7.1 Campo de conocimiento

Responde principalmente a la pregunta:

**¿Sobre qué quiero estudiar?**

Las categorías temáticas iniciales son:

1. Gobierno, riesgos y cumplimiento.
2. Dirección, liderazgo y estrategia.
3. Finanzas, tributación y mercados.
4. Derecho, sector público y regulación.
5. Tecnología, datos e inteligencia artificial.
6. Operaciones, seguros y mercados de especialidad.

Estas categorías representan contenido formativo.

Un mismo programa puede pertenecer a uno o varios campos de conocimiento simultáneamente cuando su contenido, plan de estudios o perfil lo justifique.

### 7.2 Tipo de producto académico

Responde principalmente a la pregunta:

**¿Qué tipo de programa quiero estudiar?**

Los tipos iniciales contemplados son:

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

Esta dimensión es independiente del campo de conocimiento.

Por ejemplo, un visitante podrá explorar:

- todas las ofertas relacionadas con Tecnología;
- todas las Maestrías;
- Maestrías relacionadas con Finanzas;
- Técnicos relacionados con Tecnología;
- cualquier otra combinación válida entre dimensiones.

### 7.3 Combinación de filtros

Los filtros de diferentes dimensiones deberán poder combinarse para reducir progresivamente los resultados.

El modelo debe permitir incorporar en el futuro nuevas dimensiones de filtrado cuando exista una necesidad real, sin alterar conceptualmente las existentes.

---

## 8. Búsqueda

El catálogo debe disponer de búsqueda textual que permita localizar programas de acuerdo con su contenido indexable.

La búsqueda deberá complementar, y no sustituir, los filtros por campo de conocimiento y tipo de producto académico.

El visitante podrá utilizar búsqueda y filtros conjuntamente.

---

## 9. Ficha de programa

Cada programa deberá disponer de una página individual capaz de proporcionar la información necesaria para comprender adecuadamente la oferta sin depender de fuentes externas.

La estructura podrá contemplar, según corresponda al producto académico:

- nombre;
- tipo de producto académico;
- descripción;
- campos de conocimiento;
- perfil de ingreso;
- perfil de salida;
- requisitos;
- contenido o plan de estudios;
- duración;
- modalidad;
- fechas;
- horarios;
- precio o inversión;
- información complementaria;
- llamada a la acción para solicitar información.

Los campos concretos y su obligatoriedad podrán variar según el tipo de oferta y serán refinados durante el diseño funcional y arquitectónico.

---

## 10. Vigencia y visibilidad de ofertas

Una oferta pública debe disponer de una fecha de inicio válida.

No podrá mostrarse en el catálogo público una oferta cuya fecha de inicio sea anterior a la fecha actual.

Cuando la fecha de inicio de una oferta haya pasado, esta deberá dejar de visualizarse automáticamente en el catálogo público.

El programa podrá permanecer registrado en el CMS, pero no volverá a ser elegible para publicación pública hasta que el personal autorizado configure una nueva fecha de inicio válida.

La visibilidad pública dependerá, por tanto, tanto de la decisión editorial de publicación como de la vigencia temporal de la oferta.

---

## 11. Mis programas de interés

El visitante podrá seleccionar uno o varios programas durante su navegación sin crear una cuenta.

Esta funcionalidad se conceptualiza como **Mis programas de interés** y no como un carrito de compras.

El visitante podrá:

- agregar programas;
- eliminar programas;
- consultar su selección;
- continuar navegando sin perderla;
- solicitar información sobre todos los programas seleccionados.

La última selección deberá conservarse localmente en el mismo dispositivo/navegador para que pueda recuperarse en visitas posteriores razonables sin necesidad de autenticación.

---

## 12. Captación de leads

Cuando el visitante decida solicitar información deberá proporcionar únicamente los datos mínimos necesarios para que Universidad FUNDEPOS pueda contactarlo.

Como base, se contemplan:

- nombre;
- correo electrónico;
- teléfono.

El proceso debe priorizar una conversión de baja fricción.

Cada lead deberá registrar los programas sobre los cuales el visitante manifestó interés.

---

## 13. Canales de contacto

El visitante podrá continuar su solicitud mediante al menos:

- correo electrónico;
- WhatsApp.

### 13.1 Correo electrónico

El sistema deberá construir el contexto de la solicitud incluyendo los programas seleccionados y los datos necesarios para que el equipo comercial pueda atenderla.

### 13.2 WhatsApp

Antes de redirigir o abrir WhatsApp, el sistema deberá registrar el lead.

Posteriormente podrá construir un mensaje predefinido que incluya el contexto de los programas seleccionados y abrir el canal de WhatsApp correspondiente.

De esta forma, la intención comercial quedará registrada aunque el visitante posteriormente no complete el envío del mensaje dentro de WhatsApp.

---

## 14. Gestión de contenido

El proyecto debe disponer de un CMS orientado a personal no técnico.

El CMS deberá permitir, como mínimo:

- crear programas;
- editar programas;
- activar/publicar programas;
- desactivar/despublicar programas;
- administrar la información de las fichas;
- asignar campos de conocimiento;
- asignar tipos de producto académico;
- administrar fechas;
- administrar horarios;
- administrar precios;
- mantener la información necesaria para presentar correctamente cada oferta.

La creación y edición deberá realizarse mediante estructuras o plantillas predefinidas para evitar que el personal encargado necesite conocimientos de programación.

La tecnología concreta del CMS no se define en este documento.

---

## 15. Experiencia multidispositivo

El catálogo deberá ofrecer una experiencia adecuada en:

- teléfonos móviles;
- tabletas;
- computadoras portátiles;
- computadoras de escritorio.

El diseño será responsive y no dependerá de una única resolución.

Debe contemplarse específicamente una experiencia correcta en pantallas de **1920 × 1080**, además de resoluciones inferiores habituales en computadoras portátiles.

---

## 16. Plataforma de despliegue

La solución deberá poder desplegarse y operar en **Vercel**.

Esta constituye una restricción tecnológica del proyecto.

Las decisiones arquitectónicas posteriores deberán ser compatibles con este requisito y evitar dependencias innecesarias que dificulten el modelo de despliegue seleccionado.

---

## 17. Inventario inicial

El inventario inicial identificado comprende **32 programas**:

- 23 programas de educación continua y certificación;
- 9 programas de grado y posgrado.

Este inventario constituye el contenido inicial del proyecto, pero no establece un límite de capacidad para el catálogo.

El sistema deberá permitir incorporar nuevos programas y tipos de oferta en el futuro.

---

## 18. Funcionalidades diferidas

La capacidad de agregar y gestionar enlaces asociados a los programas forma parte de la visión del producto, pero se implementará deliberadamente en una etapa posterior.

No debe condicionar ni ampliar innecesariamente el diseño o implementación inicial.

---

## 19. Fuera de alcance inicial

Salvo decisión posterior explícita, el alcance inicial no contempla:

- compra directa de programas;
- pagos en línea;
- matrícula académica transaccional;
- expediente académico;
- gestión de estudiantes;
- LMS o aula virtual;
- registro obligatorio para navegar;
- cuentas de potenciales estudiantes;
- funcionalidades académicas posteriores a la captación del interesado.

El catálogo es una plataforma de **descubrimiento, información y captación**, no un sistema académico transaccional.

---

## 20. Criterios generales de éxito

El proyecto será funcionalmente exitoso cuando:

1. Un visitante pueda encontrar programas relevantes mediante navegación, búsqueda y filtros.
2. Pueda comprender suficientemente una oferta desde su ficha individual.
3. Pueda seleccionar uno o varios programas sin registrarse.
4. Su selección pueda conservarse razonablemente en el mismo dispositivo/navegador.
5. Pueda solicitar información proporcionando pocos datos.
6. FUNDEPOS pueda identificar qué programas originaron cada solicitud.
7. El visitante pueda continuar el contacto mediante correo electrónico o WhatsApp.
8. Los programas vencidos dejen de mostrarse automáticamente.
9. Personal no técnico pueda mantener el catálogo mediante el CMS.
10. La experiencia funcione correctamente en móvil, tableta y escritorio.
11. La solución pueda operar en Vercel.
12. El catálogo pueda crecer sin requerir cambios de código para las operaciones ordinarias de contenido.

---

## 21. Principios del producto

El desarrollo deberá preservar los siguientes principios:

**Descubrimiento antes que complejidad.**  
La oferta debe ser fácil de explorar.

**Información suficiente antes de la conversión.**  
La ficha debe permitir comprender el programa antes de solicitar contacto.

**Navegación sin registro.**  
No se debe imponer autenticación a un visitante que únicamente desea conocer la oferta.

**Conversión con baja fricción.**  
Solo se solicitarán los datos necesarios para continuar el contacto.

**Clasificación multidimensional.**  
Campo de conocimiento y tipo de producto académico representan dimensiones diferentes y combinables.

**Contenido mantenible.**  
La operación cotidiana del catálogo no debe depender de personal de desarrollo.

**Vigencia automática.**  
Una oferta vencida no debe permanecer visible públicamente.

**Responsive por diseño.**  
La experiencia debe adaptarse al dispositivo del visitante.

**Arquitectura proporcional.**  
Las decisiones técnicas deberán responder a necesidades reales del catálogo y evitar complejidad innecesaria.

---

## 22. Decisiones pendientes para arquitectura

Este documento define el producto y su alcance funcional.

Las siguientes decisiones se resolverán posteriormente en `11_ARCHITECTURE.md` o mediante investigación específica cuando corresponda:

- framework y versión;
- estrategia de renderizado;
- base de datos;
- modelo de datos definitivo;
- CMS y estrategia de administración;
- autenticación del CMS;
- ORM o capa de acceso a datos;
- motor o estrategia de búsqueda;
- almacenamiento de imágenes y otros medios;
- persistencia local de programas de interés;
- mecanismo de envío de correo;
- integración de WhatsApp;
- almacenamiento y tratamiento de leads;
- estrategia SEO;
- analytics;
- observabilidad;
- estrategia de pruebas;
- seguridad administrativa;
- estructura final de despliegue en Vercel.

Las decisiones arquitectónicas deberán respetar este Brief y el marco normativo general del proyecto.
