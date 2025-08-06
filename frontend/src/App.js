import React, { useState, useCallback } from "react";
import ImageUploader from "./components/ImageUploader";
import CropperWrapper from "./components/CropperWrapper";
import ImagePreview from "./components/ImagePreview";
import TabSelector from "./components/TabSelector";
import TabContent from "./components/TabContent";
import PrintFormatSelector from "./components/PrintFormatSelector";
import SheetManager from "./components/SheetManager";
import StyledButton from "./components/buttons/StyledButton";

import { TABS } from "./constants/tabs";
import { buttonBaseStyle } from "./styles/buttonStyles";
import { mainContainer } from "./styles/mainContainer";
import { uploaderContainer, inputStyle, frameStyle } from "./styles/imagesStyles";
import { headerText } from "./styles/textStyles";

import { parseAspectRatio, getCroppedImg } from "./utils/cropImage";
import { readFile } from "./utils/imageHelpers";

function App() {
  const [activeTab, setActiveTab] = useState("id");
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1.9);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [noBgImage, setNoBgImage] = useState(null);
  const [aspectInput, setAspectInput] = useState(TABS[0].aspect);
  const [selectedFormat, setSelectedFormat] = useState("10/15 cm");
  const [sheetImages, setSheetImages] = useState([]);
  const [sheetHistory, setSheetHistory] = useState([]);
  const [selectedSheetUrl, setSelectedSheetUrl] = useState(null);
  const [showSheetPreview, setShowSheetPreview] = useState(false);
  const [sheetCreatedAfterNewPhoto, setSheetCreatedAfterNewPhoto] = useState(false);

  const aspectRatio = parseAspectRatio(aspectInput) || 35 / 45;

  const onCropComplete = useCallback((_, areaPixels) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

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

  const createCroppedImage = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    const width = 350;
    const height = width / aspectRatio;
    const cropped = await getCroppedImg(imageSrc, croppedAreaPixels, width, height);
    setCroppedImage(cropped);
    setNoBgImage(null);
  };

  const removeBackground = async () => {
    if (!croppedImage) return;

    try {
      const res = await fetch(croppedImage);
      const blob = await res.blob();

      const formData = new FormData();
      formData.append("image", blob, "cropped.png");

      const response = await fetch("http://localhost:8000/api/remove-bg/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Błąd przy usuwaniu tła");

      const data = await response.json();
      setNoBgImage("data:image/png;base64," + data.image_no_bg);
    } catch (error) {
      alert(error.message);
    }
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

  // Funkcja czyszczenia arkusza - wywoływana z SheetManager
  const clearSheet = () => {
    setSheetImages([]);
    setSheetHistory([]);
    setSelectedSheetUrl(null);
    setShowSheetPreview(false);
  };

  return (
    <div style={mainContainer}>
      <h2 style={headerText}>Twoje zdjęcie do dokumentów</h2>

      <TabSelector tabs={TABS} activeTab={activeTab} onTabChange={handleTabChange} />
      <TabContent tabKey={activeTab} aspectInput={aspectInput} setAspectInput={setAspectInput} />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 10,
          gap: 20,
        }}
      >
        <div style={{ flex: 1 }}>
          <PrintFormatSelector selectedFormat={selectedFormat} setSelectedFormat={setSelectedFormat} />
        </div>

        {sheetHistory.length > 0 && (
          <div
            style={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer", marginLeft: 20 }}
            onClick={() => setShowSheetPreview(true)}
            title="Podgląd arkusza"
          >
            <span style={{ marginBottom: 6, fontSize: 12, color: "#333" }}>Miniatura arkusza</span>
            <img
              src={sheetHistory[0]}
              alt="Miniatura arkusza"
              style={{
                width: 80,
                height: 80,
                objectFit: "cover",
                border: "3px solid #4a90e2",
                borderRadius: 6,
              }}
            />
          </div>
        )}
      </div>

      <ImageUploader onChange={onFileChange} uploaderStyle={uploaderContainer} inputStyle={inputStyle} />

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
        clearSheet={clearSheet} // przekazujemy funkcję czyszczenia
      />

      {imageSrc && (
        <div style={frameStyle}>
          <CropperWrapper
            imageSrc={imageSrc}
            crop={crop}
            setCrop={setCrop}
            zoom={zoom}
            setZoom={setZoom}
            aspectRatio={aspectRatio}
            onCropComplete={onCropComplete}
            label="Przycinanie"
          />
          <StyledButton onClick={createCroppedImage}>Przytnij zdjęcie</StyledButton>
        </div>
      )}

      {croppedImage && (
        <div style={frameStyle}>
          <ImagePreview image={croppedImage} label="Przycięte zdjęcie" aspectRatio={aspectRatio} />
          <StyledButton onClick={removeBackground}>Usuń tło</StyledButton>
        </div>
      )}

      {noBgImage && (
        <div style={frameStyle}>
          <ImagePreview image={noBgImage} label="Zdjęcie bez tła" />
          <StyledButton onClick={addToSheet}>Dodaj do arkusza</StyledButton>
        </div>
      )}
    </div>
  );
}

export default App;
