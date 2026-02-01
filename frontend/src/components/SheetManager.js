import React, { useEffect, useCallback, useState } from "react";
import { cmToPx, createImage } from "../utils/cropImage.js";
import { PAPER_FORMATS } from "../constants/paperFormats";
import FrameBox from "../styles/imagesStyles";
import { Box, Typography, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { BACKEND_URL } from "../constants/backendConfig";

const SheetManager = ({
  sheetImages,
  selectedFormat,
  sheetUrl,
  setSheetUrl,
  setSheetImages,
  showSheetPreview,
  clearSheet,
}) => {
  const { t } = useTranslation();
  const [visibleCount, setVisibleCount] = useState(0);
  const [sheetBlob, setSheetBlob] = useState(null);

  const dpi = 300;
  const margin = 20;
  const photoWidthCm = 3.5;
  const maxPhotoHeightCm = 4.5;

  // --- Generowanie arkusza ---
  const generateSheet = async () => {
    if (!sheetImages.length) return { url: null, visibleCount: 0, blob: null };
    const format = PAPER_FORMATS[selectedFormat];
    const widthPx = Math.round(cmToPx(format.width, dpi));
    const heightPx = Math.round(cmToPx(format.height, dpi));
    const canvas = document.createElement("canvas");
    canvas.width = widthPx;
    canvas.height = heightPx;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, widthPx, heightPx);

    let imgWidth = Math.round(cmToPx(photoWidthCm, dpi));
    const cols = Math.floor((widthPx + margin) / (imgWidth + margin));
    let currentY = margin;
    let currentRowHeight = 0;
    let colIndex = 0;
    let actualCount = 0;

    for (let i = 0; i < sheetImages.length; i++) {
      const { image, aspectRatio } = sheetImages[i];
      const img = await createImage(image);
      let imgHeight = Math.round(imgWidth / aspectRatio);
      const maxHeightPx = Math.round(cmToPx(maxPhotoHeightCm, dpi));
      if (imgHeight > maxHeightPx) {
        imgHeight = maxHeightPx;
        imgWidth = Math.round(imgHeight * aspectRatio);
      }
      const x = margin + colIndex * (imgWidth + margin);
      const y = currentY;
      if (y + imgHeight + margin > heightPx) break;
      ctx.drawImage(img, x, y, imgWidth, imgHeight);
      ctx.lineWidth = 2;
      ctx.strokeStyle = "black";
      ctx.strokeRect(x, y, imgWidth, imgHeight);
      actualCount++;
      currentRowHeight = Math.max(currentRowHeight, imgHeight);
      colIndex++;
      if (colIndex >= cols) {
        colIndex = 0;
        currentY += currentRowHeight + margin;
        currentRowHeight = 0;
      }
    }

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        resolve({ url, visibleCount: actualCount, blob });
      }, "image/jpeg", 0.92);
    });
  };

  const createSheetImage = useCallback(async () => {
    const result = await generateSheet();
    if (result && result.url) {
      setSheetUrl(result.url);
      setVisibleCount(result.visibleCount);
      setSheetBlob(result.blob);
    } else {
      setSheetUrl(null);
      setVisibleCount(0);
      setSheetBlob(null);
    }
  }, [sheetImages, selectedFormat, setSheetUrl]);

  useEffect(() => {
    if (sheetImages.length > 0) {
      createSheetImage();
    } else {
      setSheetUrl(null);
      setVisibleCount(0);
      setSheetBlob(null);
    }
  }, [sheetImages, createSheetImage]);

  // --- Czyszczenie arkusza ---
  const onClearSheetClick = () => {
    if (clearSheet) clearSheet();
    else {
      setSheetImages([]);
      setSheetUrl(null);
      setVisibleCount(0);
      setSheetBlob(null);
    }
  };

  // --- Duplikowanie pierwszego zdjęcia ---
  const duplicateImage = () => {
    if (!sheetImages.length) return;
    setSheetImages((prev) => [...prev, prev[0]]);
  };

  // --- Wyślij arkusz do backendu i otwórz Stripe ---
  const handleDownloadClick = async () => {
      if (!sheetUrl) return;

      const result = await generateSheet();
      if (!result || !result.blob) return;

      // Wyślij blob do backendu
      const formData = new FormData();
        formData.append("sheet", result.blob, `sheet_${selectedFormat}.jpg`);

        try {
          const response = await fetch(`${BACKEND_URL}/save-sheet`, {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error("Failed to save sheet on backend");
          }

          // Wszystko OK → przekieruj do Stripe w tej samej karcie
          const stripeLink = "https://buy.stripe.com/fZu28qdDZ5Si78rboB63K00";
          window.location.href = stripeLink;

        } catch (err) {
          console.error("Error:", err);
        }
  };


  if (!showSheetPreview || !sheetUrl) return null;

  return (
    <FrameBox sx={{ maxWidth: "none", width: { xs: "90%", md: "70%" }, mx: "auto" }}>
      <Typography variant="h6" fontWeight={600} color="text.primary" mb={2} textAlign="center">
        {t("sheet_header")}: {visibleCount} ({selectedFormat})
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          flexWrap: "wrap",
          mb: 3,
          width: "100%",
        }}
      >
        <Button variant="contained" onClick={duplicateImage} sx={{ fontWeight: 500 }}>
          {t("duplicate_photo", "Duplicate Photo")}
        </Button>
        <Button variant="outlined" color="error" onClick={onClearSheetClick} sx={{ fontWeight: 500 }}>
          {t("clear_sheet", "Clear Sheet")}
        </Button>
        <Button variant="contained" color="success" onClick={handleDownloadClick} sx={{ fontWeight: 500 }}>
          {t("download_sheet", "Download Sheet")}
        </Button>
      </Box>

      <Box
        component="img"
        src={sheetUrl}
        alt="sheet"
        sx={{
          maxWidth: "100%",
          width: { xs: "100%", md: "auto" },
          borderRadius: 2,
          boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
          border: "1px solid #ddd",
          display: "block",
          mx: "auto",
        }}
      />
    </FrameBox>
  );
};

export default SheetManager;
