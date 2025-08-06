import React from "react";

const SheetMinature = ({thumbnailUrl, onClick}) => (
    <div
        style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            cursor: "pointer",
            marginLeft: 20,
        }}
        onClick={onClick}
        title="Podgląd arkusza"
    >
    <span style={{marginBottom: 6, fontSize: 12, color: "#333"}}>
      Miniatura arkusza
    </span>
        <img
            src={thumbnailUrl}
            alt="Miniatura arkusza"
            style={{
                width: 80,
                height: 80,
                objectFit: "cover",
                border: "3px solid #4a90e2",
                borderRadius: 6,
            }}
        />
    </div>
);

export default SheetMinature;
