import React, { useCallback, useState } from "react";
import { Box, Button, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTranslation } from "react-i18next";
import CropperWrapper from "./CropperWrapper";
import ImagePreview from "./ImagePreview";
import { getCroppedImg } from "../utils/cropImage";

function CropperActions({
  imageSrc,
  crop,
  setCrop,
  zoom,
  setZoom,
  aspectRatio,
  onCropped,
  onClear,
}) {
  const { t } = useTranslation();
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [preview, setPreview] = useState(null);

  const onCropComplete = useCallback((_, areaPixels) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  const handleCrop = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    const width = 350;
    const height = width / aspectRatio;
    const cropped = await getCroppedImg(
      imageSrc,
      croppedAreaPixels,
      width,
      height
    );
    setPreview(cropped); // podgląd przyciętego zdjęcia
    onCropped(cropped);
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
      {/* Podgląd jeśli jest */}
      <ImagePreview image={preview} aspectRatio={aspectRatio} />

      {/* Sam cropper */}
      <CropperWrapper
        imageSrc={imageSrc}
        crop={crop}
        setCrop={setCrop}
        zoom={zoom}
        setZoom={setZoom}
        aspectRatio={aspectRatio}
        onCropComplete={onCropComplete}
      />

      {/* Przyciski */}
      <Box display="flex" justifyContent="center" alignItems="center" gap={1}>
        <Button
          variant="contained"
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
}

export default CropperActions;
