import React, { useState, useEffect } from "react";
import { Box, useMediaQuery } from "@mui/material";

import { TABS } from "../constants/tabs";
import { buttonBaseStyle } from "../styles/buttonStyles";
import FrameBox from "../styles/imagesStyles";
import { parseAspectRatio } from "../utils/cropImage";
import { darkTheme } from "../styles/theme";

import CropperPanel from "../components/CropperPanel";
import AppTitle from "../components/AppTitle";
import TabSelector from "../components/TabSelector";
import TabContent from "../components/TabContent";
import SheetManager from "../components/SheetManager";

import useSheetManager from "../hooks/useSheetManager";
import useImageCrop from "../hooks/useImageCrop";

import { STRIPE_PRICE_ID_PROD_PLN, STRIPE_PRICE_ID_PROD_EUR } from "../constants/payments";
import { useTranslation } from "react-i18next";

const HomePage = () => {
  const { i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState("id");
  const [aspectInput, setAspectInput] = useState(TABS[0].aspect);
  const [selectedFormat, setSelectedFormat] = useState("10x15 cm Rossmann");
  const [bgColors, setBgColors] = useState({ id: "#fefcfb", custom: "#ffffff" });

  const aspectRatio = parseAspectRatio(aspectInput);
  const isSmallScreen = useMediaQuery("(max-width:600px)");

  const {
    imageSrc,
    crop,
    setCrop,
    zoom,
    setZoom,
    setNoBgImage,
    onFileChange,
    reset,
  } = useImageCrop();

  const {
    sheetImages,
    setSheetImages,
    selectedSheetUrl,
    setSelectedSheetUrl,
    showFullSheet,
    addToSheet,
    clearSheet,
    toggleSheet,
  } = useSheetManager();

  const currentBgColor = bgColors[activeTab];

  const handleBgColorChange = (color) => {
    if (activeTab === "id") return;
    setBgColors((prev) => ({ ...prev, [activeTab]: color }));
  };

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    const tab = TABS.find((t) => t.key === tabKey);
    setAspectInput(tab.aspect);
    reset();
  };

  // ---------------- responsive columns ----------------
  const [cols, setCols] = useState(3);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 600) setCols(1);
      else if (window.innerWidth < 900) setCols(2);
      else setCols(3);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ---------------- Stripe priceId w zależności od języka ----------------
  const currentLang = i18n.language?.split("-")[0] || "pl";
  const priceId = currentLang === "pl" ? STRIPE_PRICE_ID_PROD_PLN : STRIPE_PRICE_ID_PROD_EUR;

  return (
    <Box
      sx={{
        padding: isSmallScreen ? 2 : 4,
        width: isSmallScreen ? "95vw" : "80vw",
        margin: "10px auto 40px auto",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: darkTheme.palette.text.primary,
        background:
          darkTheme.palette.mode === "dark"
            ? "linear-gradient(135deg, #1f2937 0%, #374151 100%)"
            : "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        borderRadius: 3,
        boxShadow: darkTheme.shadows[4],
      }}
    >
      <AppTitle />

      <TabSelector
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      <TabContent
        tabKey={activeTab}
        aspectInput={aspectInput}
        setAspectInput={setAspectInput}
        selectedFormat={selectedFormat}
        setSelectedFormat={setSelectedFormat}
        onFileChange={(file) => {
          onFileChange(file);
          toggleSheet(false);
        }}
        bgColor={currentBgColor}
        setBgColor={handleBgColorChange}
      />

      {sheetImages.length > 0 && showFullSheet && (
        <SheetManager
          sheetImages={sheetImages}
          setSheetImages={setSheetImages}
          sheetUrl={selectedSheetUrl}
          setSheetUrl={setSelectedSheetUrl}
          selectedFormat={selectedFormat}
          showSheetPreview={showFullSheet}
          clearSheet={clearSheet}
          cols={cols}
          buttonBaseStyle={buttonBaseStyle}
          priceId={priceId} // <-- dynamiczny priceId w zależności od języka
        />
      )}

      {imageSrc && (
        <FrameBox>
          <CropperPanel
            imageSrc={imageSrc}
            crop={crop}
            setCrop={setCrop}
            zoom={zoom}
            setZoom={setZoom}
            aspectRatio={aspectRatio}
            setNoBgImage={setNoBgImage}
            onAddToSheet={(img) => {
              addToSheet(img, aspectRatio);
              reset();
            }}
            onClear={reset}
            activeTab={activeTab}
            bgColor={currentBgColor}
          />
        </FrameBox>
      )}
    </Box>
  );
};

export default HomePage;
