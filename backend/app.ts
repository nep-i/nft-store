import express from "express";
import { Express } from "express";
import { getPosts, makePost } from "./controllers/feed";
// import bodyParser from "body-parser";

const app: Express = express();
app.use(express.json()).use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.get("/posts", getPosts);
app.post("/post", makePost);

app.listen(8080);

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });
