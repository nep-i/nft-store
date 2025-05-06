import {
  createContext,
  ReactNode,
  useEffect,
  useReducer,
  Dispatch,
  SetStateAction,
} from "react";
import { UserInterface } from "../Models/user.model";
import { KeycloakInstance } from "keycloak-js";
import { ACTIONS } from "../Store/Reducers/auth.reducer";
import { useKeycloak } from "../Hooks/useKeycloak";
import {
  keycloakReducer,
  updateKeycloak,
} from "../Store/Reducers/auth.reducer";
// import { exchangeCodeForToken } from "../Requests/accessTocken.requests";
export type authContextType = {
  authenticated: boolean;
  error: string | null | {};
  keycloak: KeycloakInstance | null;
  // getMe: () => UserInterface | null;
  doLogout: () => void;
  login: (clicked: boolean) => void;
};

export const AuthContext = createContext<authContextType>({
  authenticated: false,
  error: null,
  keycloak: null,
  // getMe: () => null,
  doLogout: () => null,
  login: (boolean) => null,
});

export const AuthProvider = (props: { children: ReactNode }) => {
  const { keycloak, login, error, authorized } = useKeycloak();

  const [state, dispatch] = useReducer(keycloakReducer, {
    authenticated: false,
    loading: false,
    error: null,
    keycloak: null,
    token: null,
    refToken: null,
    parsedToken: null,
  });

  // const getMe = (): UserInterface | null => {
  //   if (user) {
  //     return user;
  //   }
  //   return null;
  // };

  const doLogout = async () => {
    await keycloak.logout();
  };

  return (
    <AuthContext.Provider
      value={{
        keycloak,
        // getMe,
        doLogout,
        authenticated: authorized,
        error,
        login,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
