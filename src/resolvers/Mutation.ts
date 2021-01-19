// import types
import { Context } from "../context"
import { hash, compare, tokenize } from "../utils"

// local types and interfaces
interface LinkPostArgs {
  url: string
  description: string
}

interface LinkDeleteArgs {
  id: number
}

type LinkPutArgs = LinkPostArgs & LinkDeleteArgs

interface UserLoginArgs {
  email: string
  password: string
}

interface UserSignupArgs extends UserLoginArgs {
  name: string
}

export default {
  // create new Link entry
  post: async (parent: null, args: LinkPostArgs, context: Context) => {
    // get user id from context (extracted from auth headers)
    const id = context.userId
    console.log(context.userId)
    // check user authenticated --> user id not null / undefined
    if (id) {
      const newLink = await context.prisma.link.create({
        data: { ...args, postedBy: { connect: { id: id } } },
      })
      return newLink
    } else {
      throw new Error("Please login to be able to post")
    }
  },

  // update existing Link entry
  put: async (parent: null, args: LinkPutArgs, context: Context) => {
    const { url, description } = args

    return await context.prisma.link.update({
      where: { id: args.id },
      data: { url, description },
    })
  },

  // delete Link entry
  delete: async (parent: null, args: LinkDeleteArgs, context: Context) =>
    await context.prisma.link.delete({ where: { id: args.id } }),

  // user signup, creates new User entry
  signup: async (parent: null, args: UserSignupArgs, context: Context) => {
    // extract name and email from args
    const { name, email } = args

    // extract and hash password
    const password = hash(args.password)

    // add user to db
    try {
      const user = await context.prisma.user.create({
        data: {
          name,
          email,
          password,
        },
      })

      // create token
      const token = tokenize(user.id)

      // return user and token
      return {
        user,
        token,
      }
    } catch (err) {
      // if err adding user to db, log to console and throw again
      console.log(err)
      throw err
    }
  },

  // user login verify user, pass and return token
  login: async (parent: null, args: UserLoginArgs, context: Context) => {
    // extract user name and password from args
    const { email, password } = args

    // read user from db
    const user = await context.prisma.user.findUnique({ where: { email } })

    // check user exists
    if (!user) {
      throw new Error("User with not found")
    }

    // check password
    if (!compare(password, user.password)) {
      throw new Error("Wrong password")
    }

    // create token
    const token = tokenize(user.id)

    return {
      user,
      token,
    }
  },
}
