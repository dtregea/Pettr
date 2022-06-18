import React, { useState, useReducer } from "react";
import Sidebar from "../components/Sidebar";
import Timeline from "../components/Timeline";
import Widgets from "../components/Widgets";
import Modal from "../components/Modal";
import "../styles/Dashboard.css";
import Profile from "../components/Profile";
import Pets from "../components/Pets";
import useAuth from "../hooks/useAuth";
import Search from "../components/Search";

function Dashboard() {
  const { auth } = useAuth();
  const reducer = (state, action) => {
    switch (action.type) {
      case "Home":
        return {
          homeActive: true,
          profileActive: false,
          petsActive: false,
          searchActive: false,
        };
      case "Profile":
        return {
          homeActive: false,
          profileActive: true,
          petsActive: false,
          searchActive: false,
        };
      case "Pets":
        return {
          homeActive: false,
          profileActive: false,
          petsActive: true,
          searchActive: false,
        };
      case "Search":
        return {
          homeActive: false,
          profileActive: false,
          petsActive: false,
          searchActive: true,
        };
      default:
        return {};
    }
  };
  const [modalOpen, setModalOpen] = useState(false);
  const [modalProps, setModalProps] = useState({});
  const [userProfileId, setUserProfileId] = useState(auth?.userId);
  const [searchResults, setSearchResults] = useState({});

  const [state, dispatch] = useReducer(reducer, {
    homeActive: true,
    profileActive: false,
    petsActive: false,
    searchActive: false,
  });

  function setActiveDashboard(props) {
    setUserProfileId(auth?.userId);
    dispatch({ type: props.sidebar });
  }

  function setProfileTab(userId) {
    setUserProfileId(userId);
    dispatch({ type: "Profile" });
  }

  function setSearchTab(props) {
    setSearchResults(props);
    dispatch({ type: "Search" });
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
      {state.petsActive && <Pets showModal={showModal} />}
      {state.searchActive && (
        <Search
          searchResults={searchResults}
          showModal={showModal}
          setProfileTab={setProfileTab}
        />
      )}
      <Widgets
        showModal={showModal}
        setProfileTab={setProfileTab}
        setSearchTab={setSearchTab}
      />
    </div>
  );
}

export default Dashboard;
