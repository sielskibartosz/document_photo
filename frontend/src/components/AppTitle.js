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
      {/* Główny tytuł */}
      <Typography
      variant="h3"
      sx={{
        fontFamily: "'Montserrat', 'Roboto', sans-serif",
        letterSpacing: 1,
        textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
        fontWeight: 500,
        textAlign: "center",
      }}
    >
      Photo
      <Box
          component="span"
          sx={{ color: theme.palette.primary.main, fontWeight: 700, mx: 0.5 }}
        >
        ID
      </Box>
      Creator
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

      {/* Sub description */}
      {/*{subDescription && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mt: 0.8,
            maxWidth: 520,
            mx: "auto",
            lineHeight: 1.6,
          }}
        >
          {subDescription}
        </Typography>
      )}*/}
    </Box>
  );
}
