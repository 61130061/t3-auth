var bcrypt = require('bcryptjs');
import NextAuth, { type NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";


import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db/client";

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email;
      }
      return session;
    },
    async jwt ({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    }
  },
  secret: env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: "/user/signin"
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email", placeholder: "email@gmail.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        // TODO: Credentials Validation
        const { email, password } = credentials as {
          email: string,
          password: string
        }

        const user = await prisma.user.findUnique({
          where: { email }
        });

        if (!user) return null

        // TODO: Password validation
        const isValidPassword = await bcrypt.compareSync(password, user.password);

        // If no error and we have user data, return it
        if (isValidPassword) {
          console.log('hi');
          return user
        }

        return null;
      }
    })
  ],
};

export default NextAuth(authOptions);
