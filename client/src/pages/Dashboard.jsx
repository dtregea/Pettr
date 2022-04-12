import React, { useState, useReducer } from "react";
import Sidebar from "../components/Sidebar";
import Timeline from "../components/Timeline";
import Widgets from "../components/Widgets";
import Modal from "../components/Modal";
import "../styles/Dashboard.css";
import Profile from "../components/Profile";
import Pets from "../components/Pets";

function Dashboard() {
  const reducer = (state, action) => {
    switch (action.type) {
      case "Home":
        return { homeActive: true, profileActive: false, petsActive: false };
      case "Profile":
        return { homeActive: false, profileActive: true, petsActive: false };
      case "Pets":
        return { homeActive: false, profileActive: false, petsActive: true };
      default:
        return {};
    }
  };
  const [modalOpen, setModalOpen] = useState(false);
  const [modalProps, setModalProps] = useState({});
  const [userProfileId, setUserProfileId] = useState(
    localStorage.getItem("id")
  );

  const [state, dispatch] = useReducer(reducer, {
    homeActive: true,
    profileActive: false,
    petsActive: false,
  });

  function setActiveDashboard(props) {
    setUserProfileId(localStorage.getItem("id"));
    dispatch({ type: props.sidebar });
  }

  function setProfileTab(userId) {
    setUserProfileId(userId);
    dispatch({ type: "Profile" });
  }

  function showModal(userId) {
    setModalProps(userId);
    setModalOpen(true);
  }

  return (
    <div className="dashboard">
      <Modal
        show={modalOpen}
        onClose={() => setModalOpen(false)}
        components={modalProps}
        showPostModal={showModal}
        setProfileTab={setProfileTab}
      />
      <Sidebar setActiveDashboard={setActiveDashboard} showModal={showModal} />
      {state.homeActive && (
        <Timeline showModal={showModal} setProfileTab={setProfileTab} />
      )}
      {state.profileActive && (
        <Profile
          showModal={showModal}
          userId={userProfileId}
          setProfileTab={setProfileTab}
        />
      )}
      {state.petsActive && <Pets />}
      <Widgets showModal={showModal} setProfileTab={setProfileTab} />
    </div>
  );
}

export default Dashboard;
