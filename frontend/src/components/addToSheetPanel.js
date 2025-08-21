import React from "react";
import { Box, Button, IconButton } from "@mui/material";
import ImagePreview from "./ImagePreview";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTranslation } from "react-i18next";

function AddToSheetPanel({ image, aspectRatio, onAddToSheet, onClear }) {
  const { t } = useTranslation();

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={2} mt={0}>
      <ImagePreview image={image} aspectRatio={aspectRatio} />

      <Box display="flex" alignItems="center" justifyContent="center" gap={1} position="relative">
        <Button
          variant="contained"
          onClick={onAddToSheet}
          sx={{ fontWeight: 600 }}
        >
          {t("add_to_sheet", "Dodaj do arkusza")}
        </Button>

        {onClear && (
          <Box position="absolute" right={-50}> {/* przesuwamy kosz w prawo od przycisku */}
            <IconButton color="primary" onClick={onClear}>
              <DeleteIcon />
            </IconButton>
          </Box>
        )}

      </Box>
    </Box>
  );
}

export default AddToSheetPanel;
