import React from "react";
import Cropper from "react-easy-crop";

function CropperWrapper({ imageSrc, crop, setCrop, zoom, setZoom, aspectRatio, onCropComplete }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h4 style={{ marginBottom: 8 }}>Przytnij dodane zdjęcie</h4>
        <div
        style={{
          position: "relative",
          width: 300,
          height: 400,
          margin: "0 auto",
          background: "#f0f0f0",
        }}
      >
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={aspectRatio}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
          cropShape="rect"
          showGrid={true}
        />
      </div>

      <div style={{ marginTop: 16 }}>
        <label htmlFor="zoom" style={{ marginRight: 8 }}>
          Powiększenie:
        </label>
        <input
          id="zoom"
          type="range"
          min={1}
          max={3}
          step={0.01}
          value={zoom}
          onChange={(e) => setZoom(parseFloat(e.target.value))}
          style={{ width: 200 }}
        />
      </div>
    </div>
  );
}

export default CropperWrapper;
