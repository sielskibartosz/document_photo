import React, { useEffect, useCallback, useRef, useState } from "react";
import { cmToPx, createImage } from "../utils/cropImage.js";
import { PAPER_FORMATS } from "../constants/paperFormats";
import FrameBox from "../styles/imagesStyles";
import { Box, Typography, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { BACKEND_URL } from "../constants/backendConfig";
import apiFetch from "../utils/apiFetch";
import HintBubble from "./HintBubble";

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
  const [showHint, setShowHint] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const previewUrlRef = useRef(null);

  const dpi = 300;
  const margin = 20;
  const photoWidthCm = 3.5;
  const maxPhotoHeightCm = 4.5;

  const generateSheet = useCallback(async () => {
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

    const baseImgWidth = Math.round(cmToPx(photoWidthCm, dpi));
    const cols = Math.floor((widthPx + margin) / (baseImgWidth + margin));

    let currentY = margin;
    let currentRowHeight = 0;
    let colIndex = 0;
    let actualCount = 0;

    for (let i = 0; i < sheetImages.length; i++) {
      const { image, aspectRatio } = sheetImages[i];
      let img;
      try {
        img = await createImage(image);
      } catch {
        continue;
      }

      let currentImgWidth = baseImgWidth;
      let currentImgHeight = Math.round(currentImgWidth / aspectRatio);

      const maxHeightPx = Math.round(cmToPx(maxPhotoHeightCm, dpi));
      if (currentImgHeight > maxHeightPx) {
        currentImgHeight = maxHeightPx;
        currentImgWidth = Math.round(currentImgHeight * aspectRatio);
      }

      const x = margin + colIndex * (baseImgWidth + margin);
      const y = currentY;

      if (y + currentImgHeight + margin > heightPx) break;

      ctx.drawImage(img, x, y, currentImgWidth, currentImgHeight);
      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, currentImgWidth, currentImgHeight);

      actualCount++;
      currentRowHeight = Math.max(currentRowHeight, currentImgHeight);

      colIndex++;
      if (colIndex >= cols) {
        colIndex = 0;
        currentY += currentRowHeight + margin;
        currentRowHeight = 0;
      }
    }

    const blob = await new Promise((resolve) => canvas.toBlob(resolve));
    return { blob, visibleCount: actualCount };
  }, [sheetImages, selectedFormat]);

  const createSheetImage = useCallback(async () => {
    try {
      const result = await generateSheet();

      if (result && result.blob) {
        const url = URL.createObjectURL(result.blob);
        if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
        previewUrlRef.current = url;
        setSheetUrl(url);
        setVisibleCount(result.visibleCount);
      } else {
        if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
        previewUrlRef.current = null;
        setSheetUrl(null);
        setVisibleCount(0);
      }
    } catch {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
      setSheetUrl(null);
      setVisibleCount(0);
    }
  }, [generateSheet, setSheetUrl]);

  useEffect(() => {
    const seen = localStorage.getItem("sheetHintSeen");

    if (sheetImages.length === 1 && !seen) {
      setShowHint(true);
      localStorage.setItem("sheetHintSeen", "true");
    }
  }, [sheetImages]);

  useEffect(() => {
    if (sheetImages.length > 0) createSheetImage();
    else {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
      setSheetUrl(null);
    }
  }, [sheetImages, createSheetImage, setSheetUrl]);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    };
  }, []);

  const getGAClientId = useCallback(async () => {
    if (typeof window === "undefined") return null;

    const gaCookie = document.cookie.match(/(_ga_[A-Z0-9]+)=([^;]+)/);

    if (gaCookie) {
      const parts = gaCookie[2].split(".");
      return parts.slice(-2).join(".");
    }

    if (window.gtag) {
      return new Promise((resolve) => {
        window.gtag("get", "G-4GGMXV1R1V", "client_id", (clientId) => {
          resolve(clientId);
        });
      });
    }

    return null;
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(
      window.location.search || window.location.hash.split("?")[1]
    );

    const gclidParam = params.get("gclid");

    if (gclidParam) {
      localStorage.setItem("gclid", gclidParam);
      console.log("gclid stored:", gclidParam);
    }
  }, []);

  const onClearSheetClick = () => {
    if (clearSheet) clearSheet();
    else setSheetImages([]);
  };

  const duplicateImage = () => {
    if (!sheetImages.length) return;

    setSheetImages((prev) => [...prev, prev[prev.length - 1]]);
    setShowHint(false);
  };

  const handleDownloadClick = async () => {
    if (!sheetImages.length) return;

    try {
      setIsUploading(true);
      const { blob } = await generateSheet();

      if (!blob) {
        alert("Nie udało się wygenerować arkusza.");
        return;
      }

      const formData = new FormData();
      formData.append("image", blob, "photo_sheet.jpg");

      const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      let downloadResp = null;
      const maxAttempts = 2;
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          downloadResp = await apiFetch(
            `${BACKEND_URL}/api/download/create`,
            {
              method: "POST",
              body: formData,
            }
          );
          break;
        } catch (err) {
          if (attempt === maxAttempts) throw err;
          await sleep(600);
        }
      }

      if (!downloadResp.ok) {
        const errorText = await downloadResp.text();
        alert("Błąd backendu:\n" + errorText);
        return;
      }

      const { token } = await downloadResp.json();

      let ga_client_id = null;

      if (localStorage.getItem("cookiesAccepted") === "true") {
        ga_client_id = await getGAClientId();
      }

      const gclid = localStorage.getItem("gclid");

      let redirect_url = `${window.location.origin}/#/download-success?token=${token}`;

      if (gclid) {
        redirect_url += `&gclid=${encodeURIComponent(gclid)}`;
      }

      const paymentResp = await apiFetch(
        `${BACKEND_URL}/api/payments/create-link`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            price_id: priceId,
            token,
            redirect_url,
            ga_client_id,
            gclid: gclid || null,
          }),
        }
      );

      const paymentData = await paymentResp.json();

      if (paymentData.url === "ADMIN_BYPASS") {
        window.location.href = redirect_url;
        return;
      }

      window.location.href = paymentData.url;
    } catch (err) {
      console.error(err);
      const msg = String(err?.message || "");
      if (msg.includes("HTTP 413")) {
        alert("Plik jest zbyt duży do wysłania. Spróbuj ponownie lub skontaktuj się z supportem.");
      } else {
        alert("Nie udało się utworzyć linku płatności.");
      }
    } finally {
      setIsUploading(false);
    }
  };

  if (!showSheetPreview || !sheetUrl) return null;

  return (
    <>
      <HintBubble open={showHint} onClose={() => setShowHint(false)} />

      <FrameBox
        sx={{
          maxWidth: "none",
          width: { xs: "90%", md: "50%" },
          mx: "auto",
        }}
      >
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
          }}
        >
          <Button variant="contained" onClick={duplicateImage}>
            {t("duplicate_photo", "Duplicate Photo")}
          </Button>

          <Button variant="outlined" color="error" onClick={onClearSheetClick}>
            {t("clear_sheet", "Clear Sheet")}
          </Button>

          <Button variant="contained" color="success" onClick={handleDownloadClick} disabled={isUploading}>
            {isUploading ? t("uploading", "Wysyłam...") : t("download_sheet", "Download Sheet")}
          </Button>
        </Box>

        <Box
          component="img"
          src={sheetUrl}
          alt="sheet"
          sx={{
            maxWidth: { xs: "100%", md: "90%" },
            borderRadius: 2,
            boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
            border: "1px solid #ddd",
            display: "block",
            mx: "auto",
          }}
        />
      </FrameBox>
    </>
  );
};

export default SheetManager;
