import React from 'react';
import {
  Box,
  Typography,
  ThemeProvider,
  CssBaseline,
  useMediaQuery,
  IconButton,
  Divider
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { darkTheme } from "../styles/theme";
import { useTranslation } from "react-i18next";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SEO from "../components/SEO";

const IdRequirementsPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isSmallScreen = useMediaQuery("(max-width:600px)");

  const title = t('idRequirements.title');
  const header = t('idRequirements.header');
  const list = t('idRequirements.list', { returnObjects: true });
  const footer = t('idRequirements.footer');

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      {/* SEO */}
      <SEO
        title="PhotoIDCreator – Wymagania zdjęcia do dowodu"
        description="Dowiedz się, jakie są wymagania zdjęcia do dowodu, paszportu i legitymacji. Z PhotoIDCreator przygotujesz zdjęcie idealne do dokumentów."
        url="https://photoidcreator.com/id-requirements"
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
        {/* Strzałka wstecz */}
        <IconButton
          onClick={() => navigate(-1)}
          sx={{ position: "absolute", top: 12, left: 12, color: "primary.main" }}
          aria-label="back"
        >
          <ArrowBackIcon fontSize="medium" />
        </IconButton>

        {/* Tytuł */}
        <Typography variant={isSmallScreen ? "h5" : "h4"} fontWeight={600}>
          {title}
        </Typography>

        {/* Wstęp / nagłówek */}
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ maxWidth: 700, mt: 1 }}
        >
          {header}
        </Typography>

        {/* Zdjęcia */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            justifyContent: "center",
            alignItems: "center",
            mt: 3
          }}
        >
          <Box
            component="img"
            src="/images/correct_id_photo.png"
            sx={{ width: { xs: "100%", sm: 180 }, borderRadius: 2, boxShadow: 3 }}
          />
          <Box
            component="img"
            src="/images/incorrect_id_photo.png"
            sx={{ width: { xs: "100%", sm: 180 }, borderRadius: 2, boxShadow: 3 }}
          />
        </Box>

        {/* Lista wymagań w stylu kroków */}
        <Box sx={{ maxWidth: 700, mt: 3, textAlign: "left" }}>
          {list.map((item, index) => (
            <Box key={index} sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
              <Typography sx={{ fontWeight: 600, mr: 1, color: "primary.main" }}>
                {index + 1}.
              </Typography>
              <Box>
                <Typography variant="body1" fontWeight={500}>{item.primary}</Typography>
                {item.secondary && (
                  <Typography variant="body2" color="text.secondary">{item.secondary}</Typography>
                )}
              </Box>
            </Box>
          ))}
        </Box>

        {/* Stopka */}
        <Divider sx={{ my: 2, maxWidth: 700 }} />
        <Typography variant="body1" fontWeight={600} sx={{ maxWidth: 700 }}>
          {footer}
        </Typography>
      </Box>
    </ThemeProvider>
  );
};

export default IdRequirementsPage;