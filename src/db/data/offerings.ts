/**
 * 2027 offerings. Catalog prices live in offering_price_components.
 * offerings.price_amount / price_currency are legacy and remain null.
 * Graduation fees are not catalog price components.
 */

export const CSV_ONLY = [
  {
    csvId: "IDEPI-ESP-AFI",
    csvName: "Especialista en Auditoría Financiera Integral",
    csvDate: "22 de febrero",
  },
  {
    csvId: "IDEPI-TEC-SEMC",
    csvName: "Técnico en Tecnologías de Semiconductores",
    csvDate: "29 de marzo",
  },
  {
    csvId: "IDEPI-CURSO LIBRE",
    csvName:
      "Certificación Lean Practitioner – Enfoque Dual: Oficina y Manufactura",
    csvDate: "27 de abril",
  },
  {
    csvId: "IDEPI-ESP-GETH",
    csvName: "Especialista en Gestión de Talento Humano",
    csvDate: "24 de mayo",
  },
  {
    csvId: "IDEPI-CURSO LIBRE",
    csvName: "Certificación en Gestión de Ciberseguridad Empresarial",
    csvDate: "24 de mayo",
  },
  {
    csvId: "IDEPI-ESP-AFP",
    csvName: "Especialista en Auditoría del Sector Público",
    csvDate: "29 de junio",
  },
  {
    csvId: "IDEPI-MISIÓN ACAD",
    csvName: "Misión académica Liderazgo financiero experiencia en México",
    csvDate: "28 y 29 de octubre",
  },
] as const;

export const NO_2027_START_DATE = [] as const;

/** Practical start date authorized for programs that lacked a CSV 2027 date. */
export const PRACTICAL_START_DATE = "2027-01-05";

export const DATE_WITHOUT_PRICE = [] as const;

export type OfferingPriceKind =
  | "enrollment"
  | "program"
  | "subject"
  | "investment";

export type OfferingPriceComponent = {
  kind: OfferingPriceKind;
  label: string;
  amount: string;
  currency: string;
  sortOrder: number;
};

function crcEnrollment(amount: string): OfferingPriceComponent {
  return {
    kind: "enrollment",
    label: "Matrícula",
    amount,
    currency: "CRC",
    sortOrder: 0,
  };
}

function crcProgram(amount: string): OfferingPriceComponent {
  return {
    kind: "program",
    label: "Programa",
    amount,
    currency: "CRC",
    sortOrder: 1,
  };
}

function crcSubject(amount: string): OfferingPriceComponent {
  return {
    kind: "subject",
    label: "Materia",
    amount,
    currency: "CRC",
    sortOrder: 1,
  };
}

function crcInvestment(amount: string): OfferingPriceComponent {
  return {
    kind: "investment",
    label: "Inversión",
    amount,
    currency: "CRC",
    sortOrder: 0,
  };
}

function usdInvestment(amount: string): OfferingPriceComponent {
  return {
    kind: "investment",
    label: "Inversión",
    amount,
    currency: "USD",
    sortOrder: 0,
  };
}

/** HOJA DE VENTAS técnicos: Matrícula ₡60.000 + Programa ₡72.000 */
export const TECNICO_PRICE = [
  crcEnrollment("60000.00"),
  crcProgram("72000.00"),
];

/** HOJA DE VENTAS especialistas: Matrícula ₡35.000 + Programa ₡500.000 */
export const ESPECIALISTA_PRICE = [
  crcEnrollment("35000.00"),
  crcProgram("500000.00"),
];

/** Diplomado PDF: Matrícula ₡50.000 + Materia ₡75.000 */
export const DIPLOMADO_PRICE = [
  crcEnrollment("50000.00"),
  crcSubject("75000.00"),
];

/**
 * HV2 grados/másteres without a sheet price. Practical amounts authorized
 * earlier: ₡1.000 matrícula + ₡1.000 materia.
 */
export const HV2_PRACTICAL_PRICE = [
  crcEnrollment("1000.00"),
  crcSubject("1000.00"),
];

export const INVESTMENT_USD_3500 = [usdInvestment("3500.00")];
export const INVESTMENT_USD_12000 = [usdInvestment("12000.00")];
export const INVESTMENT_CRC_60000 = [crcInvestment("60000.00")];

export type OfferingRecord = {
  csvId: string;
  csvName: string;
  csvDate: string;
  programSlug: string;
  startDate: string;
  priceComponents: OfferingPriceComponent[];
  modality: string | null;
  schedule: string | null;
  editorialStatus: "draft";
};

