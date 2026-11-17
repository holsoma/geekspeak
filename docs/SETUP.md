# Setup and deployment

Geekspeak runs with Next.js, TypeScript and plain CSS. Guest learning needs no external service. GitHub identifies signed-in learners; Neon PostgreSQL stores their progress and verified answers.

## Local development

Use Node.js 22 or later. Run `npm ci`, copy `.env.example` to `.env.local`, then run `npm run dev`. The default port is 4400. Do not commit credentials.

| Variable                | Purpose                                                                                           |
| ----------------------- | ------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`  | Full website origin, without a trailing slash. Used for canonical URLs and request-origin checks. |
| `AUTH_URL`              | The same origin, used by Auth.js.                                                                 |
| `AUTH_SECRET`           | A cryptographically random secret of at least 32 characters.                                      |
| `AUTH_GITHUB_ID`        | Client ID of the Geekspeak GitHub OAuth app.                                                      |
| `AUTH_GITHUB_SECRET`    | Client secret of that OAuth app. Server only.                                                     |
| `DATABASE_URL`          | Pooled Neon PostgreSQL connection string. Server only.                                            |
| `DATABASE_URL_UNPOOLED` | Optional direct connection for migrations.                                                        |

Use separate development and production credentials. A local origin must match the address used in the browser, including `localhost` versus `127.0.0.1` and the port. `TEST_URL` can point the end-to-end checks at a different origin.

## GitHub sign-in

Register a dedicated [GitHub OAuth app](https://github.com/settings/developers). Use Geekspeak as its name and the deployment origin as its homepage. Register the exact callback:

```text
https://YOUR-DEPLOYMENT/api/auth/callback/github
```

For development, use `http://localhost:4400/api/auth/callback/github` with the matching local environment URLs. The app requests `read:user`, not repository permissions. It stores the GitHub ID and username, not repository contents. Create a random `AUTH_SECRET` through a password manager or a secure local generator.

All authentication variables and the database connection must be present before the sign-in button is enabled. Missing services produce a clear unavailable state while guest learning remains usable.

## Database

Create a dedicated Neon project or database for Geekspeak. Set the connection variables, then run:

```powershell
npm run db:migrate
```

The migration command applies numbered SQL files once, in a transaction. It creates `profiles` and `verified_terms`; request handlers never create or alter tables. The database role needs access only to the Geekspeak database. Browser code never receives its connection string.

No production database has been provisioned by the source repository alone. Do not reuse another project's tables or credentials without reviewing the separation.

## Vercel

1. Sign in to Vercel and import `holsoma/geekspeak`.
2. Add the production environment variables in the project settings.
3. Confirm that the GitHub callback matches the assigned deployment domain.
4. Deploy. `vercel.json` runs migrations, then the production build, in the Singapore region.
5. Check a real GitHub login, complete a lesson, open the account on a second browser, import guest progress explicitly, join and leave the leaderboard, and sign out.

You can deploy the guest version without credentials. Do not describe GitHub sign-in or cloud saving as live until those checks pass. Preview deployments should use development credentials and their own callback origin; production-only OAuth callbacks will not work on arbitrary preview URLs.

## Static guest preview

The current [private preview](https://geekspeak.htdcvdl.chatgpt.site) is hosted through ChatGPT Sites. It contains all 200 terms and the full guest learning flow. Its progress stays in the browser. GitHub authentication, account saving and leaderboard participation are unavailable in this static version.

To build this version from the same application source:

```powershell
npm run build:guest -- https://YOUR-PREVIEW-ORIGIN
```

The build uses an isolated directory and writes static files to `.sites-preview/dist`. It does not modify the main application. The local Sites checkout has its own ignored `.openai/hosting.json` and source repository. Reuse its project ID when updating that deployment; do not create a replacement Site. The main repository remains the full Next.js application for Vercel.

For browser checks against a locally served static export, set `TEST_URL`, `TEST_GUEST_ONLY=1` and optionally `TEST_OUTPUT`. This checks the guest features and metadata while excluding server-only API assertions.

## Verification

```powershell
npm test
npm run build
npm run start -- --hostname 127.0.0.1 --port 4400
# In another terminal:
npm run test:e2e
```

The browser runner uses Playwright Chromium or installed Microsoft Edge. Install Chromium with `npx playwright install chromium` when neither is available. Screenshots and reports go into ignored `.jury/` folders. Never use private account data for public screenshots.

Use `npm audit --omit=dev` to assess runtime dependencies separately from build tools. At creation, npm reported a picomatch advisory in the ESLint development dependency tree, with no patched version available from the registry. It is not a shipped browser or server dependency. Do not accept an unrelated major-version downgrade from `npm audit fix --force`; review the upstream fix when available.
