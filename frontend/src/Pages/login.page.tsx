import { Divider } from "primereact/divider";
import { Button } from "primereact/button";
// import { authenticated } from "../Hooks/useKeycloak";
import { AuthContext } from "../Auth/Auth";
import { useContext } from "react";

export default function Login() {
  const { login, register } = useContext(AuthContext);

  return (
    <div className="card">
      <div className="flex flex-column md:flex-row">
        <div className="w-full md:w-5 flex flex-column align-items-center justify-content-center gap-3 py-5">
          <Button
            label="Login"
            icon="pi pi-user"
            className="w-10rem mx-auto"
            onClick={() => {
              login(true);
            }}
          ></Button>
        </div>
        <div className="w-full md:w-2">
          <Divider layout="vertical" className="hidden md:flex">
            <b>OR</b>
          </Divider>
          <Divider
            layout="horizontal"
            className="flex md:hidden"
            align="center"
          >
            <b>OR</b>
          </Divider>
        </div>
        <div className="w-full md:w-5 flex align-items-center justify-content-center py-5">
          <Button
            label="Sign Up"
            icon="pi pi-user-plus"
            severity="success"
            className="w-10rem"
            onClick={() => {
              register();
            }}
          ></Button>
        </div>
      </div>
    </div>
  );
}
