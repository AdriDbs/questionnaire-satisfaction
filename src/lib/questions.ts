export type Question = {
  key: string;
  label: string;
};

export const QUESTIONS: Question[] = [
  {
    key: "organisation",
    label:
      "Le format de ce séminaire (durée, rythme, organisation) vous donne-t-il envie de vous engager dans de prochaines démarches de ce type ?",
  },
  {
    key: "diagnostic",
    label:
      "Le diagnostic partagé le premier jour vous aide-t-il à mieux anticiper les enjeux de la maintenance dans les mois à venir ?",
  },
  {
    key: "ateliers",
    label:
      "Les processus construits lors des ateliers du deuxième jour vous semblent-ils applicables concrètement dans votre activité quotidienne ?",
  },
  {
    key: "clarte",
    label:
      "Voyez-vous clairement ce que ce séminaire va changer dans votre façon de travailler ?",
  },
  {
    key: "utilite",
    label:
      "Dans quelle mesure pensez-vous que ce séminaire aura un impact positif sur votre quotidien professionnel ?",
  },
  {
    key: "collaboration",
    label:
      "Les échanges avec les autres participants vous donnent-ils confiance dans une collaboration renforcée pour la suite ?",
  },
  {
    key: "globale",
    label:
      "De façon générale, êtes-vous confiant(e) dans la mise en œuvre concrète des suites de ce séminaire ?",
  },
];

export const ORIGINES = [
  { value: "siege", label: "Siège" },
  { value: "regional", label: "Régional" },
  { value: "filiale", label: "Filiale" },
] as const;

export type Origine = (typeof ORIGINES)[number]["value"];

export const ORIGINE_VALUES = ORIGINES.map((o) => o.value) as string[];
