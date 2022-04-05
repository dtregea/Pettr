import React from "react";
import "../styles/SidebarOption.css";

function SidebarOption({
  active,
  text,
  Icon,
  setActiveDashboard,
  setActiveSidebar,
}) {
  function setActive() {
    console.log("set active");
    let sidebarInfo = { sidebar: text };
    if (text === "profile") {
      sidebarInfo["id"] = localStorage.getItem("id");
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
