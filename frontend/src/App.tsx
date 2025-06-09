import { FC } from "react";
import "./Assets/Styles/App.css";
import { RoutesComponent } from "./navigation/Routes/routes.navigation";
import ToolBar from "./components/toolbar.components";

const App: FC = () => {
  return (
    <div className="App">
      <ToolBar />
      <RoutesComponent />
    </div>
  );
};

export default App;
