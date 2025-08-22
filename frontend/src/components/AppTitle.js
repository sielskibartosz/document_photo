// components/AppTitle.js
import React from "react";
import { Typography, Box } from "@mui/material";

export default function AppTitle({ title }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 4 }}>
      <Typography variant="h4" fontWeight={700} sx={{ textShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        {title}
      </Typography>
    </Box>
  );
}
