import Link from "next/link";

export default function MerciPlusTardPage() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center px-4 py-16 text-center">
      <div className="card-surface w-full p-10">
        <p className="kicker mb-3">Progression enregistrée</p>
        <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink">
          Vos réponses ont été sauvegardées
        </h1>
        <p className="mt-4 text-ink-soft">
          Vous pourrez reprendre votre questionnaire là où vous vous étiez
          arrêté(e) en revenant sur cette page et en renseignant à nouveau
          votre adresse e-mail.
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
