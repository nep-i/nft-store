import { ApolloServer } from "apollo-server-express";
import { ApolloGateway } from "@apollo/gateway";
import express from "express";
import http from "http";
// import { WebSocketServer } from "ws";
// import { useServer } from "graphql-ws/use/ws";
import fetch from "node-fetch";

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.name = "ForbiddenError";
  }
}

// Authentication function
async function handleAuth(headers) {
  const authHeader = headers.authorization || "";
  if (!authHeader.startsWith("Bearer ")) {
    throw new ForbiddenError("No token provided");
  }

  const token = authHeader.replace("Bearer ", "");
  try {
    const response = await fetch("http://auth-service:3004/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    const result = await response.json();

    if (!result.valid) {
      throw new ForbiddenError(result.error || "Invalid token");
    }

    return result.user;
  } catch (error) {
    throw new ForbiddenError(`Authentication failed: ${error.message}`);
  }
}

const app = express();
const httpServer = http.createServer(app);

const gateway = new ApolloGateway({
  serviceList: [
    { name: "nft", url: "http://nft-service:8001/graphql" },
    { name: "forum", url: "http://forum-service:8002/graphql" },
    { name: "chat", url: "http://chat-service:3002/graphql" },
  ],
});

const server = new ApolloServer({
  gateway,
  context: async ({ req }) => {
    if (req.headers) {
      try {
        const user = await handleAuth(req.headers);
        return { user };
      } catch (error) {
        throw new ForbiddenError(error.message);
      }
    }
    return {};
  },
});

await server.start();
server.applyMiddleware({ app });

// // WebSocket for subscriptions (optional, if centralizing)
// const wsServer = new WebSocketServer({
//   server: httpServer,
//   path: "/graphql",
// });

// // WebSocket authentication
// useServer(
//   {
//     schema: gateway.schema,
//     context: async (ctx) => {
//       // Handle WebSocket connection
//       const user = await handleAuth(ctx.connectionParams || {});
//       return { user };
//     },
//   },
//   wsServer
// );

const PORT = 4000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Gateway ready at http://localhost:${PORT}/graphql`);
});
