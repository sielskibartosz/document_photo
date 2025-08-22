// TabContent.js
import React from "react";
import { Box, Typography, Link } from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";
import { useTranslation } from "react-i18next";
import { TABS, TAB_DESCRIPTION } from "../constants/tabs";
import AspectInput from "./AspectInput";
import FormatSelector from "./FormatSelector";
import ImageUploader from "./ImageUploader";
import FotoBackgroundColor from "./FotoBackgroundColor";

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

  const tab = TAB_DESCRIPTION[tabKey] || {};
  const tabFromList = TABS.find((t) => t.key === tabKey);
  const aspect = tabFromList ? tabFromList.aspect : "";

  return (
    <Box sx={{ textAlign: "center", mb: 0, "& > *": { mb: 0 } }}>
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

      {tab.title && (
        <Typography
          variant="body1"
          sx={{
            mb: 0.5,
            fontWeight: "normal",
            textAlign: "center",
            lineHeight: 1.2,
          }}
        >
          {tab.title}
        </Typography>
      )}

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

      {tab.text && (
        <Typography
          variant="body1"
          sx={{
            mb: 2,
            fontWeight: 500,
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
            {t("id_link")}
          </Link>
        )}

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          mt: 2,
          mx: "auto",
          maxWidth: 220,
          width: "100%",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, width: "100%" }}>
          <FormatSelector selectedFormat={selectedFormat} setSelectedFormat={setSelectedFormat} />
        </Box>

        {tabKey === "custom" && (
          <>
            <AspectInput
              value={aspectInput}
              onChange={(val) => setAspectInput(val)} // <- tu nie używaj e.target.value
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

        <Box sx={{ width: "100%" }}>
          <ImageUploader onChange={onFileChange} />
        </Box>
      </Box>
    </Box>
  );
};

export default TabContent;
