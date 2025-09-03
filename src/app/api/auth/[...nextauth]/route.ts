import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'openid email profile https://www.googleapis.com/auth/calendar.readonly'
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
          return null
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          })

          if (!user?.password) {
            return null
          }

          const isValid = await bcrypt.compare(credentials.password, user.password)
          
          if (!isValid) {
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt' as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
      }
      if (account) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.provider = account.provider
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.accessToken = token.accessToken as string
        session.provider = token.provider as string
      }
      return session
    },
    async signIn({ user, account, profile }) {
      try {
        if (account?.provider === 'google' && user.email) {
          // Check if profile exists for this user
          const existingProfile = await prisma.profile.findFirst({
            where: {
              OR: [
                { email: user.email },
                { userId: user.id }
              ]
            }
          })
          
          // Create profile if doesn't exist
          if (!existingProfile) {
            await prisma.profile.create({
              data: {
                userId: user.id,
                email: user.email,
                displayName: user.name || user.email.split('@')[0],
                preferences: {
                  theme: 'light',
                  notifications: true,
                  defaultPomodoroLength: 25
                }
              }
            })
            console.log('✅ Profile created for Google user:', user.email)
          }
        }
        return true
      } catch (error) {
        console.error('❌ Profile creation error during sign-in:', error)
        // Don't block sign-in if profile creation fails
        return true
      }
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  events: {
    async createUser({ user }) {
      console.log('👤 New user created:', user.email)
    },
    async signIn({ user, account, isNewUser }) {
      console.log('🔐 User signed in:', user.email, 'Provider:', account?.provider)
    }
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }