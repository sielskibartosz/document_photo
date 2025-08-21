import React from "react";
import { Box, Button, IconButton } from "@mui/material";
import ImagePreview from "./ImagePreview";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTranslation } from "react-i18next";

function AddToSheetPanel({ image, aspectRatio, onAddToSheet, onClear }) {
  const { t } = useTranslation();

  return (
    <Box display="flex" alignItems="center" justifyContent="center" gap={2}>
      <Button
        variant="contained"
        onClick={onAddToSheet}
        sx={{ fontWeight: 600 }}
      >
        {t("add_to_sheet", "Dodaj do arkusza")}
      </Button>

      {onClear && (
        <IconButton color="primary" onClick={onClear} sx={{ ml: 1 }}>
          <DeleteIcon />
        </IconButton>
      )}
    </Box>

  );
}

export default AddToSheetPanel;
