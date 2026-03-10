// TabContent.js - Komputer: zdjęcia bliżej + BEZ strzałek
import React, { useState } from "react";
import { Box, Typography, IconButton, Link } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { TABS, TAB_DESCRIPTION } from "../constants/tabs";
import AspectInput from "./AspectInput";
import FormatSelector from "./FormatSelector";
import ImageUploader from "./ImageUploader";
import FotoBackgroundColor from "./FotoBackgroundColor";



const TabContent = ({
  tabKey,
  aspectInput,
  setAspectInput,
  selectedFormat,
  setSelectedFormat,
  onFileChange,
  bgColor,
  setBgColor,
}) => {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState(1);

  const tab = TAB_DESCRIPTION[tabKey] || {};
  const tabFromList = TABS.find((t) => t.key === tabKey);
  const aspect = tabFromList ? tabFromList.aspect : "";

  const hasCarouselAssets = tabKey === "id" || tabKey === "custom";
  const steps = [
    { src: tabKey === "id" ? "/images/ai_ID_before.jpg" : "/images/custom_before.jpg", alt: "Przed edycją" },
    { src: tabKey === "id" ? "/images/ai_ID_solo.jpg" : "/images/custom_solo.jpg", alt: "Przycięte bez tła" },
    { src: tab.image || (tabKey === "id" ? "/images/ai_ID_final.jpg" : "/images/custom_final.jpg"), alt: "Gotowy arkusz" }
  ];

  const goPrev = () => setActiveStep((activeStep - 1 + steps.length) % steps.length);
  const goNext = () => setActiveStep((activeStep + 1) % steps.length);

  return (
    <Box sx={{ textAlign: "center", mb: 0, "& > *": { mb: 0 } }}>
      {hasCarouselAssets ? (
        <Box sx={{
          width: "100%",
          maxWidth: { xs: 320, sm: 420, md: 520, lg: 600 },
          height: { xs: 200, sm: 260, md: 320, lg: 360 },
          mx: "auto",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "visible",
          mb: { xs: tabKey === "custom" ? 3 : 2, sm: 2 }
        }}
        role="region"
        aria-label="Karuzela przykładów"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") goPrev();
          if (e.key === "ArrowRight") goNext();
        }}
        >
          {/* Poprzednie zdjęcie */}
          <Box
            sx={{
              position: "absolute",
              left: { xs: "-2%", md: "-0.5%" },
              top: "50%",
              transform: `translateY(-50%) scale(${tabKey === "id" || tabKey === "custom" ? "0.85" : "0.9"})`,
              opacity: 0.6,
              zIndex: 1,
              transition: "all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
            onClick={goPrev}
          >
            <Box
              component="img"
              src={steps[(activeStep - 1 + steps.length) % steps.length].src}
              alt="Poprzednie"
              sx={{
                maxWidth: { xs: "120px", md: "160px" },
                maxHeight: { xs: "160px", md: "210px" },
                width: "auto",
                height: "auto",
                objectFit: "contain",
                display: "block",
                borderRadius: "12px",
                boxShadow: "0 4px 20px rgba(25, 118, 210, 0.4), 0 2px 8px rgba(0,0,0,0.15)"
              }}
            />
          </Box>

          {/* Aktywne zdjęcie - środek */}
          <Box sx={{
            position: "relative",
            zIndex: 3,
            cursor: "pointer",
            transition: "all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
            onClick={goNext}
          >
            <Box
              component="img"
              src={steps[activeStep].src}
              alt={steps[activeStep].alt}
              sx={{
                maxWidth: { xs: "180px", md: "280px" },
                maxHeight: { xs: "220px", md: "340px" },
                width: "auto",
                height: "auto",
                objectFit: "contain",
                display: "block",
                borderRadius: "16px",
                boxShadow: "0 8px 32px rgba(25, 118, 210, 0.5), 0 4px 16px rgba(0,0,0,0.2)",
                transition: "all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
              }}
            />
          </Box>

          {/* Następne zdjęcie */}
          <Box
            sx={{
              position: "absolute",
              right: { xs: "-2%", md: "-0.5%" },
              top: "50%",
              transform: `translateY(-50%) scale(${tabKey === "id" || tabKey === "custom" ? "0.85" : "0.9"})`,
              opacity: 0.6,
              zIndex: 1,
              transition: "all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
            onClick={goNext}
          >
            <Box
              component="img"
              src={steps[(activeStep + 1) % steps.length].src}
              alt="Następne"
              sx={{
                maxWidth: { xs: "120px", md: "160px" },
                maxHeight: { xs: "160px", md: "210px" },
                width: "auto",
                height: "auto",
                objectFit: "contain",
                display: "block",
                borderRadius: "12px",
                boxShadow: "0 4px 20px rgba(25, 118, 210, 0.4), 0 2px 8px rgba(0,0,0,0.15)"
              }}
            />
          </Box>

          <IconButton
            aria-label="Poprzednie zdjęcie"
            onClick={goPrev}
            size="small"
            sx={{
              position: "absolute",
              left: { xs: -6, sm: -10 },
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 4,
              backgroundColor: "rgba(255,255,255,0.8)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              "&:hover": { backgroundColor: "rgba(255,255,255,0.95)" }
            }}
          >
            <ChevronLeftIcon />
          </IconButton>

          <IconButton
            aria-label="Następne zdjęcie"
            onClick={goNext}
            size="small"
            sx={{
              position: "absolute",
              right: { xs: -6, sm: -10 },
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 4,
              backgroundColor: "rgba(255,255,255,0.8)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              "&:hover": { backgroundColor: "rgba(255,255,255,0.95)" }
            }}
          >
            <ChevronRightIcon />
          </IconButton>
        </Box>
      ) : (
        tab.image && (
          <Box sx={{
            width: "100%",
            maxWidth: { xs: 320, sm: 420, md: 520, lg: 600 },
            height: { xs: 200, sm: 260, md: 320, lg: 360 },
            mx: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <Box
              component="img"
              src={tab.image}
              alt={t(tabFromList?.labelKey || "")}
              sx={{
                maxWidth: { xs: "180px", md: "240px" },
                maxHeight: { xs: "220px", md: "290px" },
                width: "auto",
                height: "auto",
                objectFit: "contain",
                display: "block",
                borderRadius: "16px",
                boxShadow: "0 8px 32px rgba(25, 118, 210, 0.5), 0 4px 16px rgba(0,0,0,0.2)"
              }}
            />
          </Box>
        )
      )}

      {hasCarouselAssets && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 1,
            mb: 1
          }}
          aria-label="Nawigacja karuzeli"
        >
          {steps.map((_, idx) => (
            <Box
              key={idx}
              component="button"
              type="button"
              aria-label={`Przejdź do slajdu ${idx + 1}`}
              onClick={() => setActiveStep(idx)}
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                border: "none",
                padding: 0,
                cursor: "pointer",
                backgroundColor: idx === activeStep ? "primary.main" : "grey.400"
              }}
            />
          ))}
        </Box>
      )}

      {/* Tytuł i linki */}
      {tab.title && (
        <Typography variant="body1" sx={{ mb: 0.5, mt: 0.5, fontWeight: "normal", textAlign: "center", lineHeight: 1.2 }}>
          {tab.title}
        </Typography>
      )}

      {/* Linki: tab link / How it Works / FotoTips */}
      <Box sx={{
        display: "inline-flex",
        alignItems: "center",
        mt: { xs: 1.5, sm: 0.5 },
        fontWeight: 500,
        mx: "auto",
        gap: 0.5,
        fontSize: 14
      }}>
        {tab.link && (
          <Link
            component={RouterLink}
            to={tab.link}
            underline="hover"
            sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}
          >
            {t("id_link")}
          </Link>
        )}

        <Typography sx={{ mx: 1, color: "text.primary" }}>|</Typography>

        <Link
          component={RouterLink}
          to="/how-it-works"
          underline="hover"
          sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}
        >
          {t("how_it_works.link_text", "Jak działa aplikacja")}
        </Link>

        <Typography sx={{ mx: 1, color: "text.primary" }}>|</Typography>

        <Link
          component={RouterLink}
          to="/foto-tips"
          underline="hover"
          sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}
        >
          {t("foto_tips.link_text", "Wskazówki do zdjęcia")}
        </Link>
      </Box>

      {/* Selektory i uploader */}
      <Box sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: { xs: 1.5, sm: 2 },
        mt: { xs: 2, sm: 2 },
        mx: "auto",
        width: "100%",
        maxWidth: 220,
        position: "relative",
        left: 13
      }}>
        <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
          <FormatSelector selectedFormat={selectedFormat} setSelectedFormat={setSelectedFormat} sx={{ width: "100%" }} />
        </Box>
        {tabKey === "custom" && (
          <>
            <AspectInput value={aspectInput} onChange={(val) => setAspectInput(val)} placeholder={`np. ${aspect}`} sx={{ width: "100%" }} />
            <FotoBackgroundColor color={bgColor || "#ffffff"} onChange={setBgColor} sx={{ width: "100%" }} />
          </>
        )}
        <ImageUploader onChange={onFileChange} sx={{ width: "100%" }} />
      </Box>
    </Box>
  );
};

export default TabContent;
