import React, { useState, useReducer } from "react";
// css
import "../styles/Sidebar.css";
import "../styles/SidebarOption.css";
// Icons
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import ListAltIcon from "@mui/icons-material/ListAlt";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Button } from "@mui/material";
import PetsIcon from "@mui/icons-material/Pets";
import SidebarOption from "./SidebarOption";

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

function Sidebar(props) {
  const [state, dispatch] = useReducer(reducer, {
    homeActive: true,
    profileActive: false,
    petsActive: false,
  });

  function setActiveSidebar(sidebar) {
    dispatch({ type: sidebar });
  }

  function showPostBoxModal() {
    props.showModal({
      body: {
        component: "PostBox",
      },
    });
  }

  return (
    <div className="sidebar">
      {/* Pettr text*/}
      <h1 className="sidebar-icon">Pettr</h1>
      {/* Sidebar options*/}
      <div className="sidebar-options">
        <SidebarOption
          active={state.homeActive}
          Icon={HomeIcon}
          text="Home"
          setActiveDashboard={props.setActiveDashboard}
          setActiveSidebar={setActiveSidebar}
        />
        <SidebarOption
          active={state.profileActive}
          Icon={PermIdentityIcon}
          text="Profile"
          setActiveDashboard={props.setActiveDashboard}
          setActiveSidebar={setActiveSidebar}
        />
        <SidebarOption
          Icon={PetsIcon}
          text="Pets"
          active={state.petsActive}
          setActiveDashboard={props.setActiveDashboard}
          setActiveSidebar={setActiveSidebar}
        />
        {/* <SidebarOption Icon={SearchIcon} text="Explore" />
      <SidebarOption Icon={NotificationsNoneIcon} text="Notifications" />
      <SidebarOption Icon={MailOutlineIcon} text="Messages" />
      <SidebarOption Icon={BookmarkBorderIcon} text="Bookmarks" />
      <SidebarOption Icon={MoreHorizIcon} text="More" /> */}
        {/* button -> tweet*/}
        <Button
          variant="outlined"
          className="sidebar-tweet-button"
          fullWidth
          onClick={showPostBoxModal}
        >
          Post
        </Button>
      </div>
    </div>
  );
}

export default Sidebar;
