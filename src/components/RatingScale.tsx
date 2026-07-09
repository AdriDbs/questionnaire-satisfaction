"use client";

import { useState } from "react";

function hue(n: number) {
  return ((n - 1) / 9) * 120; // 1 -> red (0deg), 10 -> green (120deg)
}

export function RatingScale({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue?: number | null;
}) {
  const [value, setValue] = useState<number | null>(defaultValue ?? null);

  return (
    <div>
      <input type="hidden" name={name} value={value ?? ""} />
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => {
          const h = hue(n);
          const selected = value === n;
          return (
            <button
              key={n}
              type="button"
              aria-pressed={selected}
              onClick={() => setValue(n)}
              style={{
                backgroundColor: selected
                  ? `hsl(${h}deg 58% 42%)`
                  : `hsl(${h}deg 60% 93%)`,
                borderColor: `hsl(${h}deg 55% ${selected ? "35%" : "68%"})`,
                color: selected ? "#fffdf9" : `hsl(${h}deg 55% 28%)`,
              }}
              className={`flex h-11 w-11 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all duration-150 cursor-pointer ${
                selected ? "scale-110 shadow-lg" : "hover:scale-105 hover:shadow"
              }`}
            >
              {n}
            </button>
          );
        })}
      </div>
      <div className="mt-1.5 flex justify-between text-[0.65rem] uppercase tracking-wide text-muted">
        <span>Pas satisfait</span>
        <span>Très satisfait</span>
      </div>
    </div>
  );
}
