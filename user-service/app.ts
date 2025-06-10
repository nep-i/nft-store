import express from "express";
import { MongoClient } from "mongodb";
import Redis from "ioredis";
import { ApolloServer } from "apollo-server-express";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/use/ws";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { RedisPubSub } from "graphql-redis-subscriptions";

const typeDefs = `
  extend schema
    @link(url: "https://specs.apollo.dev/link/v1.0")
    @link(url: "https://specs.apollo.dev/federation/v2.0", import: ["@key", "@shareable"])

  type Message @key(fields: "id") {
    id: ID!
    roomId: String!
    content: String!
    userId: String!
    createdAt: String!
  }

  type Query {
    messages(roomId: String!): [Message!]!
  }

  type Mutation {
    createChat(participants: [String!]!): Chat!
    sendMessage(roomId: String!, content: String!, userId: String!, type: String!): Message!
  }

  type Subscription {
    messageAdded(roomId: String!): Message!
  }
`;

const resolvers = {
  Query: {
    messages: async (_, { roomId }, { db }) => {
      return await db
        .collection("messages")
        .find({ roomId, type: "permanent" })
        .toArray();
    },
  },
  Mutation: {
    createChat: async (_, { participants }, { db }) => {
      const chat = {
        id: Math.random().toString(36).slice(2), // Generate unique ID
        participants,
        messages: [],
        createdAt: new Date().toISOString(),
      };
      await db.collection("chats").insertOne(chat);
      return chat;
    },
    sendMessage: async (
      _,
      { roomId, content, userId, type },
      { db, pubsub, redis }
    ) => {
      // Verify chat exists
      const chat = await db.collection("chats").findOne({ id: roomId });
      if (!chat) throw new Error(`Chat with id ${roomId} not found`);

      const message = {
        id: Math.random().toString(36).slice(2),
        roomId,
        content,
        userId,
        type,
        createdAt: new Date().toISOString(),
      };

      if (type === "permanent") {
        await db.collection("messages").insertOne(message);
        // Update chat's messages array
        await db
          .collection("chats")
          .updateOne({ id: roomId }, { $push: { messages: message } });
      } else if (type === "temporary") {
        await redis.setex(
          `message:${message.id}`,
          24 * 60 * 60,
          JSON.stringify(message)
        );
      }

      await pubsub.publish(`MESSAGE_ADDED_${roomId}`, {
        messageAdded: message,
      });

      return message;
    },
  },
  Subscription: {
    messageAdded: {
      subscribe: (_, { roomId }, { pubsub }) =>
        pubsub.asyncIterator(`MESSAGE_ADDED_${roomId}`),
    },
  },
};

// Redis and MongoDB setup
const redisOptions = {
  host: process.env.REDIS_URL || "redis://redis:6379",
  retryStrategy: (times) => Math.min(times * 50, 2000),
};

const pubsub = new RedisPubSub({
  publisher: new Redis(redisOptions),
  subscriber: new Redis(redisOptions),
});

const mongoUrl =
  process.env.MONGO_URL || "mongo://user:password@mongodb:27017/database";
let db;

async function startServer() {
  const app = express();
  const httpServer = require("http").createServer(app);

  // Connect to MongoDB
  const client = new MongoClient(mongoUrl);
  await client.connect();
  db = client.db();

  // Redis client for temporary messages
  const redis = new Redis(redisOptions);

  const schema = makeExecutableSchema({ typeDefs, resolvers });

  const server = new ApolloServer({
    schema,

    context: () => ({ db, pubsub, redis }),
    plugins: [
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await this.server.dispose();
            },
          };
        },
      },
    ],
  });

  await server.start();
  server.applyMiddleware({ app });

  // WebSocket for subscriptions
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });

  useServer({ schema }, wsServer);

  const PORT = 3002;
  httpServer.listen(PORT, () => {
    console.log(`Chat service ready at http://localhost:${PORT}/graphql`);
    console.log(`Subscriptions ready at ws://localhost:${PORT}/graphql`);
  });
}

startServer().catch(console.error);
