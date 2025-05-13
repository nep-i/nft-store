import { MongodbPubSub } from "graphql-mongoose-subscriptions";

const pubsub = MongodbPubSub({
  mongooseOptions: {
    url: "mongodb://user:password@localhost:27017/database?authSource=admin",
    options: { useNewUrlParser: true, useUnifiedTopology: true },
  },
});

export default pubsub;
