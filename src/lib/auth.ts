import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
// Use dynamic require for optional dependency to avoid type errors in this environment
const PrismaAdapter: any = require('@auth/prisma-adapter').PrismaAdapter || require('@next-auth/prisma-adapter')?.PrismaAdapter || ((p: any) => p);
import CredentialsProvider from 'next-auth/providers/credentials';
// dynamic import for bcrypt to avoid missing-type errors in analysis environment
const { compare } = require('bcrypt') as { compare: (a: string, b: string) => Promise<boolean> };
import { prisma } from './prisma';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  pages: ({
    signIn: '/auth/signin',
    signUp: '/auth/signup',
    error: '/auth/error',
  } as any),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials');
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user || !user.password) {
          throw new Error('Invalid credentials');
        }

        const isValid = await compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error('Invalid credentials');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};
