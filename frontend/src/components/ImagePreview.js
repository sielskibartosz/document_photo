import React from "react";

function ImagePreview({ image, label }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h4 style={{ marginBottom: 8 }}>{label}</h4>
      <div
        style={{
          position: "relative",
          width: 300,
          height: 400,
          background: "#f0f0f0",
          overflow: "hidden", // ważne, żeby obraz nie wychodził
        }}
      >
        {image ? (
          <img
            src={image}
            alt={label}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover", // <-- najważniejsze
            }}
          />
        ) : (
          <span
            style={{
              color: "#999",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            Brak zdjęcia
          </span>
        )}
      </div>
    </div>
  );
}

export default ImagePreview;
