import Link from "next/link";

export default function MerciPage() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center px-4 py-16 text-center">
      <div className="card-surface w-full p-10">
        <p className="kicker mb-3">Merci</p>
        <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink">
          Vos réponses ont bien été enregistrées
        </h1>
        <p className="mt-4 text-ink-soft">
          Merci pour votre participation au séminaire et pour le temps
          consacré à ce questionnaire. Vos commentaires seront précieux pour
          la suite des travaux sur la maintenance.
        </p>
        <Link
          href="/"
          className="btn-secondary mt-8 inline-flex px-5 py-2.5 font-medium"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </main>
  );
}
