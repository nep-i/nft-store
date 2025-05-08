import { FC, useContext, useState, useEffect } from "react";
import { AuthContext } from "../Auth/Auth";
import Login from "./login.page";
import Home from "./home.page";
import { ProtectedRoute } from "../Components/protectedRoute.component";
import { exchangeCodeForToken } from "../Requests/accessTocken.requests";
import { useNavigate } from "react-router";

const Start: FC = () => {
  // const { login, authenticated, keycloak, setKeycloak } =
  //   useContext(AuthContext);

  const { authenticated, keycloak } = useContext(AuthContext);
  const [logged, setLogged] = useState<boolean>(authenticated);
  console.log(
    "***** start.page authorized keycloak-> ",
    authenticated,
    keycloak
  );
  // setKeycloak((k) => k);
  const hashParams = new URLSearchParams(window.location.hash.substring(1)); // Remove "#" prefix
  const state = hashParams.get("state");
  const code = hashParams.get("code");
  const nav = useNavigate();
  // const [logged, setLogged] = useState<boolean>(authenticated);

  // useEffect(() => {
  // useEffect(() => {
  //   if (state) {
  //     console.log("inside login and with state ", keycloak, authenticated);

  //     if (!keycloak) {
  //       login();
  //       window.history.replaceState(null, "", window.location.pathname);
  //       nav("/home");
  //     }
  //   }
  // }, []);
  // const navigate = useNavigate();

  // useEffect(() => {
  //   if (code && state) {
  //     const data = exchangeCodeForToken(code, state).then((data) => {
  //       console.log("inside start page keycloak ", keycloak, authenticated);
  //       if (!keycloak) {
  //         const key = (async () => await login())().then((d) => {
  //           return d;
  //         });
  //         console.log("inside init when keycloak is null ", key);
  //       }

  //       //@ts-ignore
  //       if (keycloak && keycloak.didInitialize) {
  //         (async () => {
  //           //@ts-ignore
  //           await keycloak.login().then((data) => {
  //             console.log("inside loged in keycloak ", data, keycloak);
  //           });
  //           setKeycloak(keycloak);
  //           if (keycloak.authenticated) setLogged(true);
  //         })();
  //       }

  //       return data;
  //     }) as {} | null;
  //   }
  // }, [keycloak]);

  // useEffect(() => {
  //   console.log(
  //     "inside login page and authenticated changed",
  //     authenticated,
  //     keycloak?.authenticated
  //   );
  //   if (keycloak && keycloak.token) login();
  // }, [authenticated, keycloak]);

  useEffect(() => {
    if ((keycloak && keycloak.authenticated) || authenticated) setLogged(true);
  }, [authenticated, keycloak]);

  return !logged ? <Login /> : <ProtectedRoute children={<Home />} />;
};

export default Start;

// const hashParams = new URLSearchParams(window.location.hash.substring(1)); // Remove "#" prefix
// const state = hashParams.get("state");
// const baseString = new URLSearchParams(window.location.href);
// const code = hashParams.get("code");
