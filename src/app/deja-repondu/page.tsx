import Link from "next/link";

export default function DejaReponduPage() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center px-4 py-16 text-center">
      <div className="card-surface w-full p-10">
        <p className="kicker mb-3">Déjà enregistré</p>
        <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink">
          Vous avez déjà répondu à ce questionnaire
        </h1>
        <p className="mt-4 text-ink-soft">
          Un questionnaire complet a déjà été envoyé avec cette adresse
          e-mail. Merci encore pour votre participation et vos retours, ils
          sont précieux pour la démarche d&apos;amélioration continue de la
          maintenance chez Transdev.
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
