import { useState, useEffect } from "react";
import Keycloak, { KeycloakInstance } from "keycloak-js";
import { KEYCLOAK_INIT_CONFIG } from "../constants/vars";

export const useKeycloak = () => {
  const [keycloak, setKeycloak] = useState<KeycloakInstance>(
    //@ts-ignore
    new Keycloak(KEYCLOAK_INIT_CONFIG)
  );
  const [error, setError] = useState<null | {}>(null);
  const [authorized, setAuthorized] = useState<boolean>(false);

  const hashParams = new URLSearchParams(window.location.hash.substring(1));
  const code: string | null = hashParams.get("code");

  useEffect(() => {
    if (code && !keycloak.authenticated) login();
  }, [hashParams]);

  const login = async (clicked: boolean = false): Promise<any> => {
    //@ts-ignore
    if (!keycloak.didInitialize) {
      const auth = await keycloak.init({
        checkLoginIframe: false,
        onLoad: clicked ? "login-required" : "check-sso",
      });
      if (auth) {
        setAuthorized(true);
        setKeycloak(keycloak);
      }
      if (!auth) {
        //@ts-ignore
        await keycloak
          .login()
          //@ts-ignore
          .then((auth: boolean) => {
            if (auth) {
              setAuthorized(auth);
              setKeycloak(keycloak);
            }
          })
          //@ts-ignore
          .catch((error: any) => setError(error));
      }
    }
  };

  const register = async (): Promise<any> => {
    if (!keycloak.didInitialize) {
      const auth = await keycloak.init({
        checkLoginIframe: false,
      });
      //@ts-ignore
      await keycloak
        .login({
          action: "register",
          redirectUri: KEYCLOAK_INIT_CONFIG.redirectUri,
        })
        //@ts-ignore
        .then((auth: boolean) => {
          if (auth) {
            setAuthorized(auth);
            setKeycloak(keycloak);
          }
        })
        //@ts-ignore
        .catch((error: any) => setError(error));
      // }
    }
  };

  return {
    keycloak,
    error,
    login,
    authorized,
    register,
  };
};
