import React, { useCallback, useState } from "react";
import CropperWrapper from "./CropperWrapper";
import { Button, Box, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
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
  onClear, // funkcja resetująca w rodzicu
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

  const handleClear = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1.9);
    onCropped(null);
    if (onClear) onClear();
  };

  return (
    <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          gap={1}
          position="relative"
          width="fit-content"
        >
          <Button
            variant="contained"
            color="primary"
            onClick={handleCrop}
            size="large"
            sx={{ fontWeight: 600 }}
          >
            {t("crop_photo")}
          </Button>

          {onClear && (
            <Box position="absolute" right={-50}>
              <IconButton color="primary" onClick={handleClear}>
                <DeleteIcon />
              </IconButton>
            </Box>
          )}
        </Box>

  );
};

export default CropperActions;
