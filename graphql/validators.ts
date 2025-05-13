const { pubsub } = require("./chat-service");
const fetch = require("node-fetch");
import _ from "lodash";

export default {
  Query: {
    nft: async (_, { id }) => {
      const response = await fetch(`http://nft-service:8001/nft/${id}`);
      return await response.json();
    },
    thread: async (_, { id }) => {
      const response = await fetch(`http://forum-service:8002/thread/${id}`);
      return await response.json();
    },
    messages: async (_, { roomId }) => {
      const response = await fetch(
        `http://chat-service:3002/messages/${roomId}`
      );
      return await response.json();
    },
  },
  Mutation: {
    createNFT: async (_, { name, ownerId, fileContent }) => {
      const response = await fetch("http://nft-service:8001/nft/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          owner_id: ownerId,
          file_content: fileContent,
        }),
      });
      return await response.json();
    },
    createThread: async (_, { title, createdBy }) => {
      const response = await fetch("http://forum-service:8002/thread/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, created_by: createdBy }),
      });
      return await response.json();
    },
    createPost: async (_, { threadId, content, createdBy }) => {
      const response = await fetch("http://forum-service:8002/post/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          thread: threadId,
          content,
          created_by: createdBy,
        }),
      });
      return await response.json();
    },
    sendMessage: async (_, { roomId, content, userId }) => {
      const response = await fetch("http://chat-service:3002/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId, content, userId }),
      });
      return await response.json();
    },
  },
  Subscription: {
    messageAdded: {
      subscribe: (_, { roomId }) =>
        pubsub.asyncIterator(`MESSAGE_ADDED_${roomId}`),
    },
  },
};

// // Inside chat-service/message POST handler
// const newMessage = await saveMessageToDb(roomId, content, userId);
// pubsub.publish(`MESSAGE_ADDED_${roomId}`, {
//   messageAdded: newMessage,
// });

//   const message = await response.json();

//   // Publish the event to subscribers
//   pubsub.publish(`MESSAGE_ADDED_${roomId}`, {
//     messageAdded: message, // must match subscription field name
//   });

// Subscription: {
//     somethingChanged: {
//       subscribe: (_, args) => pubsub.asyncIterator(`${SOMETHING_CHANGED_TOPIC}.${args.relevantId}.*`, { pattern: true })
//     },
//   },
