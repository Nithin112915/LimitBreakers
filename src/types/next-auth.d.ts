import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      username?: string
      honorPoints?: number
      level?: number
      avatar?: string
    }
  }

  interface User {
    id: string
    email: string
    name: string
    username?: string
    avatar?: string
    honorPoints?: number
    level?: number
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    username?: string
    honorPoints?: number
    level?: number
    avatar?: string
  }
}