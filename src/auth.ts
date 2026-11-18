import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import type { TokenSet } from "@auth/core/types";
export const authConfigured = Boolean(
  process.env.AUTH_GITHUB_ID &&
  process.env.AUTH_GITHUB_SECRET &&
  (process.env.AUTH_SECRET?.length || 0) >= 32 &&
  process.env.DATABASE_URL,
);
export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  trustHost:
    Boolean(process.env.AUTH_URL) ||
    process.env.VERCEL === "1" ||
    process.env.NODE_ENV !== "production",
  providers: authConfigured
    ? [
        GitHub({
          authorization: { params: { scope: "read:user" } },
          userinfo: {
            url: "https://api.github.com/user",
            async request({ tokens }: { tokens: TokenSet }) {
              if (!tokens.access_token)
                throw new Error("GitHub did not return an access token.");
              const response = await fetch("https://api.github.com/user", {
                headers: {
                  Authorization: `Bearer ${tokens.access_token}`,
                  "User-Agent": "GeekSpeak",
                },
                cache: "no-store",
              });
              if (!response.ok)
                throw new Error("GitHub profile could not be loaded.");
              return response.json();
            },
          },
          profile(profile) {
            return {
              id: String(profile.id),
              name: profile.login,
              email: null,
              image: profile.avatar_url,
            };
          },
        }),
      ]
    : [],
  session: { strategy: "jwt" },
  pages: { signIn: "/sign-in", error: "/sign-in" },
  callbacks: {
    jwt({ token, account, profile }) {
      if (account?.provider === "github") {
        token.sub = account.providerAccountId;
        token.username =
          typeof profile?.login === "string" ? profile.login : "";
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.sub || "";
      session.user.name =
        typeof token.username === "string" ? token.username : session.user.name;
      return session;
    },
    redirect({ url, baseUrl }) {
      try {
        const target = new URL(url, baseUrl);
        return target.origin === new URL(baseUrl).origin
          ? target.href
          : baseUrl;
      } catch {
        return baseUrl;
      }
    },
  },
});
