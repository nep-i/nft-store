import { Toolbar } from "primereact/toolbar";
import { Avatar } from "primereact/avatar";
import Navigation from "../Navigation/navigation.components";
import logoimage from "../Assets/Nordic.png";
import logoutImage from "../Assets/logout.svg";
import { useContext } from "react";
import { AuthContext } from "../Auth/Auth";

const ToolBar = () => {
  const centerContent = <Navigation />;
  const { authenticated, logout } = useContext(AuthContext);

  const startContent = (
    // <div className="flex align-items-center">
    <Avatar
      image={logoimage}
      shape="circle"
      size="large"
      style={
        !authenticated
          ? {
              width: "10%",
              height: "10%",
              margin: "auto",
            }
          : {}
      }
    />
    // </div>
  );

  const logoutElm = () => {
    return authenticated ? (
      <div className="flex align-items-center">
        <Avatar
          image={logoutImage}
          shape="square"
          size="large"
          color="white"
          onClick={() => logout()}
        />
      </div>
    ) : (
      <></>
    );
  };

  return (
    <div className="card">
      <Toolbar
        center={authenticated ? centerContent : startContent}
        start={authenticated ? startContent : <></>}
        end={logoutElm}
        className="bg-gray-900 shadow-2"
        style={{
          borderRadius: "3rem",
          backgroundImage: "linear-gradient(to right, #0f5f7d, #0c5571)",
          margin: "0.1rem",
        }}
      />
    </div>
  );
};

export default ToolBar;
