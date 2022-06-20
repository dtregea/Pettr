import React from "react";

function UploadImage(props) {
  return (
    <input
      className="post-box-image-input"
      placeholder="Upload Image"
      type="file"
      onChange={(e) => {
        props.setImage(e.target.files[0]);
      }}
    ></input>
  );
}

export default UploadImage;
