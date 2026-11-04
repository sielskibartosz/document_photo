// Dyskretna stopka z linkami do stron docelowych - Google lepiej ocenia strony, do których
// prowadzą zwykłe linki z serwisu, a nie tylko sitemap.xml.
import React from "react";
import { Box, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const LINKS = {
  pl: [
    ["/zdjecie-do-paszportu", "Zdjęcie do paszportu"],
    ["/szablon-zdjecia-do-dowodu", "Szablon 10×15"],
    ["/zdjecie-do-legitymacji", "Zdjęcie do legitymacji"],
    ["/zdjecie-do-prawa-jazdy", "Zdjęcie do prawa jazdy"],
    ["/karta-pobytu", "Zdjęcie do karty pobytu"],
  ],
  en: [["/en/residence-card", "Residence card photo"]],
  ua: [["/uk/karta-pobytu", "Фото на карту побиту"]],
};

export default function SiteFooter({ lang }) {
  const links = LINKS[lang] || LINKS.pl;

  return (
    <Box
      component="footer"
      sx={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: { xs: 1, sm: 2 },
        px: 2,
        pb: 3,
        fontSize: 12,
      }}
    >
      {links.map(([href, label]) => (
        <Link key={href} component={RouterLink} to={href} underline="hover" color="text.secondary">
          {label}
        </Link>
      ))}
    </Box>
  );
}
