import React from "react";
import { Box, Typography, Button } from "@mui/material";
import ImagePreview from "./ImagePreview";

function AddToSheetPanel({ image, aspectRatio, onAddToSheet }) {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={2} mt={0}>

      <ImagePreview image={image} aspectRatio={aspectRatio} />

      <Button variant="contained" onClick={onAddToSheet} sx={{ fontWeight: 600 }}>
        Dodaj do arkusza
      </Button>
    </Box>
  );
}

export default AddToSheetPanel;
