import React from "react";
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

function Sidebar() {
  return (
    <div className="sidebar">
      {/* Pettr icon*/}
      <PetsIcon className="sidebar-icon" />
      {/* Sidebar options*/}
      <SidebarOption active Icon={HomeIcon} text="Home" />
      <SidebarOption Icon={SearchIcon} text="Explore" />
      <SidebarOption Icon={NotificationsNoneIcon} text="Notifications" />
      <SidebarOption Icon={MailOutlineIcon} text="Messages" />
      <SidebarOption Icon={BookmarkBorderIcon} text="Bookmarks" />
      <SidebarOption Icon={ListAltIcon} text="Lists" />
      <SidebarOption Icon={PermIdentityIcon} text="Profile" />
      <SidebarOption Icon={MoreHorizIcon} text="More" />
      {/* button -> tweet*/}
      <Button variant="outlined" className="sidebar-tweet-button" fullWidth>
        Post
      </Button>
    </div>
  );
}

export default Sidebar;
