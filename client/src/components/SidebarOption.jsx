import React from "react";
import "../styles/SidebarOption.css";
import useAuth from "../hooks/useAuth";
function SidebarOption({
  active,
  text,
  Icon,
  setActiveDashboard,
  setActiveSidebar,
}) {
  const { auth } = useAuth();
  function setActive() {
    let sidebarInfo = { sidebar: text };
    if (text === "profile") {
      sidebarInfo["id"] = auth?.userId;
    }
    setActiveDashboard(sidebarInfo);
    setActiveSidebar(text);
  }
  return (
    <div
      className={`sidebar-option ${active && "sidebar-option--active"}`}
      onClick={setActive}
    >
      {/* && mean if active, then text */}
      <Icon />
      <h2>{text}</h2>
    </div>
  );
}

export default SidebarOption;
