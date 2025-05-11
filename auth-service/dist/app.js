"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const loglevel_1 = __importDefault(require("loglevel"));
loglevel_1.default.setLevel("DEBUG");
const app = (0, express_1.default)();
app.use(express_1.default.json()).use((req, res, next) => {
    // res.set({
    //   "Access-Control-Allow-Origin": "*",
    //   "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTION",
    //   "Access-Control-Allow-Headers": "*",
    // });
    next();
});
const verify = async (req, res) => {
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
        loglevel_1.default.debug("URL ----------------------> ", url);
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
        const response = await (0, axios_1.default)(config).then((f) => {
            loglevel_1.default.debug("FROM RESPONSE ----------------------------------------->  ", f.data);
            return f;
        });
        // logger.debug("Response data -----------> ", response.data);
        return res.json({
            message: "Token verified",
            jwks: response.data,
        });
    }
    catch (error) {
        loglevel_1.default.error("Error verifying token: --------------------->", error);
        return res.status(500).json({
            error: `Failed to retrieve user info: ${error.message}`,
        });
    }
};
app.get("/", verify);
app.listen(3004, () => {
    loglevel_1.default.info("Auth_service started");
});
