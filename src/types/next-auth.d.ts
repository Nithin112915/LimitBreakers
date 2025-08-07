import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      honorPoints: number
      level: number
      avatar?: string
    } & DefaultSession['user']
  }

  interface User {
    honorPoints: number
    level: number
    avatar?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    honorPoints: number
    level: number
    avatar?: string
  }
}