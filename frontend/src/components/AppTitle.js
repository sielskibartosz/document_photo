import React from "react";
import { Typography, Box } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function AppTitle() {
  const { t } = useTranslation();

  const title = t("title");
  const subTitle = t("sub_title");

  return (
    <Box sx={{ textAlign: "center", mb: 4 }}>
      <Typography
        variant="h3" // większy nagłówek
        fontWeight={900} // mocniejsza czcionka
        sx={{
          fontFamily: "'Montserrat', 'Roboto', sans-serif", // nowa czcionka
          textShadow: "2px 2px 4px rgba(0,0,0,0.2)", // mocniejszy cień
          letterSpacing: 1, // lekko większe odstępy liter
        }}
      >
        {title}
      </Typography>
      {subTitle && (
        <Typography
          variant="subtitle1"
          color="text.secondary"
          sx={{ mt: 0.5, fontStyle: "italic", fontWeight: 500 }}
        >
          {subTitle}
        </Typography>
      )}
    </Box>
  );
}
