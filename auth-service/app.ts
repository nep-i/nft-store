import express, { NextFunction, Request, Response } from "express";
import { Express, response } from "express";
import axios, { AxiosHeaders } from "axios";
import logger from "loglevel";
import https from "https";
logger.setLevel("DEBUG");
const app: Express = express();
app.use(express.json()).use((req, res, next) => {
  // res.set({
  //   "Access-Control-Allow-Origin": "*",
  //   "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTION",
  //   "Access-Control-Allow-Headers": "*",
  // });

  next();
});
const verify = async (req: Request, res: Response): Promise<any> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "No token provided" });
    }

    let token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;

    const keycloakUrl = process.env.KEYCLOAK_URL || "http://localhost:8080";
    const url = `${keycloakUrl}/realms/products/protocol/openid-connect/userinfo`;
    logger.debug("URL ----------------------> ", url);

    var config = {
      method: "get",
      url: url,
      headers: {
        "Cache-Control": "no-cache",
        Accept: "*/*",
        "Accept-Encoding": "gzip,deflate",
        Connection: "keep-alive",
        Authorization: `Bearer ${token}`,
      },
    };

    const response: any = await axios(config).then((f) => {
      logger.debug(
        "FROM RESPONSE ----------------------------------------->  ",
        f.data
      );
      return f;
    });

    // logger.debug("Response data -----------> ", response.data);

    return res.json({
      message: "Token verified",
      jwks: response.data,
    });
  } catch (error: any) {
    logger.error("Error verifying token: --------------------->", error);
    return res.status(500).json({
      error: `Failed to retrieve user info: ${error.message}`,
    });
  }
};

app.get("/", verify);

app.listen(3004, () => {
  logger.info("Auth_service started");
});
