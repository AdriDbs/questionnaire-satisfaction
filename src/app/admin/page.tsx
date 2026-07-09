import Link from "next/link";
import { getSql } from "@/lib/db";
import { ORIGINES } from "@/lib/questions";
import { DeleteResponseButton } from "@/components/DeleteResponseButton";

type Row = {
  id: number;
  email: string;
  origine: string;
  status: "in_progress" | "completed";
  created_at: string;
  avg_note: string | null;
  verbatim_count: string;
};

function origineLabel(value: string) {
  return ORIGINES.find((o) => o.value === value)?.label ?? value;
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ origine?: string }>;
}) {
  const { origine } = await searchParams;
  const sql = getSql();

  const validOrigine = ORIGINES.some((o) => o.value === origine) ? origine : null;

  const rows = (await sql`
    SELECT
      r.id, r.email, r.origine, r.status, r.created_at,
      AVG(a.note) AS avg_note,
      COUNT(a.verbatim) FILTER (WHERE a.verbatim IS NOT NULL AND a.verbatim <> '') AS verbatim_count
    FROM responses r
    LEFT JOIN answers a ON a.response_id = r.id
    WHERE ${validOrigine}::text IS NULL OR r.origine = ${validOrigine}
    GROUP BY r.id
    ORDER BY r.created_at DESC
  `) as unknown as Row[];

  const [stats] = (await sql`
    SELECT COUNT(*)::int AS total, AVG(note) AS global_avg
    FROM responses r JOIN answers a ON a.response_id = r.id
  `) as unknown as { total: number; global_avg: string | null }[];

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-12">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="kicker mb-2">Administration</p>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink">
            Réponses au questionnaire
          </h1>
        </div>
        <form action="/api/admin/logout" method="POST">
          <button type="submit" className="btn-secondary px-4 py-2 text-sm font-medium">
            Se déconnecter
          </button>
        </form>
      </header>

      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="card-surface p-4">
          <p className="kicker mb-1">Réponses</p>
          <p className="font-display text-2xl font-semibold text-ink">
            {rows.length}
          </p>
        </div>
        <div className="card-surface p-4">
          <p className="kicker mb-1">Note moyenne</p>
          <p className="font-display text-2xl font-semibold text-ink">
            {stats?.global_avg ? Number(stats.global_avg).toFixed(1) : "—"}
            <span className="text-sm text-muted"> / 10</span>
          </p>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <Link
          href="/admin"
          className={`px-4 py-2 rounded-xl text-sm font-medium border border-line ${
            !origine ? "btn-filter-active" : "bg-paper text-ink-soft hover:border-camel"
          }`}
        >
          Toutes les origines
        </Link>
        {ORIGINES.map((o) => (
          <Link
            key={o.value}
            href={`/admin?origine=${o.value}`}
            className={`px-4 py-2 rounded-xl text-sm font-medium border border-line ${
              origine === o.value
                ? "btn-filter-active"
                : "bg-paper text-ink-soft hover:border-camel"
            }`}
          >
            {o.label}
          </Link>
        ))}
      </div>

      <div className="card-surface overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line text-ink-soft">
              <th className="px-4 py-3 font-medium">E-mail</th>
              <th className="px-4 py-3 font-medium">Origine</th>
              <th className="px-4 py-3 font-medium">Statut</th>
              <th className="px-4 py-3 font-medium">Note moy.</th>
              <th className="px-4 py-3 font-medium">Verbatims</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3 text-ink">
                  <Link href={`/admin/reponse/${r.id}`} className="hover:text-camel-dark">
                    {r.email}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <span className="badge inline-flex px-2.5 py-1 text-xs font-medium">
                    {origineLabel(r.origine)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {r.status === "completed" ? (
                    <span className="inline-flex rounded-full border border-camel/40 bg-camel/10 px-2.5 py-1 text-xs font-medium text-camel-dark">
                      Terminé
                    </span>
                  ) : (
                    <span className="inline-flex rounded-full border border-line bg-sand px-2.5 py-1 text-xs font-medium text-ink-soft">
                      En cours
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-ink-soft">
                  {r.avg_note ? Number(r.avg_note).toFixed(1) : "—"}
                </td>
                <td className="px-4 py-3 text-ink-soft">{r.verbatim_count}</td>
                <td className="px-4 py-3 text-muted">
                  {new Date(r.created_at).toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <Link
                      href={`/admin/reponse/${r.id}`}
                      className="text-camel-dark hover:underline"
                    >
                      Détail
                    </Link>
                    <DeleteResponseButton id={r.id} />
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted">
                  Aucune réponse pour le moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
