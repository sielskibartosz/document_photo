import React, { useState, useEffect } from "react";
import {
  Box,
  CssBaseline,
  ThemeProvider,
  useMediaQuery,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { TABS } from "./constants/tabs";
import { buttonBaseStyle } from "./styles/buttonStyles";
import FrameBox from "./styles/imagesStyles";
import { parseAspectRatio } from "./utils/cropImage";
import { darkTheme } from "./styles/theme";

import CropperPanel from "./components/CropperPanel";
import AppTitle from "./components/AppTitle";
import AppHeader from "./components/AppHeader";
import TabSelector from "./components/TabSelector";
import TabContent from "./components/TabContent";
import SheetManager from "./components/SheetManager";
import useSheetManager from "./hooks/useSheetManager";
import useImageCrop from "./hooks/useImageCrop";

function App() {
  const { i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState("id");
  const [aspectInput, setAspectInput] = useState(TABS[0].aspect);
  const [selectedFormat, setSelectedFormat] = useState("10x15 cm Rossmann");

  // ✅ osobny kolor dla każdej zakładki
  const [bgColors, setBgColors] = useState({
    id: "#ffffff",        // zawsze biały
    custom: "#ffffff",    // startowo biały, można zmieniać
    selfie: "#ffffff",    // startowo biały
  });

  const aspectRatio = parseAspectRatio(aspectInput);
  const isSmallScreen = useMediaQuery("(max-width:600px)");

  const {
    imageSrc,
    crop,
    setCrop,
    zoom,
    setZoom,
    croppedImage,
    setCroppedImage,
    noBgImage,
    setNoBgImage,
    onFileChange,
    reset
  } = useImageCrop();

  const {
    sheetImages,
    setSheetImages,
    selectedSheetUrl,
    setSelectedSheetUrl,
    showFullSheet,
    addToSheet,
    duplicateLastImage,
    clearSheet,
    toggleSheet
  } = useSheetManager();

  // aktualny kolor dla aktywnej zakładki
  const currentBgColor = bgColors[activeTab];

  // zmiana koloru tylko w zakładce nie-ID
  const handleBgColorChange = (color) => {
    if (activeTab === "id") return; // blokada zmiany w ID
    setBgColors((prev) => ({
      ...prev,
      [activeTab]: color,
    }));
  };

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    const tab = TABS.find((t) => t.key === tabKey);
    setAspectInput(tab.aspect);
    reset();
  };

  // Responsive kolumny dla SheetManager
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

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AppHeader i18n={i18n} />

      <Box
        sx={{
          padding: isSmallScreen ? 2 : 4,
          width: isSmallScreen ? "95vw" : "80vw",
          margin: "10px auto 40px auto",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          color: darkTheme.palette.text.primary,
          background: darkTheme.palette.mode === "dark"
            ? "linear-gradient(135deg, #1f2937 0%, #374151 100%)"
            : "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          borderRadius: 3,
          boxShadow: darkTheme.shadows[4],
        }}
      >
        <AppTitle title={i18n.t("title")} />

        <TabSelector tabs={TABS} activeTab={activeTab} onTabChange={handleTabChange} />

        <Box sx={{ position: "relative", width: "100%", mt: 2 }}>
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
            bgColor={currentBgColor}                   // aktywny kolor dla zakładki
            setBgColor={handleBgColorChange}           // zmiana tylko jeśli nie ID
          />
        </Box>

        {sheetImages.length > 0 && showFullSheet && (
          <Box sx={{ mb: 4 }}>
            <SheetManager
              sheetImages={sheetImages}
              setSheetImages={setSheetImages}
              sheetUrl={selectedSheetUrl}
              setSheetUrl={setSelectedSheetUrl}
              selectedFormat={selectedFormat}
              duplicateImage={duplicateLastImage}
              showSheetPreview={showFullSheet}
              clearSheet={clearSheet}
              cols={cols}
              buttonBaseStyle={buttonBaseStyle}
            />
          </Box>
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
              onAddToSheet={(img) => { addToSheet(img, aspectRatio); reset(); }}
              onClear={reset}
              activeTab={activeTab}
              bgColor={currentBgColor}  // zawsze kolor zakładki
            />
          </FrameBox>
        )}
      </Box>
    </ThemeProvider>
  );
}

export default App;
