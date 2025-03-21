import axios from "axios";
import * as jose from "jose";
import { normalizeRole, UserRole, isValidRole } from "./auth/constants"

// Types
export interface User {
  id: string
  email: string
  name: string | null
  role: UserRole
  image?: string | null
}

export interface Session {
  user: User | null
  expires: string
  accessToken: string
  refreshToken: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresAt: number
}

// Constants
const isProduction = process.env.NODE_ENV === "production"
const API_URL = isProduction
  ? process.env.NEXT_PUBLIC_API_URL || "/api"
  : process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
const AUTH_COOKIE_NAME = "auth_token"
const REFRESH_COOKIE_NAME = "refresh_token"

// Helper functions to get cookies on the client side
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null

  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null
  return null
}

// Helper function to validate JWT token structure
export async function validateJwtToken(token: string): Promise<{
  isValid: boolean
  userId?: string
  email?: string
  role?: UserRole
  error?: string
}> {
  try {
    // Basic validation
    if (!token || token.trim() === "") {
      return { isValid: false, error: "Empty token provided" }
    }

    // Check token format
    if (!token.includes(".")) {
      return { isValid: false, error: "Invalid token format (not a JWT)" }
    }

    // Decode the token without verification for now
    try {
      const decoded = jose.decodeJwt(token)

      // Log token contents for debugging
      console.log("Validating token:", {
        sub: decoded.sub,
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
        exp: decoded.exp
          ? new Date(decoded.exp * 1000).toLocaleString()
          : "none",
      })

      // Check for expiration
      const currentTime = Math.floor(Date.now() / 1000)
      if (decoded.exp && decoded.exp < currentTime) {
        return { isValid: false, error: "Token expired" }
      }

      // Extract user information - be more lenient with required fields
      const userId = decoded.sub || (decoded.userId as string)
      if (!userId) {
        return { isValid: false, error: "Token missing user ID" }
      }

      const email = (decoded.email as string) || "unknown"
      const roleValue = decoded.role as string

      // Validate role if present
      let role: UserRole | undefined
      if (roleValue) {
        // Handle various formats of ADMIN role
        if (
          roleValue.toUpperCase() === UserRole.ADMIN ||
          roleValue === "0" || // Some systems use numeric role codes
          roleValue === "admin" ||
          roleValue === "Admin"
        ) {
          role = UserRole.ADMIN
          console.log("ADMIN role assigned from token value:", roleValue)
        }
        // Handle NODE_OFFICER role
        else if (
          roleValue.toUpperCase() === UserRole.NODE_OFFICER ||
          roleValue === "1" || // Some systems use numeric role codes
          roleValue === "node_officer" ||
          roleValue === "NodeOfficer"
        ) {
          role = UserRole.NODE_OFFICER
          console.log("NODE_OFFICER role assigned from token value:", roleValue)
        }
        // Handle USER role
        else if (
          roleValue.toUpperCase() === UserRole.USER ||
          roleValue === "2" || // Some systems use numeric role codes
          roleValue === "user" ||
          roleValue === "User"
        ) {
          role = UserRole.USER
          console.log("USER role assigned from token value:", roleValue)
        }
        // Handle other cases
        else {
          console.log(
            `Unrecognized role in token: ${roleValue}, defaulting to USER`
          )
          role = UserRole.USER
        }
      } else {
        console.log("No role found in token, defaulting to USER")
        role = UserRole.USER
      }

      return {
        isValid: true,
        userId,
        email,
        role,
      }
    } catch (jwtError: any) {
      console.error("JWT decode error:", jwtError)
      return {
        isValid: false,
        error: "Invalid JWT format: " + jwtError.message,
      }
    }
  } catch (error) {
    console.error("Token validation error:", error)
    return { isValid: false, error: String(error) }
  }
}

