// TabContent.js
import React from "react";
import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { TABS, TAB_DESCRIPTION } from "../constants/tabs";
import AspectInput from "./AspectInput";
import FormatSelector from "./FormatSelector";
import ImageUploader from "./ImageUploader";
import FotoBackgroundColor from "./FotoBackgroundColor";
import LinkIcon from '@mui/icons-material/Link';

const TabContent = ({
  tabKey,
  aspectInput,
  setAspectInput,
  selectedFormat,
  setSelectedFormat,
  onFileChange,
  bgColor,
  setBgColor,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const tab = TAB_DESCRIPTION[tabKey] || {};
  const tabFromList = TABS.find((t) => t.key === tabKey);
  const aspect = tabFromList ? tabFromList.aspect : "";

  return (
    <Box sx={{ textAlign: "center", mb: 0, "& > *": { mb: 0 } }}>
      {/* Obrazki */}
      {tab.image && (
        <Box
          sx={{
            width: "100%",
            maxWidth: 350,
            minHeight: 200,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 2,
            backgroundColor: "transparent",
            padding: 1,
            boxSizing: "border-box",
          }}
        >
          <Box
            component="img"
            src={tab.image}
            alt={t(tabFromList?.labelKey || "")}
            sx={{
              maxWidth: "100%",
              height: "auto",
              objectFit: "contain",
              borderRadius: 2,
              display: "block",
              backgroundColor: "transparent",
            }}
          />
        </Box>
      )}

      {/* Tytuł */}
      {tab.title && (
        <Typography
          variant="body1"
          sx={{ mb: 0.5, fontWeight: "normal", textAlign: "center", lineHeight: 1.2 }}
        >
          {tab.title}
        </Typography>
      )}

      {/* Opis */}
      {tab.description && (
        <Typography
          variant="body1"
          sx={{
            mb: 1,
            fontWeight: 500,
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

      {/* Link do wymagań */}
        {tab.link && (
          <Typography
            variant="body1"
            sx={{
              display: "inline-block",
              mt: 0,
              cursor: "pointer",
              color: "primary.main",
              fontWeight: 500,
              textDecoration: "underline",
              "&:hover": { opacity: 0.8 },
              mx: "auto",
            }}
            onClick={() => navigate(tab.link)}
          >
            {t("id_link") || "Wymagania zdjęcia"}
          </Typography>
        )}


      {/* Kontener pól */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            mt: 2,
            mx: "auto",
            width: "100%",
            maxWidth: 220, // wspólna szerokość dla wszystkich pól
            position: "relative",
            left: 16, // przesunięcie w prawo o 16px, możesz zmienić wartość
          }}
        >
          {/* Format selector */}
          <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
            <FormatSelector
              selectedFormat={selectedFormat}
              setSelectedFormat={setSelectedFormat}
              sx={{ width: "100%" }}
            />
          </Box>

          {/* Niestandardowe pola */}
          {tabKey === "custom" && (
            <>
              <AspectInput
                value={aspectInput}
                onChange={(val) => setAspectInput(val)}
                placeholder={`np. ${aspect}`}
                sx={{ width: "100%" }}
              />
              <FotoBackgroundColor
                color={bgColor || "#ffffff"}
                onChange={setBgColor}
                sx={{ width: "100%" }}
              />
            </>
          )}

          {/* Image uploader */}
          <ImageUploader onChange={onFileChange} sx={{ width: "100%" }} />
        </Box>

    </Box>
  );
};

export default TabContent;
