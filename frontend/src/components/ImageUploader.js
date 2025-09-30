import React, { useRef, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useTranslation } from "react-i18next";

function ImageUploader({ onChange }) {
  const inputRef = useRef(null);
  const { t } = useTranslation();
  const [open, setOpen] = useState(false); // stan Dialogu

  const handleChange = (e) => {
    onChange(e);
    e.target.value = null; // reset inputa
  };

  return (
    <Box sx={{ mb: 3, width: "100%", display: "flex", flexDirection: "column", gap: 0.5 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
            sx={{ fontWeight: 500, width: "100%" }}
          >
            {t("foto_selection", "Wybierz zdjęcie")}
          </Button>
        </label>

        {/* Ikona info otwierająca Dialog */}
        <IconButton
          size="small"
          aria-label="info"
          sx={{ p: 0, color: "primary.main" }}
          onClick={() => setOpen(true)}
        >
          <InfoOutlinedIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Dialog z informacją */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogContent>
          <Typography>
            {t("foto_upload_info", "Możesz przesłać zdjęcie w formacie JPG lub PNG.")}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>
            {t("close", "Zamknij")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ImageUploader;
