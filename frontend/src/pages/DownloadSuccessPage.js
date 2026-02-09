import { useEffect, useRef } from "react";
import {
  Box,
  Button,
  Typography,
  ThemeProvider,
  CssBaseline,
  useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { darkTheme } from "../styles/theme";
import { useTranslation } from "react-i18next";
import SEO from "../components/SEO";

const DownloadSuccessPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const gratitude = t("success_page.gratitude");
  const not_downloaded = t("success_page.not_downloaded");
  const download_btn = t("success_page.download_btn");
  const main_page_btn = t("success_page.main_page_btn");
  const download_problems = t("success_page.download_problems");

  const isSmallScreen = useMediaQuery("(max-width:600px)");

  const autoDownloadTriggered = useRef(false);

  const downloadFile = () => {
    const dataUrl = sessionStorage.getItem("sheetBlob");

    if (!dataUrl) {
      alert("Plik nie jest już dostępny. Wygeneruj zdjęcie ponownie.");
      return false;
    }

    try {
      const parts = dataUrl.split(",");
      const mime = parts[0].match(/:(.*?);/)?.[1] || "image/jpeg";
      const binary = atob(parts[1]);
      const array = new Uint8Array(binary.length);

      for (let i = 0; i < binary.length; i++) {
        array[i] = binary.charCodeAt(i);
      }

      const blob = new Blob([array], { type: mime });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "sheet.jpg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
      return true;
    } catch (err) {
      console.error("Download failed", err);
      alert("Pobieranie nie powiodło się. Spróbuj ponownie.");
      return false;
    }
  };

  useEffect(() => {
    if (window.gtag) {
      window.gtag("event", "purchase_success", {
        event_category: "ecommerce",
        event_label: "PhotoIDCreator",
        value: 1,
      });
    }

    if (!autoDownloadTriggered.current) {
      autoDownloadTriggered.current = true;
      const success = downloadFile();
      if (!success) {
        alert("Nie udało się automatycznie pobrać pliku.");
      }
    }
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <SEO
        title="PhotoIDCreator – pobranie zdjęcia zakończone sukcesem"
        description="Dziękujemy za użycie PhotoIDCreator. Twoje zdjęcie do dokumentów zostało wygenerowane i jest gotowe do pobrania."
        url="https://photoidcreator.com/#/download-success"
      />

      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          p: isSmallScreen ? 2 : 4,
          width: isSmallScreen ? "95vw" : "80vw",
          margin: "10px auto",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          color: darkTheme.palette.text.primary,
          background:
            darkTheme.palette.mode === "dark"
              ? "linear-gradient(135deg, #1f2937 0%, #374151 100%)"
              : "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          borderRadius: 3,
          boxShadow: darkTheme.shadows[4],
        }}
      >
        <Typography variant={isSmallScreen ? "h5" : "h4"} gutterBottom>
          {gratitude}
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {not_downloaded}
        </Typography>

        <Button
          variant="contained"
          onClick={downloadFile}
          sx={{ mb: 3 }}
        >
          {download_btn}
        </Button>

        <Button
          variant="outlined"
          onClick={() => navigate("/")}
          sx={{ mb: 3 }}
        >
          {main_page_btn}
        </Button>

        <Typography variant="body2" color="text.secondary">
          {download_problems}
        </Typography>
      </Box>
    </ThemeProvider>
  );
};

export default DownloadSuccessPage;