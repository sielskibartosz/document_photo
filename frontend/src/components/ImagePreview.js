import React from "react";

function ImagePreview({ image, label, aspectRatio }) {
  const width = 300;
  const height = width / aspectRatio;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h4 style={{ marginBottom: 8 }}>{label}</h4>
      <div
        style={{
          position: "relative",
          width,
          height,
          background: "#f0f0f0",
          overflow: "hidden",
          borderRadius: 8,
          border: "1px solid #ccc",
        }}
      >
        {image ? (
          <img
            src={image}
            alt={label}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain", // dopasowanie bez przycinania
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
