import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { authConfig } from "./auth.config";
import { findById, verifyCredentials, verifyEmailAfterOAuthLink } from "@/domain/auth";
import { enforceRateLimit, getClientIp } from "@/lib/rate-limit";

// OAuth providers are only registered when their credentials are configured, so
// the soft launch can run on the seeded Credentials admin alone without wiring up
// Google / GitHub apps.
//
// Google is allowed to link to an existing account with the same email. That is only
// safe because the signIn callback (auth.config.ts) rejects unverified Google emails and
// the linkAccount event below drops any unverified password on the linked account.
const oauthProviders = [
  process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET
    ? Google({ allowDangerousEmailAccountLinking: true })
    : null,
  process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET ? GitHub : null,
].filter((provider) => provider !== null);

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  callbacks: {
    ...authConfig.callbacks,
    // The token only carries id/role from sign-in, so a profile edit would show a stale name
    // until re-login. `session.update()` (client) just triggers this; the values come from the DB.
    async jwt(params) {
      const token = authConfig.callbacks.jwt(params);

      if (params.trigger === "update" && typeof token.id === "string") {
        const user = await findById(token.id);

        if (user) {
          token.name = user.name;
          token.picture = user.image;
        }
      }

      return token;
    },
  },
  events: {
    async linkAccount({ user }) {
      if (user.id) {
        await verifyEmailAfterOAuthLink(user.id);
      }
    },
  },
  providers: [
    ...oauthProviders,
    Credentials({
      credentials: { email: {}, password: {} },
      authorize: async (creds, request) => {
        const email = typeof creds?.email === "string" ? creds.email.toLowerCase() : "unknown";
        const ip = getClientIp(request);
        await enforceRateLimit({ key: `login:${email}:${ip}`, limit: 10, windowSeconds: 60 * 5 });
        return verifyCredentials(creds);
      },
    }),
  ],
});
