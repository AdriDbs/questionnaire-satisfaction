export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col items-center justify-center px-4 py-16">
      <div className="card-surface w-full p-8">
        <p className="kicker mb-3 text-center">Administration</p>
        <h1 className="mb-6 text-center font-display text-xl font-semibold text-ink">
          Accès aux résultats
        </h1>

        {error && (
          <p className="mb-4 rounded-lg border border-bp/30 bg-bp/10 px-3 py-2 text-sm text-bp-dark">
            Mot de passe incorrect.
          </p>
        )}

        <form action="/api/admin/login" method="POST" className="space-y-4">
          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm text-ink-soft">
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoFocus
              className="input-field w-full px-3 py-2"
            />
          </div>
          <button type="submit" className="btn-primary w-full py-2.5 font-medium">
            Se connecter
          </button>
        </form>
      </div>
    </main>
  );
}
