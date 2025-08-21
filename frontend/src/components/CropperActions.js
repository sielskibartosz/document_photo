import React, { useCallback, useState } from "react";
import { Box, Button, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTranslation } from "react-i18next";
import CropperWrapper from "./CropperWrapper";
import { getCroppedImg } from "../utils/cropImage";
import ImagePreview from "./ImagePreview";

const CropperActions = ({
  imageSrc,
  crop,
  setCrop,
  zoom,
  setZoom,
  aspectRatio,
  onCropped,
  onClear,
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
    <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
      {/* 🔥 Dodaj podgląd zdjęcia */}
      <ImagePreview image={imageSrc} aspectRatio={aspectRatio} />

      <CropperWrapper
        imageSrc={imageSrc}
        crop={crop}
        setCrop={setCrop}
        zoom={zoom}
        setZoom={setZoom}
        aspectRatio={aspectRatio}
        onCropComplete={onCropComplete}
      />

      <Box display="flex" justifyContent="center" alignItems="center" gap={1}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCrop}
          sx={{ fontWeight: 600 }}
        >
          {t("crop_image", "Przytnij zdjęcie")}
        </Button>

        {onClear && (
          <IconButton color="primary" onClick={onClear}>
            <DeleteIcon />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};

export default CropperActions;
