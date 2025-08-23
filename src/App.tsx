
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ScrollToHash from "./hooks/ScrollController";
import MenuComponent from "./pages/MenuFad";
import FadharAdminDashboard from "./pages/MainDashbaord";
import FadharAdminLogin from "./pages/Login";
import { isLoggedIn } from "./app/Localstorage";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToHash />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={isLoggedIn ? <FadharAdminDashboard /> : <FadharAdminLogin />} />
        <Route path="/menu" element={<MenuComponent />} />
        <Route path="/dashboard" element={isLoggedIn ? <FadharAdminDashboard /> : <FadharAdminLogin />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}