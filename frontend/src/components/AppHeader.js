// components/AppHeader.js
import React from "react";
import { Box, Select, MenuItem } from "@mui/material";
import PrivacyPolicy from "./PrivacyPolicy";

export default function AppHeader({ i18n }) {
  const handleLanguageChange = (e) => i18n.changeLanguage(e.target.value);

  return (
    <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 1, px: 1, py: 0.5, mb: 0.25, backgroundColor: "background.paper", fontSize: "0.875rem" }}>
      <PrivacyPolicy sx={{ cursor: "pointer", fontSize: "0.875rem" }} />
      <Select value={i18n.language} onChange={handleLanguageChange} size="small" sx={{ fontSize: "0.875rem", height: 28 }}>
        <MenuItem value="pl">PL</MenuItem>
        <MenuItem value="en">EN</MenuItem>
        <MenuItem value="de">DE</MenuItem>
      </Select>
    </Box>
  );
}
