import React from "react";
import Cropper from "react-easy-crop";

function CropperWrapper({ imageSrc, crop, setCrop, zoom, setZoom, aspectRatio, onCropComplete }) {
  return (
    <div style={{ position: "relative", width: 300, height: 400 }}>
      <Cropper
        image={imageSrc}
        crop={crop}
        zoom={zoom}
        aspect={aspectRatio}
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={onCropComplete}
      />
    </div>
  );
}

export default CropperWrapper;
