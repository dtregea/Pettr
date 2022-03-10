import React from "react";
import "../styles/SidebarOption.css";

function SidebarOption({ active, text, Icon }) {
  return (
    <div className={`sidebar-option ${active && "sidebar-option--active"}`}>
      {/* && mean if active, then text */}
      <Icon />
      <h2>{text}</h2>
    </div>
  );
}

export default SidebarOption;
