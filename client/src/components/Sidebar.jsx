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
import Search from "@mui/icons-material/Search";
import { Button } from "@mui/material";
import PetsIcon from "@mui/icons-material/Pets";
import SidebarOption from "./SidebarOption";

const reducer = (state, action) => {
  switch (action.type) {
    case "Home":
      return {
        homeActive: true,
        exploreActive: false,
        profileActive: false,
        petsActive: false,
      };
    case "Explore":
      return {
        homeActive: false,
        exploreActive: true,
        profileActive: false,
        petsActive: false,
      };
    case "Profile":
      return {
        homeActive: false,
        exploreActive: false,
        profileActive: true,
        petsActive: false,
      };
    case "Pets":
      return {
        homeActive: false,
        exploreActive: false,
        profileActive: false,
        petsActive: true,
      };
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
      <div className="sidebar-options">
        <img className="pettr-logo" src="https://res.cloudinary.com/pettr/image/upload/c_scale,q_100,w_450/v1658784736/33C1F02E-469D-4961-A946-78168245BBD4_yvnplk.jpg"></img>

        <SidebarOption
          active={state.homeActive}
          Icon={HomeIcon}
          text="Home"
          setActiveDashboard={props.setActiveDashboard}
          setActiveSidebar={setActiveSidebar}
        />
        <SidebarOption
          active={state.exploreActive}
          Icon={Search}
          text="Explore"
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
        {/* Potential icons for future use */}
        
        {/* <SidebarOption Icon={SearchIcon} text="Explore" />
        <SidebarOption Icon={NotificationsNoneIcon} text="Notifications" />
        <SidebarOption Icon={MailOutlineIcon} text="Messages" />
        <SidebarOption Icon={BookmarkBorderIcon} text="Bookmarks" />
        <SidebarOption Icon={MoreHorizIcon} text="More" /> 
        */}
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
