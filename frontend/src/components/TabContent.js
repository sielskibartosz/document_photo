import React from "react";
import { Box, Typography, Link } from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";
import { TAB_DESCTIPTION } from "../constants/tabs";

const TabContent = ({ tabKey, aspectInput, setAspectInput }) => {
  const tab = TAB_DESCTIPTION[tabKey] || {};
  const { title, description, link, image, text } = tab;

  return (
    <Box sx={{ textAlign: "center", mb: 4 }}>
      {image && (
        <Box sx={{ maxWidth: 400, mx: "auto", mb: 2 }}>
          <Box
            component="img"
            src={image}
            alt={`Przykład zdjęcia - ${tabKey}`}
            sx={{
              width: "100%",
              borderRadius: 2,
              boxShadow: 3,
              display: "block",
            }}
          />
        </Box>
      )}

      {title && (
        <Typography
          variant="body1"
          sx={{
            mb: 2,
            fontWeight: "normal", // niepogrubione
            textAlign: "center",
          }}
        >
          {title}
        </Typography>
      )}

      {description && (
        <Typography
          variant="body1"
          sx={{
            mb: 2,
            fontWeight: 600, // pogrubione
            color: "text.primary",
            maxWidth: 600,
            mx: "auto",
            lineHeight: 1.7,
            textAlign: "justify",
            whiteSpace: "pre-line",
          }}
        >
          {description}
        </Typography>
      )}

      {text && (
        <Typography
          variant="body1"
          sx={{
            mb: 2,
            fontWeight: 600, // pogrubione
            color: "text.primary",
            maxWidth: 600,
            mx: "auto",
            lineHeight: 1.7,
            textAlign: "justify",
            whiteSpace: "pre-line",
          }}
        >
          {text}
        </Typography>
      )}

      {link && (
        <Link
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.5,
            fontWeight: 700,
            color: "primary.main",
            textDecoration: "none",
            "&:hover": { textDecoration: "underline" },
            maxWidth: 600,
            mx: "auto",
          }}
        >
          <LinkIcon fontSize="small" />
          Link do wymagań gov.pl
        </Link>
      )}

      {tabKey === "custom" && (
        <Box sx={{ maxWidth: 300, mx: "auto", mt: 3 }}>
          {/* input do wymiarów, jeśli potrzeba */}
        </Box>
      )}
    </Box>
  );
};

export default TabContent;
