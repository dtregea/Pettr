import React, { useState, useReducer } from "react";
import Sidebar from "../components/Sidebar";
import Timeline from "../components/Timeline";
import Widgets from "../components/Widgets";
import Modal from "../components/Modal";
import "../styles/Dashboard.css";
import Profile from "../components/Profile";
import Pets from "../components/Pets";

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
function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalProps, setModalProps] = useState({});

  const [state, dispatch] = useReducer(reducer, {
    homeActive: true,
    profileActive: false,
    petsActive: false,
  });

  function setActiveDashboard(props) {
    dispatch({ type: props.sidebar });
  }

  function showModal(props) {
    setModalProps(props);
    setModalOpen(true);
  }

  return (
    <div className="dashboard">
      <Modal
        show={modalOpen}
        onClose={() => setModalOpen(false)}
        components={modalProps}
        showPostModal={showModal}
      />
      <Sidebar setActiveDashboard={setActiveDashboard} showModal={showModal} />
      {state.homeActive && <Timeline showModal={showModal} />}
      {state.profileActive && (
        <Profile showModal={showModal} user={localStorage.getItem("id")} />
      )}
      {state.petsActive && <Pets />}
      <Widgets showModal={showModal} />
    </div>
  );
}

export default Dashboard;
