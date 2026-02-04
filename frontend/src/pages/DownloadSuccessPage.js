import { useEffect } from "react";
import { Box, Button, Typography, ThemeProvider, CssBaseline, useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { darkTheme } from "../styles/theme";
import { useTranslation } from 'react-i18next';

const DownloadSuccessPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const gratitude = t('success_page.gratitude');
  const not_downloaded = t('success_page.not_downloaded');
  const download_btn = t('success_page.download_btn');
  const main_page_btn = t('success_page.main_page_btn');

  const isSmallScreen = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    // 🔴 Google Ads Conversion Event
    if (window.gtag) {
      window.gtag('event', 'purchase_success', {
        event_category: 'ecommerce',
        event_label: 'PhotoIDCreator',
        value: 1,
      });
    }

    // ⬇️ Pobieranie pliku
    const dataUrl = sessionStorage.getItem("sheetBlob");
    if (!dataUrl) return;

    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "sheet.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    sessionStorage.removeItem("sheetBlob");
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
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
        <Typography variant={isSmallScreen ? "h5" : "h4"} gutterBottom color="text.primary">
          {gratitude}
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          {not_downloaded}{" "}
          <Button
            variant="text"
            onClick={() => {
              const dataUrl = sessionStorage.getItem("sheetBlob");
              if (!dataUrl) return;
              const link = document.createElement("a");
              link.href = dataUrl;
              link.download = "sheet.jpg";
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
          >
            {download_btn}
          </Button>
          .
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/")}
        >
          {main_page_btn}
        </Button>
      </Box>
    </ThemeProvider>
  );
};

export default DownloadSuccessPage;
