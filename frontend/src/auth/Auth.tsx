import { createContext, ReactNode, useEffect } from "react";
import { KeycloakInstance } from "keycloak-js";
// import { ACTIONS } from "../Store/Reducers/auth.reducer";
import { useKeycloak } from "../hooks/useKeycloak";
import { Provider, useDispatch, useSelector } from "react-redux";
import store, { RootState } from "../store/store";
import {
  setKeycloakInstance,
  setAuthenticated,
  setError,
  setToken,
  setRefToken,
} from "../store/Reducers/auth.reducer";
import { isEqual } from "lodash";
// import { exchangeCodeForToken } from "../Requests/accessTocken.requests";
import { KEYCLOAK_INIT_CONFIG } from "../constants/vars";
import Keycloak from "keycloak-js";
import react from "@vitejs/plugin-react";
export type authContextType = {
  authenticated: boolean;
  error: string | null | {};
  keycloak: KeycloakInstance | null;
  // getMe: () => UserInterface | null;
  logout: () => void;
  login: (clicked: boolean) => void;
  register: () => void;
};

export const AuthContext = createContext<authContextType>({
  authenticated: false,
  error: null,
  keycloak: null,
  // getMe: () => null,
  logout: () => null,
  login: (boolean) => null,
  register: () => null,
});

export const AuthProvider = (props: { children: ReactNode }) => {
  const { keycloak, login, error, authorized, register } = useKeycloak();

  const dispatch = useDispatch();

  const authState = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!isEqual(authState.keycloak, keycloak)) {
      dispatch(setKeycloakInstance(keycloak));
    }

    if (authorized !== authState.authenticated) {
      dispatch(setAuthenticated(authorized));
    }
  }, [keycloak, authorized]);

  useEffect(() => {
    if (error && authState.error !== error) dispatch(setError(error));
  }, [error]);

  const logout = async () => {
    await keycloak?.logout();
    dispatch(setAuthenticated(false));
    //@ts-ignore
    dispatch(setKeycloakInstance(new Keycloak(KEYCLOAK_INIT_CONFIG)));
    dispatch(setToken(null));
    dispatch(setRefToken(null));
    await keycloak.logout();
  };

  return (
    <AuthContext.Provider
      value={{
        keycloak,
        // getMe,
        logout,
        authenticated: authorized,
        error,
        login,
        register,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
