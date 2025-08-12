import NextAuth, { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { getUserByEmail } from './server-utils';
import { authSchema } from './validations';
import { sleep } from './utils';

const config = {
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        //runs on login

        //validation
        const validatedFormData = authSchema.safeParse(credentials);
        if (!validatedFormData.success) {
          return null;
        }

        //extract values
        const { email, password } = validatedFormData.data;

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

      if (isLoggedIn && isTryingToAccessApp && !auth?.user.hasAccess) {
        return Response.redirect(new URL('/payment', request.nextUrl));
      }

      if (isLoggedIn && isTryingToAccessApp && auth?.user.hasAccess) {
        return true;
      }

      if (isLoggedIn && !isTryingToAccessApp) {
        if (
          request.nextUrl.pathname.includes('/login') ||
          (request.nextUrl.pathname.includes('/signup') &&
            !auth?.user.hasAccess)
        ) {
          return Response.redirect(new URL('/payment', request.nextUrl));
        }
        return true;
      }

      if (!isLoggedIn && !isTryingToAccessApp) {
        return true;
      }

      return false;
    },

    jwt: async ({ token, user, trigger }) => {
      if (user) {
        token.userId = user.id;
        token.email = user.email!;
        token.hasAccess = user.hasAccess;
      }

      if (trigger === 'update') {
        console.log('TRIGGERED!!!!!');
        await sleep(1000);
        //on every request
        const userFromDb = await getUserByEmail(token.email);

        if (userFromDb) {
          token.hasAccess = userFromDb.hasAccess;
        }
      }

      return token;
    },

    session: ({ session, token }) => {
      session.user.id = token.userId;
      session.user.hasAccess = token.hasAccess;

      return session;
    },
  },
  // session: {
  //   maxAge: 30 * 24 * 60 * 60, // 30 days
  //   strategy: 'jwt',
  // },
} satisfies NextAuthConfig;

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth(config);
