import React, {useState, useEffect} from "react";
import ImageUploader from "./components/ImageUploader";
import ImagePreview from "./components/ImagePreview";
import TabSelector from "./components/TabSelector";
import TabContent from "./components/TabContent";
import FormatSelector from "./components/FormatSelector";
import SheetManager from "./components/SheetManager";
import RemoveBackgroundPanel from "./components/removeBackgroundPanel";
import FotoBackgroundColor from "./components/FotoBackgroundColor";

import {
    Box,
    Typography,
    CssBaseline,
    ThemeProvider,
} from "@mui/material";

import {TABS} from "./constants/tabs";
import {buttonBaseStyle} from "./styles/buttonStyles";
import FrameBox from "./styles/imagesStyles";

import {parseAspectRatio} from "./utils/cropImage";
import {readFile} from "./utils/imageHelpers";
import CropperActions from "./components/CropperActions";
import SheetMinature from "./components/SheetMinature";
import {darkTheme} from "./styles/theme";
import AddToSheetPanel from "./components/addToSheetPanel";

function App() {
    const [activeTab, setActiveTab] = useState("id");
    const [imageSrc, setImageSrc] = useState(null);
    const [crop, setCrop] = useState({x: 0, y: 0});
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

    // Kolor tła tylko dla zakładki "custom"
    const [bgColorCustom, setBgColorCustom] = useState("#ffffff");

    // Jeśli nie "custom", to tło jest białe
    const bgColor = activeTab === "custom" ? bgColorCustom : "#ffffff";

    const aspectRatio = parseAspectRatio(aspectInput);

    const resetImageStates = () => {
        setImageSrc(null);
        setCroppedImage(null);
        setNoBgImage(null);
        setCrop({x: 0, y: 0});
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

        // Nie czyścimy sheetImages, aby można było dodawać kolejne zdjęcia
        setSheetCreatedAfterNewPhoto(true);
    };

    const addToSheet = () => {
        if (!noBgImage) return;
        setSheetImages((prev) => [...prev, {image: noBgImage, aspectRatio}]);
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

    // Przykład dynamicznej liczby kolumn do przekazania do SheetManager
    const [cols, setCols] = useState(3);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 600) {
                setCols(1);
            } else if (window.innerWidth < 900) {
                setCols(2);
            } else {
                setCols(3);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline/>
            <Box
                sx={(theme) => ({
                    padding: 4,
                    width: "70vw",
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
                <Typography
                    variant="h4"
                    align="center"
                    fontWeight={700}
                    sx={{mb: 4, textShadow: "0 1px 3px rgba(0,0,0,0.1)"}}
                >
                    Zdjęcie do dowodu — szybko i za darmo
                </Typography>

                <TabSelector tabs={TABS} activeTab={activeTab} onTabChange={handleTabChange}/>
                <TabContent tabKey={activeTab} aspectInput={aspectInput} setAspectInput={setAspectInput}/>

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        mb: 2,
                        gap: 0,
                    }}
                >
                    {sheetHistory.length > 0 && sheetCreatedAfterNewPhoto && (
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                mb: 0.5,
                                mt: 0.5,
                            }}
                        >
                            <SheetMinature
                                thumbnailUrl={sheetHistory[0]}
                                onClick={() => setShowSheetPreview(true)}
                            />
                        </Box>
                    )}

                    <Box
                      sx={{
                        width: '100%',
                        maxWidth: 350,
                        mt: 1.5,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                      }}
                    >
                      <FormatSelector
                        selectedFormat={selectedFormat}
                        setSelectedFormat={setSelectedFormat}
                      />
                      {activeTab === "custom" && (
                        <Box sx={{ mt: 2, width: '100%', maxWidth: 150 }}>
                          <FotoBackgroundColor color={bgColorCustom} onChange={setBgColorCustom} />
                        </Box>
                      )}
                    </Box>
                </Box>

                <ImageUploader onChange={onFileChange}/>

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
                            bgColor={bgColor} // dynamiczny kolor w zależności od zakładki
                        />
                    </FrameBox>
                )}

                {noBgImage && (
                    <FrameBox>
                        <AddToSheetPanel image={noBgImage} aspectRatio={aspectRatio} onAddToSheet={addToSheet}/>
                    </FrameBox>
                )}
            </Box>
        </ThemeProvider>
    );
}

export default App;
