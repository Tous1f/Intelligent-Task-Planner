import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { type DefaultSession, type NextAuthOptions } from 'next-auth'
import { type JWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string
      email: string
      name: string
      image?: string
      accessToken?: string
      refreshToken?: string
      expiresAt?: number
      provider?: string
      scope?: string
    } & DefaultSession['user']
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string
    refreshToken?: string
    expiresAt?: number
    provider?: string
    scope?: string
  }
}

export const authOptions = {
  debug: true,
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: [
            'openid',
            'email',
            'profile',
            'https://www.googleapis.com/auth/calendar',
            'https://www.googleapis.com/auth/calendar.events',
            'https://www.googleapis.com/auth/calendar.readonly'
          ].join(' '),
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Missing credentials')
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user || !user.password) {
          throw new Error('No user found with this email')
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          throw new Error('Invalid password')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, account, trigger }) {
      console.log('JWT callback - entry point', { 
        tokenFields: Object.keys(token),
        hasUser: !!user,
        hasAccount: !!account,
        trigger,
        accountType: account?.type,
        provider: account?.provider
      });

      // Initial sign in with OAuth
      if (account?.type === 'oauth' && account.provider === 'google') {
        console.log('JWT callback - Google OAuth sign in');
        
        if (!account.access_token) {
          console.error('No access token provided by Google OAuth');
          throw new Error('No access token provided by Google OAuth');
        }

        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at ? account.expires_at * 1000 : undefined; // Convert to milliseconds
        token.provider = account.provider;
        token.scope = account.scope;

        // Always take new tokens and scope from the account on fresh sign in
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          expiresAt: account.expires_at ? Math.floor(Date.now() / 1000 + account.expires_at) : undefined,
          provider: account.provider,
          scope: account.scope
        };
      }

      // Handle credentials provider
      if (account?.type === 'credentials') {
        console.log('JWT callback - Credentials sign in');
        return {
          ...token,
          provider: 'credentials'
        };
      }

      // Check token expiration
      const shouldRefresh = token.expiresAt && 
        typeof token.expiresAt === 'number' && 
        Date.now() >= (token.expiresAt * 1000 - 5 * 60 * 1000); // Refresh 5 min before expiry

      if (!shouldRefresh) {
        return token;
      }

      // Try to refresh the token
      if (token.refreshToken) {
        console.log('JWT callback - Attempting token refresh');
        try {
          // Make sure refresh token is a string
          const refreshToken = token.refreshToken as string;
          
          const response = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
              client_id: process.env.GOOGLE_CLIENT_ID || '',
              client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
              grant_type: 'refresh_token',
              refresh_token: refreshToken
            })
          });

          const tokens = await response.json();

          if (!response.ok) {
            console.error('JWT callback - Token refresh failed:', tokens);
            throw new Error(tokens.error || 'Failed to refresh token');
          }

          console.log('JWT callback - Token refresh succeeded');

          return {
            ...token,
            accessToken: tokens.access_token,
            expiresAt: Math.floor(Date.now() / 1000 + tokens.expires_in),
            error: undefined // Clear any previous errors
          };
        } catch (error) {
          console.error('JWT callback - Token refresh error:', error);
          return { 
            ...token, 
            error: 'RefreshAccessTokenError',
            // Keep the refresh token in case we want to try again
            accessToken: undefined,
            expiresAt: undefined
          };
        }
      }

      return token;
    },
    async session({ session, token, user }) {
      if (session.user) {
        // Set basic user info
        session.user.id = (token.sub as string) || '';
        session.user.provider = token.provider as string | undefined;

        // Only set OAuth tokens for Google provider
        if (token.provider === 'google') {
          session.user.accessToken = token.accessToken as string | undefined;
          session.user.refreshToken = token.refreshToken as string | undefined;
          session.user.expiresAt = token.expiresAt as number | undefined;

          // Also pass scope from token to session
          if (token.scope) {
            (session as any).scope = token.scope;
          }
        }
      }

      console.log('Session callback - sanitized:', {
        userId: session.user?.id,
        provider: session.user?.provider,
        hasAccessToken: !!session.user?.accessToken,
        hasRefreshToken: !!session.user?.refreshToken,
        expiresAt: session.user?.expiresAt,
        hasScope: !!(session as any).scope
      });

      return session;
    }
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt'
  }
} satisfies NextAuthOptions
