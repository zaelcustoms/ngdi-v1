import { Hono } from "hono"
import { zValidator } from "@hono/zod-validator"
import { z } from "zod"
import { prisma } from "../db/prisma"
import { errorHandler, ApiError, ErrorCode } from "../middleware/error-handler"
import { hashPassword, comparePassword } from "../utils/password"
import {
  generateToken,
  generateRefreshToken,
  verifyRefreshToken,
  verifyToken,
} from "../utils/jwt"
import { UserRole } from "../types/auth.types"
import { emailService } from "../services/email.service"
import { AuthService } from "../services/auth.service"
import { HTTPException } from "hono/http-exception"
import { auth as authMiddleware } from "../middleware/auth"

// Schema for login request validation
const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

// Schema for registration request validation
const registerSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
})

// Schema for email verification
const verifyEmailSchema = z.object({
  token: z.string(),
})

// Schema for password reset request
const requestPasswordResetSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
})

// Schema for password reset
const resetPasswordSchema = z.object({
  token: z.string(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
})

// Create auth router
const auth = new Hono()

// Apply error handler
auth.onError(errorHandler)

// Login route
auth.post("/login", zValidator("json", loginSchema), async (c) => {
  try {
    console.log("Login request received")
    const data = await c.req.json()
    console.log("Login data:", { email: data.email })

    const result = await AuthService.login(data)
    console.log("Login successful")

    // Set cookies for authentication
    const cookieOptions = {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      domain:
        process.env.NODE_ENV === "production" ? "vercel.app" : "localhost",
    }

    c.header(
      "Set-Cookie",
      `auth_token=${result.accessToken}; ${cookieOptions.path}; ${cookieOptions.httpOnly ? "HttpOnly;" : ""} ${cookieOptions.secure ? "Secure;" : ""} SameSite=${cookieOptions.sameSite}; Max-Age=${cookieOptions.maxAge}; Domain=${cookieOptions.domain}`
    )
    c.header(
      "Set-Cookie",
      `refresh_token=${result.refreshToken}; ${cookieOptions.path}; ${cookieOptions.httpOnly ? "HttpOnly;" : ""} ${cookieOptions.secure ? "Secure;" : ""} SameSite=${cookieOptions.sameSite}; Max-Age=${cookieOptions.maxAge}; Domain=${cookieOptions.domain}`
    )

    return c.json(result)
  } catch (error) {
    console.error("Login error:", error)

    if (error instanceof HTTPException) {
      return c.json(
        {
          success: false,
          message: error.message || "Authentication failed",
          code: ErrorCode.AUTHENTICATION_ERROR,
        },
        error.status
      )
    }

    console.error("Unhandled login error:", error)
    throw new HTTPException(500, { message: "Login failed" })
  }
})

// Register route
auth.post("/register", zValidator("json", registerSchema), async (c) => {
  try {
    const data = await c.req.json()
    const result = await AuthService.register(data)

    // Set cookies for authentication
    const cookieOptions = {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      domain:
        process.env.NODE_ENV === "production" ? "vercel.app" : "localhost",
    }

    c.header(
      "Set-Cookie",
      `auth_token=${result.accessToken}; ${cookieOptions.path}; ${cookieOptions.httpOnly ? "HttpOnly;" : ""} ${cookieOptions.secure ? "Secure;" : ""} SameSite=${cookieOptions.sameSite}; Max-Age=${cookieOptions.maxAge}; Domain=${cookieOptions.domain}`
    )
    c.header(
      "Set-Cookie",
      `refresh_token=${result.refreshToken}; ${cookieOptions.path}; ${cookieOptions.httpOnly ? "HttpOnly;" : ""} ${cookieOptions.secure ? "Secure;" : ""} SameSite=${cookieOptions.sameSite}; Max-Age=${cookieOptions.maxAge}; Domain=${cookieOptions.domain}`
    )

    return c.json(result)
  } catch (error) {
    if (error instanceof HTTPException) {
      return c.json(
        {
          success: false,
          message: error.message || "Registration failed",
          code: ErrorCode.AUTHENTICATION_ERROR,
        },
        error.status
      )
    }
    throw new HTTPException(500, { message: "Registration failed" })
  }
})

// Verify email route
auth.get("/verify-email", zValidator("query", verifyEmailSchema), async (c) => {
  try {
    const { token } = await c.req.valid("query")

    // Find verification token
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        token,
        expires: {
          gt: new Date(),
        },
      },
    })

    if (!verificationToken) {
      throw new ApiError("Invalid token", 400, ErrorCode.VALIDATION_ERROR)
    }

    // Update user
    await prisma.user.update({
      where: { email: verificationToken.identifier },
      data: { emailVerified: new Date() },
    })

    // Delete verification token
    await prisma.verificationToken.delete({
      where: { token },
    })

    return c.json({
      message: "Email verified successfully",
    })
  } catch (error) {
    console.error("Email verification error:", error)
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      "Email verification failed",
      400,
      ErrorCode.VALIDATION_ERROR
    )
  }
})

