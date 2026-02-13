import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import type { JWT as JWTType } from "@auth/core/jwt";
import { jwtDecode, type JwtPayload } from "jwt-decode";
import Credentials from "next-auth/providers/credentials";

import { oauth_google } from "@/google-config";

interface DecodedToken extends JwtPayload {
  user_type: string;
  user_id: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

// Extend the NextAuth Session and JWT types to include your custom properties
declare module "next-auth" {
  interface User {
    id: string;
    name?: string;
    email: string;
    username: string;
    display: string;
    user_type: string;
    accessToken: string;
    refreshToken: string;
    hasUsablePassword: boolean;
    first_name?: string | null;
    last_name?: string | null;
  }
  interface Session {
    user: User;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    token_type?: string;
    exp?: number;
    iat?: number;
    jti?: string;
    user_id?: string;
    user_type?: string;
    email?: string;
    first_name?: string | null;
    last_name?: string | null;
    accessToken?: string;
    refreshToken?: string;
    display?: string;
    hasUsablePassword?: boolean;
    image?: string;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/_allauth/browser/v1/auth/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            },
          );

          if (!response.ok) {
            console.error("Login failed with status:", response.status);
            return null;
          }

          const data = await response.json();

          if (!data?.data?.user?.access_token) {
            console.error("User data not found in the response");
            return null;
          }

          const decoded = jwtDecode<DecodedToken>(data.data.user.access_token);

          return {
            id: String(data.data.user.id),
            name: data.data.user.display || credentials.email,
            email: data.data.user.email,
            username: data.data.user.username || data.data.user.email,
            display: data.data.user.display,
            user_type: decoded.user_type || "",
            accessToken: data.data.user.access_token,
            refreshToken: data.data.user.refresh_token,
            hasUsablePassword: data.data.user.has_usable_password || false,
            first_name: decoded.first_name,
            last_name: decoded.last_name,
          };
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
    Google({
      clientId: oauth_google.client_id,
      clientSecret: oauth_google.client_secret,
      authorization: {
        params: {
          prompt: oauth_google.prompt,
          access_type: oauth_google.access_type,
          scope: oauth_google.scopes,
        },
      },
      checks: ["state"],
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }): Promise<JWTType> {
      if (account && user) {
        if (account.provider === "google") {
          try {
            // Step 1: Fetch CSRF token from Django
            const csrfResponse = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/_allauth/browser/v1/config`,
              { method: "GET", credentials: "include" },
            );

            const csrfCookie = csrfResponse.headers.get("set-cookie");
            let csrfToken = "";
            let cookieHeader = "";

            if (csrfCookie) {
              const match = csrfCookie.match(/csrftoken=([^;]+)/);
              if (match) {
                csrfToken = match[1];
                cookieHeader = `csrftoken=${csrfToken}`;
              }
            }

            const requestBody = {
              provider: "google",
              process: "login",
              token: {
                client_id: oauth_google.client_id,
                id_token: account.id_token,
                access_token: account.access_token,
              },
            };

            const fetchHeaders: HeadersInit = {
              "Content-Type": "application/json",
              "X-CSRFToken": csrfToken,
              Cookie: cookieHeader,
            };

            const response = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/_allauth/browser/v1/auth/provider/token`,
              {
                method: "POST",
                headers: fetchHeaders,
                body: JSON.stringify(requestBody),
              },
            );

            if (!response.ok) {
              const errorText = await response.text();
              console.error("Backend auth error:", response.status, errorText);
              throw new Error(`Backend auth failed: ${response.status}`);
            }

            const data = await response.json();
            console.log("data", data);
            const decodedToken = jwtDecode<DecodedToken>(
              data.data.user.access_token,
            );

            return {
              ...token,
              accessToken: data.data.user.access_token,
              refreshToken: data.data.user.refresh_token,
              first_name: decodedToken.first_name,
              last_name: decodedToken.last_name,
              display: data.data.user.display,
              hasUsablePassword: data.data.user.has_usable_password || false,
              email: data.data.user.email,
              user_id: String(data.data.user.id),
              user_type: decodedToken.user_type,
              image: user.image,
              iat: decodedToken.iat,
              exp: decodedToken.exp,
              jti: decodedToken.jti,
            } as JWTType;
          } catch (error) {
            console.error("Google auth error:", error);
            return token;
          }
        }
        return { ...token, ...user } as JWTType;
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = (token.user_id as string) || "";
        session.user.user_type = (token.user_type as string) || "";
        session.user.email =
          (token.email as string) || session.user.email || "";
        session.user.first_name = (token.first_name as string | null) || null;
        session.user.last_name = (token.last_name as string | null) || null;
        session.user.username =
          (token.email as string) || session.user.email || "";
        session.user.accessToken = (token.accessToken as string) || "";
        session.user.refreshToken = (token.refreshToken as string) || "";
        session.user.display =
          (token.display as string) || session.user.name || "";
        session.user.hasUsablePassword =
          (token.hasUsablePassword as boolean) || false;
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  session: {
    strategy: "jwt",
  },
});
