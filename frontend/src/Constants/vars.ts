export const LOCAL_STORAGE_KEYCLOAK_REFRESH = "refresh_token";
export const LOCAL_STORAGE_KEYCLOAK_TOKEN = "token";
export const LOCAL_STORAGE_KEYCLOAK_TOKEN_PARSED = "parsed_token";
export const LOCAL_STORAGE_KEYCLOAK_LOGGED_IN = "logged_in";
export const LOCAL_STORAGE_USER = "user";
export const LOCAL_STORAGE_KEYCLOAK = "keycloak_instance";
export const KC_AUTH_SESSION_HASH = "KC_AUTH_SESSION_HASH";

//--------------------------------------------------------------------------

//Keycloak vars

// Keycloak Environment Variables
export const REACT_APP_KEYCLOAK_URL: string = "http://localhost:8080";
export const REACT_APP_KEYCLOAK_REDIRECT_URL: string = "http://localhost:3000/";
export const REACT_APP_KEYCLOAK_REALM: string = "products";
export const REACT_APP_KEYCLOAK_CLIENT_ID: string = "account";

//MongoDB Environment Variables
export const REACT_APP_MONGO_URL: string = "";
export const REACT_APP_MONGO_DB_NAME: string = "";
export const REACT_APP_MONGO_USER: string = "";
//PostgreSQL Environment Variables
export const REACT_APP_POSTGRE_URL: string = "";
export const REACT_APP_POSTGRE_DB_NAME: string = "";
export const REACT_APP_POSTGRE_USER: string = "";

export const KEYCLOAK_INIT_CONFIG = {
  url: "http://localhost:3000/auth",
  realm: "products",
  clientId: "account",
  redirectUri: "http://localhost:3000/",
  adapter: "default",
  onLoad: "login-required",
};
