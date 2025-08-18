import React from "react";
import { Box, Button } from "@mui/material";
import ImagePreview from "./ImagePreview";
import { useTranslation } from "react-i18next";

function AddToSheetPanel({ image, aspectRatio, onAddToSheet }) {
  const { t } = useTranslation();

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={2} mt={0}>
      <ImagePreview image={image} aspectRatio={aspectRatio} />

      <Button variant="contained" onClick={onAddToSheet} sx={{ fontWeight: 600 }}>
        {t("add_to_sheet", "Dodaj do arkusza")}
      </Button>
    </Box>
  );
}

export default AddToSheetPanel;