// Refresh token route
auth.post("/refresh-token", async (c) => {
  try {
    // Get refresh token from Authorization header or cookies
    let refreshToken = c.req.header("Authorization")?.replace("Bearer ", "")

    // If not in header, try to get from cookies
    if (!refreshToken) {
      const cookieHeader = c.req.raw.headers.get("cookie")
      if (cookieHeader) {
        const cookies = cookieHeader.split(";")
        const refreshTokenCookie = cookies.find((c) =>
          c.trim().startsWith("refresh_token=")
        )
        if (refreshTokenCookie) {
          refreshToken = refreshTokenCookie.split("=")[1]
        }
      }
    }

    // Check if we have a refresh token
    if (!refreshToken) {
      throw new ApiError(
        "Refresh token is required",
        400,
        ErrorCode.BAD_REQUEST
      )
    }

    // Verify refresh token
    const decoded = await verifyRefreshToken(refreshToken)

    // Generate new access token
    const accessToken = await generateToken({
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    })

    // Generate new refresh token
    const newRefreshToken = await generateRefreshToken({
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    })

    // Set cookies for authentication
    const cookieOptions = {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      domain:
        process.env.NODE_ENV === "production" ? "vercel.app" : "localhost",
    }

    c.header(
      "Set-Cookie",
      `auth_token=${accessToken}; ${cookieOptions.path}; ${cookieOptions.httpOnly ? "HttpOnly;" : ""} ${cookieOptions.secure ? "Secure;" : ""} SameSite=${cookieOptions.sameSite}; Max-Age=${cookieOptions.maxAge}; Domain=${cookieOptions.domain}`
    )
    c.header(
      "Set-Cookie",
      `refresh_token=${newRefreshToken}; ${cookieOptions.path}; ${cookieOptions.httpOnly ? "HttpOnly;" : ""} ${cookieOptions.secure ? "Secure;" : ""} SameSite=${cookieOptions.sameSite}; Max-Age=${cookieOptions.maxAge}; Domain=${cookieOptions.domain}`
    )

    return c.json(
      {
        success: true,
        message: "Token refreshed",
        data: {
          accessToken,
          refreshToken: newRefreshToken,
        },
      },
      200
    )
  } catch (error) {
    console.error("Token refresh error:", error)
    throw new ApiError(
      "Invalid refresh token",
      401,
      ErrorCode.AUTHENTICATION_ERROR
    )
  }
})

// Request password reset
auth.post(
  "/request-password-reset",
  zValidator("json", requestPasswordResetSchema),
  async (c) => {
    try {
      const { email } = await c.req.valid("json")

      // Check if user exists
      const user = await prisma.user.findUnique({ where: { email } })

      if (!user) {
        // Don't reveal that the user doesn't exist for security reasons
        return c.json(
          {
            success: true,
            message:
              "If your email is registered, you will receive a password reset link.",
          },
          200
        )
      }

      // Generate reset token
      const resetToken =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15)

      const expiresAt = new Date()
      expiresAt.setHours(expiresAt.getHours() + 1) // Token expires in 1 hour

      // Store reset token
      await prisma.verificationToken.create({
        data: {
          identifier: email,
          token: resetToken,
          expires: expiresAt,
        },
      })

      // Send password reset email
      await emailService.sendPasswordResetEmail(email, resetToken)

      return c.json(
        {
          success: true,
          message:
            "If your email is registered, you will receive a password reset link.",
        },
        200
      )
    } catch (error) {
      console.error("Password reset request error:", error)
      throw new ApiError(
        "Password reset request failed",
        400,
        ErrorCode.BAD_REQUEST
      )
    }
  }
)

// Reset password
auth.post(
  "/reset-password",
  zValidator("json", resetPasswordSchema),
  async (c) => {
    try {
      const { token, password } = await c.req.valid("json")

      // Find verification token
      const verificationRecord = await prisma.verificationToken.findUnique({
        where: { token },
      })

      if (!verificationRecord) {
        throw new ApiError(
          "Invalid or expired token",
          400,
          ErrorCode.BAD_REQUEST
        )
      }

      // Check if token is expired
      if (new Date() > verificationRecord.expires) {
        // Delete expired token
        await prisma.verificationToken.delete({
          where: { token },
        })
        throw new ApiError("Token expired", 400, ErrorCode.BAD_REQUEST)
      }

      // Hash new password
      const hashedPassword = await hashPassword(password)

      // Update user's password
      await prisma.user.update({
        where: { email: verificationRecord.identifier },
        data: { password: hashedPassword },
      })

      // Delete used token
      await prisma.verificationToken.delete({
        where: { token },
      })

      return c.json(
        {
          success: true,
          message:
            "Password reset successful. You can now log in with your new password.",
        },
        200
      )
    } catch (error) {
      console.error("Password reset error:", error)
      if (error instanceof ApiError) {
        throw error
      }
      throw new ApiError("Password reset failed", 400, ErrorCode.BAD_REQUEST)
    }
  }
)

// Logout route
auth.post("/logout", async (c) => {
  try {
    // Clear authentication cookies with the same domain as set in login
    const domain =
      process.env.NODE_ENV === "production" ? "vercel.app" : "localhost"

    c.header(
      "Set-Cookie",
      `auth_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Domain=${domain}`
    )
    c.header(
      "Set-Cookie",
      `refresh_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Domain=${domain}`
    )

    return c.json({
      success: true,
      message: "Logged out successfully",
    })
  } catch (error) {
    console.error("Logout error:", error)
    throw new HTTPException(500, { message: "Logout failed" })
  }
})

// Get current user (me) endpoint
auth.get("/me", async (c) => {
  try {
    const authHeader = c.req.header("Authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(
        "Authorization header is required",
        401,
        ErrorCode.AUTHENTICATION_ERROR
      )
    }

    const token = authHeader.replace("Bearer ", "")

    // Verify token
    const decoded = await verifyToken(token)

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        image: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!user) {
      throw new ApiError("User not found", 404, ErrorCode.RESOURCE_NOT_FOUND)
    }

    return c.json(user)
  } catch (error) {
    console.error("Get current user error:", error)
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      "Authentication failed",
      401,
      ErrorCode.AUTHENTICATION_ERROR
    )
  }
})

// Export the router
export { auth }
export default auth
