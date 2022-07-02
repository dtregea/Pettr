import React from "react";
import { Ellipsis } from "react-awesome-spinners";
import "../styles/PageLoading.css";
function PageLoading() {
  return (
    <div className="loader">
      <Ellipsis color="#6504b5" />
    </div>
  );
}

export default PageLoading;
