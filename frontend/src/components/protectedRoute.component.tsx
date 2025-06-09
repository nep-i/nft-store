import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../auth/Auth";
import Login from "../pages/login.page";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { authenticated } = useContext(AuthContext);
  const [logged, setLogged] = useState<boolean>(true);

  useEffect(() => {
    console.log("inside protected route authenticated ", true);
    if (authenticated && !logged) setLogged((n) => !n);
  }, [authenticated]);

  return <>{children}</>;
};
