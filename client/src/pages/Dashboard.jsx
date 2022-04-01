import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Feed from "../components/Feed";
import Widgets from "../components/Widgets";
import Modal from "../components/Modal";
import "../styles/Dashboard.css";
function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalProps, setModalProps] = useState({});

  function showPostModal(props) {
    setModalProps(props);
    setModalOpen(true);
  }

  return (
    <div className="dashboard">
      <Modal
        show={modalOpen}
        onClose={() => setModalOpen(false)}
        post={modalProps}
      />
      <Sidebar />
      <Feed showPostModal={showPostModal} />
      <Widgets showPostModal={showPostModal} />
    </div>
  );
}

export default Dashboard;