export const OFFERINGS: OfferingRecord[] = [
  {
    csvId: "PRACTICAL-2027-01-05",
    csvName: "Doctorado en Administración",
    csvDate: "5 de enero (fecha práctica autorizada)",
    programSlug: "doctorado-administracion",
    startDate: PRACTICAL_START_DATE,
    priceComponents: INVESTMENT_USD_12000,
    modality: "100% virtual",
    schedule: "Lecciones sincrónicas un día a la semana de 06:00 a 09:00 p.m.",
    editorialStatus: "draft",
  },
  {
    csvId: "IDEPI-DIPLOMADO",
    csvName: "Diplomado en Dirección de empresas",
    csvDate: "5 de enero (fecha práctica; CSV original: 26 de enero)",
    programSlug: "diplomado-direccion-empresas",
    startDate: PRACTICAL_START_DATE,
    priceComponents: DIPLOMADO_PRICE,
    modality: "En línea",
    schedule: null,
    editorialStatus: "draft",
  },
  {
    csvId: "PRACTICAL-2027-01-05",
    csvName: "Bachillerato en Contaduría",
    csvDate: "5 de enero (fecha práctica autorizada)",
    programSlug: "bachillerato-contaduria",
    startDate: PRACTICAL_START_DATE,
    priceComponents: HV2_PRACTICAL_PRICE,
    modality: "100% en línea",
    schedule: null,
    editorialStatus: "draft",
  },
  {
    csvId: "PRACTICAL-2027-01-05",
    csvName: "Bachillerato en Dirección de Empresas",
    csvDate: "5 de enero (fecha práctica autorizada)",
    programSlug: "bachillerato-direccion-empresas",
    startDate: PRACTICAL_START_DATE,
    priceComponents: HV2_PRACTICAL_PRICE,
    modality: "En línea",
    schedule: null,
    editorialStatus: "draft",
  },
  {
    csvId: "PRACTICAL-2027-01-05",
    csvName: "Licenciatura en Dirección de Empresas",
    csvDate: "5 de enero (fecha práctica autorizada)",
    programSlug: "licenciatura-direccion-empresas",
    startDate: PRACTICAL_START_DATE,
    priceComponents: HV2_PRACTICAL_PRICE,
    modality: "En línea",
    schedule: null,
    editorialStatus: "draft",
  },
  {
    csvId: "PRACTICAL-2027-01-05",
    csvName:
      "Maestría Profesional en Dirección de Empresas y Gestión del Talento Humano",
    csvDate: "5 de enero (fecha práctica autorizada)",
    programSlug: "maestria-profesional-direccion-empresas-talento-humano",
    startDate: PRACTICAL_START_DATE,
    priceComponents: HV2_PRACTICAL_PRICE,
    modality: "100% virtual",
    schedule: null,
    editorialStatus: "draft",
  },
  {
    csvId: "PRACTICAL-2027-01-05",
    csvName:
      "Maestría Profesional en Dirección de Empresas con énfasis en Banca y Finanzas",
    csvDate: "5 de enero (fecha práctica autorizada)",
    programSlug: "maestria-profesional-direccion-empresas-banca-finanzas",
    startDate: PRACTICAL_START_DATE,
    priceComponents: HV2_PRACTICAL_PRICE,
    modality: "En línea",
    schedule: null,
    editorialStatus: "draft",
  },
  {
    csvId: "PRACTICAL-2027-01-05",
    csvName:
      "Maestría Profesional en Dirección de Empresas con énfasis en Mercadeo",
    csvDate: "5 de enero (fecha práctica autorizada)",
    programSlug: "maestria-profesional-direccion-empresas-mercadeo",
    startDate: PRACTICAL_START_DATE,
    priceComponents: HV2_PRACTICAL_PRICE,
    modality: "En línea",
    schedule: null,
    editorialStatus: "draft",
  },
  {
    csvId: "PRACTICAL-2027-01-05",
    csvName: "Máster en Sostenibilidad e Innovación para la Gestión Empresarial",
    csvDate: "5 de enero (fecha práctica autorizada)",
    programSlug: "master-sostenibilidad-innovacion-gestion-empresarial",
    startDate: PRACTICAL_START_DATE,
    priceComponents: HV2_PRACTICAL_PRICE,
    modality: "En línea",
    schedule: null,
    editorialStatus: "draft",
  },
  {
    csvId: "PRACTICAL-2027-01-05",
    csvName: "Máster Ejecutivo en Ingeniería Financiera",
    csvDate: "5 de enero (fecha práctica autorizada)",
    programSlug: "master-ejecutivo-ingenieria-financiera",
    startDate: PRACTICAL_START_DATE,
    priceComponents: HV2_PRACTICAL_PRICE,
    modality: "En línea",
    schedule: null,
    editorialStatus: "draft",
  },
  {
    csvId: "IDEPI-TEC-EE",
    csvName: "EXECUTIVE ENGLISH PROGRAM",
    csvDate: "25 de enero",
    programSlug: "tecnico-executive-english-program",
    startDate: "2027-01-25",
    priceComponents: TECNICO_PRICE,
    modality: "Virtual",
    schedule: null,
    editorialStatus: "draft",
  },
  {
    csvId: "IDEPI-TEC-TLI",
    csvName: "Técnico en Logística Internacional y cadena de abastecimiento",
    csvDate: "26 de enero",
    programSlug: "tecnico-logistica-internacional-cadena-abastecimiento",
    startDate: "2027-01-26",
    priceComponents: TECNICO_PRICE,
    modality: "Virtual",
    schedule: null,
    editorialStatus: "draft",
  },
  {
    csvId: "IDEPI-MISIÓN ACAD",
    csvName:
      "Misión Académica: Alta Gerencia y Finanzas corporativas para la toma de decisiones apoyado en IA",
    csvDate: "22 al 27 de febrero",
    programSlug: "mision-academica-alta-gerencia-finanzas-corporativas-ia",
    startDate: "2027-02-22",
    priceComponents: INVESTMENT_USD_3500,
    modality: null,
    schedule: null,
    editorialStatus: "draft",
  },
  {
    csvId: "IDEPI-TEC-TS",
    csvName: "Técnico en Seguros",
    csvDate: "22 de febrero",
    programSlug: "tecnico-seguros",
    startDate: "2027-02-22",
    priceComponents: TECNICO_PRICE,
    modality: "Virtual",
    schedule: null,
    editorialStatus: "draft",
  },
  {
    csvId: "IDEPI-TEC-COR",
    csvName: "Técnico en Ciberseguridad y operaciones de red",
    csvDate: "22 de febrero",
    programSlug: "tecnico-ciberseguridad-operaciones-red",
    startDate: "2027-02-22",
    priceComponents: TECNICO_PRICE,
    modality: "Virtual",
    schedule: null,
    editorialStatus: "draft",
  },
  {
    csvId: "IDEPI-TEC-IA",
    csvName: "Técnico en Inteligencia Artificial",
    csvDate: "23 de febrero",
    programSlug: "tecnico-inteligencia-artificial-empresarial",
    startDate: "2027-02-23",
    priceComponents: TECNICO_PRICE,
    modality: "Virtual",
    schedule: null,
    editorialStatus: "draft",
  },
  {
    csvId: "IDEPI-ESP-EGP",
    csvName: "Especialista en Gestión de Proyectos",
    csvDate: "23 de febrero",
    programSlug: "especialista-gestion-proyectos",
    startDate: "2027-02-23",
    priceComponents: ESPECIALISTA_PRICE,
    modality: "Virtual",
    schedule: null,
    editorialStatus: "draft",
  },
  {
    csvId: "IDEPI-ESP-CP",
    csvName: "Especialista en Contratación Pública",
    csvDate: "23 de febrero",
    programSlug: "especialista-contratacion-publica",
    startDate: "2027-02-23",
    priceComponents: ESPECIALISTA_PRICE,
    modality: "Virtual",
    schedule: null,
    editorialStatus: "draft",
  },
  {
    csvId: "IDEPI-ESP-FMV",
    csvName: "Especialista en Gestión Bursátil y Gobernanza",
    csvDate: "29 de marzo",
    programSlug: "especialista-gestion-bursatil-gobernanza",
    startDate: "2027-03-29",
    priceComponents: ESPECIALISTA_PRICE,
    modality: "Virtual",
    schedule: null,
    editorialStatus: "draft",
  },
  {
    csvId: "IDEPI-ESP-EPLG",
    csvName: "Especialista en Prevención en Legitimación de Capitales",
    csvDate: "29 de marzo",
    programSlug: "especialista-prevencion-legitimacion-capitales",
    startDate: "2027-03-29",
    priceComponents: ESPECIALISTA_PRICE,
    modality: "Virtual",
    schedule: null,
    editorialStatus: "draft",
  },
  {
    csvId: "IDEPI-ESP-EPAT",
    csvName: "Especialista en Práctica y Asesoría Tributaria",
    csvDate: "30 de marzo",
    programSlug: "especialista-practica-asesoria-tributaria",
    startDate: "2027-03-30",
    priceComponents: ESPECIALISTA_PRICE,
    modality: "Virtual",
    schedule: null,
    editorialStatus: "draft",
  },
  {
    csvId: "IDEPI-TEC-MKAI",
    csvName: "Técnico en Marketing AI PRO",
    csvDate: "30 de marzo",
    programSlug: "tecnico-marketing-ai-pro",
    startDate: "2027-03-30",
    priceComponents: TECNICO_PRICE,
    modality: "Virtual",
    schedule: null,
    editorialStatus: "draft",
  },
  {
    csvId: "IDEPI-TEC-GD",
    csvName: "Técnico en Gestión Deportiva",
    csvDate: "26 de abril",
    programSlug: "tecnico-gestion-estrategica-deportiva",
    startDate: "2027-04-26",
    priceComponents: TECNICO_PRICE,
    modality: "Virtual",
    schedule: null,
    editorialStatus: "draft",
  },
  {
    csvId: "IDEPI-ESP-RD",
    csvName: "Especialista en Régimen Disciplinario",
    csvDate: "26 de abril",
    programSlug: "especialista-regimen-disciplinario-sector-privado-publico",
    startDate: "2027-04-26",
    priceComponents: ESPECIALISTA_PRICE,
    modality: "Virtual",
    schedule: null,
    editorialStatus: "draft",
  },
  {
    csvId: "IDEPI-ESP-GOB",
    csvName: "Especialista en Gobierno Corporativo",
    csvDate: "26 de abril",
    programSlug: "especialista-gobierno-corporativo",
    startDate: "2027-04-26",
    priceComponents: ESPECIALISTA_PRICE,
    modality: "Virtual",
    schedule: null,
    editorialStatus: "draft",
  },
  {
    csvId: "IDEPI-ESP-ECN",
    csvName: "Especialista en Cumplimiento Normativo",
    csvDate: "27 de abril",
    programSlug: "especialista-cumplimiento-normativo",
    startDate: "2027-04-27",
    priceComponents: ESPECIALISTA_PRICE,
    modality: "Virtual",
    schedule: null,
    editorialStatus: "draft",
  },
  {
    csvId: "IDEPI-CURSO LIBRE",
    csvName: "GERENTES LIDERES 4.0",
    csvDate: "24 al 28 de mayo",
    programSlug: "programa-gerentes-lideres-4-0",
    startDate: "2027-05-24",
    priceComponents: INVESTMENT_USD_3500,
    modality: "Presencial (Centro de capacitaciones Oikoumene, Cartago)",
    schedule: null,
    editorialStatus: "draft",
  },
  {
    csvId: "IDEPI-ESP-RIEG",
    csvName: "Especialista en Riesgos",
    csvDate: "24 de mayo",
    programSlug: "especialista-riesgos",
    startDate: "2027-05-24",
    priceComponents: ESPECIALISTA_PRICE,
    modality: "Virtual",
    schedule: null,
    editorialStatus: "draft",
  },
  {
    csvId: "IDEPI-ESP-CIA",
    csvName: "Especialista en Control Interno y Auditoría",
    csvDate: "25 de mayo",
    programSlug: "especialista-control-interno-auditoria",
    startDate: "2027-05-25",
    priceComponents: ESPECIALISTA_PRICE,
    modality: "Virtual",
    schedule: null,
    editorialStatus: "draft",
  },
  {
    csvId: "IDEPI-MISIÓN ACAD",
    csvName: "Misión Académica Seguros y Gerencia Aseguradora",
    csvDate: "14 al 19 de junio",
    programSlug: "mision-academica-seguros-gerencia-aseguradora",
    startDate: "2027-06-14",
    priceComponents: INVESTMENT_USD_3500,
    modality: null,
    schedule: "lunes a viernes de 9 a.m. a 2:00 p.m.",
    editorialStatus: "draft",
  },
  {
    csvId: "IDEPI-TEC-TDE",
    csvName: "Técnico en Dirección de Empresas",
    csvDate: "28 de junio",
    programSlug: "tecnico-direccion-empresas",
    startDate: "2027-06-28",
    priceComponents: TECNICO_PRICE,
    modality: "Virtual",
    schedule: null,
    editorialStatus: "draft",
  },
  {
    csvId: "IDEPI-SEM-CF",
    csvName: "Seminario Cierre Fiscal",
    csvDate: "3 de noviembre",
    programSlug: "seminario-cierre-fiscal",
    startDate: "2027-11-03",
    priceComponents: INVESTMENT_CRC_60000,
    modality: "Presencial",
    schedule: "8:00 a.m. a 12 m.d.",
    editorialStatus: "draft",
  },
];
