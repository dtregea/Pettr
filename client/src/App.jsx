import Login from "./pages/Login";
import RequireAuth from "./components/RequireAuth.jsx";
import Register from "./pages/Register";
import PersistLogin from "./components/PersistLogin";
import { Route, Routes, Navigate} from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import Sidebar from "./components/Sidebar";
import Timeline from "./components/Timeline";
import Explore from "./components/Explore";
import Profile from "./components/Profile";
import Pets from "./components/Pets";
import Search from "./components/Search";
import Widgets from "./components/Widgets";
import PetWidgets from "./components/PetWidgets";
import SearchWidgets from "./components/SearchWidgets";
import Modal from "./components/Modal";
import useModal from "./hooks/useModal";
import "./styles/Dashboard.css";

function App() {
  const {modalOpen, modalProps, setModalOpen} = useModal();

  return (
    <div>
      <Toaster />
      <Modal
        show={modalOpen}
        components={modalProps}
      />
      <Routes>
        {/* public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth />}>
            <Route exact path="/home" element={<div className="dashboard two-rows"><Sidebar /><Timeline /> <Widgets /> </div>} />
            <Route exact path="/explore" element={<div className="dashboard two-rows"><Sidebar /><Explore /> <Widgets /> </div>} />
            <Route exact path="/profile">
              <Route path=":userId" element={<div className="dashboard two-rows"><Sidebar /><Profile /> <Widgets /> </div>} />

            </Route>
            <Route path="/pets" element={<div className="dashboard three-rows"><Sidebar /><Pets /> <PetWidgets /> </div>} />
            <Route path="/search" element={<div className="dashboard three-rows"><Sidebar /><Search /> <SearchWidgets /> </div>} />

          </Route>
        </Route>
        <Route path="/*" element={<Navigate to="/home" replace />} />
      </Routes>
    </div>
  );
}

export default App;
