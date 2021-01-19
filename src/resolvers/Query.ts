// import types
import { Context } from "../context"

export default {
  feed: async (parent: null, args: null, context: Context) =>
    await context.prisma.link.findMany(),
}
