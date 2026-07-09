import Link from "next/link";
import { notFound } from "next/navigation";
import { getSql } from "@/lib/db";
import { QUESTIONS, ORIGINES } from "@/lib/questions";
import { DeleteResponseButton } from "@/components/DeleteResponseButton";

type ResponseRow = {
  id: number;
  email: string;
  origine: string;
  status: "in_progress" | "completed";
  created_at: string;
};

type AnswerRow = {
  question_key: string;
  note: number | null;
  verbatim: string | null;
};

function noteTone(note: number) {
  if (note <= 3) return "border-bp/40 bg-bp/10 text-bp-dark";
  if (note <= 7) return "border-camel-light bg-sand text-camel-dark";
  return "border-camel bg-camel text-cream";
}

export default async function AdminResponseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const responseId = Number(id);
  if (!Number.isInteger(responseId)) notFound();

  const sql = getSql();
  const [response] = (await sql`
    SELECT id, email, origine, status, created_at FROM responses WHERE id = ${responseId}
  `) as unknown as ResponseRow[];

  if (!response) notFound();

  const answers = (await sql`
    SELECT question_key, note, verbatim FROM answers WHERE response_id = ${responseId}
  `) as unknown as AnswerRow[];

  const answersByKey = new Map(answers.map((a) => [a.question_key, a]));
  const origineLabel =
    ORIGINES.find((o) => o.value === response.origine)?.label ?? response.origine;

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/admin" className="text-sm text-camel-dark hover:underline">
          ← Retour à la liste
        </Link>
        <DeleteResponseButton id={response.id} redirectTo="/admin" />
      </div>

      <header className="card-surface mb-6 p-6 sm:p-8">
        <p className="kicker mb-2">Réponse #{response.id}</p>
        <h1 className="font-display text-2xl font-semibold text-ink">
          {response.email}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-ink-soft">
          <span className="badge inline-flex px-2.5 py-1 text-xs font-medium">
            {origineLabel}
          </span>
          {response.status === "completed" ? (
            <span className="inline-flex rounded-full border border-camel/40 bg-camel/10 px-2.5 py-1 text-xs font-medium text-camel-dark">
              Terminé
            </span>
          ) : (
            <span className="inline-flex rounded-full border border-line bg-sand px-2.5 py-1 text-xs font-medium text-ink-soft">
              En cours
            </span>
          )}
          <span>
            {new Date(response.created_at).toLocaleString("fr-FR", {
              dateStyle: "long",
              timeStyle: "short",
            })}
          </span>
        </div>
      </header>

      <div className="space-y-4">
        {QUESTIONS.map((q, index) => {
          const answer = answersByKey.get(q.key);
          return (
            <section key={q.key} className="card-surface p-6 sm:p-8">
              <p className="kicker mb-2">
                Question {index + 1} / {QUESTIONS.length}
              </p>
              <div className="flex items-start justify-between gap-4">
                <h2 className="font-display text-base font-semibold text-ink">
                  {q.label}
                </h2>
                {answer?.note != null && (
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-sm font-semibold ${noteTone(
                      answer.note
                    )}`}
                  >
                    {answer.note}
                  </span>
                )}
              </div>
              {answer?.verbatim ? (
                <p className="mt-4 rounded-xl border border-line bg-paper p-4 text-ink-soft">
                  &ldquo;{answer.verbatim}&rdquo;
                </p>
              ) : (
                <p className="mt-4 text-sm italic text-muted">
                  Aucun commentaire laissé.
                </p>
              )}
            </section>
          );
        })}
      </div>
    </main>
  );
}
