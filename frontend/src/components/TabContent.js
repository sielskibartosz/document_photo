import React from "react";
import { Box, Typography, Link, TextField, Tooltip, IconButton } from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { TABS, TAB_DESCTIPTION } from "../constants/tabs";

const TabContent = ({ tabKey, aspectInput, setAspectInput }) => {
  const tab = TAB_DESCTIPTION[tabKey] || {};
  const tabFromList = TABS.find((t) => t.key === tabKey);
  const aspect = tabFromList ? tabFromList.aspect : "";

  const getFormatDescription = () => {
    return `Format arkusza to rozmiar kartki papieru na ktorej umieszczone bedzie zdjęcie.`;
  };

  // Handler zmiany inputa proporcji
  const handleAspectChange = (e) => {
    setAspectInput(e.target.value);
  };

  return (
    <Box sx={{ textAlign: "center", mb: 0, "& > *": { mb: 0 } }}>
      {tab.image && (
        <Box
          sx={{
            width: 300,
            minHeight: 200,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 2,
            backgroundColor: "transparent",
            padding: 1,
            boxSizing: "border-box",
            mb: 0,
          }}
        >
          <Box
            component="img"
            src={tab.image}
            alt={`Przykład zdjęcia - ${tabKey}`}
            sx={{
              maxWidth: "100%",
              height: "auto",
              width: "auto",
              objectFit: "contain",
              borderRadius: 2,
              boxShadow: "none",
              display: "block",
              backgroundColor: "transparent",
              border: "none",
            }}
          />
        </Box>
      )}

      {tab.title && (
        <Typography
          variant="body1"
          sx={{ mb: 0.5, fontWeight: "normal", textAlign: "center", mt: 0, pt: 0, lineHeight: 1.2 }}
        >
          {tab.title}
        </Typography>
      )}

      {tab.description && (
        <Typography
          variant="body1"
          sx={{
            mb: 1,
            fontWeight: 600,
            color: "text.primary",
            maxWidth: 600,
            mx: "auto",
            lineHeight: 1.7,
            textAlign: "justify",
            whiteSpace: "pre-line",
          }}
        >
          {tab.description}
        </Typography>
      )}

      {tab.text && (
        <Typography
          variant="body1"
          sx={{
            mb: 2,
            fontWeight: 600,
            color: "text.primary",
            maxWidth: 600,
            mx: "auto",
            lineHeight: 1.7,
            textAlign: "justify",
            whiteSpace: "pre-line",
          }}
        >
          {tab.text}
        </Typography>
      )}

      {tab.link && (
        <Link
          href={tab.link}
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
        <Box
          sx={{
            position: "relative",
            maxWidth: 180,
            mx: "auto",
            mt: 3,
          }}
        >
          <TextField
            label={`Podaj proporcje [mm]`}
            variant="outlined"
            size="small"
            value={aspectInput}
            onChange={handleAspectChange}
            InputProps={{ sx: { height: 40 } }}
            inputProps={{ style: { fontSize: 16, fontFamily: "Roboto, sans-serif" } }}
            placeholder={`np. ${aspect}`}
            fullWidth
          />
          <Tooltip title={getFormatDescription()} arrow placement="top">
            <IconButton
              size="small"
              aria-label="info"
              sx={{
                position: "absolute",
                right: 4,
                top: "50%",
                transform: "translateY(-50%)",
                padding: 0,
              }}
            >
              <InfoOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )}
    </Box>
  );
};

export default TabContent;
