import { randomUUID } from "crypto";
import { getSql } from "@/lib/db";
import { QUESTIONS } from "@/lib/questions";

export type ResponseRecord = {
  id: number;
  email: string;
  origine: string;
  status: "in_progress" | "completed";
  token: string;
  created_at: string;
  updated_at: string;
};

export type AnswerRecord = {
  question_key: string;
  note: number | null;
  verbatim: string | null;
};

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function findResponseByEmail(email: string) {
  const sql = getSql();
  const rows = (await sql`
    SELECT id, email, origine, status, token, created_at, updated_at
    FROM responses WHERE email = ${normalizeEmail(email)}
  `) as unknown as ResponseRecord[];
  return rows[0] ?? null;
}

export async function createResponse(email: string, origine: string) {
  const sql = getSql();
  const token = randomUUID();
  const rows = (await sql`
    INSERT INTO responses (email, origine, status, token)
    VALUES (${normalizeEmail(email)}, ${origine}, 'in_progress', ${token})
    RETURNING id, email, origine, status, token, created_at, updated_at
  `) as unknown as ResponseRecord[];
  return rows[0];
}

export async function getResponseByToken(token: string) {
  const sql = getSql();
  const rows = (await sql`
    SELECT id, email, origine, status, token, created_at, updated_at
    FROM responses WHERE token = ${token}
  `) as unknown as ResponseRecord[];
  return rows[0] ?? null;
}

export async function getAnswersForResponse(responseId: number) {
  const sql = getSql();
  const rows = (await sql`
    SELECT question_key, note, verbatim FROM answers WHERE response_id = ${responseId}
  `) as unknown as AnswerRecord[];
  return new Map(rows.map((r) => [r.question_key, r]));
}

export async function upsertAnswers(
  responseId: number,
  entries: { key: string; note: number | null; verbatim: string | null }[]
) {
  const sql = getSql();
  for (const entry of entries) {
    if (entry.note === null && !entry.verbatim) continue;
    await sql`
      INSERT INTO answers (response_id, question_key, note, verbatim)
      VALUES (${responseId}, ${entry.key}, ${entry.note}, ${entry.verbatim})
      ON CONFLICT (response_id, question_key)
      DO UPDATE SET note = EXCLUDED.note, verbatim = EXCLUDED.verbatim
    `;
  }
  await sql`UPDATE responses SET updated_at = now() WHERE id = ${responseId}`;
}

export async function markCompleted(responseId: number) {
  const sql = getSql();
  await sql`UPDATE responses SET status = 'completed', updated_at = now() WHERE id = ${responseId}`;
}

export function readFormAnswers(formData: FormData) {
  return QUESTIONS.map((q) => {
    const rawNote = formData.get(`note_${q.key}`);
    const note = rawNote ? Number(rawNote) : null;
    const verbatimRaw = String(formData.get(`verbatim_${q.key}`) || "").trim();
    return {
      key: q.key,
      note: note && Number.isInteger(note) && note >= 1 && note <= 10 ? note : null,
      verbatim: verbatimRaw || null,
    };
  });
}
