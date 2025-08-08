import React, { useCallback, useState } from "react";
import CropperWrapper from "./CropperWrapper";
import { Button, Box } from "@mui/material";
import { getCroppedImg } from "../utils/cropImage";

const CropperActions = ({
  imageSrc,
  crop,
  setCrop,
  zoom,
  setZoom,
  aspectRatio,
  onCropped,
}) => {
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((_, areaPixels) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  const handleCrop = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    const width = 350;
    const height = width / aspectRatio;
    const cropped = await getCroppedImg(imageSrc, croppedAreaPixels, width, height);
    onCropped(cropped);
  };

  return (
    <Box sx={{ mt: 3, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
      <CropperWrapper
        imageSrc={imageSrc}
        crop={crop}
        setCrop={setCrop}
        zoom={zoom}
        setZoom={setZoom}
        aspectRatio={aspectRatio}
        onCropComplete={onCropComplete}
        label="Przycinanie"
      />
      <Button variant="contained" color="primary" onClick={handleCrop} size="large">
        Przytnij zdjęcie
      </Button>
    </Box>
  );
};

export default CropperActions;
