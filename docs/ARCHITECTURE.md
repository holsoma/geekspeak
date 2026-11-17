# Architecture

## Content

Two typed source assets export ten packs, each containing twenty original terms grouped into five lessons of four. A term has a stable ID, name, aliases, summary, explanation, example, misconception, primary-source URL and a scenario question. Stable IDs are part of the progress contract. Preserve them when correcting text. Adding or removing terms requires checking pack counts, lesson boundaries and saved progress compatibility.

The catalogue and definitions are public. Nothing in the question bank is treated as secret: this is a learning tool with a small social leaderboard, not an examination system or competition with prizes.

## Lesson rules

Any pack can be opened. Within a pack, completing a lesson opens the next. A test-out can be attempted for any lesson and passes only with four correct answers on the first attempt. A failed test-out does not complete the lesson. Correct terms can still count towards personal understanding.

Normal lessons first explain four terms, then ask four questions. A missed term is appended to the question queue until answered correctly. Completion is recorded only after the queue is finished. Repetition does not increase the number of distinct learned terms.

## Personal progress

Guest progress lives under `geekspeak:guest:v1` in browser local storage. Account caches use the GitHub account ID in a separate key. Stored data includes learned terms, completed lesson IDs, timestamped bookmark and review marks, and the last visited lesson.

Completed lessons and learned terms merge as sets. The latest bookmark or review mark wins, including removals. Future device timestamps are bounded when reading saved data. Server writes use an optimistic revision check and retry a concurrent update instead of silently overwriting it. API handlers derive the account identity from the signed session, never a client-supplied account ID.

Guest import is explicit. It merges personal progress and removes the guest copy only after the learner chooses to import. Guest data never adds leaderboard points. If a cloud request fails, the account's browser cache keeps the edit for retry on reconnection, reload or a later edit. If browser storage itself is unavailable, the interface says that progress is only held in the open page.

## Authentication and scoring

Auth.js uses a GitHub OAuth flow and an encrypted session cookie. Only profile access is requested. No GitHub access token is exposed to the browser. Origin checks protect mutation routes. Client input is bounded and checked against known term and lesson IDs.

`POST /api/answer` checks the chosen option against the source question. A correct signed-in answer inserts one `(github_id, term_id)` record; a primary key makes repeated requests harmless. Each unique record is worth ten points. The public leaderboard returns only opted-in usernames and aggregates, up to twenty learners. There is no weekly reset or streak multiplier.

The public source contains the answers, so this prevents accidental duplicate scoring and direct score submission, not a determined person reading the answers. Do not use these scores to assess academic work.

## Interface

Public pages include home, packs, pack detail, wordbook, term detail, about, privacy and leaderboard. Learning and progress pages are excluded from search indexing. Missing routes return a real 404. Public descriptions are server rendered, with canonical URLs, an Open Graph image, sitemap and structured term data.

The interface uses SVG artwork and two self-hosted font families. GSAP runs the home card movement and page entrances. Lesson pages remain still at rest. Reduced-motion users get all content without animation. The design deliberately keeps native scrolling and the native pointer.
