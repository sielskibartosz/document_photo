import React from "react";
import { Box, Button, Typography, ThemeProvider, CssBaseline, useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { darkTheme } from "../styles/theme";
import { useTranslation } from "react-i18next";
import SEO from "../components/SEO";
import FeedbackForm from "../components/FeedbackForm";
import { BACKEND_URL } from "../constants/backendConfig";

const DownloadSuccessPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isSmallScreen = useMediaQuery("(max-width:600px)");

const downloadFromBackend = async () => {
  const hash = window.location.hash;
    const queryString = hash.split("?")[1];
    const urlParams = new URLSearchParams(queryString);
    const token = urlParams.get("token");

  if (!token) return alert("Brak tokena pobierania.");

  try {
    const response = await fetch(`${BACKEND_URL}/api/download/${token}`);
    if (!response.ok) throw new Error("Błąd serwera");

    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "photo_sheet.jpg";
    link.click();
    // 🔥 KONWERSJA GOOGLE ADS
    if (window.gtag) {
      window.gtag('event', 'conversion', {
        send_to: 'AW-17550154396/_6-ECIjRr_kbEJy1yLBB',
        value: 7.0,
        currency: 'PLN',
        transaction_id: token
      });
    }
  } catch (err) {
    console.error(err);
    alert("Nie udało się pobrać pliku.");
  }
};

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <SEO title="Pobranie zakończone" description="Twoje zdjęcie jest gotowe do pobrania" url="/#/download-success" />
      <Box sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        textAlign: "center",
        pt: isSmallScreen ? 20 : 25,
        pb: 4,
        width: isSmallScreen ? "95vw" : "80vw",
        margin: "10px auto",
        borderRadius: 3,
        boxShadow: darkTheme.shadows[4],
        background:
          darkTheme.palette.mode === "dark"
            ? "linear-gradient(135deg, #1f2937 0%, #374151 100%)"
            : "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      }}>
        <Typography variant={isSmallScreen ? "h5" : "h4"} gutterBottom>{t("success_page.gratitude")}</Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>{t("success_page.not_downloaded")}</Typography>
        <Button variant="contained" onClick={downloadFromBackend} sx={{ mb: 2 }}>{t("success_page.download_btn")}</Button>
        <Button variant="outlined" onClick={() => navigate("/")} sx={{ mb: 2 }}>{t("success_page.main_page_btn")}</Button>
        <Box sx={{ mt: 4 }}><FeedbackForm /></Box>
      </Box>
    </ThemeProvider>
  );
};

export default DownloadSuccessPage;
