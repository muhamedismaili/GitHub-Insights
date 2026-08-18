import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/",
  },
  session: {
    strategy: "database",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isProtectedRoute =
        nextUrl.pathname.startsWith("/watchlist") ||
        nextUrl.pathname.startsWith("/dashboard");

      if (isProtectedRoute && !isLoggedIn) {
        return Response.redirect(new URL("/?authRequired=true", nextUrl));
      }

      if (isProtectedRoute) {
        
        return isLoggedIn;
      }
      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
