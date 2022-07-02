import Dashboard from "./pages/Dashboard";
import LoggedOutView from "./pages/LoggedOutView";
import Login from "./pages/Login";
import RequireAuth from "./components/RequireAuth.jsx";
import Register from "./pages/Register";
import PersistLogin from "./components/PersistLogin";
import { Route, Routes, Navigate } from "react-router-dom";
function App() {
  return (
    <div>
      <Routes>
        {/* public routes */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth />}>
            <Route path="/" element={<Dashboard />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
