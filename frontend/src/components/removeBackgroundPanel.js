import React, { useState } from "react";
import ImagePreview from "./ImagePreview";
import { Box, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { BACKEND_URL } from "../constants/backendConfig";

function RemoveBackgroundPanel({ croppedImage, aspectRatio, setNoBgImage, bgColor = "#ffffff" }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  // Funkcja pomocnicza do konwersji data URL -> Blob
  const dataURLtoBlob = (dataurl) => {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  const removeBackground = async () => {
    if (!croppedImage) return;
    setLoading(true);

    try {
      // Konwersja data URL na Blob lub pobranie z URL
      const blob = croppedImage.startsWith("data:")
        ? dataURLtoBlob(croppedImage)
        : await (await fetch(croppedImage)).blob();

      const formData = new FormData();
      formData.append("image", blob, "cropped.png");
      formData.append("bg_color", bgColor);

      const response = await fetch(`${BACKEND_URL}/remove-background/`, { // <- poprawione
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        try {
          const errData = await response.json();
          throw new Error(errData.detail || t("remove_bg_error", "Błąd przy usuwaniu tła"));
        } catch {
          throw new Error(t("remove_bg_error", "Błąd przy usuwaniu tła"));
        }
      }

      // 📌 odbiór jako BLOB zamiast base64
      const resultBlob = await response.blob();
      const objectUrl = URL.createObjectURL(resultBlob);

      // ustawiamy Blob URL zamiast base64
      setNoBgImage(objectUrl);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={2} mt={0}>
      <ImagePreview image={croppedImage} aspectRatio={aspectRatio} />
      <Button
        variant="contained"
        onClick={removeBackground}
        disabled={loading}
        sx={{ fontWeight: 600 }}
      >
        {loading ? t("removing_bg", "Usuwanie...") : t("remove_bg", "Usuń tło")}
      </Button>
    </Box>
  );
}

export default RemoveBackgroundPanel;
