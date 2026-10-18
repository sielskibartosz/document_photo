// CropperPanel.js
import React, { useCallback, useState, useEffect, useRef } from "react";
import { Box, Button, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTranslation } from "react-i18next";
import CropperWrapper from "./CropperWrapper";
import { getCroppedImg, cmToPx, DPI } from "../utils/cropImage";
import { BACKEND_URL } from "../constants/backendConfig";

export default function CropperPanel({
  imageSrc,
  crop,
  setCrop,
  zoom,
  setZoom,
  aspectRatio,
  sizeMm,
  isSizeValid = true,
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
  const abortRef = useRef(null);
  const imageSrcRef = useRef(imageSrc);
  imageSrcRef.current = imageSrc;

  // przerwij trwające usuwanie tła przy odmontowaniu (zmiana zakładki, usunięcie zdjęcia)
  useEffect(() => () => abortRef.current?.abort(), []);

  const onCropComplete = useCallback((_, areaPixels) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  // Simulate progress bar
  useEffect(() => {
    if (!loading) {
      setLoadingProgress(0);
      return;
    }
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 2;
      if (progress >= 100) progress = 99;
      setLoadingProgress(Math.floor(progress));
    }, 300);
    return () => clearInterval(interval);
  }, [loading]);

  const hexToRGBA = (hex) => {
    try {
      if (!hex.startsWith("#")) return [239, 248, 246, 255]; // default
      let r, g, b;
      if (hex.length === 7) {
        r = parseInt(hex.slice(1, 3), 16);
        g = parseInt(hex.slice(3, 5), 16);
        b = parseInt(hex.slice(5, 7), 16);
      } else if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
      } else {
        return [239, 248, 246, 255];
      }
      return [r, g, b, 255];
    } catch (e) {
      return [239, 248, 246, 255];
    }
  };

  // Kadr w docelowej rozdzielczości druku (300 DPI), żeby zdjęcie na arkuszu nie było skalowane w górę
  const getPrintSize = () => ({
    width: cmToPx(sizeMm.widthMm / 10, DPI),
    height: cmToPx(sizeMm.heightMm / 10, DPI),
  });

  const handleCropAndRemoveBg = async () => {
    if (!imageSrc || !croppedAreaPixels || !isSizeValid) return;
    const requestSrc = imageSrc;
    const controller = new AbortController();
    abortRef.current?.abort();
    abortRef.current = controller;
    setLoading(true);
    let croppedUrl = null;
    try {
      const { width, height } = getPrintSize();
      croppedUrl = await getCroppedImg(imageSrc, croppedAreaPixels, width, height);
      const blob = await (await fetch(croppedUrl)).blob();

      const formData = new FormData();
      formData.append("image", blob, "cropped.png");
      formData.append("bg_color", JSON.stringify(hexToRGBA(bgColor)));

      const response = await fetch(`${BACKEND_URL}/remove-background/`, {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(t("remove_bg_error", "Błąd przy usuwaniu tła"));
      }

      const resultBlob = await response.blob();
      // użytkownik w międzyczasie usunął / zmienił zdjęcie - wynik jest nieaktualny
      if (controller.signal.aborted || imageSrcRef.current !== requestSrc) return;

      const objectUrl = URL.createObjectURL(resultBlob);
      setNoBgImage(objectUrl);
      if (onAddToSheet) onAddToSheet(objectUrl);
    } catch (error) {
      if (error.name !== "AbortError" && !controller.signal.aborted) alert(error.message);
    } finally {
      if (croppedUrl) URL.revokeObjectURL(croppedUrl);
      if (abortRef.current === controller) {
        abortRef.current = null;
        setLoading(false);
      }
    }
  };

  const handleAddWithBg = async () => {
    if (!imageSrc || !croppedAreaPixels || !isSizeValid) return;
    try {
      const { width, height } = getPrintSize();
      const cropped = await getCroppedImg(imageSrc, croppedAreaPixels, width, height);
      if (onAddToSheet) onAddToSheet(cropped);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleClear = () => {
    abortRef.current?.abort();
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
        <Button
          variant="contained"
          onClick={handleCropAndRemoveBg}
          disabled={loading || !isSizeValid}
          sx={{ fontWeight: 500, width: 220 }}
        >
          {loading ? `${t("removing_bg")}${loadingProgress}%` : t("crop_and_remove")}
        </Button>

        {activeTab === "custom" && (
          <Button
            variant="contained"
            onClick={handleAddWithBg}
            disabled={loading || !isSizeValid}
            sx={{ fontWeight: 500, width: 220 }}
          >
            {t("add_with_bg")}
          </Button>
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
    </Box>
  );
}
