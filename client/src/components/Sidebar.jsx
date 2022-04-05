import React, { useState } from "react";
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

// components
import SidebarOption from "./SidebarOption";

function Sidebar(props) {
  const [homeActive, setHomeActive] = useState(true);
  const [profileActive, setProfileActive] = useState(false);
  const [petsActive, setPetsActive] = useState(false);

  const nameToSetter = new Map();
  nameToSetter.set("Home", setHomeActive);
  nameToSetter.set("Profile", setProfileActive);
  nameToSetter.set("Pets", setPetsActive);

  const setters = [setHomeActive, setProfileActive, setPetsActive];

  // oof....
  function setActiveSidebar(sidebar) {
    setters.forEach((setter) => {
      setter(false);
    });
    nameToSetter.get(sidebar)(true);
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
      <SidebarOption
        active={homeActive}
        Icon={HomeIcon}
        text="Home"
        setActiveDashboard={props.setActiveDashboard}
        setActiveSidebar={setActiveSidebar}
      />
      <SidebarOption
        active={profileActive}
        Icon={PermIdentityIcon}
        text="Profile"
        setActiveDashboard={props.setActiveDashboard}
        setActiveSidebar={setActiveSidebar}
      />
      <SidebarOption
        Icon={PetsIcon}
        text="Pets"
        active={petsActive}
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
  );
}

export default Sidebar;
