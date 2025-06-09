import { configureStore } from "@reduxjs/toolkit";
import _ from "lodash";

import logger from "loglevel";

import { batchedSubscribe } from "redux-batched-subscribe";
import { default as authReducer } from "./Reducers/auth.reducer";

const logMiddleware = (store: any) => (next: any) => (action: any) => {
  logger.debug("Dispatch action ", action);
  const result = next(action);
  logger.debug("Updated state ", { ...store });
  return result;
};

const debounceNotify = _.debounce((notify: any) => notify());

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware: any) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["auth/setKeycloakInstance"],
        ignoredPaths: ["auth.keycloak"],
      },
    }).concat(logMiddleware),
  devTools: process.env.NODE_ENV !== "production",

  enhancers: (getDefaultEnhancers: any) =>
    getDefaultEnhancers({
      autoBatch: false,
    }).concat(batchedSubscribe(debounceNotify)),
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
