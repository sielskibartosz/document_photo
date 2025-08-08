import React from "react";
import { Box, Typography, Button } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

function ImageUploader({ onChange }) {
  return (
    <Box sx={{ mb: 3 }}>
      {/* Hidden input + MUI Button */}
      <label htmlFor="upload-button" style={{ cursor: "pointer" }}>
        <input
          id="upload-button"
          type="file"
          accept="image/*"
          onChange={onChange}
          style={{ display: "none" }}
        />
        <Button
          variant="contained"
          component="span"
          color="primary"
          startIcon={<CloudUploadIcon />}
        >
          Wybierz zdjęcie
        </Button>
      </label>
    </Box>
  );
}

export default ImageUploader;
