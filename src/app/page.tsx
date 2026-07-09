import { identify } from "@/app/actions";
import { ORIGINES } from "@/lib/questions";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-4 py-12 sm:py-16">
      <header className="mb-10 text-center">
        <p className="kicker mb-3">Séminaire Maintenance · Transdev</p>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-ink">
          Questionnaire de satisfaction
        </h1>
        <p className="mt-4 text-ink-soft">
          Merci d&apos;avoir consacré deux journées à ce séminaire, entre
          partage du diagnostic et production des grands processus de la
          maintenance.
        </p>
        <p className="mt-3 text-ink-soft">
          Vos retours comptent beaucoup pour Transdev : ils s&apos;inscrivent
          dans une démarche de suivi et d&apos;amélioration continue de la
          performance maintenance. Merci de prendre quelques minutes pour les
          partager, en détaillant si possible vos réponses.
        </p>
      </header>

      <section className="card-surface p-6 sm:p-8">
        <p className="kicker mb-4">Identification</p>

        {error && (
          <p className="mb-4 rounded-lg border border-bp/30 bg-bp/10 px-3 py-2 text-sm text-bp-dark">
            Merci de renseigner une adresse e-mail valide et de préciser votre
            entité de rattachement.
          </p>
        )}

        <form action={identify} className="space-y-5">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm text-ink-soft">
              Adresse e-mail professionnelle
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="input-field w-full px-3 py-2"
              autoComplete="email"
              placeholder="prenom.nom@transdev.com"
            />
            <p className="mt-1.5 text-xs text-muted">
              Elle nous permet de retrouver votre questionnaire si vous
              souhaitez reprendre plus tard, et d&apos;éviter les doublons.
            </p>
          </div>

          <fieldset>
            <legend className="mb-2 block text-sm text-ink-soft">
              Votre entité de rattachement
            </legend>
            <div className="flex flex-wrap gap-2">
              {ORIGINES.map((o, idx) => (
                <label key={o.value} className="relative">
                  <input
                    type="radio"
                    name="origine"
                    value={o.value}
                    required={idx === 0}
                    className="peer sr-only"
                  />
                  <span className="inline-flex cursor-pointer items-center rounded-full border-2 border-line bg-paper px-4 py-2 text-sm font-medium text-ink-soft transition-all hover:border-camel-light peer-checked:scale-105 peer-checked:border-ink peer-checked:bg-ink peer-checked:text-cream peer-checked:font-semibold peer-checked:shadow-md">
                    {o.label}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="flex justify-end pt-2">
            <button type="submit" className="btn-primary px-6 py-3 font-medium">
              Commencer le questionnaire
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
