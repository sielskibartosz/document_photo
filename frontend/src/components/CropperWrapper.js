import React from "react";
import Cropper from "react-easy-crop";
import { Box, Typography, Slider, Paper } from "@mui/material";
import { useTranslation } from "react-i18next";

function CropperWrapper({
  imageSrc,
  crop,
  setCrop,
  zoom,
  setZoom,
  aspectRatio,
  onCropComplete,
}) {
  const { t } = useTranslation();

  return (
    <Box display="flex" flexDirection="column" alignItems="center" width="100%">
      {/* Ramka croppera */}
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: 360,
          aspectRatio: aspectRatio,
          backgroundColor: "#f5f1e6",
          overflow: "hidden",
          borderRadius: 2,
          position: "relative",
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
          showGrid
        />
      </Paper>

      {/* Slider powiększenia */}
      <Box sx={{ mt: 3, width: "90%" }}>
        <Typography variant="body2" gutterBottom>
          {t("zoom", "Powiększenie")}
        </Typography>
        <Slider
          value={zoom}
          min={1}
          max={3}
          step={0.01}
          onChange={(e, value) => setZoom(value)}
          valueLabelDisplay="auto"
        />
      </Box>
    </Box>
  );
}

export default CropperWrapper;
