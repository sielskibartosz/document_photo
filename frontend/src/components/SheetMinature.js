//
//"""Not used anywhere yet"""
//
import React from "react";
import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

const SheetMinature = ({ thumbnailUrl, onClick }) => {
  const { t } = useTranslation();

  return (
    <Box
      onClick={onClick}
      title={t("sheetThumbnail")}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        cursor: "pointer",
        ml: 2.5,
        userSelect: "none",
        "&:hover img": {
          borderColor: "primary.main",
          boxShadow: (theme) => `0 0 8px ${theme.palette.primary.main}`,
        },
        transition: "border-color 0.3s, box-shadow 0.3s",
      }}
    >
      <Typography
        variant="caption"
        sx={{ mb: 0.75, color: "text.secondary", userSelect: "none" }}
      >
        {t("sheetThumbnail")}
      </Typography>
      <Box
        component="img"
        src={thumbnailUrl}
        alt={t("sheetThumbnail")}
        sx={{
          width: 80,
          height: 80,
          objectFit: "cover",
          border: "3px solid",
          borderColor: "primary.main",
          borderRadius: 1,
          userSelect: "none",
        }}
      />
    </Box>
  );
};

export default SheetMinature;

