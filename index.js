const express = require("express");
const Post = require("./models/post");
const { expressMiddleware } = require("@apollo/server/express4");
const {
  ApolloServerPluginDrainHttpServer,
} = require("@apollo/server/plugin/drainHttpServer");
const bodyParser = require("body-parser");
const { createServer } = require("http");
const cors = require("cors");
const { ApolloServer } = require("@apollo/server");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const typeDefs = require("./typeDefs");
const resolvers = require("./resolvers");
const { WebSocketServer } = require("ws");
const { useServer } = require("graphql-ws/lib/use/ws");
const { PubSub } = require("graphql-subscriptions");
const dbConnect = require("./db");
(async function () {
  const app = express();
  const pubsub = new PubSub();
  const httpServer = createServer(app);
  const schema = makeExecutableSchema({ typeDefs, resolvers });
  const wsServer = new WebSocketServer({
    path: "/graphql",
    server: httpServer,
  });
  const cleanup = useServer(
    {
      schema,
      context: (ctx, msg, args) => {
        ctx["pubsub"] = pubsub;
        ctx["post"] = Post;
        return { ctx, msg, args };
      },
    },
    wsServer
  );
  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await cleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await server.start();
  app.use(
    "/graphql",
    cors(),
    bodyParser.json(),
    expressMiddleware(server, {
      context: () => {
        return {
          Post,
          pubsub,
        };
      },
    })
  );
  httpServer.listen(4000, function () {
    console.log("app running on  http://localhost:4000/graphql");
    dbConnect();
  });
})();
