import React, { useEffect, useCallback, useState } from "react";
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
  setSheetImages,
  showSheetPreview,
  clearSheet,
}) => {
  const { t } = useTranslation();
  const [visibleCount, setVisibleCount] = useState(0);

  const dpi = 300;
  const margin = 20;
  const photoWidthCm = 3.5;
  const maxPhotoHeightCm = 4.5;

  const generateSheet = async () => {
    if (!sheetImages.length) return { url: null, visibleCount: 0 };

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
        resolve({ url, visibleCount: actualCount });
      }, "image/jpeg", 0.92);
    });
  };

  const createSheetImage = useCallback(async () => {
    const result = await generateSheet();
    if (result && result.url) {
      setSheetUrl(result.url);
      setVisibleCount(result.visibleCount);
    } else {
      setSheetUrl(null);
      setVisibleCount(0);
    }
  }, [sheetImages, selectedFormat, setSheetUrl]);

  useEffect(() => {
    if (sheetImages.length > 0) {
      createSheetImage();
    } else {
      setSheetUrl(null);
      setVisibleCount(0);
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
      setVisibleCount(0);
    }
  };

  const duplicateImage = () => {
    if (!sheetImages.length) return;

    const format = PAPER_FORMATS[selectedFormat];
    const widthPx = Math.round(cmToPx(format.width, dpi));
    const heightPx = Math.round(cmToPx(format.height, dpi));
    const imgWidth = Math.round(cmToPx(photoWidthCm, dpi));
    const cols = Math.floor((widthPx + margin) / (imgWidth + margin));

    let currentY = margin;
    let currentRowHeight = 0;
    let colIndex = 0;

    for (let i = 0; i < sheetImages.length; i++) {
      const imgHeight = Math.min(Math.round(imgWidth / sheetImages[i].aspectRatio), Math.round(cmToPx(maxPhotoHeightCm, dpi)));
      currentRowHeight = Math.max(currentRowHeight, imgHeight);
      colIndex++;
      if (colIndex >= cols) {
        colIndex = 0;
        currentY += currentRowHeight + margin;
        currentRowHeight = 0;
      }
    }

    const nextHeight = Math.min(Math.round(imgWidth / sheetImages[0].aspectRatio), Math.round(cmToPx(maxPhotoHeightCm, dpi)));
    if (currentY + nextHeight + margin <= heightPx) {
      setSheetImages(prev => [...prev, prev[0]]);
    }
  };

  if (!showSheetPreview || !sheetUrl) return null;

  return (
    <FrameBox sx={{ maxWidth: "none", width: { xs: "90%", md: "70%" }, mx: "auto" }}>
      <Typography variant="h6" fontWeight={600} color="text.primary" mb={2} textAlign="center">
        {t("sheet_header")}: {visibleCount} ({selectedFormat})
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 2, flexWrap: "wrap", mb: 3, width: "100%" }}>
        <Button variant="contained" onClick={duplicateImage} sx={{ fontWeight: 500 }}>
          {t("duplicate_photo", "Duplicate Photo")}
        </Button>
        <Button variant="outlined" color="error" onClick={onClearSheetClick} sx={{ fontWeight: 500 }}>
          {t("clear_sheet", "Clear Sheet")}
        </Button>
        <Button variant="contained" color="success" onClick={downloadSheet} sx={{ fontWeight: 500 }}>
          {t("download_sheet", "Download Sheet")}
        </Button>
      </Box>

      <Box
        component="img"
        src={sheetUrl}
        alt="sheet"
        sx={{ maxWidth: "100%", width: { xs: "100%", md: "auto" }, borderRadius: 2, boxShadow: "0 4px 16px rgba(0,0,0,0.1)", border: "1px solid #ddd", display: "block", mx: "auto" }}
      />
    </FrameBox>
  );
};

export default SheetManager;
