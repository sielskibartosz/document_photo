import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  CssBaseline,
  ThemeProvider,
  Select,
  MenuItem,
  useMediaQuery,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { TABS } from "./constants/tabs";
import { buttonBaseStyle } from "./styles/buttonStyles";
import FrameBox from "./styles/imagesStyles";
import { parseAspectRatio } from "./utils/cropImage";
import { darkTheme } from "./styles/theme";

import PrivacyPolicy from "./components/PrivacyPolicy";
import TabSelector from "./components/TabSelector";
import TabContent from "./components/TabContent";
import SheetManager from "./components/SheetManager";
import CropperActions from "./components/CropperActions";
import SheetMinature from "./components/SheetMinature";
import RemoveBackgroundPanel from "./components/removeBackgroundPanel";
import useSheetManager from "./hooks/useSheetManager";
import useImageCrop from "./hooks/useImageCrop";

function App() {
  const { i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState("id");
  const [aspectInput, setAspectInput] = useState(TABS[0].aspect);
  const [selectedFormat, setSelectedFormat] = useState("10/15 cm Rossmann");
  const [bgColor, setBgColor] = useState("#ffffff");

  const aspectRatio = parseAspectRatio(aspectInput);
  const isSmallScreen = useMediaQuery("(max-width:600px)");

  // Hook do obsługi obrazu
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

  // Hook do arkusza
  const {
    sheetImages,
    setSheetImages,
    selectedSheetUrl,
    setSelectedSheetUrl,
    thumbnailUrl,
    setThumbnailUrl,
    showFullSheet,
    addToSheet,
    duplicateLastImage,
    clearSheet,
    toggleSheet
  } = useSheetManager();

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    const tab = TABS.find((t) => t.key === tabKey);
    setAspectInput(tab.aspect);
    reset(); // resetuje crop, zoom, obraz itp.
  };

  const handleLanguageChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  // Responsive kolumn
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

      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 1, px: 1, py: 0.5, mb: 0.25, backgroundColor: "background.paper", fontSize: "0.875rem" }}>
        <PrivacyPolicy sx={{ cursor: "pointer", fontSize: "0.875rem" }} />
        <Select value={i18n.language} onChange={handleLanguageChange} size="small" sx={{ fontSize: "0.875rem", height: 28 }}>
          <MenuItem value="pl">PL</MenuItem>
          <MenuItem value="en">EN</MenuItem>
          <MenuItem value="de">DE</MenuItem>
        </Select>
      </Box>

      <Box sx={{ padding: 4, width: "80vw", margin: "10px auto 40px auto", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", color: darkTheme.palette.text.primary, background: darkTheme.palette.mode === "dark" ? "linear-gradient(135deg, #1f2937 0%, #374151 100%)" : "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)", borderRadius: 3, boxShadow: darkTheme.shadows[4] }}>

        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 4 }}>
          <Typography variant="h4" fontWeight={700} sx={{ textShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            {i18n.t("title")}
          </Typography>
        </Box>

        <TabSelector tabs={TABS} activeTab={activeTab} onTabChange={handleTabChange} />

        <Box sx={{ position: "relative", width: "100%", mt: 2 }}>
          <TabContent
            tabKey={activeTab}
            aspectInput={aspectInput}
            setAspectInput={setAspectInput}
            selectedFormat={selectedFormat}
            setSelectedFormat={setSelectedFormat}
            onFileChange={onFileChange}
            bgColor={bgColor}
            setBgColor={setBgColor}
          />

          {thumbnailUrl && (
            <Box onClick={toggleSheet} sx={{ position: isSmallScreen ? "static" : "absolute", bottom: isSmallScreen ? "auto" : 10, right: isSmallScreen ? "auto" : 650, width: 80, cursor: "pointer", display: "flex", justifyContent: "center", mt: 0, mb: 2 }}>
              <SheetMinature thumbnailUrl={thumbnailUrl} />
            </Box>
          )}
        </Box>

        {sheetImages.length > 0 && showFullSheet && (
          <Box sx={{ mb: 4 }}>
            <SheetManager
              sheetImages={sheetImages}
              setSheetImages={setSheetImages}
              sheetUrl={selectedSheetUrl}
              setSheetUrl={setSelectedSheetUrl}
              setThumbnailUrl={setThumbnailUrl}
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
            <CropperActions
              imageSrc={imageSrc}
              crop={crop}
              setCrop={setCrop}
              zoom={zoom}
              setZoom={setZoom}
              aspectRatio={aspectRatio}
              onCropped={(cropped) => { setCroppedImage(cropped); setNoBgImage(null); }}
              onClear={reset}
            />
          </FrameBox>
        )}

        {croppedImage && (
          <FrameBox>
            <RemoveBackgroundPanel
              croppedImage={croppedImage}
              aspectRatio={aspectRatio}
              bgColor={activeTab === "custom" ? bgColor : "#ffffff"}
              setNoBgImage={setNoBgImage}
              onAddToSheet={(img) => { addToSheet(img, aspectRatio); reset(); }}
              onClear={() => { setCroppedImage(null); setNoBgImage(null); }}
            />
          </FrameBox>
        )}
      </Box>
    </ThemeProvider>
  );
}

export default App;
