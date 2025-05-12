use("database");
db.createCollection("chats", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["id", "participants", "messages"],
      properties: {
        id: { bsonType: "string" },
        participants: {
          bsonType: "array",
          items: { bsonType: "string" }, // References users.id
        },
        messages: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["id", "sender", "content", "timestamp"],
            properties: {
              id: { bsonType: "string" },
              sender: { bsonType: "string" }, // References users.id
              content: { bsonType: "string" },
              timestamp: { bsonType: "date" },
              metadata: { bsonType: "object" },
            },
          },
        },
        metadata: { bsonType: "object" },
      },
    },
  },
});

db.createCollection("products", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "id",
        "name",
        "owner",
        "startingPrice",
        "currentPrice",
        "artUrl",
      ],
      properties: {
        id: { bsonType: "string" },
        name: { bsonType: "string" },
        owner: { bsonType: "string" }, // References users.id
        startingPrice: { bsonType: "double" },
        currentPrice: { bsonType: "double" },
        bidHistory: {
          bsonType: "array",
          items: { bsonType: "double" },
        },
        reviews: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["user", "rating", "comment"],
            properties: {
              user: { bsonType: "string" }, // References users.id
              rating: { bsonType: "int" },
              comment: { bsonType: "string" },
            },
          },
        },
        artUrl: { bsonType: "string" },
        metadata: { bsonType: "object" },
      },
    },
  },
});

db.createCollection("carts", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["id", "user", "products"],
      properties: {
        id: { bsonType: "string" },
        user: { bsonType: "string" }, // References users.id
        products: {
          bsonType: "array",
          items: { bsonType: "string" }, // References products.id
        },
        metadata: { bsonType: "object" },
      },
    },
  },
});

db.createCollection("favorites", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["id", "user", "favoriteProducts"],
      properties: {
        id: { bsonType: "string" },
        user: { bsonType: "string" }, // References users.id
        favoriteProducts: {
          bsonType: "array",
          items: { bsonType: "string" }, // References products.id
        },
        metadata: { bsonType: "object" },
      },
    },
  },
});

db.createCollection("transaction_histories", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["id", "user", "transactions"],
      properties: {
        id: { bsonType: "string" },
        user: { bsonType: "string" }, // References users.id
        transactions: {
          bsonType: "array",
          items: { bsonType: "string" }, // References transactions.id
        },
        metadata: { bsonType: "object" },
      },
    },
  },
});
