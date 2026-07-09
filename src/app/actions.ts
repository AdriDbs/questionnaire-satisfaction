"use server";

import { redirect } from "next/navigation";
import { ORIGINE_VALUES, QUESTIONS } from "@/lib/questions";
import {
  createResponse,
  findResponseByEmail,
  getResponseByToken,
  markCompleted,
  readFormAnswers,
  upsertAnswers,
} from "@/lib/responses";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function identify(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const origine = String(formData.get("origine") || "");

  if (!EMAIL_RE.test(email) || !ORIGINE_VALUES.includes(origine)) {
    redirect("/?error=1");
  }

  const existing = await findResponseByEmail(email);

  if (existing) {
    if (existing.status === "completed") {
      redirect("/deja-repondu");
    }
    redirect(`/questionnaire/${existing.token}`);
  }

  const created = await createResponse(email, origine);
  redirect(`/questionnaire/${created.token}`);
}

export async function saveProgress(formData: FormData) {
  const token = String(formData.get("token") || "");
  const response = await getResponseByToken(token);
  if (!response) throw new Error("Réponse introuvable.");
  if (response.status === "completed") redirect("/deja-repondu");

  const answers = readFormAnswers(formData);
  await upsertAnswers(response.id, answers);

  redirect("/merci-plus-tard");
}

export async function submitFinal(formData: FormData) {
  const token = String(formData.get("token") || "");
  const response = await getResponseByToken(token);
  if (!response) throw new Error("Réponse introuvable.");
  if (response.status === "completed") redirect("/deja-repondu");

  const answers = readFormAnswers(formData);
  const missing = answers.filter((a) => a.note === null);
  if (missing.length > 0) {
    throw new Error(
      `Merci de donner une note à toutes les questions (${missing.length} question(s) manquante(s) sur ${QUESTIONS.length}).`
    );
  }

  await upsertAnswers(response.id, answers);
  await markCompleted(response.id);

  redirect("/merci");
}
