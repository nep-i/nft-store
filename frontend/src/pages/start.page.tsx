import { FC, useContext, useState, useEffect } from "react";
import { AuthContext } from "../auth/Auth";
import Login from "./login.page";
import Home from "./home.page";
import { ProtectedRoute } from "../components/protectedRoute.component";
import { useNavigate } from "react-router";

const Start: FC = () => {
  const { authenticated, keycloak } = useContext(AuthContext);
  const [logged, setLogged] = useState<boolean>(authenticated);
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
