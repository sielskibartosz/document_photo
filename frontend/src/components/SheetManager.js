import React, { useEffect, useCallback } from "react";
import { cmToPx, createImage } from "../utils/cropImage.js";
import { PAPER_FORMATS } from "../constants/paperFormats";
import FrameBox from "../styles/imagesStyles";
import { Box, Typography, Button } from "@mui/material";
import { useTranslation } from "react-i18next";

const SheetManager = ({
  sheetImages,
  selectedFormat,
  sheetUrl,
  setSheetUrl,
  setThumbnailUrl,
  setSheetImages,
  showSheetPreview,
  clearSheet,
}) => {
  const { t } = useTranslation();

  const dpi = 300;
  const margin = 20;
  const photoWidthCm = 3.5;
  const maxPhotoHeightCm = 4.5;

  const generateSheet = async () => {
    if (sheetImages.length === 0) return null;

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

      // Jeśli zdjęcie wykracza poza arkusz, przerywamy
      if (y + imgHeight + margin > heightPx) break;

      ctx.drawImage(img, x, y, imgWidth, imgHeight);
      ctx.lineWidth = 2;
      ctx.strokeStyle = "black";
      ctx.strokeRect(x, y, imgWidth, imgHeight);

      if (imgHeight > currentRowHeight) currentRowHeight = imgHeight;
      colIndex++;
      if (colIndex >= cols) {
        colIndex = 0;
        currentY += currentRowHeight + margin;
        currentRowHeight = 0;
      }
    }

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          const url = URL.createObjectURL(blob);
          resolve(url);
        },
        "image/jpeg",
        0.92
      );
    });
  };

  const createSheetImage = useCallback(async () => {
    const url = await generateSheet();
    if (url) {
      setSheetUrl(url);
      setThumbnailUrl(url); // miniatura aktualizowana od razu
    }
  }, [sheetImages, selectedFormat, setSheetUrl, setThumbnailUrl]);

  useEffect(() => {
    if (sheetImages.length > 0) {
      createSheetImage();
    } else {
      setSheetUrl(null);
      setThumbnailUrl(null);
    }
  }, [sheetImages, createSheetImage]);

  const downloadSheet = () => {
    if (!sheetUrl) return;
    const link = document.createElement("a");
    link.href = sheetUrl;
    link.download = `sheet_${selectedFormat}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const onClearSheetClick = () => {
    if (clearSheet) clearSheet();
    else {
      setSheetImages([]);
      setSheetUrl(null);
      setThumbnailUrl(null);
    }
  };

  // ---------------- Duplicate Photo z ograniczeniem miejsca ----------------
  const duplicateImage = () => {
    if (sheetImages.length === 0) return;

    const format = PAPER_FORMATS[selectedFormat];
    const widthPx = Math.round(cmToPx(format.width, dpi));
    const heightPx = Math.round(cmToPx(format.height, dpi));

    let imgWidth = Math.round(cmToPx(photoWidthCm, dpi));
    const cols = Math.floor((widthPx + margin) / (imgWidth + margin));

    let currentY = margin;
    let currentRowHeight = 0;
    let colIndex = 0;

    for (let i = 0; i < sheetImages.length; i++) {
      const { aspectRatio } = sheetImages[i];
      let imgHeight = Math.round(imgWidth / aspectRatio);
      const maxHeightPx = Math.round(cmToPx(maxPhotoHeightCm, dpi));
      if (imgHeight > maxHeightPx) imgHeight = maxHeightPx;

      if (imgHeight > currentRowHeight) currentRowHeight = imgHeight;
      colIndex++;
      if (colIndex >= cols) {
        colIndex = 0;
        currentY += currentRowHeight + margin;
        currentRowHeight = 0;
      }
    }

    // Obliczamy wysokość nowego zdjęcia
    const nextHeight = Math.round(imgWidth / sheetImages[0].aspectRatio);
    if (currentY + nextHeight + margin > heightPx) return; // brak miejsca

    // Dodajemy duplikat tylko jeśli zmieści się na arkuszu
    setSheetImages((prev) => [...prev, prev[0]]);
  };
  // ---------------------------------------------------------------------------

  if (!showSheetPreview || !sheetUrl) return null;

  return (
    <FrameBox sx={{ maxWidth: "none", width: { xs: "90%", md: "70%" }, mx: "auto" }}>
      <Typography variant="h6" fontWeight={600} color="text.primary" mb={2} textAlign="center">
        {t("sheet_header")}: {sheetImages.length} ({selectedFormat})
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 2, flexWrap: "wrap", mb: 3, width: "100%" }}>
        <Button variant="contained" onClick={duplicateImage} sx={{ fontWeight: 600 }}>
          {t("duplicate_photo", "Duplicate Photo")}
        </Button>
        <Button variant="outlined" color="error" onClick={onClearSheetClick} sx={{ fontWeight: 600 }}>
          {t("clear_sheet", "Clear Sheet")}
        </Button>
        <Button variant="contained" color="success" onClick={downloadSheet} sx={{ fontWeight: 600 }}>
          {t("download_sheet", "Download Sheet")}
        </Button>
      </Box>

      <Box
        component="img"
        src={sheetUrl}
        alt="sheet"
        sx={{ maxWidth: "100%", borderRadius: 2, boxShadow: "0 4px 16px rgba(0,0,0,0.1)", border: "1px solid #ddd", display: "block", margin: "0 auto" }}
      />
    </FrameBox>
  );
};

export default SheetManager;
