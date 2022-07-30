import React from "react";
import "../styles/SidebarOption.css";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

function SidebarOption({
  active,
  text,
  Icon,
}) {
  const { auth } = useAuth();
  const navigate = useNavigate();

  return (
    <div
      className={`sidebar-option ${active && "sidebar-option--active"}`}
      onClick={() => {
        navigate(`/${text !== 'profile' ? text : `profile/${auth?.userId}`}`)
      }
      }
    >
      <Icon className="sidebar-option-icon" />
      <h2 className="sidebar-option-text">{text}</h2>
    </div>
  );
}

export default SidebarOption;
