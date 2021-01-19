// import from node modules
import { ApolloServer } from "apollo-server"
import fs from "fs"
import path from "path"
import context from "./context"

// import resolvers
import Query from "./resolvers/Query"
import Mutation from "./resolvers/Mutation"
import User from "./resolvers/User"
import Link from "./resolvers/Link"

// declare resolvers
const resolvers = {
  Query,
  Mutation,
  User,
  Link,
}

// load schema
const typeDefs = fs.readFileSync(
  path.join(process.cwd(), "./schema/schema.graphql"),
  "utf-8"
)

// init apollo server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
})

// start server
server.listen().then(({ url }) => {
  console.log(`server started at ${url}`)
})
