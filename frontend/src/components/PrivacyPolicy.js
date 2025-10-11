import React from "react";
import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function PrivacyPolicy({ sx }) {
  const { t } = useTranslation();

  return (
    <Box
      component={Link}
      to="/privacy-policy"
      sx={{
        cursor: "pointer",
        textDecoration: "underline",
        color: "primary.main",
        ...sx,
      }}
    >
      {t("privacyPolicy_title")}
    </Box>
  );
}
