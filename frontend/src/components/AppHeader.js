import React from "react";
import { Box, Select, MenuItem } from "@mui/material";
import PrivacyPolicy from "./PrivacyPolicy";
import Donate from "./Donate";
import {PAYMENT_LINKS} from "../constants/paymentLinks";

export default function AppHeader({ i18n }) {
  const handleLanguageChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  // normalizacja: pl-PL → pl
  const currentLang = i18n.language?.split("-")[0] || "pl";
  const paymentLink = PAYMENT_LINKS[currentLang] || PAYMENT_LINKS.pl;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: 1,
        px: 1,
        py: 0.5,
        mb: 0.25,
        backgroundColor: "background.paper",
        fontSize: "0.875rem",
      }}
    >
      <PrivacyPolicy sx={{ cursor: "pointer", fontSize: "0.875rem" }} />

      {/*<Donate paymentLink={paymentLink} />*/}

      <Select
        value={currentLang}
        onChange={handleLanguageChange}
        size="small"
        displayEmpty
        sx={{
          fontSize: "0.875rem",
          height: 28,
          "& .MuiSelect-select": {
            py: 0.5,
          },
        }}
      >
        <MenuItem value="pl">PL</MenuItem>
        <MenuItem value="en">EN</MenuItem>
        <MenuItem value="de">DE</MenuItem>
        <MenuItem value="es">ES</MenuItem>
        <MenuItem value="fr">FR</MenuItem>
      </Select>
    </Box>
  );
}
