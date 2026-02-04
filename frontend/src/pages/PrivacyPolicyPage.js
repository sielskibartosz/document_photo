import React from "react";
import { Box, Typography, IconButton, List, ListItem, ListItemText } from "@mui/material";
import { useTranslation } from "react-i18next";
import { darkTheme } from "../styles/theme";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import SEO from "../components/SEO";

export default function PrivacyPolicyPage() {
  const { t } = useTranslation();
  const contentHeader = t("privacyPolicy_content_header");
  const content = t("privacyPolicy_content", { returnObjects: true });
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        p: { xs: 2, sm: 4 },
        width: { xs: "95vw", sm: "80vw", md: "60vw" },
        mx: "auto",
        mt: 4,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: darkTheme.palette.text.primary,
        background:
          darkTheme.palette.mode === "dark"
            ? "linear-gradient(135deg, #1f2937 0%, #374151 100%)"
            : "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        borderRadius: 3,
        boxShadow: darkTheme.shadows[3],
        position: "relative",
      }}
    >
     {/* SEO */}
      <SEO
        title="PhotoIDCreator – Polityka prywatności"
        description="Poznaj politykę prywatności PhotoIDCreator. Dowiedz się, jakie dane zbieramy, jak je przetwarzamy i jak dbamy o Twoją prywatność."
        url="https://photoidcreator.com/privacy-policy"
      />

      {/* Strzałka wstecz */}
      <IconButton
        onClick={() => navigate("/")}
        sx={{ position: "absolute", top: 12, left: 12, color: "primary.main" }}
        aria-label="back"
      >
        <ArrowBackIcon fontSize="medium" />
      </IconButton>

      {/* Tytuł */}
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          textAlign: "center",
          textShadow:
            darkTheme.palette.mode === "dark"
              ? "1px 1px 2px rgba(0,0,0,0.6)"
              : "1px 1px 2px rgba(255,255,255,0.6)",
          mb: 3,
        }}
      >
        {t("privacyPolicy_title")}
      </Typography>

      <Box sx={{ mx: "auto", maxWidth: 800 }}>
        {/* Nagłówek content */}
        {contentHeader && (
          <Typography
            variant="body1"
            paragraph
            sx={{
              mb: 2,
              lineHeight: 1.6,
              fontSize: { xs: "1rem", sm: "1.1rem" },
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 500,
              textAlign: "justify",
            }}
          >
            {contentHeader}
          </Typography>
        )}

        {/* Lista punktowana */}
        {content && (
          <List sx={{ p: 0 }}>
            {content.map((line, index) => (
              <ListItem key={index} sx={{ display: "list-item", pl: 2, py: 0.5 }}>
                <ListItemText
                  primary={line}
                  primaryTypographyProps={{
                    fontSize: { xs: "0.95rem", sm: "1rem" },
                    lineHeight: 1.6,
                    textAlign: "justify",
                  }}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Box>
  );
}
