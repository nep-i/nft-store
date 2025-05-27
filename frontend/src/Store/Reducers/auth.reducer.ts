import Keycloak, { KeycloakInstance } from "keycloak-js";
// import { setToLocalStorage } from "../../Utils/storage";
// import { ActionDispatch } from "react";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { KEYCLOAK_INIT_CONFIG } from "../../Constants/vars";

// import {
//   LOCAL_STORAGE_KEYCLOAK_TOKEN_PARSED,
//   LOCAL_STORAGE_USER,
//   LOCAL_STORAGE_KEYCLOAK,
//   LOCAL_STORAGE_KEYCLOAK_LOGGED_IN,
//   LOCAL_STORAGE_KEYCLOAK_REFRESH,
//   LOCAL_STORAGE_KEYCLOAK_TOKEN,
// } from "../../Constants/vars";
export type ReducerAction = {
  type: string;
  state: any;
};

export type AuthState = {
  authenticated: boolean;
  loading: boolean;
  error: string | null | {};
  keycloak: KeycloakInstance;
  token: string | null;
  refToken: string | null;
};

export const authInitState: AuthState = {
  authenticated: false,
  loading: false,
  error: null,
  //@ts-ignore
  keycloak: new Keycloak(KEYCLOAK_INIT_CONFIG),
  token: null,
  refToken: null,
};

// export type UserState = {
//   user: UserInterface;
// };

// export const ACTIONS = {
//   SET_INSTANCE: "SET_INSTANCE",
//   SET_AUTHENTICATED: "SET_AUTHENTICATED",
//   SET_LOADING: "SET_LOADING",
//   SET_ERROR: "SET_ERROR",
//   SET_KEYCLOAK: "SET_KEYCLOAK",
//   SET_TOKEN: "SET_TOKEN",
//   SET_REF_TOKEN: "SET_REF_TOKEN",
//   // SET_PARSED_TOKEN: "SET_PARSED_TOKEN",
//   SET_USER: "SET_USER",
// };

// export const keycloakReducer = (state: AuthState, action: ReducerAction) => {
//   switch (action.type) {
//     case ACTIONS.SET_AUTHENTICATED:
//       return { ...state, authenticated: action.state };
//     case ACTIONS.SET_LOADING:
//       return { ...state, loading: action.state };
//     case ACTIONS.SET_ERROR:
//       return { ...state, error: action.state };
//     case ACTIONS.SET_KEYCLOAK:
//       return { ...state, keycloak: action.state };
//     case ACTIONS.SET_TOKEN:
//       // setToLocalStorage(LOCAL_STORAGE_KEYCLOAK_TOKEN, action.state);
//       return { ...state, token: action.state };
//     case ACTIONS.SET_REF_TOKEN:
//       return { ...state, refToken: action.state };
//     // case ACTIONS.SET_PARSED_TOKEN:
//     //   return { ...state, parsedToken: action.state };
//     // case ACTIONS.SET_USER:
//     //   return { ...state, user: action.state };
//     default:
//       return state;
//   }
// };

// export const userReducer = (state: UserState, action: ReducerAction) => {
//   switch (action.type) {
//     case ACTIONS.SET_USER:
//       return { ...state, user: action.state };

//     default:
//       return state;
//   }
// };

// export const updateUser = async (
//   dispatch: ActionDispatch<[action: ReducerAction]>,
//   parsedToken: {} | undefined
// ) => {
//   if (parsedToken) {
//     const name = parsedToken ? ["given_name"]?.toString() : "";
//     const username = parsedToken ? ["preferred_username"]?.toString() : "";
//     const email = parsedToken ? ["email"]?.toString() : "";
//     let user = { username, email, name } as UserInterface;
//     await dispatch({
//       type: ACTIONS.SET_USER,
//       state: user,
//     });
//   }
// };

// export const updateKeycloak = async (
//   dispatch: ActionDispatch<[action: ReducerAction]>,
//   keycloak: KeycloakInstance
// ) => {
//   await dispatch({
//     type: ACTIONS.SET_KEYCLOAK,
//     state: { ...keycloak },
//   });

//   await dispatch({
//     type: ACTIONS.SET_AUTHENTICATED,
//     state: keycloak.authenticated,
//   });

//   // await updateUser(dispatch, keycloak.idTokenParsed);
// };

const authSlice = createSlice({
  name: "auth",
  initialState: authInitState,
  reducers: {
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.authenticated = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null | {}>) => {
      state.error = action.payload;
    },
    setKeycloakInstance: (state, action: PayloadAction<KeycloakInstance>) => {
      state.keycloak = { ...action.payload };
    },
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
    },
    setRefToken: (state, action: PayloadAction<string | null>) => {
      state.refToken = action.payload;
    },
  },
});

export const {
  setAuthenticated,
  setLoading,
  setError,
  setKeycloakInstance,
  setToken,
  setRefToken,
} = authSlice.actions;
export default authSlice.reducer;
