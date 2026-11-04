import React from "react";
import { Box, Button, Typography, useMediaQuery } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { darkTheme } from "../styles/theme";
import SEO from "../components/SEO";
import SeoContent from "../components/SeoContent";
import SEO_PAGES from "../constants/seoPages.json";
import { seoRoute } from "../utils/localizedRoutes";

// Strony docelowe pod konkretne wyszukiwania (zdjęcie do paszportu, szablon 10×15, legitymacja, prawo jazdy).
// Cała treść jest w constants/seoPages.json - nowa strona to wpis tam, trasa w App.js i adres w sitemap.xml.
const DocumentLandingPage = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isSmallScreen = useMediaQuery("(max-width:600px)");
  const page = SEO_PAGES[seoRoute(pathname)];
  if (!page) return null;

  const cta = (
    <Button variant="contained" size="large" onClick={() => navigate("/")}>
      {page.cta || "Zrób zdjęcie teraz"}
    </Button>
  );

  return (
    <>
      <SEO />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          p: isSmallScreen ? 2 : 4,
          width: isSmallScreen ? "95vw" : "80vw",
          margin: "20px auto",
          color: darkTheme.palette.text.primary,
          background: "linear-gradient(135deg, #1f2937 0%, #374151 100%)",
          borderRadius: 3,
          boxShadow: darkTheme.shadows[4],
          gap: 3,
        }}
      >
        <Typography variant={isSmallScreen ? "h5" : "h4"} component="h1" fontWeight={600}>
          {page.h1}
        </Typography>

        {(page.paragraphs || []).map((text, i) => (
          <Typography key={i} variant="body1" color="text.secondary" sx={{ maxWidth: 760 }}>
            {text}
          </Typography>
        ))}

        {cta}

        <Box
          component="img"
          src="/images/correct_id_photo.png"
          alt="Przykład poprawnego zdjęcia do dokumentu 35×45 mm"
          loading="lazy"
          sx={{ width: { xs: "60%", sm: 180 }, borderRadius: 2, boxShadow: 3 }}
        />

        <SeoContent page={page} />

        {cta}
      </Box>
    </>
  );
};

export default DocumentLandingPage;
