import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { packs, getPack } from "@/data/packs";
import { Lesson } from "@/components/Lesson";
export const dynamicParams = false;
export const generateStaticParams = () =>
  packs.flatMap((p) =>
    p.lessons.map((_, i) => ({ pack: p.id, lesson: String(i + 1) })),
  );
export async function generateMetadata({
  params,
}: {
  params: Promise<{ pack: string; lesson: string }>;
}): Promise<Metadata> {
  const p = await params;
  const pack = getPack(p.pack);
  return {
    title: pack?.lessons[Number(p.lesson) - 1] || "Lesson",
    description: `Learn four useful terms from ${pack?.title || "GeekSpeak"} through examples and short questions.`,
    robots: { index: false, follow: true },
  };
}
export default async function LessonPage({
  params,
}: {
  params: Promise<{ pack: string; lesson: string }>;
}) {
  const p = await params;
  const pack = getPack(p.pack);
  const index = Number(p.lesson) - 1;
  if (!pack || !Number.isInteger(index) || index < 0 || index >= 5) notFound();
  return (
    <Suspense
      fallback={
        <div className="lesson-shell lesson-loading">
          Preparing your lesson…
        </div>
      }
    >
      <Lesson
        key={`${p.pack}/${p.lesson}`}
        packId={pack.id}
        packTitle={pack.title}
        lesson={index + 1}
        title={pack.lessons[index]}
        terms={pack.terms.slice(index * 4, index * 4 + 4)}
      />
    </Suspense>
  );
}
