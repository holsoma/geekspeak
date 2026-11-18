# Deployment status

The public website is [geek-speak.vercel.app](https://geek-speak.vercel.app), hosted in the `holsoma/geekspeak` Vercel project. The GitHub repository is connected for deployments from `main`. Vercel authentication is disabled for the project so visitors can open the website without a Vercel account.

The dedicated `geekspeak-db` Neon database uses the free plan in Singapore. The schema has been applied. The session secret, GitHub client ID and GitHub client secret are configured in Vercel production. No credentials are committed to Git.

## Verification

- Anonymous requests to the production homepage return HTTP 200 with GeekSpeak content.
- The production profile endpoint reports that authentication is enabled. The GitHub provider uses `https://geek-speak.vercel.app/api/auth/callback/github`.
- Selecting Continue with GitHub opens GitHub's sign-in page for the GeekSpeak application, requesting only `read:user`.
- The project owner confirmed successful GitHub sign-in with a real account on 18 November 2026.
- The production leaderboard endpoint can query its database and initially returns an empty list.
- Integration checks using temporary encrypted test sessions passed for persisted progress, separation between accounts, rejected unauthenticated and cross-origin writes, once-per-term scoring, and leaderboard opt-in and withdrawal.
- Test profiles and scores were removed after the checks.

The former static-export build and its public links have been removed from the repository. The complete server application is the only supported deployment.

## Former hosting

The old ChatGPT Site's application files were removed and its replacement handler returns HTTP 410 Gone for all paths. That retirement version was deployed successfully. The Sites connector does not expose permanent project deletion, so the retired Site entry may still appear in the owner's library until it is deleted there.
