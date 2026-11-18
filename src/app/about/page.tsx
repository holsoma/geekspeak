import type { Metadata } from "next";
import Link from "next/link";
import { Arrow, Logo } from "@/components/Icons";
import { githubUrl } from "@/lib/site";
export const metadata: Metadata = {
  title: "About GeekSpeak",
  description:
    "A useful tech vocabulary, built for curious people. Learn why GeekSpeak focuses on understanding, real examples and progress without pressure.",
};
export default function About() {
  return (
    <article className="prose-page">
      <Logo className="prose-logo" />
      <span className="section-label">WHY GeekSpeak EXISTS</span>
      <h1>You shouldn’t need a dictionary to follow the conversation.</h1>
      <p className="lead">
        Someone mentions a coroutine. Someone else says “just use Terraform”.
        You nod, and quietly add another word to the list of things to look up.
      </p>
      <p>
        GeekSpeak is for that list. It brings together useful terms from AI,
        programming and the systems behind everyday software. Each one gets a
        plain explanation, a concrete example and a question that checks whether
        it makes sense.
      </p>
      <h2>Useful, rather than exhaustive.</h2>
      <p>
        The first collection has 200 terms across ten packs. Applied AI gets
        particular attention: language models, retrieval, agents, machine
        learning, computer vision and running models in real products. Python,
        data, system design and cloud computing connect those ideas to the tools
        around them.
      </p>
      <h2>Your understanding is the progress.</h2>
      <p>
        There are no streaks to protect or lives to run out of. Start with any
        pack. Learn four terms at a time, review the ideas that need another
        look, or test out of material you already know.
      </p>
      <h2>Open to learn. Open to improve.</h2>
      <p>
        The explanations and questions are written for GeekSpeak, with links to
        original documentation. The project is free and open source. If an
        example is unclear or a definition needs correcting, you can report it
        on GitHub.
      </p>
      <div className="button-row">
        <Link className="button primary" href="/packs">
          Find a pack <Arrow />
        </Link>
        <a className="button" href={githubUrl}>
          Explore the project <Arrow diagonal />
        </a>
      </div>
    </article>
  );
}
