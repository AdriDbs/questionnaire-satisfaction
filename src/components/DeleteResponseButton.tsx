"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export function DeleteResponseButton({
  id,
  redirectTo,
}: {
  id: number;
  redirectTo?: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="text-bp hover:text-bp-dark hover:underline"
      >
        Supprimer
      </button>
    );
  }

  return (
    <span className="inline-flex items-center gap-2">
      <span className="text-xs text-muted">Confirmer ?</span>
      <button
        type="button"
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            await fetch(`/api/admin/responses/${id}`, { method: "DELETE" });
            if (redirectTo) {
              router.push(redirectTo);
            } else {
              router.refresh();
            }
          })
        }
        className="btn-danger px-2.5 py-1 text-xs font-semibold"
      >
        Oui
      </button>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        className="text-xs text-ink-soft hover:underline"
      >
        Annuler
      </button>
    </span>
  );
}
