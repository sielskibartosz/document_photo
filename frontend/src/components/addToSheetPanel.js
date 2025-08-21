import React from "react";
import { Box, Button, IconButton } from "@mui/material";
import ImagePreview from "./ImagePreview";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTranslation } from "react-i18next";

function AddToSheetPanel({ image, aspectRatio, onAddToSheet, onClear }) {
  const { t } = useTranslation();

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
      <ImagePreview image={image} aspectRatio={aspectRatio} />

      <Box display="flex" justifyContent="center" alignItems="center" gap={1}>
        <Button
          variant="contained"
          onClick={onAddToSheet}
          sx={{ fontWeight: 600 }}
        >
          {t("add_to_sheet", "Dodaj do arkusza")}
        </Button>

        {onClear && (
          <IconButton color="primary" onClick={onClear}>
            <DeleteIcon />
          </IconButton>
        )}
      </Box>
    </Box>
  );
}

export default AddToSheetPanel;
