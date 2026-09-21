import { getDb } from "@/db";
import { leadPrograms, leads } from "@/db/schema";
import { getCatalogPrograms } from "@/lib/catalog/queries";
import type { NormalizedLeadInput } from "@/lib/leads/validate";

export class LeadEligibilityError extends Error {
  constructor() {
    super("ineligible-programs");
    this.name = "LeadEligibilityError";
  }
}

/**
 * contact_channel es NOT NULL en el schema (email | whatsapp).
 * LEADS-001 no ofrece elección de canal ni entrega externa: se persiste
 * `email` porque el formulario recolecta correo y aún no abre WhatsApp.
 * Esto no crea LeadDelivery ni envía correo.
 */
const CONTACT_CHANNEL = "email" as const;

export async function createLead(input: NormalizedLeadInput): Promise<string> {
  const visible = await getCatalogPrograms();
  const visibleIds = new Set(visible.map((program) => program.id));
  if (
    input.programIds.length === 0 ||
    input.programIds.some((id) => !visibleIds.has(id))
  ) {
    throw new LeadEligibilityError();
  }

  const leadId = crypto.randomUUID();
  const db = getDb();

  // neon-http no soporta db.transaction() interactivo; db.batch() envía
  // las consultas en una transacción HTTP de Neon. El UUID se genera aquí
  // para que ambas inserciones viajen juntas y no quede un Lead huérfano.
  await db.batch([
    db.insert(leads).values({
      id: leadId,
      name: input.name,
      email: input.email,
      phone: input.phone,
      contactChannel: CONTACT_CHANNEL,
    }),
    db.insert(leadPrograms).values(
      input.programIds.map((programId) => ({
        leadId,
        programId,
      })),
    ),
  ]);

  return leadId;
}
