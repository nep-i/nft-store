import { Toolbar } from "primereact/toolbar";
import { Avatar } from "primereact/avatar";
import Navigation from "../Navigation/navigation.components";
import logoimage from "../Assets/logoimage.jpg";

const ToolBar = () => {
  const centerContent = <Navigation />;

  const endContent = (
    <div className="flex align-items-center gap-2">
      <Avatar image={logoimage} shape="circle" size="large" />
    </div>
  );

  return (
    <div className="card">
      <Toolbar
        center={centerContent}
        start={endContent}
        className="bg-gray-900 shadow-2"
        style={{
          borderRadius: "3rem",
          backgroundImage:
            "linear-gradient(to right, var(--bluegray-500), var(--bluegray-800))",
          margin: "1rem",
        }}
      />
    </div>
  );
};

export default ToolBar;
