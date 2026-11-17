import { aiPacks } from "./ai-packs";
import { engineeringPacks } from "./engineering-packs";
export const packs = [...aiPacks, ...engineeringPacks];
export const terms = packs.flatMap((pack) =>
  pack.terms.map((term) => ({
    ...term,
    packId: pack.id,
    packTitle: pack.title,
  })),
);
export const getPack = (id: string) => packs.find((pack) => pack.id === id);
export const getTerm = (id: string) => terms.find((term) => term.id === id);
export const LESSON_SIZE = 4;
