import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { authConfig } from "./auth.config";
import { verifyCredentials } from "@/domain/auth";
import { enforceRateLimit, getClientIp } from "@/lib/rate-limit";

// OAuth providers are only registered when their credentials are configured, so
// the soft launch can run on the seeded Credentials admin alone without wiring up
// Google / GitHub apps.
const oauthProviders = [
  process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET ? Google : null,
  process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET ? GitHub : null,
].filter((provider) => provider !== null);

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
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
