import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { authConfig } from "./auth.config";
import { verifyCredentials } from "@/domain/auth";
import { enforceRateLimit, getClientIp } from "@/lib/rate-limit";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Google,
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
