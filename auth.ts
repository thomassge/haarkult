import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

import {
  authorizeAdminCredentials,
  normalizeAdminEmail,
  type AdminSessionUser,
} from "@/lib/auth/admin-users";
import {
  checkLoginThrottle,
  clearLoginThrottle,
  recordLoginFailure,
} from "@/lib/auth/login-throttle";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

function getRequestSource(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwardedFor || request.headers.get("x-real-ip")?.trim() || undefined;
}

function createThrottleKey(email: string, source?: string) {
  return source ? `${email}|${source}` : email;
}

function toTokenUser(user: AdminSessionUser) {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    active: user.active,
  };
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "E-Mail", type: "email" },
        password: { label: "Passwort", type: "password" },
      },
      async authorize(rawCredentials, request) {
        const parsedCredentials = credentialsSchema.safeParse(rawCredentials);

        if (!parsedCredentials.success) {
          return null;
        }

        const email = normalizeAdminEmail(parsedCredentials.data.email);
        const throttleKey = createThrottleKey(email, getRequestSource(request));

        if (!checkLoginThrottle(throttleKey)) {
          return null;
        }

        const admin = await authorizeAdminCredentials({
          email,
          password: parsedCredentials.data.password,
        });

        if (!admin) {
          recordLoginFailure(throttleKey);
          return null;
        }

        clearLoginThrottle(throttleKey);
        return toTokenUser(admin);
      },
    }),
  ],
  callbacks: {
    authorized({ auth: session, request }) {
      const pathname = request.nextUrl.pathname;

      if (pathname.startsWith("/admin/login") || pathname.startsWith("/api/auth")) {
        return true;
      }

      if (pathname.startsWith("/admin")) {
        const user = session?.user as Partial<AdminSessionUser> | undefined;
        return user?.active === true;
      }

      return true;
    },
    jwt({ token, user }) {
      if (user) {
        const adminUser = user as AdminSessionUser;

        token.id = adminUser.id;
        token.email = adminUser.email;
        token.role = adminUser.role;
        token.active = adminUser.active;
      }

      return token;
    },
    session({ session, token }) {
      session.user.id = String(token.id);
      session.user.email = String(token.email);
      Object.assign(session.user, {
        role: token.role as AdminSessionUser["role"],
        active: token.active === true,
      });

      return session;
    },
  },
});
