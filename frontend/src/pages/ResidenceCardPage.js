import React from "react";
import { Box, Button, Typography, useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { darkTheme } from "../styles/theme";
import SEO from "../components/SEO";
import { localizedPath } from "../utils/localizedRoutes";

// Strona docelowa dla wyszukiwań "zdjęcie do karty pobytu" (/karta-pobytu, /en/residence-card, /uk/karta-pobytu).
// Ludzie trafiają tu prosto z Google, więc zamiast strzałki wstecz jest przycisk do aplikacji.
const ResidenceCardPage = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isSmallScreen = useMediaQuery("(max-width:600px)");

  const list = t("residenceCard.list", { returnObjects: true });
  const homePath = localizedPath("/", i18n.language?.split("-")[0]) || "/";

  return (
    <>
      <SEO />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          p: isSmallScreen ? 2 : 4,
          width: isSmallScreen ? "95vw" : "80vw",
          margin: "20px auto",
          color: darkTheme.palette.text.primary,
          background: "linear-gradient(135deg, #1f2937 0%, #374151 100%)",
          borderRadius: 3,
          boxShadow: darkTheme.shadows[4],
          gap: 3,
        }}
      >
        <Typography variant={isSmallScreen ? "h5" : "h4"} component="h1" fontWeight={600}>
          {t("residenceCard.title")}
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 700 }}>
          {t("residenceCard.header")}
        </Typography>

        <Button variant="contained" size="large" onClick={() => navigate(homePath)}>
          {t("residenceCard.cta")}
        </Button>

        <Box
          component="img"
          src="/images/correct_id_photo.png"
          alt=""
          sx={{ width: { xs: "60%", sm: 180 }, borderRadius: 2, boxShadow: 3 }}
        />

        <Box sx={{ maxWidth: 700, textAlign: "left" }}>
          {list.map((item, index) => (
            <Box key={index} sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
              <Typography sx={{ fontWeight: 600, mr: 1, color: "primary.main" }}>
                {index + 1}.
              </Typography>
              <Box>
                <Typography variant="body1" fontWeight={500}>{item.primary}</Typography>
                <Typography variant="body2" color="text.secondary">{item.secondary}</Typography>
              </Box>
            </Box>
          ))}
        </Box>

        <Button variant="contained" size="large" onClick={() => navigate(homePath)}>
          {t("residenceCard.cta")}
        </Button>
      </Box>
    </>
  );
};

export default ResidenceCardPage;
