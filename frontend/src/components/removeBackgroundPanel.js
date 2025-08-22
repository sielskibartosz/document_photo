import React, { useState } from "react";
import ImagePreview from "./ImagePreview";
import { Box, Button, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTranslation } from "react-i18next";
import { BACKEND_URL } from "../constants/backendConfig";

function RemoveBackgroundPanel({ croppedImage, aspectRatio, setNoBgImage, onAddToSheet, bgColor = "#ffffff", onClear }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const dataURLtoBlob = (dataurl) => {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new Blob([u8arr], { type: mime });
  };

  const removeBackground = async () => {
    if (!croppedImage) return;
    setLoading(true);

    try {
      const blob = croppedImage.startsWith("data:")
        ? dataURLtoBlob(croppedImage)
        : await (await fetch(croppedImage)).blob();

      const formData = new FormData();
      formData.append("image", blob, "cropped.png");
      formData.append("bg_color", bgColor);

      // 🔹 Fetch POST do backend
      const response = await fetch(`${BACKEND_URL}/remove-background`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || t("remove_bg_error", "Błąd przy usuwaniu tła"));
      }

      const resultJson = await response.json();
      const imageData = resultJson.image;
      const byteCharacters = atob(imageData);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) byteNumbers[i] = byteCharacters.charCodeAt(i);
      const byteArray = new Uint8Array(byteNumbers);
      const objectUrl = URL.createObjectURL(new Blob([byteArray], { type: "image/png" }));

      setNoBgImage(objectUrl);

      // Automatycznie dodaj do sheet po usunięciu tła
      if (onAddToSheet) onAddToSheet(objectUrl);

    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToSheet = () => {
    if (croppedImage && onAddToSheet) onAddToSheet(croppedImage);
  };

  const handleClear = () => {
    setNoBgImage(null);
    if (onClear) onClear();
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
      <ImagePreview image={croppedImage} aspectRatio={aspectRatio} />
      <Box display="flex" justifyContent="center" alignItems="center" gap={1}>
        <Button
          variant="contained"
          onClick={handleAddToSheet}
          disabled={!croppedImage}
          sx={{ fontWeight: 600 }}
        >
          {t("add_to_sheet", "Dodaj do arkusza")}
        </Button>
        <Button
          variant="contained"
          onClick={removeBackground}
          disabled={loading || !croppedImage}
          sx={{ fontWeight: 600 }}
        >
          {loading ? t("removing_bg", "Usuwanie...") : t("remove_bg", "Usuń tło")}
        </Button>
        {onClear && (
          <IconButton color="primary" onClick={handleClear}>
            <DeleteIcon />
          </IconButton>
        )}
      </Box>
    </Box>
  );
}

export default RemoveBackgroundPanel;
