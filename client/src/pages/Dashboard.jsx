import React, { useState, useReducer } from "react";
import Sidebar from "../components/Sidebar";
import Timeline from "../components/Timeline";
import Widgets from "../components/Widgets";
import Modal from "../components/Modal";
import "../styles/Dashboard.css";
import "../styles/index.css";
import Profile from "../components/Profile";
import Pets from "../components/Pets";
import useAuth from "../hooks/useAuth";
import Search from "../components/Search";
import PetWidgets from "../components/PetWidgets";
import Explore from "../components/Explore";

function Dashboard() {
  const { auth } = useAuth();
  const reducer = (state, action) => {
    switch (action.type) {
      case "Home":
        return {
          homeActive: true,
          exploreActive: false,
          profileActive: false,
          petsActive: false,
          searchActive: false,
          widgetsActive: true,
        };
      case "Explore":
        return {
          homeActive: false,
          exploreActive: true,
          profileActive: false,
          petsActive: false,
          searchActive: false,
          widgetsActive: true,
        };
      case "Profile":
        return {
          homeActive: false,
          exploreActive: false,
          profileActive: true,
          petsActive: false,
          searchActive: false,
          widgetsActive: true,
        };
      case "Pets":
        return {
          homeActive: false,
          exploreActive: false,
          profileActive: false,
          petsActive: true,
          searchActive: false,
          widgetsActive: false,
        };
      case "Search":
        return {
          homeActive: false,
          exploreActive: false,
          profileActive: false,
          petsActive: false,
          searchActive: true,
          widgetsActive: true,
        };
      default:
        return {};
    }
  };
  const [modalOpen, setModalOpen] = useState(false);
  const [modalProps, setModalProps] = useState({});
  const [userProfileId, setUserProfileId] = useState(auth?.userId);
  const [searchResults, setSearchResults] = useState({});
  const [petFilters, setPetFilters] = useState({});

  const [state, dispatch] = useReducer(reducer, {
    homeActive: true,
    profileActive: false,
    petsActive: false,
    searchActive: false,
    widgetsActive: true,
  });

  function setActiveDashboard(props) {
    setUserProfileId(auth?.userId);
    setPetFilters({});
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

      {state.exploreActive && (
        <Explore showModal={showModal} setProfileTab={setProfileTab} />
      )}
      {state.profileActive && (
        <Profile
          showModal={showModal}
          userId={userProfileId}
          setProfileTab={setProfileTab}
        />
      )}
      {state.petsActive && (
        <Pets showModal={showModal} petFilters={petFilters} />
      )}
      {state.petsActive && <PetWidgets setPetFilters={setPetFilters} />}

      {state.searchActive && (
        <Search
          searchResults={searchResults}
          showModal={showModal}
          setProfileTab={setProfileTab}
        />
      )}
      {state.widgetsActive && (
        <Widgets
          showModal={showModal}
          setProfileTab={setProfileTab}
          setSearchTab={setSearchTab}
        />
      )}
    </div>
  );
}

export default Dashboard;
