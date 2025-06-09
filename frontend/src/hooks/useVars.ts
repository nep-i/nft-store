import {
  REACT_APP_KEYCLOAK_CLIENT_ID,
  REACT_APP_KEYCLOAK_REALM,
  REACT_APP_KEYCLOAK_REDIRECT_URL,
  REACT_APP_KEYCLOAK_URL,
  REACT_APP_MONGO_DB_NAME,
  REACT_APP_MONGO_URL,
  REACT_APP_MONGO_USER,
  REACT_APP_POSTGRE_DB_NAME,
  REACT_APP_POSTGRE_URL,
  REACT_APP_POSTGRE_USER,
} from "../constants/vars";
export type keycloakEnvVars = {
  url: string;
  redirectUrl: string;
  realm: string;
  clientId: string;
};

export type DBVars<T extends Record<string, string> = {}> = {
  url: string;
  dbName: string;
  user: string;
} & T;

//   export const REACT_APP_KEYCLOAK_URL: string = "http://localhost:8080";
//   export const REACT_APP_KEYCLOAK_REDIRECT_URL: string = "http://localhost:3000/";
//   export const REACT_APP_KEYCLOAK_REALM: string = "products";
//   export const REACT_APP_KEYCLOAK_CLIENT_ID: string = "account";

//   //MongoDB Environment Variables
//   export const REACT_APP_MONGO_URL: string = "";
//   export const REACT_APP_MONGO_DB_NAME: string = "";
//   export const REACT_APP_MONGO_USER: string = "";
//   //PostgreSQL Environment Variables
//   export const REACT_APP_POSTGRE_URL: string = "";
//   export const REACT_APP_POSTGRE_DB_NAME: string = "";
//   export const REACT_APP_POSTGRE_USER: string = "";

const useVars = () => {
  let keycloakVars: keycloakEnvVars;
  let postgreVars: DBVars;
  let mongoVars: DBVars;

  const setEnvironmentVars = () => {
    if (process.env.toString().includes("REACT_APP_KEYCLOAK"))
      keycloakVars = {
        //@ts-ignore
        url: process.env.REACT_APP_KEYCLOAK_URL,
        //@ts-ignore
        redirectUrl: process.env.REACT_APP_KEYCLOAK_REDIRECT_URL,
        //@ts-ignore
        realm: process.env.REACT_APP_KEYCLOAK_REALM,
        //@ts-ignore
        clientId: process.env.REACT_APP_KEYCLOAK_CLIENT_ID,
      };
    else {
      keycloakVars = {
        url: REACT_APP_KEYCLOAK_URL,
        redirectUrl: REACT_APP_KEYCLOAK_REDIRECT_URL,
        realm: REACT_APP_KEYCLOAK_REALM,
        clientId: REACT_APP_KEYCLOAK_CLIENT_ID,
      };
    }

    if (process.env.toString().includes("REACT_APP_POSTGRE"))
      postgreVars = {
        //@ts-ignore
        url: process.env.REACT_APP_POSTGRE_URL,
        //@ts-ignore
        dbName: process.env.REACT_APP_POSTGRE_DB_NAME,
        //@ts-ignore
        user: process.env.REACT_APP_POSTGRE_USER,
      };
    else {
      postgreVars = {
        url: REACT_APP_POSTGRE_URL,
        dbName: REACT_APP_POSTGRE_DB_NAME,
        user: REACT_APP_POSTGRE_USER,
      };
    }

    if (process.env.toString().includes("REACT_APP_MONGO"))
      mongoVars = {
        //@ts-ignore
        url: process.env.REACT_APP_MONGO_URL,
        //@ts-ignore
        dbName: process.env.REACT_APP_MONGO_DB_NAME,
        //@ts-ignore
        user: process.env.REACT_APP_MONGO_USER,
      };
    else {
      mongoVars = {
        url: REACT_APP_MONGO_URL,
        dbName: REACT_APP_MONGO_DB_NAME,
        user: REACT_APP_MONGO_USER,
      };
    }
  };

  const getEnvironmentVars = () => {
    setEnvironmentVars();
    return { keycloakVars, postgreVars, mongoVars };
  };

  return { getEnvironmentVars };
};

export default useVars;