// Helper function to normalize user data from API
function normalizeUserData(userData: any): User {
  // Ensure role is uppercase for consistency
  const rawRole = userData.role || UserRole.USER
  const normalizedRole = normalizeRole(rawRole) || UserRole.USER

  console.log("[normalizeUserData] Role normalization:", {
    rawRole,
    normalizedRole,
    isAdmin: normalizedRole === UserRole.ADMIN,
  })

  return {
    id: userData.id,
    email: userData.email,
    name: userData.name || null,
    // Use the normalized role
    role: normalizedRole,
    image: userData.image || null,
  }
}

async function isTokenExpired(token: string): Promise<boolean> {
  try {
    const decoded = jose.decodeJwt(token)
    const currentTime = Date.now() / 1000
    return (decoded.exp as number) < currentTime
  } catch (error) {
    return true
  }
}

// Auth client
export const authClient = {
  async login(
    email: string,
    password: string,
    rememberMe: boolean = false
  ): Promise<Session> {
    console.log(`Attempting login for ${email} with rememberMe=${rememberMe}`)

    try {
      // Call the login API through our Next.js proxy
      console.log(`Making API request to /api/auth/login`)
      const response = await axios.post(`/api/auth/login`, {
        email,
        password,
      })

      console.log("Login API response received:", {
        status: response.status,
        hasAccessToken: !!response.data.accessToken,
        hasRefreshToken: !!response.data.refreshToken,
        hasUser: !!response.data.user,
      })

      // Extract tokens from response
      const { accessToken, refreshToken } = response.data

      // Get user data
      const userData = response.data.user || {}
      const user = normalizeUserData(userData)

      // Create and return session
      const session = {
        user,
        expires:
          response.data.expires ||
          new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        accessToken,
        refreshToken,
      }

      // For debugging purposes, log the token info
      console.log("Login successful, token info:", {
        tokenLength: accessToken.length,
        userRole: user.role,
      })

      return session
    } catch (error: any) {
      console.error("Login failed:", error.message || error)

      if (error.response) {
        console.error("Error response:", {
          status: error.response.status,
          data: error.response.data,
        })
      }

      throw error
    }
  },

  async register(
    email: string,
    password: string,
    name?: string
  ): Promise<Session> {
    console.log(
      `Attempting to register user with email: ${email}, name: ${name || "not provided"}`
    )

    try {
      console.log(`Making API request to ${API_URL}/api/auth/register`)
      const response = await axios.post(`${API_URL}/api/auth/register`, {
        email,
        password,
        name,
      })

      console.log("Registration API response received:", {
        status: response.status,
        hasAccessToken: !!response.data.accessToken,
        hasRefreshToken: !!response.data.refreshToken,
        hasUser: !!response.data.user,
      })

      const { accessToken, refreshToken, user } = response.data

      // Create and return session
      const session = {
        user,
        expires:
          response.data.expires ||
          new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        accessToken,
        refreshToken,
      }

      console.log("Registration successful, session created:", {
        userEmail: user.email,
        userRole: user.role,
      })

      return session
    } catch (error: any) {
      console.error("Registration failed:", error)

      if (error.response) {
        console.error("Error response:", {
          status: error.response.status,
          data: error.response.data,
        })
      }

      // Extract the error message from the response if available
      const errorMessage =
        error.response?.data?.message ||
        "Registration failed. Please try again."

      // Create a more informative error
      const enhancedError = new Error(errorMessage)
      enhancedError.name = "RegistrationError"

      throw enhancedError
    }
  },

  async logout(): Promise<void> {
    try {
      // Use our Next.js proxy endpoint instead of the direct API
      await axios.post(`/api/auth/logout`, {})
    } catch (error) {
      console.error("Logout failed:", error)
    }
  },

  async refreshToken(): Promise<string | null> {
    console.log("refreshToken called")
    const refreshToken = getCookie(REFRESH_COOKIE_NAME)
    
    if (!refreshToken) {
      console.log("No refresh token found in cookies")
      return null
    }

    try {
      console.log("Calling refresh token proxy endpoint")
      const response = await axios.post(
        `/api/auth/refresh`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      console.log("Refresh token response:", {
        status: response.status,
        hasAccessToken: !!response.data.data?.accessToken,
      })

      const accessToken = response.data.data?.accessToken

      if (!accessToken) {
        console.error("No access token returned from refresh endpoint")
        return null
      }
      
      return accessToken
    } catch (error) {
      console.error("Token refresh failed:", error)
      return null
    }
  },

  /**
   * Check if the user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const token = getCookie(AUTH_COOKIE_NAME)
    if (!token) return false

    try {
      const validationResult = await validateJwtToken(token)
      return validationResult.isValid
    } catch (error) {
      console.error("Error checking authentication:", error)
      return false
    }
  },

  /**
   * Get the current session
   */
  async getSession(): Promise<Session | null> {
    console.log("getSession called")

    try {
      // First try to get session from the server-side auth check endpoint
      console.log(
        "Attempting to fetch session from server-side auth check endpoint"
      )
      const response = await fetch("/api/auth/check", {
        method: "GET",
        credentials: "include", // Important: include cookies in the request
        cache: "no-store", // Prevent caching of auth status
      })

      if (response.ok) {
        const data = await response.json()
        console.log("Auth check response:", data)

        if (data.authenticated && data.user) {
          console.log("Server confirmed authentication, creating session")
          return {
            user: {
              id: data.user.id,
              email: data.user.email,
              name: data.user.name || "",
              role: data.user.role,
            },
            expires: new Date(Date.now() + 3600 * 1000).toISOString(), // 1 hour from now
            accessToken: getCookie(AUTH_COOKIE_NAME) || "",
            refreshToken: getCookie(REFRESH_COOKIE_NAME) || "",
          }
        } else {
          console.log("Server reports not authenticated:", data.message)
        }
      } else {
        console.error(
          "Auth check endpoint returned error:",
          response.status,
          response.statusText
        )
      }

      // Fallback to client-side cookie check
      console.log("Falling back to client-side cookie check")
      const token = getCookie(AUTH_COOKIE_NAME)

      console.log("Token status:", {
        hasToken: !!token,
        tokenLength: token?.length,
      })

      if (!token) {
        console.log("No token found, returning null session")
        return null
      }

      console.log("Validating token...")
      const validationResult = await validateJwtToken(token)
      console.log("Token validation result:", validationResult)

      if (!validationResult.isValid) {
        console.log("Token is invalid, returning null session")
        return null
      }

      const session = {
        user: {
          id: validationResult.userId || "",
          email: validationResult.email || "",
          name: "",
          role: validationResult.role || UserRole.USER,
        },
        expires: new Date(Date.now() + 3600 * 1000).toISOString(), // 1 hour from now
        accessToken: token,
        refreshToken: getCookie(REFRESH_COOKIE_NAME) || "",
      }

      console.log("Created session with user role:", session.user.role)
      return session
    } catch (error) {
      console.error("Error getting session:", error)
      return null
    }
  },

  getAccessToken(): string | null {
    return getCookie(AUTH_COOKIE_NAME)
  },

  /**
   * Exchange an authorization code for a session
   */
  async exchangeCodeForSession(code: string): Promise<Session> {
    try {
      // Make API request to exchange code for tokens
      const response = await axios.post(`${API_URL}/auth/callback`, { code })

      const { accessToken, refreshToken, user } = response.data

      // Return session
      return {
        user,
        expires:
          response.data.expires ||
          new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        accessToken,
        refreshToken,
      }
    } catch (error) {
      console.error("Failed to exchange code for session:", error)
      throw error
    }
  },
}

// Create an axios instance with auth headers
export const authAxios = axios.create({
  baseURL: API_URL,
});

// Add interceptor to handle token refresh
authAxios.interceptors.request.use(async (config) => {
  let token = getCookie(AUTH_COOKIE_NAME)
  
  if (token && (await isTokenExpired(token))) {
    token = await authClient.refreshToken()
  }
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  
  return config;
}); 