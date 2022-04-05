import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Feed from "../components/Feed";
import Widgets from "../components/Widgets";
import Modal from "../components/Modal";
import "../styles/Dashboard.css";
import Profile from "../components/Profile";
import Pets from "../components/Pets";
function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalProps, setModalProps] = useState({});
  const [homeActive, setHomeActive] = useState(true);
  const [profileActive, setProfileActive] = useState(false);
  const [petsActive, setPetsActive] = useState(false);

  const nameToSetter = new Map();
  nameToSetter.set("Home", setHomeActive);
  nameToSetter.set("Profile", setProfileActive);
  nameToSetter.set("Pets", setPetsActive);

  const setters = [setHomeActive, setProfileActive, setPetsActive];

  function setActiveDashboard(props) {
    setters.forEach((setter) => {
      setter(false);
    });
    nameToSetter.get(props.sidebar)(true);
  }

  function showPostModal(props) {
    setModalProps(props);
    setModalOpen(true);
  }

  return (
    <div className="dashboard">
      <Modal
        show={modalOpen}
        onClose={() => setModalOpen(false)}
        components={modalProps}
        showPostModal={showPostModal}
      />
      <Sidebar setActiveDashboard={setActiveDashboard} />
      {homeActive && <Feed showPostModal={showPostModal} />}
      {profileActive && <Profile />}
      {petsActive && <Pets />}
      <Widgets showPostModal={showPostModal} />
    </div>
  );
}

export default Dashboard;
