// import types
import { Context, Link } from "../context"

export default {
  postedBy: (parent: Link, args: null, context: Context) =>
    context.prisma.link
      .findUnique({
        where: { id: parent.id },
      })
      .postedBy(),
}
