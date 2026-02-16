import { useEffect } from "react";
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
import FeedbackForm from "../components/FeedbackForm";
import { BACKEND_URL } from "../constants/backendConfig";

const DownloadSuccessPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const gratitude = t("success_page.gratitude");
  const not_downloaded = t("success_page.not_downloaded");
  const download_btn = t("success_page.download_btn");
  const main_page_btn = t("success_page.main_page_btn");
  const download_problems = t("success_page.download_problems");

  const isSmallScreen = useMediaQuery("(max-width:600px)");

  const downloadFromBackend = async () => {
    const dataUrl = sessionStorage.getItem("sheetBlob");

    if (!dataUrl) {
      alert("Plik nie jest już dostępny. Wygeneruj zdjęcie ponownie.");
      return;
    }

    try {
      // 🔹 Wywołanie backendu
      const response = await fetch(`${BACKEND_URL}/api/download/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image_base64: dataUrl }),
      });

      if (!response.ok) {
        throw new Error("Błąd serwera");
      }

      const data = await response.json();

      // 🔹 Pobranie pliku przez tymczasowy link
      const link = document.createElement("a");
      link.href = `${BACKEND_URL}${data.url}`;
      link.download = "photo_sheet.jpg"; // nazwa pliku
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(err);
      alert("Nie udało się pobrać pliku.");
    }
  };

  useEffect(() => {
    // Google Conversion Tracking
    if (window.gtag) {
      window.gtag("event", "conversion", {
        send_to: "AW-17550154396/_6-ECIjRr_kbEJy1yLBB",
        value: 7.0,
        currency: "PLN",
        transaction_id: "",
        new_customer: true,
      });
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
          justifyContent: "flex-start",
          alignItems: "center",
          textAlign: "center",
          pt: isSmallScreen ? 20 : 25,
          pb: 4,
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
          position: "relative",
        }}
      >
        <Typography variant={isSmallScreen ? "h5" : "h4"} gutterBottom>
          {gratitude}
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          {not_downloaded}
        </Typography>

        <Button
          variant="contained"
          onClick={downloadFromBackend}
          sx={{ mb: 2 }}
        >
          {download_btn}
        </Button>

        <Button
          variant="outlined"
          onClick={() => navigate("/")}
          sx={{ mb: 2 }}
        >
          {main_page_btn}
        </Button>

        <Box sx={{ width: "100%", mb: 1 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 0.5,
              lineHeight: 1.3,
            }}
          >
            {download_problems}
          </Typography>

          {/* 🔹 dodane odstęp między tekstem a formularzem */}
          <Box sx={{ mt: 4 }}>
            <FeedbackForm />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default DownloadSuccessPage;
