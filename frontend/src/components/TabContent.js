// TabContent.js - Komputer: zdjęcia bliżej + BEZ strzałek
import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import {
  KeyboardArrowLeft as ArrowLeftIcon,
  KeyboardArrowRight as ArrowRightIcon
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
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
          mb: { xs: tabKey === "custom" ? 4 : 2, sm: 2 }
        }}>
          {/* STRZĄŁKA LEWA - TYLKO MOBILE (md+) */}
          <Box
            sx={{
              position: "absolute",
              left: { xs: 8, md: 16 },
              top: "50%",
              transform: "translateY(-50%)",
              bgcolor: "transparent",
              color: "rgba(25, 118, 210, 0.9)",
              width: { xs: 28, md: 36 },
              height: { xs: 42, md: 52 },
              borderRadius: "24px",
              display: { xs: "none", md: "none" }, // ❌ BEZ STRZŁEK NA KOMPUTERZE
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.3s ease",
              zIndex: 5,
              "&:hover": {
                color: "primary.main",
                bgcolor: "rgba(25, 118, 210, 0.1)",
                transform: "translateY(-50%) scale(1.2)"
              }
            }}
            onClick={() => setActiveStep((activeStep - 1 + steps.length) % steps.length)}
          >
            <ArrowLeftIcon sx={{ fontSize: { xs: 28, md: 36 } }} />
          </Box>

          {/* POPRZEDNIE - LEWA - BLIŻEJ NA md+ */}
          <Box
            sx={{
              position: "absolute",
              left: { xs: "-2%", md: "-0.5%" }, // BLIŻEJ na komputerze
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
            onClick={() => setActiveStep((activeStep - 1 + steps.length) % steps.length)}
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

          {/* AKTYWNE - ŚRODEK - WIĘKSZE NA md+ */}
          <Box sx={{
            position: "relative",
            zIndex: 3,
            cursor: "pointer",
            transition: "all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
            onClick={() => setActiveStep((activeStep + 1) % steps.length)}
          >
            <Box
              component="img"
              src={steps[activeStep].src}
              alt={steps[activeStep].alt}
              sx={{
                maxWidth: { xs: "180px", md: "280px" }, // WIĘKSZE na komputerze
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

          {/* NASTĘPNE - PRAWA - BLIŻEJ NA md+ */}
          <Box
            sx={{
              position: "absolute",
              right: { xs: "-2%", md: "-0.5%" }, // BLIŻEJ na komputerze
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
            onClick={() => setActiveStep((activeStep + 1) % steps.length)}
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

          {/* STRZĄŁKA PRAWA - TYLKO MOBILE (md+) - UKRYTA */}
          <Box
            sx={{
              position: "absolute",
              right: { xs: 8, md: 16 },
              top: "50%",
              transform: "translateY(-50%)",
              bgcolor: "transparent",
              color: "rgba(25, 118, 210, 0.9)",
              width: { xs: 28, md: 36 },
              height: { xs: 42, md: 52 },
              borderRadius: "24px",
              display: { xs: "none", md: "none" }, // ❌ BEZ STRZŁEK NA KOMPUTERZE
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.3s ease",
              zIndex: 5,
              "&:hover": {
                color: "primary.main",
                bgcolor: "rgba(25, 118, 210, 0.1)",
                transform: "translateY(-50%) scale(1.2)"
              }
            }}
            onClick={() => setActiveStep((activeStep + 1) % steps.length)}
          >
            <ArrowRightIcon sx={{ fontSize: { xs: 28, md: 36 } }} />
          </Box>
        </Box>
      ) : (
        // ... reszta bez zmian
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

      {/* Reszta komponentów bez zmian */}
      {tab.title && (
        <Typography variant="body1" sx={{ mb: 0.5, mt: 0.5, fontWeight: "normal", textAlign: "center", lineHeight: 1.2 }}>
          {tab.title}
        </Typography>
      )}

      {tab.link && (
        <Box sx={{
          display: "inline-flex",
          alignItems: "center",
          mt: { xs: 1.5, sm: 0.5 },
          cursor: "pointer",
          color: "primary.main",
          fontWeight: 500,
          textDecoration: "underline",
          mx: "auto",
          gap: 0.5,
          fontSize: 14
        }}>
          <Box onClick={() => navigate(tab.link)} sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}>
            {t("id_link")}
          </Box>
          <Typography sx={{ mx: 1, color: "text.primary" }}>|</Typography>
          <Box onClick={() => navigate("/how-it-works")} sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}>
            {t("how_it_works.link_text", "Jak działa aplikacja")}
          </Box>
        </Box>
      )}

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
