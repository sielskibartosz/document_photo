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
import { useMediaQuery } from "@mui/material";

import PrivacyPolicy from "./components/PrivacyPolicy";
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
  const [croppedImage, setCroppedImage] = useState(null);
  const [noBgImage, setNoBgImage] = useState(null);

  const [selectedFormat, setSelectedFormat] = useState("10/15 cm");
  const [sheetImages, setSheetImages] = useState([]);
  const [selectedSheetUrl, setSelectedSheetUrl] = useState(null);
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [showFullSheet, setShowFullSheet] = useState(false);
  const [bgColor, setBgColor] = useState("#ffffff");

  const aspectRatio = parseAspectRatio(aspectInput);

  const resetImageStates = () => {
    setImageSrc(null);
    setCroppedImage(null);
    setNoBgImage(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1.9);
  };

  const isSmallScreen = useMediaQuery("(max-width:600px)");

  const onFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64 = await readFile(file);

    setImageSrc(base64);
    setCroppedImage(null);
    setNoBgImage(null);
    setShowFullSheet(false);
  };

  const addToSheet = () => {
    if (!noBgImage) return;
    setSheetImages((prev) => [...prev, { image: noBgImage, aspectRatio }]);
    resetImageStates();
    setShowFullSheet(true);
  };

  const duplicateLastImage = () => {
    if (!sheetImages.length) return;
    setSheetImages((prev) => [...prev, prev[prev.length - 1]]);
    setShowFullSheet(true);
  };

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    const tab = TABS.find((t) => t.key === tabKey);
    setAspectInput(tab.aspect);
    resetImageStates();
    setShowFullSheet(false);
  };

  const clearSheet = () => {
    setSheetImages([]);
    setSelectedSheetUrl(null);
    setThumbnailUrl(null);
    setShowFullSheet(false);
  };

  const handleLanguageChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };

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

  const toggleSheet = () => setShowFullSheet((prev) => !prev);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />

      {/* 🔹 Header nad całą aplikacją */}
      <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 1,
            px: 1,        // minimalny padding poziomy
            py: 0.5,      // minimalny padding pionowy
            mb: 0.25,
            backgroundColor: "background.paper",
            fontSize: "0.875rem", // mniejszy font jeśli trzeba
          }}
        >
          <PrivacyPolicy sx={{ cursor: "pointer", fontSize: "0.875rem" }} />
          <Select
            value={i18n.language}
            onChange={handleLanguageChange}
            size="small"
            sx={{ fontSize: "0.875rem", height: 28 }} // zmniejszamy rozmiar selecta
          >
            <MenuItem value="pl">PL</MenuItem>
            <MenuItem value="en">EN</MenuItem>
            <MenuItem value="de">DE</MenuItem>
          </Select>
        </Box>

      <Box
        sx={(theme) => ({
          padding: 4,
          width: "80vw",
          margin: "10px auto 40px auto",
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
        {/* Nagłówek z tytułem */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
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

        <TabSelector
          tabs={TABS}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

        {/* TabContent + miniatura */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            mt: 2,
          }}
        >
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
            <>
              {isSmallScreen ? (
                <Box
                  sx={{
                    mt: 0,
                    mb: 2,
                    display: "flex",
                    justifyContent: "center",
                  }}
                  onClick={toggleSheet}
                >
                  <SheetMinature thumbnailUrl={thumbnailUrl} />
                </Box>
              ) : (
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 10,
                    right: 0,
                    width: 80,
                    cursor: "pointer",
                    zIndex: 10,
                  }}
                  onClick={toggleSheet}
                >
                  <SheetMinature thumbnailUrl={thumbnailUrl} />
                </Box>
              )}
            </>
          )}
        </Box>

        {/* Arkusz */}
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

        {/* CropperActions */}
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
              onClear={resetImageStates}
            />
          </FrameBox>
        )}

        {/* RemoveBackgroundPanel */}
        {croppedImage && (
          <FrameBox>
            <RemoveBackgroundPanel
              croppedImage={croppedImage}
              aspectRatio={aspectRatio}
              bgColor={activeTab === "custom" ? bgColor : "#ffffff"}
              setNoBgImage={setNoBgImage}
              onAddToSheet={(img) => {
                setSheetImages((prev) => [
                  ...prev,
                  { image: img, aspectRatio },
                ]);
                resetImageStates();
                setShowFullSheet(true);
              }}
              onClear={() => {
                setCroppedImage(null);
                setNoBgImage(null);
              }}
            />
          </FrameBox>
        )}
      </Box>
    </ThemeProvider>
  );
}

export default App;
