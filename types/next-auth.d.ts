import { UserRole } from "@prisma/client"
import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role?: UserRole
      access_token?: string
      token_type?: string
    }
  }

  interface User {
    id: string
    email: string
    name: string
    role?: UserRole
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: UserRole
    access_token?: string
    token_type?: string
    provider_token?: string
  }
}
