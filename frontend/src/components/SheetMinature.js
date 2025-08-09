import React from "react";
import { Box, Typography } from "@mui/material";

const SheetMinature = ({ thumbnailUrl, onClick }) => (
  <Box
    onClick={onClick}
    title="Podgląd arkusza"
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      cursor: "pointer",
      ml: 2.5, // marginLeft: 20px
      userSelect: "none",
      "&:hover img": {
        borderColor: "primary.main",
        boxShadow: (theme) => `0 0 8px ${theme.palette.primary.main}`,
      },
      transition: "border-color 0.3s, box-shadow 0.3s",
    }}
  >
    <Typography
      variant="caption"
      sx={{ mb: 0.75, color: "text.secondary", userSelect: "none" }}
    >
      Miniatura arkusza
    </Typography>
    <Box
      component="img"
      src={thumbnailUrl}
      alt="Miniatura arkusza"
      sx={{
        width: 80,
        height: 80,
        objectFit: "cover",
        border: "3px solid",
        borderColor: "primary.main",
        borderRadius: 1,
        userSelect: "none",
      }}
    />
  </Box>
);

export default SheetMinature;
