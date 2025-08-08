import React from "react";
import { Paper, Typography } from "@mui/material";

function ImagePreview({ image, aspectRatio }) {
  return (
    <Paper
      elevation={3}
      sx={{
        width: "100%",       // pełna szerokość rodzica
        maxWidth: "360px",       // max 360px na dużych ekranach
        aspectRatio: aspectRatio, // zachowanie proporcji (nowoczesne przeglądarki)
        backgroundColor: "#f0f0f0",
        overflow: "hidden",
        borderRadius: 2,
        position: "relative",
      }}
    >
      {image ? (
        <img
          src={image}
          alt="Podgląd zdjęcia"
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      ) : (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          Brak zdjęcia
        </Typography>
      )}
    </Paper>
  );
}

export default ImagePreview;
