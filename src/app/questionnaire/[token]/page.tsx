import { redirect, notFound } from "next/navigation";
import { saveProgress, submitFinal } from "@/app/actions";
import { QUESTIONS, ORIGINES } from "@/lib/questions";
import { RatingScale } from "@/components/RatingScale";
import { getAnswersForResponse, getResponseByToken } from "@/lib/responses";

export default async function QuestionnairePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const response = await getResponseByToken(token);

  if (!response) notFound();
  if (response.status === "completed") redirect("/deja-repondu");

  const answers = await getAnswersForResponse(response.id);
  const origineLabel =
    ORIGINES.find((o) => o.value === response.origine)?.label ?? response.origine;
  const answeredCount = QUESTIONS.filter((q) => answers.get(q.key)?.note != null).length;

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:py-16">
      <header className="mb-8 text-center">
        <p className="kicker mb-3">Questionnaire de satisfaction</p>
        <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink">
          À vous de répondre
        </h1>
        <p className="mt-3 text-sm text-ink-soft">
          {response.email} · <span className="badge inline-flex px-2.5 py-1 text-xs font-medium">{origineLabel}</span>
        </p>
        {answeredCount > 0 && (
          <p className="mt-3 text-sm text-camel-dark">
            {answeredCount} / {QUESTIONS.length} questions déjà renseignées —
            vous reprenez là où vous vous étiez arrêté(e).
          </p>
        )}
      </header>

      <form className="space-y-6">
        <input type="hidden" name="token" value={response.token} />

        {QUESTIONS.map((q, index) => {
          const existing = answers.get(q.key);
          return (
            <section key={q.key} className="card-surface p-6 sm:p-8">
              <p className="kicker mb-2">
                Question {index + 1} / {QUESTIONS.length}
              </p>
              <h2 className="mb-4 font-display text-lg font-semibold text-ink">
                {q.label}
              </h2>

              <RatingScale name={`note_${q.key}`} defaultValue={existing?.note ?? null} />

              <div className="mt-5">
                <label
                  htmlFor={`verbatim_${q.key}`}
                  className="mb-1.5 flex items-center gap-2 text-sm text-ink-soft"
                >
                  Votre commentaire
                  <span className="badge px-2 py-0.5 text-xs font-semibold">
                    Recommandé
                  </span>
                </label>
                <textarea
                  id={`verbatim_${q.key}`}
                  name={`verbatim_${q.key}`}
                  rows={3}
                  defaultValue={existing?.verbatim ?? ""}
                  placeholder="Dites-nous ce qui a bien fonctionné, ce qui vous a marqué ou ce qui pourrait être amélioré..."
                  className="input-field w-full px-3 py-2"
                />
              </div>
            </section>
          );
        })}

        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
          <button
            type="submit"
            formAction={saveProgress}
            className="btn-secondary px-6 py-3 font-medium"
          >
            Enregistrer et reprendre plus tard
          </button>
          <button
            type="submit"
            formAction={submitFinal}
            className="btn-primary px-6 py-3 font-medium"
          >
            Envoyer mes réponses
          </button>
        </div>
      </form>
    </main>
  );
}
