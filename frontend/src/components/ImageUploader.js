import React, { useRef } from "react";
import { Box, Button } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useTranslation } from "react-i18next";

function ImageUploader({ onChange }) {
  const inputRef = useRef(null);
  const { t } = useTranslation();

  const handleChange = (e) => {
    onChange(e);
    e.target.value = null; // reset inputa
  };

  return (
    <Box sx={{ mb: 3, width: "100%" }}>
      <label htmlFor="upload-button" style={{ cursor: "pointer", width: "100%" }}>
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
          sx={{ fontWeight: 600, width: "100%" }}
        >
          {t("foto_selection")}
        </Button>
      </label>
    </Box>
  );
}

export default ImageUploader;
