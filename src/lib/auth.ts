import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import dbConnect from './mongodb'
import { User } from '../models/User'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials: any) {
        if (!credentials?.email || !credentials?.password) {
          console.log('Missing credentials:', { 
            hasEmail: !!credentials?.email, 
            hasPassword: !!credentials?.password 
          })
          return null
        }

        try {
          await dbConnect()
          console.log('Attempting to find user with email:', credentials.email)
          
          const user = await User.findOne({ email: credentials.email })
          
          if (!user) {
            console.log('User not found for email:', credentials.email)
            return null
          }

          console.log('User found:', { 
            email: user.email, 
            hasPassword: !!user.password,
            passwordLength: user.password?.length 
          })
          
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password)
          console.log('Password comparison result:', isPasswordValid)
          
          if (!isPasswordValid) {
            console.log('Invalid password for user:', credentials.email)
            return null
          }

          console.log('Authentication successful for:', user.email)
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            username: user.username,
            avatar: user.avatar,
            honorPoints: user.honorPoints,
            level: user.level
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.username = (user as any).username
        token.honorPoints = (user as any).honorPoints
        token.level = (user as any).level
        token.avatar = (user as any).avatar
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub!
        ;(session.user as any).username = token.username as string
        ;(session.user as any).honorPoints = token.honorPoints as number
        ;(session.user as any).level = token.level as number
        ;(session.user as any).avatar = token.avatar as string
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      // Default redirect to dashboard after login
      return `${baseUrl}/dashboard`
    }
  },
  pages: {
    signIn: '/auth/signin'
  },
  secret: process.env.NEXTAUTH_SECRET
}
