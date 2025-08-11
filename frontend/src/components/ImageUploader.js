import React, { useRef } from "react";
import { Box, Typography, Button } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

function ImageUploader({ onChange }) {
  const inputRef = useRef(null);

  const handleChange = (e) => {
    onChange(e);
    // resetujemy wartość inputa, aby można było wybrać ten sam plik ponownie
    e.target.value = null;
  };

  return (
    <Box sx={{ mb: 3, display: "flex", justifyContent: "center" }}>
      <label htmlFor="upload-button" style={{ cursor: "pointer" }}>
        <input
          id="upload-button"
          type="file"
          accept="image/*"
          onChange={handleChange}
          ref={inputRef}
          style={{ display: "none" }}
        />
        <Button
          variant="contained"
          component="span"
          color="primary"
          startIcon={<CloudUploadIcon />}
          sx={{ fontWeight: 600 }}
        >
          Wybierz zdjęcie
        </Button>
      </label>
    </Box>
  );
}

export default ImageUploader;
