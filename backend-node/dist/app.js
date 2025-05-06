"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const feed_1 = require("./controllers/feed");
// import bodyParser from "body-parser";
const app = (0, express_1.default)();
app.use(express_1.default.json()).use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});
app.get("/posts", feed_1.getPosts);
app.post("/post", feed_1.makePost);
app.listen(8080);
// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });
