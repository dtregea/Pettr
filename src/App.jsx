import Dashboard from "./pages/Dashboard";
import LoggedOutView from "./pages/LoggedOutView";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Route, Routes, Navigate } from "react-router-dom";
function App() {
  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            localStorage.getItem("token") != null ? (
              <Dashboard />
            ) : (
              <LoggedOutView />
            )
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/log" element={<LoggedOutView />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
