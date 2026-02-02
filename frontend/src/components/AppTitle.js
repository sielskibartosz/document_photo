import React from "react";
import { Typography, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useTheme } from '@mui/material/styles';

export default function AppTitle() {
  const { t } = useTranslation();
  const theme = useTheme();
  const title = t("title");
  const subTitle = t("sub_title");
  const subDescription = t("sub_description");

  return (
    <Box sx={{ textAlign: "center", mb: 4 }}>

      {/* Logo na górze */}
     <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2, // odstęp między logo
            mb: 1
          }}
        >
          <Box
            component="img"
            src="/transparent_logo_small.png"
            alt="Logo"
            sx={{ width: { xs: 50, sm: 50, md: 70 }, height: "auto" }}
          />
        </Box>

      {/* Główny tytuł */}
      <Typography
        variant="h3"
        sx={{
          fontFamily: "'Poppins', 'Roboto', sans-serif",
          letterSpacing: 1,
          textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
          fontWeight: 500,
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
        }}
      >
        <Box component="span">
  photo<Box component="span" color="primary.main">ID</Box>creator
</Box>


      </Typography>

      {/* Subtitle */}
      {subTitle && (
        <Typography
          variant="subtitle1"
          color="text.secondary"
          sx={{ mt: 0.5, fontStyle: "italic", fontWeight: 400 }}
        >
          {subTitle}
        </Typography>
      )}

    </Box>
  );
}
