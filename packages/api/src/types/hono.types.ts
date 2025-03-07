import { Context as HonoContext } from "hono"
import { UserRole } from "./auth.types"

/**
 * Custom variables stored in Hono context
 */
export interface Variables {
  userId: string
  userEmail: string
  userRole: UserRole
  secureHeadersNonce?: string
}

/**
 * Extended Hono Context with our custom variables
 */
export type Context = HonoContext<{
  Variables: Variables
}>
