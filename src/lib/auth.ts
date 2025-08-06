import NextAuth, { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from './db';
import bcrypt from 'bcryptjs';
import { getUserByEmail } from './server-utils';

const config = {
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials, req) {
        //runs on login
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        const user = await getUserByEmail(email);

        if (!user) {
          throw new Error('No user found with the given email');
          return null;
        }

        const passwordsMatch = await bcrypt.compare(
          password,
          user.hashedPassword
        );
        if (!passwordsMatch) {
          throw new Error('Incorrect password');
          return null;
        }
        return user;
      },
    }),
  ],
  callbacks: {
    authorized: ({ auth, request }) => {
      //runs on every request with middleware
      const isLoggedIn = Boolean(auth?.user?.email);
      const isTryingToAccessApp = request.nextUrl.pathname.includes('/app');

      // if (isTryingToAccessApp) {
      //   return false;
      // } else {
      //   return true;
      // }

      if (!isLoggedIn && isTryingToAccessApp) {
        return false; // redirect to login
      }
      if (isLoggedIn && isTryingToAccessApp) {
        return true;
      }

      if (isLoggedIn && !isTryingToAccessApp) {
        return Response.redirect(new URL('/app/dashboard', request.nextUrl));
      }

      if (!isLoggedIn && !isTryingToAccessApp) {
        return true;
      }

      return false;
    },
    jwt: ({ token, user }) => {
      if (user) {
        token.userId = user.id;
      }

      return token;
    },

    session: ({ session, token }) => {
      if (session.user) {
        session.user.id = token.userId;
      }

      return session;
    },
  },
  // session: {
  //   maxAge: 30 * 24 * 60 * 60, // 30 days
  //   strategy: 'jwt',
  // },
} satisfies NextAuthConfig;

export const { auth, signIn, signOut } = NextAuth(config);
