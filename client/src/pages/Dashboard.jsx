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
import SearchWidgets from "../components/SearchWidgets";

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
          rows: 2,
        };
      case "Explore":
        return {
          homeActive: false,
          exploreActive: true,
          profileActive: false,
          petsActive: false,
          searchActive: false,
          widgetsActive: true,
          rows: 2,
        };
      case "Profile":
        return {
          homeActive: false,
          exploreActive: false,
          profileActive: true,
          petsActive: false,
          searchActive: false,
          widgetsActive: true,
          rows: 2,
        };
      case "Pets":
        return {
          homeActive: false,
          exploreActive: false,
          profileActive: false,
          petsActive: true,
          searchActive: false,
          widgetsActive: false,
          rows: 3,
        };
      case "Search":
        return {
          homeActive: false,
          exploreActive: false,
          profileActive: false,
          petsActive: false,
          searchActive: true,
          widgetsActive: false,
          rows: 3, // this will be 3 soon on search results
        };
      default:
        return {};
    }
  };
  const [modalOpen, setModalOpen] = useState(false);
  const [modalProps, setModalProps] = useState({});
  const [userProfileId, setUserProfileId] = useState(auth?.userId);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilters, setSearchFilters] = useState({});
  const [petFilters, setPetFilters] = useState({});

  const [state, dispatch] = useReducer(reducer, {
    homeActive: true,
    profileActive: false,
    petsActive: false,
    searchActive: false,
    widgetsActive: true,
    rows: 2,
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
    setSearchQuery(props);
    dispatch({ type: "Search" });
  }

  function showModal(userId) {
    setModalProps(userId);
    setModalOpen(true);
  }

  return (
    <div
      className={`dashboard ${state.rows === 2 ? "two-rows" : "three-rows"}`}
    >
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
        <Explore
          showModal={showModal}
          setProfileTab={setProfileTab}
          setSearchTab={setSearchTab}
        />
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

      {state.petsActive && 
        <PetWidgets 
        setPetFilters={setPetFilters} 
        setProfileTab={setProfileTab} 
        setSearchTab={setSearchTab}
        passedSearchQuery={searchQuery}
        />
      }

      {state.searchActive && (
        <Search
          searchQuery={searchQuery}
          showModal={showModal}
          setProfileTab={setProfileTab}
          searchFilters={searchFilters}
          setSearchTab={setSearchTab}
        />
      )}
      {state.searchActive && 
        <SearchWidgets 
        setSearchFilters={setSearchFilters}
          setSearchTab={setSearchTab}
          searchQuery={searchQuery}
        />
      }
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
