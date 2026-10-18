import React, { useEffect, useState } from "react";
import { Box, Button, Typography, ThemeProvider, CssBaseline, useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { darkTheme } from "../styles/theme";
import { useTranslation } from "react-i18next";
import SEO from "../components/SEO";
import FeedbackForm from "../components/FeedbackForm";
import { BACKEND_URL } from "../constants/backendConfig";
import apiFetch from "../utils/apiFetch";

const DownloadSuccessPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isSmallScreen = useMediaQuery("(max-width:600px)");

  const [isChecking, setIsChecking] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  // Webhook Stripe może dotrzeć chwilę po powrocie użytkownika - czekamy na potwierdzenie,
  // zamiast przenosić go na surową stronę z błędem 403
  const waitForPayment = async (token) => {
    const maxAttempts = 15;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const resp = await apiFetch(`${BACKEND_URL}/api/download/status/${token}`);
        const { paid } = await resp.json();
        if (paid) return "paid";
      } catch (err) {
        if (String(err?.message || "").startsWith("HTTP 404")) return "expired";
      }
      setStatusMessage(t("success_page.waiting_for_payment", "Czekamy na potwierdzenie płatności..."));
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
    return "pending";
  };

  // Direct link for best mobile compatibility
  const downloadFromBackend = async () => {
    const hash = window.location.hash;
    const queryString = hash.split("?")[1];
    const urlParams = new URLSearchParams(queryString);
    const token = urlParams.get("token");

    if (!token) return alert(t("success_page.no_token", "Brak tokena pobierania."));

    setIsChecking(true);
    setStatusMessage("");
    try {
      const status = await waitForPayment(token);
      if (status === "expired") {
        setStatusMessage(t("success_page.link_expired", "Link wygasł lub nie istnieje. Skontaktuj się z nami przez formularz poniżej."));
        return;
      }
      if (status === "pending") {
        setStatusMessage(t("success_page.payment_pending", "Płatność nie została jeszcze potwierdzona. Spróbuj ponownie za chwilę."));
        return;
      }
      setStatusMessage("");

      // The server sets Content-Disposition: attachment, so the page is not replaced
      const link = document.createElement("a");
      link.href = `${BACKEND_URL}/api/download/${token}`;
      link.download = "photo_sheet.jpg";
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      setTimeout(() => link.remove(), 100);
    } finally {
      setIsChecking(false);
    }
  };

  // 🔥 GOOGLE ADS CONVERSION TRACKING
  useEffect(() => {
    // Tylko jeśli użytkownik wyraził zgodę na cookies
    if (localStorage.getItem('cookiesAccepted') !== 'true') {
      console.log('⚠️ Cookies nie zaakceptowane, pomijam konwersję Google Ads');
      return;
    }

    const hash = window.location.hash;
    const queryString = hash.split("?")[1];
    const urlParams = new URLSearchParams(queryString);
    const token = urlParams.get("token");
    const gclid = urlParams.get("gclid");

    if (!token) {
      console.log('❌ Brak tokena w URL, pomijam konwersję');
      return;
    }

    // 🎯 Wysyłamy Google Ads conversion event
    if (window.gtag) {
      window.gtag('event', 'conversion', {
        'send_to': 'AW-17550154396/gwoSCO_jlv4bEJy1yLBB',
        'transaction_id': token,
        ...(gclid && { 'gclid': gclid })
      });
      console.log('✅ Google Ads conversion event wysłany | token=' + token + ' | gclid=' + (gclid || 'none'));
    } else {
      console.warn('⚠️ gtag nie dostępny');
    }
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <SEO title="Pobranie zakończone" description="Twoje zdjęcie jest gotowe do pobrania" url="https://photoidcreator.com/#/download-success" />
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
        <Button variant="contained" onClick={downloadFromBackend} disabled={isChecking} sx={{ mb: 2 }}>{t("success_page.download_btn")}</Button>
        {statusMessage && <Typography variant="body2" sx={{ mb: 2 }}>{statusMessage}</Typography>}
        <Button variant="outlined" onClick={() => navigate("/")} sx={{ mb: 2 }}>{t("success_page.main_page_btn")}</Button>
        <Box sx={{ mt: 4 }}><FeedbackForm /></Box>
      </Box>
    </ThemeProvider>
  );
};

export default DownloadSuccessPage;
