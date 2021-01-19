// import from node modules
import crypto from "crypto"
import jwt from "jsonwebtoken"
import http from "http"

// typescript magic

// pass in typeof <function> and return function return type
export type ReturnType<T extends (...args: any[]) => any> = T extends (
  ...args: any[]
) => infer R
  ? R
  : never

// get res type of Promise
export type ThenArg<T> = T extends PromiseLike<infer U> ? U : T

// app secret to be used as salt
const APP_SECRET = "secrett"

/**
 * helper function for password hashing
 * @param rawStr string to be hashed
 */
export const hash = (rawStr: string) =>
  rawStr
    ? crypto.createHmac("sha256", APP_SECRET).update(rawStr).digest("hex")
    : ""

/**
 * compare raw and hashed string
 * @param rawStr raw string to be hashed and compared to second param
 * @param hashedStr hashed string for comparison
 */
export const compare = (rawStr: string, hashedStr: string) =>
  hash(rawStr) === hashedStr

// helper function for token creation
export const tokenize = (userId: number) => jwt.sign({ userId }, APP_SECRET)

// helper function for token comparison
export const decodeToken = (token: string) => jwt.verify(token, APP_SECRET)

// get user id from req headers or string token
export const getUserId = (
  input?: http.IncomingMessage | string
): number | undefined => {
  // if input not defined throw error
  if (!input) {
    throw new Error("Invalid input")
  }

  // if input string treat as auth token
  if (typeof input == "string") {
    const { userId } = jwt.verify(input, APP_SECRET) as {
      userId?: number
    }
    return userId
  }

  // if not string treat input as http request object

  // extract headers
  const { headers } = input

  // extract token header
  const tokenHeader = headers.authorization

  // check token not undefined
  if (!tokenHeader) {
    throw new Error("Missing token from headers")
  }

  // extract jwt signed string
  const token = tokenHeader.replace("Bearer", "").trim()

  // decode token and extract userId
  const { userId } = jwt.verify(token, APP_SECRET) as {
    userId?: number
  }
  return userId
}
