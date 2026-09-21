import { NextResponse } from "next/server";
import { createLead, LeadEligibilityError } from "@/lib/leads/createLead";
import { MAX_JSON_BYTES, parseLeadPayload } from "@/lib/leads/validate";

export const dynamic = "force-dynamic";

function jsonError(
  status: number,
  error: string,
  fields?: Record<string, string>,
) {
  return NextResponse.json(
    fields ? { ok: false, error, fields } : { ok: false, error },
    { status },
  );
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().startsWith("application/json")) {
    return jsonError(415, "unsupported-media-type");
  }

  const raw = await request.text();
  if (raw.length > MAX_JSON_BYTES) {
    return jsonError(413, "payload-too-large");
  }

  let body: unknown;
  try {
    body = raw.length === 0 ? null : JSON.parse(raw);
  } catch {
    return jsonError(400, "invalid-json");
  }

  const parsed = parseLeadPayload(body);
  if (!parsed.ok) {
    return jsonError(400, "validation", parsed.fields);
  }

  if (parsed.value.honeypotFilled) {
    return NextResponse.json(
      { ok: true, leadId: crypto.randomUUID() },
      { status: 201 },
    );
  }

  try {
    const leadId = await createLead(parsed.value);
    return NextResponse.json({ ok: true, leadId }, { status: 201 });
  } catch (error) {
    if (error instanceof LeadEligibilityError) {
      return jsonError(400, "validation", {
        programIds: "Hay programas inválidos en la solicitud.",
      });
    }
    console.error("lead-create-failed");
    return jsonError(500, "internal");
  }
}
