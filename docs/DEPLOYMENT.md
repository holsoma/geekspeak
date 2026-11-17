# Deployment status

The public website is [geekspeak-sigma.vercel.app](https://geekspeak-sigma.vercel.app), hosted in the `holsoma/geekspeak` Vercel project. The GitHub repository is connected for deployments from `main`. Vercel authentication is disabled for the project so visitors can open the website without a Vercel account.

The dedicated `geekspeak-db` Neon database uses the free plan in Singapore. The schema has been applied. The session secret is configured in Vercel; no credentials are committed to Git.

## Verification

- Anonymous requests to the production homepage return HTTP 200 with Geekspeak content.
- The production leaderboard endpoint can query its database and initially returns an empty list.
- Integration checks using temporary encrypted test sessions passed for persisted progress, separation between accounts, rejected unauthenticated and cross-origin writes, once-per-term scoring, and leaderboard opt-in and withdrawal.
- Test profiles and scores were removed after the checks.

These integration checks verify the application after authentication. They do not claim a successful GitHub OAuth handshake.

## Remaining activation step

Register the Geekspeak OAuth app with homepage `https://geekspeak-sigma.vercel.app` and callback `https://geekspeak-sigma.vercel.app/api/auth/callback/github`. Add `AUTH_GITHUB_ID` and `AUTH_GITHUB_SECRET` as production secrets, redeploy, then check a real GitHub sign-in and saved progress across browsers.

The former static-export build and its public links have been removed from the repository. The complete server application is the only supported deployment.

## Former hosting

The old ChatGPT Site's application files were removed and its replacement handler returns HTTP 410 Gone for all paths. That retirement version was deployed successfully. The Sites connector does not expose permanent project deletion, so the retired Site entry may still appear in the owner's library until it is deleted there.
