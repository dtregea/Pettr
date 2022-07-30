import React from "react";
import { useLocation } from 'react-router-dom';
// css
import "../styles/Sidebar.css";
import "../styles/SidebarOption.css";
// Icons
import HomeIcon from "@mui/icons-material/Home";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import Search from "@mui/icons-material/Search";
import { Button } from "@mui/material";
import PetsIcon from "@mui/icons-material/Pets";
import SidebarOption from "./SidebarOption";

import useModal from "../hooks/useModal";


function Sidebar(props) {
  const location = useLocation();
  const {setModalOpen, setModalProps} = useModal();

  function showPostBoxModal() {
    setModalProps({
      body: {
        component: "PostBox",
      },
    });
    setModalOpen(true);
  }

  return (
    <div className="sidebar">
      <div className="sidebar-options">
        <img className="pettr-logo" src="https://res.cloudinary.com/pettr/image/upload/c_scale,q_100,w_450/v1658784736/33C1F02E-469D-4961-A946-78168245BBD4_yvnplk.jpg"></img>

        <SidebarOption
          active={location.pathname.includes('home')}
          Icon={HomeIcon}
          text="home"
        />
        <SidebarOption
          active={location.pathname.includes('explore')}
          Icon={Search}
          text="explore"
        />
        <SidebarOption
          active={location.pathname.includes('profile')}
          Icon={PermIdentityIcon}
          text="profile"
        />
        <SidebarOption
          Icon={PetsIcon}
          text="pets"
          active={location.pathname.includes('pets')}
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
