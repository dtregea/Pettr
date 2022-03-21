import React from "react";
import Sidebar from "../components/Sidebar";
import Feed from "../components/Feed";
import Widgets from "../components/Widgets";
import "../styles/Dashboard.css";
function Dashboard() {
  return (
    <div className="dashboard">
      <Sidebar />
      <Feed />
      <Widgets />
    </div>
  );
}

export default Dashboard;
