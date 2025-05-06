import { FC } from "react";
import "./Assets/Styles/App.css";
import { RoutesComponent } from "./Navigation/Routes/routes.navigation";
import ToolBar from "./Components/toolbar.components";

const App: FC = () => {
  return (
    <div className="App">
      <ToolBar />
      <RoutesComponent />
    </div>
  );
};

export default App;
