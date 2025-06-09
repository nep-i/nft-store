import { Routes, Route } from "react-router";
import { FC } from "react";
import Start from "../../pages/start.page";
import Home from "../../pages/home.page";
import Login from "../../pages/login.page";
import { ProtectedRoute } from "../../components/protectedRoute.component";

export const RoutesComponent: FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Start />} />
      <Route path="/home" element={<ProtectedRoute children={<Home />} />} />
      <Route path="/about" element={<h1>About Us</h1>} />
      <Route path="/login" element={<Login />} />
      <Route path="/chat" element={<Login />} />
      <Route path="/products" element={<Login />} />
      <Route path="*" element={<h1>404 Not Found</h1>} />
    </Routes>
  );
};
