// import types
import { Context, User } from "../context"

export default {
  links: (parent: User, args: null, context: Context) =>
    context.prisma.user.findUnique({ where: { id: parent.id } }).links(),
}
