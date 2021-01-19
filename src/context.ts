// import from node modules
import http from "http"
import { PrismaClient } from "@prisma/client"
import { ReturnType, getUserId, ThenArg } from "./utils"

export type Context = ReturnType<typeof context>

// init prisma client instance
const prisma = new PrismaClient()

const user = prisma.user.findUnique({ where: { id: 1 } })
export type User = NonNullable<ThenArg<typeof user>>

const link = prisma.link.findUnique({ where: { id: 1 } })
export type Link = NonNullable<ThenArg<typeof link>>

// declare context
const context = ({ req }: { req: http.IncomingMessage }) => ({
  ...req,
  prisma,
  userId: req && req.headers.authorization ? getUserId(req) : undefined,
})

export default context
