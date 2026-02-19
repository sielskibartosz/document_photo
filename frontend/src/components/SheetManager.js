import React, { useEffect, useCallback, useState } from "react";
import { cmToPx, createImage } from "../utils/cropImage.js";
import { PAPER_FORMATS } from "../constants/paperFormats";
import FrameBox from "../styles/imagesStyles";
import { Box, Typography, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { BACKEND_URL } from "../constants/backendConfig";
import apiFetch from "../utils/apiFetch";

const SheetManager = ({
  sheetImages,
  selectedFormat,
  sheetUrl,
  setSheetUrl,
  setSheetImages,
  showSheetPreview,
  clearSheet,
  priceId,
}) => {
  const { t } = useTranslation();
  const [visibleCount, setVisibleCount] = useState(0);

  const dpi = 300;
  const margin = 20;
  const photoWidthCm = 3.5;
  const maxPhotoHeightCm = 4.5;

  // ---------------- GENERATE SHEET ----------------
  const generateSheet = async () => {
    if (!sheetImages.length) return { blob: null, visibleCount: 0 };

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
      if (!img) continue;

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
      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;
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

    const blob = await new Promise((resolve) => canvas.toBlob(resolve));
    return { blob, visibleCount: actualCount };
  };

  // ---------------- CREATE SHEET IMAGE ----------------
  const createSheetImage = useCallback(async () => {
    const result = await generateSheet();
    if (result && result.blob) {
      const url = URL.createObjectURL(result.blob);
      setSheetUrl(url);
      setVisibleCount(result.visibleCount);
    } else {
      setSheetUrl(null);
      setVisibleCount(0);
    }
  }, [sheetImages, selectedFormat, setSheetUrl]);

  useEffect(() => {
    if (sheetImages.length > 0) createSheetImage();
    else setSheetUrl(null);
  }, [sheetImages, createSheetImage]);

  // ---------------- BUTTON HANDLERS ----------------
  const onClearSheetClick = () => {
    if (clearSheet) clearSheet();
    else setSheetImages([]);
  };

  const duplicateImage = () => {
    if (!sheetImages.length) return;
    setSheetImages((prev) => [...prev, prev[0]]);
  };

  // ---------------- HANDLE PAYMENT ----------------
// ---------------- HANDLE PAYMENT ----------------
const handleDownloadClick = async () => {
  if (!sheetImages.length) return;

  try {
    // 1️⃣ Generowanie arkusza i konwersja na base64
    const { blob } = await generateSheet();
    if (!blob) {
      alert("Nie udało się wygenerować arkusza.");
      return;
    }

    const base64Image = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

    // 2️⃣ Wysyłamy do /api/download/create
    const downloadResp = await apiFetch(`${BACKEND_URL}/api/download/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image_base64: base64Image }),
    });

    if (!downloadResp.ok) {
      const errorText = await downloadResp.text();
      console.error("Błąd /download/create:", downloadResp.status, errorText);
      alert("Błąd backendu przy tworzeniu tokena:\n" + errorText);
      return;
    }

    const downloadData = await downloadResp.json();
    const token = downloadData.token;

    // 3️⃣ Wywołujemy Stripe link
    const redirect_url = `${window.location.origin}/#/download-success?token=${token}`;
    const bodyData = { price_id: priceId, token, redirect_url };
    console.log("💡 Sending to /create-link:", bodyData);

    const paymentResp = await apiFetch(`${BACKEND_URL}/api/payments/create-link`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyData),
    });

    console.log("💡 /create-link status:", paymentResp.status);
    const responseText = await paymentResp.text();
    console.log("💡 /create-link raw response:", responseText);

    if (!paymentResp.ok) {
      alert("Błąd backendu przy tworzeniu linku płatności:\n" + responseText);
      return; // ❌ zatrzymujemy redirect
    }

    const paymentData = JSON.parse(responseText);
    console.log("💡 /create-link parsed response:", paymentData);

    // ADMIN BYPASS
    if (paymentData.url === "ADMIN_BYPASS") {
      window.location.href = `${window.location.origin}/#/download-success?token=${token}`;
      return;
    }

    // 💳 Normalny Stripe flow
    if (!paymentData.url) {
      alert("Brak URL do przekierowania ze Stripe.");
      return;
    }

    window.location.href = paymentData.url;

  } catch (err) {
    console.error("Błąd przy tworzeniu linku płatności:", err);
    alert(err.message || "Nie udało się utworzyć linku płatności.");
  }
};



  // ---------------- RENDER ----------------
  if (!showSheetPreview || !sheetUrl) return null;

  return (
    <FrameBox sx={{ maxWidth: "none", width: { xs: "90%", md: "70%" }, mx: "auto" }}>
      <Typography variant="h6" fontWeight={600} color="text.primary" mb={2} textAlign="center">
        {t("sheet_header")}: {visibleCount} ({selectedFormat})
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 2, flexWrap: "wrap", mb: 3 }}>
        <Button variant="contained" onClick={duplicateImage}>{t("duplicate_photo", "Duplicate Photo")}</Button>
        <Button variant="outlined" color="error" onClick={onClearSheetClick}>{t("clear_sheet", "Clear Sheet")}</Button>
        <Button variant="contained" color="success" onClick={handleDownloadClick}>{t("download_sheet", "Download Sheet")}</Button>
      </Box>

      <Box
        component="img"
        src={sheetUrl}
        alt="sheet"
        sx={{ maxWidth: "100%", borderRadius: 2, boxShadow: "0 4px 16px rgba(0,0,0,0.1)", border: "1px solid #ddd", display: "block", mx: "auto" }}
      />
    </FrameBox>
  );
};

export default SheetManager;
