// PrivacyPolicyPage.js
import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { useTranslation } from "react-i18next";
import { darkTheme } from "../styles/theme";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

export default function PrivacyPolicyPage() {
  const { t } = useTranslation();
  const contentHeader = t("privacyPolicy_content_header");
  const content = t("privacyPolicy_content", { returnObjects: true });
  const navigate = useNavigate();

  const textStyle = {
    textAlign: "justify",
    mb: 1, // mniejsze odstępy między paragrafami
    lineHeight: 1.6,
    fontSize: { xs: "1rem", sm: "1.1rem" },
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        padding: { xs: 3, sm: 6 },
        width: { xs: "95vw", sm: "70vw", md: "60vw" },
        margin: "20px auto",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: darkTheme.palette.text.primary,
        background:
          darkTheme.palette.mode === "dark"
            ? "linear-gradient(135deg, #1f2937 0%, #374151 100%)"
            : "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        borderRadius: 4,
        boxShadow: darkTheme.shadows[5],
        position: "relative",
      }}
    >
      {/* Strzałka w lewym górnym rogu */}
      <IconButton
        onClick={() => navigate("/")}
        sx={{
          position: "absolute",
          top: 16,
          left: 16,
          color: "primary.main",
        }}
        aria-label="back"
      >
        <ArrowBackIcon fontSize="large" />
      </IconButton>

      {/* Tytuł */}
      <Typography
        variant="h3"
        sx={{
          mb: 4,
          fontWeight: "bold",
          textAlign: "center",
          textShadow:
            darkTheme.palette.mode === "dark"
              ? "1px 1px 2px rgba(0,0,0,0.6)"
              : "1px 1px 2px rgba(255,255,255,0.6)",
        }}
      >
        {t("privacyPolicy_title")}
      </Typography>

      {/* Treść */}
      <Box sx={{ mx: "auto", maxWidth: "800px" }}>
        {/* Nagłówek content */}
        {contentHeader && (
          <Typography variant="body1" paragraph sx={textStyle}>
            {contentHeader}
          </Typography>
        )}

        {/* Lista punktowana */}
        {content &&
          content.map((line, index) => (
            <Typography
              key={`content-${index}`}
              variant="body1"
              paragraph
              sx={textStyle}
            >
              {"\u2022 "}{line} {/* punkt zamiast myślnika */}
            </Typography>
          ))}
      </Box>
    </Box>
  );
}
