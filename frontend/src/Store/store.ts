import { configureStore } from "@reduxjs/toolkit";
import _ from "lodash";

import logger from "loglevel";

// And use redux-batched-subscribe as an example of adding enhancers
import { batchedSubscribe } from "redux-batched-subscribe";

const debounceNotify = _.debounce((notify: any) => notify());

const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware: any) =>
    getDefaultMiddleware().concat(logger),
  devTools: process.env.NODE_ENV !== "production",

  enhancers: (getDefaultEnhancers: any) =>
    getDefaultEnhancers({
      autoBatch: false,
    }).concat(batchedSubscribe(debounceNotify)),
});
