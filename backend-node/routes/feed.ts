import express from "express";
import { getPosts } from "../controllers/feed";

const router: express.Router = express();

router.get("/post", getPosts);
