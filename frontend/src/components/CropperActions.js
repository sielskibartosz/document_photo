import React, { useCallback, useState } from "react";
import CropperWrapper from "./CropperWrapper";
import { Button, Box } from "@mui/material";
import { getCroppedImg } from "../utils/cropImage";
import { useTranslation } from "react-i18next";

const CropperActions = ({
  imageSrc,
  crop,
  setCrop,
  zoom,
  setZoom,
  aspectRatio,
  onCropped,
}) => {
  const { t } = useTranslation();
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
    <Box gap={2} mt={0}>
      <CropperWrapper
        imageSrc={imageSrc}
        crop={crop}
        setCrop={setCrop}
        zoom={zoom}
        setZoom={setZoom}
        aspectRatio={aspectRatio}
        onCropComplete={onCropComplete}
      />
      <Box display="flex" flexDirection="column" alignItems="center">
        <Button
          variant="contained"
          color="primary"
          onClick={handleCrop}
          size="large"
          sx={{ fontWeight: 600 }}
        >
          {t("crop_photo")}
        </Button>
      </Box>
    </Box>
  );
};

export default CropperActions;
