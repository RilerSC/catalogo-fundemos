export const MAX_LEAD_PROGRAMS = 32;
export const MAX_NAME_LENGTH = 80;
export const MAX_EMAIL_LENGTH = 254;
export const MAX_PHONE_LENGTH = 40;
export const MAX_JSON_BYTES = 8 * 1024;

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_LETTER_RE = /\p{L}/u;

export type LeadFieldErrors = {
  name?: string;
  email?: string;
  phone?: string;
  programIds?: string;
};

export type NormalizedLeadInput = {
  name: string;
  email: string;
  phone: string;
  programIds: string[];
  honeypotFilled: boolean;
};

export function normalizeName(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

/**
 * Acepta formatos humanos (espacios, guiones, paréntesis, 00/+).
 * 8 dígitos se interpretan como Costa Rica y se guardan como +506…
 * Otros números se normalizan a E.164 básico (+ y 8–15 dígitos) si es seguro.
 */
export function normalizePhone(value: string): string | null {
  const compact = value.trim().replace(/[()\s.\-]/g, "");
  if (!compact || compact.length > MAX_PHONE_LENGTH) {
    return null;
  }

  let candidate = compact;
  if (candidate.startsWith("00")) {
    candidate = `+${candidate.slice(2)}`;
  }

  const hasPlus = candidate.startsWith("+");
  if (!/^\+?[0-9]+$/.test(candidate)) {
    return null;
  }

  const digits = candidate.replace(/\D/g, "");
  if (hasPlus) {
    if (digits.length < 8 || digits.length > 15) {
      return null;
    }
    return `+${digits}`;
  }
  if (digits.length === 8) {
    return `+506${digits}`;
  }
  if (digits.length === 11 && digits.startsWith("506")) {
    return `+${digits}`;
  }
  if (digits.length >= 10 && digits.length <= 15) {
    return `+${digits}`;
  }
  return null;
}

export function uniqueProgramIds(values: unknown[]): string[] {
  const seen = new Set<string>();
  const ids: string[] = [];
  for (const value of values) {
    if (typeof value !== "string") {
      continue;
    }
    const id = value.trim();
    if (!id || seen.has(id)) {
      continue;
    }
    seen.add(id);
    ids.push(id);
  }
  return ids;
}

export function parseLeadPayload(
  input: unknown,
):
  | { ok: true; value: NormalizedLeadInput }
  | { ok: false; fields: LeadFieldErrors } {
  if (input === null || typeof input !== "object" || Array.isArray(input)) {
    return {
      ok: false,
      fields: { programIds: "La solicitud no es válida." },
    };
  }

  const body = input as Record<string, unknown>;
  const fields: LeadFieldErrors = {};
  const honeypot =
    typeof body.website === "string" ? body.website.trim() : "";

  const name = typeof body.name === "string" ? normalizeName(body.name) : "";
  if (!name) {
    fields.name = "Indique su nombre.";
  } else if (name.length < 2) {
    fields.name = "El nombre es demasiado corto.";
  } else if (name.length > MAX_NAME_LENGTH) {
    fields.name = "El nombre es demasiado largo.";
  } else if (!NAME_LETTER_RE.test(name)) {
    fields.name = "Indique un nombre válido.";
  }

  const email = typeof body.email === "string" ? normalizeEmail(body.email) : "";
  if (!email) {
    fields.email = "Indique su correo electrónico.";
  } else if (email.length > MAX_EMAIL_LENGTH || !EMAIL_RE.test(email)) {
    fields.email = "Indique un correo electrónico válido.";
  }

  const rawPhone = typeof body.phone === "string" ? body.phone : "";
  const phone = typeof body.phone === "string" ? normalizePhone(body.phone) : null;
  if (!rawPhone.trim()) {
    fields.phone = "Indique su teléfono.";
  } else if (!phone) {
    fields.phone = "Indique un teléfono válido.";
  }

  if (!Array.isArray(body.programIds)) {
    fields.programIds = "Seleccione al menos un programa.";
  }

  const rawIds = Array.isArray(body.programIds) ? body.programIds : [];
  if (rawIds.some((id) => typeof id !== "string")) {
    fields.programIds = "Hay programas inválidos en la solicitud.";
  }

  const programIds = uniqueProgramIds(rawIds);
  if (!fields.programIds && programIds.length === 0) {
    fields.programIds = "Seleccione al menos un programa.";
  } else if (programIds.length > MAX_LEAD_PROGRAMS) {
    fields.programIds = "Hay demasiados programas en la solicitud.";
  } else if (programIds.some((id) => !UUID_RE.test(id))) {
    fields.programIds = "Hay programas inválidos en la solicitud.";
  }

  if (Object.keys(fields).length > 0) {
    return { ok: false, fields };
  }

  return {
    ok: true,
    value: {
      name,
      email,
      phone: phone as string,
      programIds,
      honeypotFilled: honeypot.length > 0,
    },
  };
}
