# GeekSpeak

## Brief

An open-source learning website for the tech terms that come up in real conversations. Start with 200 terms in ten packs, weighted towards applied AI. Guests can learn immediately. GitHub sign-in saves progress across devices. No streaks, hearts, timers, paid content or fake leaderboard entries.

## Concept

Three directions considered: a translation desk (originality 4, fit 5, feasibility 5, portability 2), a collection of learning cards (3, 5, 5, 3), and a map of connected ideas (4, 4, 3, 3). The translation desk wins: GeekSpeak turns a word you have heard into a sentence you understand. Learning cards support the central interaction.

Idea: Turn tech talk into something you can explain.
Metaphor: Conversation cards on a learning desk.
Signature: A large term card slides aside to reveal a concrete everyday explanation. The same movement carries through pack selection, lesson cards and answer feedback.
Emotion: Curiosity without pressure.
Motion verb: Slide, turn, settle.
Screenshot: Oversized navy lettering beside a coral speaking-head silhouette and a fan of pale-blue term cards.

## System

Ground #f7f4ec, ink #173548, muted #52616b, line #c7cdc8, accent #ee855b, deep ground #173548. Supporting pack colours: #c5deeb, #d6dfb4, #e7c8d4, #f3d88a. No gradients. Display: Bricolage Grotesque. Body: Manrope. Self-host licensed fonts. Twelve-column desktop grid with 40px outer spacing; four columns and 20px spacing on phones. Shared 8px radius for controls, 20px for physical card objects. Body 17px/1.6.

Home: offset headline and interactive term stack; narrow fact strip; varied pack shelf; full-width working learning demonstration; concise explanation of progress; oversized typographic footer. Pack detail: artwork beside a five-lesson path. Lesson: one question or explanation at a time. Wordbook: search and flat definition rows. Progress: meaningful counts and next steps. Leaderboard: opt-in real accounts only.

Use GSAP for the signature movement and page entrance. Short feedback, no loading theatre, no scroll hijacking, no automatic sound. Keep lesson pages still at rest for concentration. On the home page, a tiny card tilt expresses the physical stack, paused offscreen and under reduced motion. All content remains visible without motion.

## Quality

Test production at desktop, 390px mobile and reduced motion. Verify keyboard access, visible focus, AA contrast, no overflow, truthful empty/error states and real progress persistence. Target mobile LCP below 2.5s, CLS below 0.05, no serious axe findings. Conduct at least two independent jury passes. Scores must be earned from evidence, never adjusted to meet the requested ambition.
