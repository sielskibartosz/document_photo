import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  CssBaseline,
  ThemeProvider,
  Select,
  MenuItem,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { TABS } from "./constants/tabs";
import { buttonBaseStyle } from "./styles/buttonStyles";
import FrameBox from "./styles/imagesStyles";
import { parseAspectRatio } from "./utils/cropImage";
import { readFile } from "./utils/imageHelpers";
import { darkTheme } from "./styles/theme";

import TabSelector from "./components/TabSelector";
import TabContent from "./components/TabContent";
import SheetManager from "./components/SheetManager";
import CropperActions from "./components/CropperActions";
import SheetMinature from "./components/SheetMinature";
import RemoveBackgroundPanel from "./components/removeBackgroundPanel";
import AddToSheetPanel from "./components/addToSheetPanel";

function App() {
  const { i18n } = useTranslation();

  const [activeTab, setActiveTab] = useState("id");
  const [aspectInput, setAspectInput] = useState(TABS[0].aspect);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1.9);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [noBgImage, setNoBgImage] = useState(null);

  const [selectedFormat, setSelectedFormat] = useState("10/15 cm");
  const [sheetImages, setSheetImages] = useState([]);
  const [sheetHistory, setSheetHistory] = useState([]);
  const [selectedSheetUrl, setSelectedSheetUrl] = useState(null);
  const [showSheetPreview, setShowSheetPreview] = useState(false);
  const [sheetCreatedAfterNewPhoto, setSheetCreatedAfterNewPhoto] = useState(false);
  const [bgColor, setBgColor] = useState("#ffffff");

  const aspectRatio = parseAspectRatio(aspectInput);

  const resetImageStates = () => {
    setImageSrc(null);
    setCroppedImage(null);
    setNoBgImage(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1.9);
    setCroppedAreaPixels(null);
    setShowSheetPreview(false);
  };

  const onFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64 = await readFile(file);

    setImageSrc(base64);
    setCroppedImage(null);
    setNoBgImage(null);
    setShowSheetPreview(false);
    setSheetCreatedAfterNewPhoto(true);
  };

  const addToSheet = () => {
    if (!noBgImage) return;
    setSheetImages((prev) => [...prev, { image: noBgImage, aspectRatio }]);
    resetImageStates();
    setShowSheetPreview(true);
  };

  const duplicateLastImage = () => {
    if (!sheetImages.length) return;
    setSheetImages((prev) => [...prev, prev[prev.length - 1]]);
    setShowSheetPreview(true);
  };

  const onSheetGenerated = (url) => {
    setSelectedSheetUrl(url);
    if (sheetCreatedAfterNewPhoto) {
      setSheetHistory([url]);
      setSheetCreatedAfterNewPhoto(false);
    }
  };

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    const tab = TABS.find((t) => t.key === tabKey);
    setAspectInput(tab.aspect);
    resetImageStates();
  };

  const clearSheet = () => {
    setSheetImages([]);
    setSheetHistory([]);
    setSelectedSheetUrl(null);
    setShowSheetPreview(false);
  };

  const handleLanguageChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  const [cols, setCols] = useState(3);
  useEffect(() => {
    const handleResize = () =>
      setCols(window.innerWidth < 600 ? 1 : window.innerWidth < 900 ? 2 : 3);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />

      {/* Dropdown języka w prawym górnym rogu całej strony */}
      <Box
        sx={{
          position: "fixed",
          top: 8,
          right: 8,
          zIndex: 1000,
        }}
      >
        <Select
          value={i18n.language}
          onChange={handleLanguageChange}
          size="small"
          sx={{
            fontSize: "0.7rem",
            minWidth: 40,
            py: 0.2,
            px: 0.4,
          }}
        >
          <MenuItem value="pl">PL</MenuItem>
          <MenuItem value="en">EN</MenuItem>
        </Select>
      </Box>

      <Box
        sx={(theme) => ({
          padding: 4,
          width: "80vw",
          margin: "40px auto",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          color: theme.palette.text.primary,
          background:
            theme.palette.mode === "dark"
              ? "linear-gradient(135deg, #1f2937 0%, #374151 100%)"
              : "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          borderRadius: 3,
          boxShadow: theme.shadows[4],
          [theme.breakpoints.down("sm")]: {
            padding: 2,
            maxWidth: "90vw",
            margin: "20px auto",
          },
        })}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            mb: 4,
          }}
        >
          <Typography
            variant="h4"
            fontWeight={700}
            sx={{ textShadow: "0 1px 3px rgba(0,0,0,0.1)" }}
          >
            {i18n.t("title")}
          </Typography>
        </Box>

        <TabSelector tabs={TABS} activeTab={activeTab} onTabChange={handleTabChange} />

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

        {sheetHistory.length > 0 && sheetCreatedAfterNewPhoto && (
          <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
            <SheetMinature
              thumbnailUrl={sheetHistory[0]}
              onClick={() => setShowSheetPreview(true)}
            />
          </Box>
        )}

        <SheetManager
          sheetImages={sheetImages}
          setSheetImages={setSheetImages}
          sheetUrl={selectedSheetUrl}
          setSheetUrl={onSheetGenerated}
          selectedFormat={selectedFormat}
          buttonBaseStyle={buttonBaseStyle}
          duplicateImage={duplicateLastImage}
          showSheetPreview={showSheetPreview}
          setShowSheetPreview={setShowSheetPreview}
          clearSheet={clearSheet}
          cols={cols}
        />

        {imageSrc && (
          <FrameBox>
            <CropperActions
              imageSrc={imageSrc}
              crop={crop}
              setCrop={setCrop}
              zoom={zoom}
              setZoom={setZoom}
              aspectRatio={aspectRatio}
              onCropped={(cropped) => {
                setCroppedImage(cropped);
                setNoBgImage(null);
              }}
            />
          </FrameBox>
        )}

        {croppedImage && (
          <FrameBox>
            <RemoveBackgroundPanel
              croppedImage={croppedImage}
              aspectRatio={aspectRatio}
              setNoBgImage={setNoBgImage}
              bgColor={activeTab === "custom" ? bgColor : "#ffffff"}
            />
          </FrameBox>
        )}

        {noBgImage && (
          <FrameBox>
            <AddToSheetPanel
              image={noBgImage}
              aspectRatio={aspectRatio}
              onAddToSheet={addToSheet}
            />
          </FrameBox>
        )}
      </Box>
    </ThemeProvider>
  );
}

export default App;
