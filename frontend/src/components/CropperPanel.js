// CropperPanel.js
import React, { useCallback, useState, useEffect } from "react";
import { Box, Button, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTranslation } from "react-i18next";
import CropperWrapper from "./CropperWrapper";
import { getCroppedImg } from "../utils/cropImage";
import ImagePreview from "./ImagePreview";
import { BACKEND_URL } from "../constants/backendConfig";

export default function CropperPanel({
  imageSrc,
  crop,
  setCrop,
  zoom,
  setZoom,
  aspectRatio,
  setNoBgImage,
  onAddToSheet,
  onClear,
  bgColor,
  activeTab,
}) {
  const { t } = useTranslation();
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [preview, setPreview] = useState(null);

  const onCropComplete = useCallback((_, areaPixels) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  // Symulowany licznik podczas loadingu
  useEffect(() => {
    if (!loading) {
      setLoadingProgress(0);
      return;
    }
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 3;
      if (progress >= 100) progress = 99;
      setLoadingProgress(Math.floor(progress));
    }, 300);
    return () => clearInterval(interval);
  }, [loading]);

  const dataURLtoBlob = (dataurl) => {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new Blob([u8arr], { type: mime });
  };

  const hexToRGBA = (hex) => {
  try {
    if (!hex.startsWith("#")) return [239,248,246,255]; // default kremowy
    let r,g,b;
    if (hex.length === 7) {
      r = parseInt(hex.slice(1,3),16);
      g = parseInt(hex.slice(3,5),16);
      b = parseInt(hex.slice(5,7),16);
    } else if (hex.length === 4) {
      r = parseInt(hex[1]+hex[1],16);
      g = parseInt(hex[2]+hex[2],16);
      b = parseInt(hex[3]+hex[3],16);
    } else {
      return [239,248,246,255]; // default
    }
    return [r,g,b,255];
  } catch(e) {
    return [239,248,246,255]; // default
  }
};


  const handleCropAndRemoveBg = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    setLoading(true);
    try {
      const width = 350;
      const height = width / aspectRatio;
      const cropped = await getCroppedImg(imageSrc, croppedAreaPixels, width, height);

      const blob = cropped.startsWith("data:")
        ? dataURLtoBlob(cropped)
        : await (await fetch(cropped)).blob();

      const formData = new FormData();
      formData.append("image", blob, "cropped.png");
      formData.append("bg_color", JSON.stringify(hexToRGBA(bgColor)));
      console.log("Sending bg color:", hexToRGBA(bgColor));


      const response = await fetch(`${BACKEND_URL}/remove-background/`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || t("remove_bg_error", "Błąd przy usuwaniu tła"));
      }

      const resultJson = await response.json();
      const imageData = resultJson.image;
      const byteCharacters = atob(imageData);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) byteNumbers[i] = byteCharacters.charCodeAt(i);
      const byteArray = new Uint8Array(byteNumbers);
      const objectUrl = URL.createObjectURL(new Blob([byteArray], { type: "image/png" }));

      setNoBgImage(objectUrl);
      if (onAddToSheet) onAddToSheet(objectUrl);

    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setPreview(null);
    setNoBgImage(null);
    if (onClear) onClear();
  };

  const renderButtons = () => (
    <Box sx={{ display: "flex", position: "relative", width: "100%", px: 2, mt: 1, mb: 2 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          margin: "0 auto",
          gap: 1,
        }}
      >
        {!preview ? (
          <>
            <Button
              variant="contained"
              onClick={handleCropAndRemoveBg}
              disabled={loading}
              sx={{ fontWeight: 500, width: 220 }}
            >
              {loading ? `${t("removing_bg")}${loadingProgress}%` : t("crop_and_remove")}
            </Button>

            {activeTab === "custom" && (
              <Button
                variant="contained"
                onClick={async () => {
                  if (!imageSrc || !croppedAreaPixels) return;
                  const width = 350;
                  const height = width / aspectRatio;
                  const cropped = await getCroppedImg(imageSrc, croppedAreaPixels, width, height);
                  if (onAddToSheet) onAddToSheet(cropped);
                }}
                sx={{ fontWeight: 500, width: 220 }}
              >
                {t("add_with_bg")}
              </Button>
            )}
          </>
        ) : (
          <>
            <Button
              variant="contained"
              onClick={() => onAddToSheet && onAddToSheet(preview)}
              sx={{ fontWeight: 500, width: 220 }}
            >
              {t("add_to_sheet")}
            </Button>

            {activeTab === "custom" && (
              <Button
                variant="outlined"
                onClick={() => onAddToSheet && onAddToSheet(imageSrc)}
                sx={{ fontWeight: 500, width: 220 }}
              >
                {t("add_without_bg", "Dodaj bez usuwania tła")}
              </Button>
            )}
          </>
        )}
      </Box>

      {onClear && (
        <IconButton
          color="primary"
          onClick={handleClear}
          sx={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}
        >
          <DeleteIcon />
        </IconButton>
      )}
    </Box>
  );

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={2} width="100%">
      <CropperWrapper
        imageSrc={imageSrc}
        crop={crop}
        setCrop={setCrop}
        zoom={zoom}
        setZoom={setZoom}
        aspectRatio={aspectRatio}
        onCropComplete={onCropComplete}
      />

      {renderButtons()}

      {preview && (
        <Box display="flex" flexDirection="column" alignItems="center" gap={2} width="100%">
          <ImagePreview image={preview} aspectRatio={aspectRatio} />
        </Box>
      )}
    </Box>
  );
}
