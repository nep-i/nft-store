import { KeycloakInstance } from "keycloak-js";
import { setToLocalStorage } from "../../Utils/storage";
import { ActionDispatch } from "react";
import { UserInterface } from "../../Models/user.model";

import {
  LOCAL_STORAGE_KEYCLOAK_TOKEN_PARSED,
  LOCAL_STORAGE_USER,
  LOCAL_STORAGE_KEYCLOAK,
  LOCAL_STORAGE_KEYCLOAK_LOGGED_IN,
  LOCAL_STORAGE_KEYCLOAK_REFRESH,
  LOCAL_STORAGE_KEYCLOAK_TOKEN,
} from "../../Constants/vars";
export type keycloakAction = {
  type: string;
  payload: any;
};

export type keycloakState = {
  authenticated: boolean;
  loading: boolean;
  error: string | null | {};
  keycloak: KeycloakInstance | null;
  token: string | null;
  refToken: string | null;
  parsedToken: {} | null;
};

export const ACTIONS = {
  SET_INSTANCE: "SET_INSTANCE",
  SET_AUTHENTICATED: "SET_AUTHENTICATED",
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  SET_KEYCLOAK: "SET_KEYCLOAK",
  SET_TOKEN: "SET_TOKEN",
  SET_REF_TOKEN: "SET_REF_TOKEN",
  SET_PARSED_TOKEN: "SET_PARSED_TOKEN",
  SET_USER: "SET_USER",
};

export const keycloakReducer = (
  state: keycloakState,
  action: keycloakAction
) => {
  switch (action.type) {
    case ACTIONS.SET_AUTHENTICATED:
      return { ...state, authenticated: action.payload };
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload };
    case ACTIONS.SET_KEYCLOAK:
      return { ...state, keycloak: action.payload };
    case ACTIONS.SET_TOKEN:
      setToLocalStorage(LOCAL_STORAGE_KEYCLOAK_TOKEN, action.payload);
      return { ...state, token: action.payload };
    case ACTIONS.SET_REF_TOKEN:
      return { ...state, refToken: action.payload };
    case ACTIONS.SET_PARSED_TOKEN:
      return { ...state, parsedToken: action.payload };
    // case ACTIONS.SET_USER:
    //   return { ...state, user: action.payload };
    default:
      return state;
  }
};

export const updateUser = async (
  dispatch: ActionDispatch<[action: keycloakAction]>,
  parsedToken: {} | undefined
) => {
  if (parsedToken) {
    const name = parsedToken ? ["given_name"]?.toString() : "";
    const username = parsedToken ? ["preferred_username"]?.toString() : "";
    const email = parsedToken ? ["email"]?.toString() : "";
    let user = { username, email, name } as UserInterface;
    await dispatch({
      type: ACTIONS.SET_USER,
      payload: user,
    });
  }
};

export const updateKeycloak = async (
  dispatch: ActionDispatch<[action: keycloakAction]>,
  keycloak: KeycloakInstance
) => {
  await dispatch({
    type: ACTIONS.SET_KEYCLOAK,
    payload: keycloak,
  });

  await dispatch({
    type: ACTIONS.SET_AUTHENTICATED,
    payload: keycloak.authenticated,
  });

  await updateUser(dispatch, keycloak.idTokenParsed);
};
