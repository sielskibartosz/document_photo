import React from "react";

function ImagePreview({ image, label }) {
  return (
    <div style={{ marginTop: 20 }}>
      <h4>{label}</h4>
      <img src={image} alt={label} style={{ maxWidth: "100%", border: "1px solid #ccc" }} />
    </div>
  );
}

export default ImagePreview;
