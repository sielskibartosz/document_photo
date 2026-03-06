import { Box, Typography, ThemeProvider, CssBaseline, useMediaQuery, IconButton, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { darkTheme } from "../styles/theme";
import { useTranslation } from "react-i18next";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ContrastIcon from "@mui/icons-material/Contrast";
import SEO from "../components/SEO";
import PortraitIcon from "@mui/icons-material/Portrait";
import HighQualityIcon from "@mui/icons-material/HighQuality";
import LightModeIcon from "@mui/icons-material/LightMode";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";

const FotoTipsPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isSmallScreen = useMediaQuery("(max-width:600px)");

  const tips = t("foto_tips.steps", { returnObjects: true });
  const tipIcons = [ContrastIcon, PortraitIcon, HighQualityIcon, LightModeIcon];

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <SEO
        title="PhotoIDCreator – Wskazówki do zdjęcia"
        description="Dowiedz się, jak wykonać zdjęcie do dowodu lub legitymacji, aby aplikacja poprawnie je przycięła."
        url="https://photoidcreator.com/foto-tips"
      />
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          p: isSmallScreen ? 2 : 4,
          width: isSmallScreen ? "95vw" : "80vw",
          margin: "20px auto",
          color: darkTheme.palette.text.primary,
          background:
            darkTheme.palette.mode === "dark"
              ? "linear-gradient(135deg, #1f2937 0%, #374151 100%)"
              : "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          borderRadius: 3,
          boxShadow: darkTheme.shadows[4],
          gap: 3,
          position: "relative",
        }}
      >
        <Box sx={{ width: "100%", position: "relative", pt: 1 }}>
          <IconButton
            onClick={() => navigate(-1)}
            sx={{ position: "absolute", top: 0, left: 0, color: "primary.main" }}
            aria-label="back"
          >
            <ArrowBackIcon fontSize="medium" />
          </IconButton>

          <Typography
            variant={isSmallScreen ? "h5" : "h4"}
            fontWeight={600}
            sx={{ px: isSmallScreen ? 6 : 8 }}
          >
            {t("foto_tips.title", "Wskazówki do zdjęcia")}
          </Typography>
        </Box>

        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 700 }}>
          {t("foto_tips.subtitle", "Proste porady, aby Twoje zdjęcie było idealnie przycięte przez aplikację.")}
        </Typography>

        <Box sx={{ maxWidth: 700, textAlign: "left", mt: 3 }}>
          {tips.map((tip, index) => {
            const Icon = tipIcons[index] || CameraAltIcon;
            return (
              <Box key={index} sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Icon sx={{ mr: 1, color: "primary.main" }} />
                <Typography variant="body1">
                  <strong>{index + 1}.</strong> {tip}
                </Typography>
              </Box>
            );
          })}

          <Divider sx={{ my: 2 }} />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "primary.light",
              color: "primary.contrastText",
              borderRadius: 2,
              p: 1.5,
            }}
          >
            <ChangeCircleIcon sx={{ mr: 1 }} />
            <Typography variant="body1" fontWeight={600}>
              {tips.length + 1}. {t("foto_tips.final_step", "Sprawdź podgląd i wydrukuj zdjęcie")}
            </Typography>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default FotoTipsPage;

