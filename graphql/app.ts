import express from "express";
import axios from "axios";
import { Express } from "express";
import logger from "loglevel";

const app: Express = express();

app.listen(4000, () => {
  logger.error("Hooray! graphql works");
});
