"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import {
  parseLeadPayload,
  type LeadFieldErrors,
} from "@/lib/leads/validate";

const SUCCESS_STORAGE_KEY = "fundepos.catalog.leadRequest.v1";

type LeadRequestFormProps = {
  programIds: string[];
  programCount: number;
};

type FormState = {
  name: string;
  email: string;
  phone: string;
};

function readSubmittedIds(): string[] | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const raw = window.sessionStorage.getItem(SUCCESS_STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as { programIds?: unknown };
    if (!Array.isArray(parsed.programIds)) {
      return null;
    }
    return parsed.programIds.filter((id): id is string => typeof id === "string");
  } catch {
    return null;
  }
}

function sameIds(left: string[], right: string[]): boolean {
  if (left.length !== right.length) {
    return false;
  }
  const expected = [...right].sort();
  return [...left].sort().every((id, index) => id === expected[index]);
}

export function LeadRequestForm({
  programIds,
  programCount,
}: LeadRequestFormProps) {
  const formId = useId();
  const nameId = `${formId}-name`;
  const emailId = `${formId}-email`;
  const phoneId = `${formId}-phone`;
  const nameErrorId = `${formId}-name-error`;
  const emailErrorId = `${formId}-email-error`;
  const phoneErrorId = `${formId}-phone-error`;
  const statusId = `${formId}-status`;
  const successRef = useRef<HTMLHeadingElement>(null);

  const [values, setValues] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
  });
  const [fields, setFields] = useState<LeadFieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [submittedIds, setSubmittedIds] = useState<string[] | null>(
    readSubmittedIds,
  );
  const succeeded =
    submittedIds !== null && sameIds(submittedIds, programIds);
  const submittedCount = succeeded ? submittedIds.length : programCount;

  useEffect(() => {
    if (succeeded) {
      successRef.current?.focus();
    }
  }, [succeeded]);

  if (programIds.length === 0) {
    return null;
  }

  if (succeeded) {
    return (
      <section
        className="mt-10 rounded-2xl border border-line bg-card p-6 md:p-8"
        aria-labelledby={`${formId}-success`}
      >
        <span aria-hidden="true" className="block h-px w-10 bg-gold" />
        <h2
          id={`${formId}-success`}
          ref={successRef}
          tabIndex={-1}
          className="mt-3 font-serif text-2xl font-semibold text-navy outline-none"
        >
          Solicitud recibida
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
          Registramos su solicitud de información sobre {submittedCount}{" "}
          {submittedCount === 1 ? "programa" : "programas"}. Sus programas de
          interés siguen disponibles en este navegador.
        </p>
      </section>
    );
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting || programIds.length === 0) {
      return;
    }

    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      phone: String(form.get("phone") ?? ""),
      website: String(form.get("website") ?? ""),
      programIds,
    };

    const local = parseLeadPayload(payload);
    if (!local.ok) {
      setFields(local.fields);
      setFormError("Revise los datos del formulario.");
      const firstInvalid =
        (local.fields.name && nameId) ||
        (local.fields.email && emailId) ||
        (local.fields.phone && phoneId);
      if (firstInvalid) {
        document.getElementById(firstInvalid)?.focus();
      }
      return;
    }

    setSubmitting(true);
    setFormError(null);
    setFields({});

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json().catch(() => null)) as
        | { ok?: boolean; fields?: LeadFieldErrors; error?: string }
        | null;

      if (response.ok && data?.ok) {
        window.sessionStorage.setItem(
          SUCCESS_STORAGE_KEY,
          JSON.stringify({ programIds }),
        );
        setSubmittedIds(programIds);
        return;
      }

      if (data?.fields) {
        setFields(data.fields);
        setFormError("Revise los datos del formulario.");
        const firstInvalid =
          (data.fields.name && nameId) ||
          (data.fields.email && emailId) ||
          (data.fields.phone && phoneId);
        if (firstInvalid) {
          document.getElementById(firstInvalid)?.focus();
        }
        return;
      }
      setFormError("No pudimos registrar la solicitud. Intente de nuevo.");
    } catch {
      setFormError("No pudimos registrar la solicitud. Intente de nuevo.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section
      className="mt-10 rounded-2xl border border-line bg-card p-6 md:p-8"
      aria-labelledby={`${formId}-title`}
    >
      <span aria-hidden="true" className="block h-px w-10 bg-gold" />
      <h2
        id={`${formId}-title`}
        className="mt-3 font-serif text-2xl font-semibold text-navy"
      >
        ¿Desea recibir información sobre estos programas?
      </h2>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
        Usaremos estos datos únicamente para atender su solicitud de información
        sobre {programCount} {programCount === 1 ? "programa" : "programas"}.
      </p>

      <form
        className="relative mt-6 max-w-xl space-y-5"
        onSubmit={onSubmit}
        noValidate
        aria-busy={submitting}
      >
        <div
          className="pointer-events-none absolute h-px w-px overflow-hidden opacity-0"
          aria-hidden="true"
        >
          <label htmlFor={`${formId}-website`}>Sitio web</label>
          <input
            id={`${formId}-website`}
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <Field
          id={nameId}
          errorId={nameErrorId}
          label="Nombre"
          error={fields.name}
        >
          <input
            id={nameId}
            name="name"
            type="text"
            autoComplete="name"
            required
            maxLength={80}
            value={values.name}
            aria-invalid={fields.name ? true : undefined}
            aria-describedby={fields.name ? nameErrorId : undefined}
            onChange={(event) =>
              setValues((current) => ({ ...current, name: event.target.value }))
            }
            className={inputClass(Boolean(fields.name))}
          />
        </Field>

        <Field
          id={emailId}
          errorId={emailErrorId}
          label="Correo electrónico"
          error={fields.email}
        >
          <input
            id={emailId}
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            maxLength={254}
            value={values.email}
            aria-invalid={fields.email ? true : undefined}
            aria-describedby={fields.email ? emailErrorId : undefined}
            onChange={(event) =>
              setValues((current) => ({ ...current, email: event.target.value }))
            }
            className={inputClass(Boolean(fields.email))}
          />
        </Field>

        <Field
          id={phoneId}
          errorId={phoneErrorId}
          label="Teléfono"
          error={fields.phone}
        >
          <input
            id={phoneId}
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            required
            maxLength={40}
            value={values.phone}
            aria-invalid={fields.phone ? true : undefined}
            aria-describedby={fields.phone ? phoneErrorId : undefined}
            onChange={(event) =>
              setValues((current) => ({ ...current, phone: event.target.value }))
            }
            className={inputClass(Boolean(fields.phone))}
          />
        </Field>

        {formError ? (
          <p
            id={statusId}
            role="alert"
            className="text-sm font-medium text-brand-red"
          >
            {formError}
          </p>
        ) : null}
        {fields.programIds ? (
          <p role="alert" className="text-sm font-medium text-brand-red">
            {fields.programIds}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={submitting || programIds.length === 0}
          className="inline-flex min-h-12 items-center justify-center rounded-lg bg-navy px-6 text-sm font-semibold text-white transition-colors hover:bg-navy-deep disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? "Enviando…" : "Solicitar información"}
        </button>
      </form>
    </section>
  );
}

function Field({
  id,
  errorId,
  label,
  error,
  children,
}: {
  id: string;
  errorId: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-navy">
        {label}
      </label>
      <div className="mt-1.5">{children}</div>
      {error ? (
        <p id={errorId} className="mt-1.5 text-sm text-brand-red">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function inputClass(invalid: boolean): string {
  return `w-full min-h-12 rounded-lg border bg-card-subtle px-3 text-base text-navy outline-none transition-colors ${
    invalid
      ? "border-brand-red/50"
      : "border-line focus:border-navy"
  }`;
}
