import React, {useEffect} from "react";
import {cmToPx, createImage} from "../utils/cropImage.js";
import {PAPER_FORMATS} from "../constants/paperFormats";
import FrameBox from "../styles/imagesStyles";
import {Box, Typography, Button} from "@mui/material";

const SheetManager = ({
                          sheetImages,
                          selectedFormat,
                          sheetUrl,
                          setSheetUrl,
                          setSheetImages,
                          duplicateImage,
                          showSheetPreview,
                          setShowSheetPreview,
                          clearSheet,
                      }) => {
    const generateSheet = async () => {
        if (sheetImages.length === 0) return null;

        const dpi = 300;
        const format = PAPER_FORMATS[selectedFormat];
        const widthPx = Math.round(cmToPx(format.width, dpi));
        const heightPx = Math.round(cmToPx(format.height, dpi));

        const canvas = document.createElement("canvas");
        canvas.width = widthPx;
        canvas.height = heightPx;
        const ctx = canvas.getContext("2d");

        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, widthPx, heightPx);

        const margin = 20;
        const photoWidthCm = 3.5;
        let imgWidth = Math.round(cmToPx(photoWidthCm, dpi));
        const maxPhotoHeightCm = 4.5;

        const cols = Math.floor((widthPx + margin) / (imgWidth + margin));

        let currentY = margin;
        let currentRowHeight = 0;
        let colIndex = 0;

        for (let i = 0; i < sheetImages.length; i++) {
            if (i >= cols * Math.floor(heightPx / (cmToPx(maxPhotoHeightCm, dpi) + margin))) break;

            const {image, aspectRatio} = sheetImages[i];
            const img = await createImage(image);

            let imgHeight = Math.round(imgWidth / aspectRatio);
            const maxHeightPx = Math.round(cmToPx(maxPhotoHeightCm, dpi));

            if (imgHeight > maxHeightPx) {
                imgHeight = maxHeightPx;
                imgWidth = Math.round(imgHeight * aspectRatio);
            }

            const x = margin + colIndex * (imgWidth + margin);
            const y = currentY;

            ctx.drawImage(img, x, y, imgWidth, imgHeight);
            ctx.lineWidth = 2;
            ctx.strokeStyle = "black";
            ctx.strokeRect(x, y, imgWidth, imgHeight);

            if (imgHeight > currentRowHeight) {
                currentRowHeight = imgHeight;
            }

            colIndex++;

            if (colIndex >= cols) {
                colIndex = 0;
                currentY += currentRowHeight + margin;
                currentRowHeight = 0;
            }
        }

        return new Promise((resolve) => {
            canvas.toBlob(
                (blob) => {
                    const url = URL.createObjectURL(blob);
                    resolve(url);
                },
                "image/jpeg",
                0.92
            );
        });
    };

    const createSheetImage = async () => {
        const url = await generateSheet();
        if (url) {
            setSheetUrl(url);
            setShowSheetPreview(true);
        }
    };

    useEffect(() => {
        if (sheetImages.length > 0) {
            createSheetImage();
        } else {
            setSheetUrl(null);
            setShowSheetPreview(false);
        }
    }, [sheetImages]);

    const downloadSheet = () => {
        if (!sheetUrl) return;
        const link = document.createElement("a");
        link.href = sheetUrl;
        link.download = `sheet_${selectedFormat}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const onClearSheetClick = () => {
        if (clearSheet) {
            clearSheet();
        } else {
            setSheetImages([]);
            setSheetUrl(null);
            setShowSheetPreview(false);
        }
    };

    if (!showSheetPreview || !sheetUrl) return null;

    return (
        <>
            {sheetImages.length > 0 && sheetUrl && (
                <FrameBox
                    sx={{
                        maxWidth: 'none',
                        width: {
                            xs: '90%',  // na małych ekranach (xs) 90%
                            md: '70%',  // na średnich i większych (md+) 70%
                        },
                        mx: 'auto', // wyśrodkowanie poziome
                    }}
                >
                    {/* Nagłówek na środku */}
                    <Typography
                        variant="h6"
                        fontWeight={600}
                        color="text.primary"
                        mb={2}
                        textAlign="center"
                    >
                        Zdjęcia dodane do arkusza ({selectedFormat}): {sheetImages.length}
                    </Typography>

                    {/* Przyciski w jednej linii */}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center", // wyśrodkowanie w poziomie
                            alignItems: "center",     // wyśrodkowanie w pionie
                            gap: 2,
                            flexWrap: "wrap",
                            mb: 3,
                            width: "100%",            // zajmuje całą szerokość
                        }}
                    >
                        <Button variant="contained" onClick={duplicateImage}>
                            Powiel zdjęcie
                        </Button>
                        <Button variant="outlined" color="error" onClick={onClearSheetClick}>
                            Wyczyść arkusz
                        </Button>
                        <Button variant="contained" color="success" onClick={downloadSheet}>
                            Pobierz arkusz
                        </Button>
                    </Box>

                    {/* Podgląd arkusza */}
                    <Box
                        component="img"
                        src={sheetUrl}
                        alt="sheet"
                        sx={{
                            maxWidth: "100%",
                            borderRadius: 2,
                            boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                            border: "1px solid #ddd",
                            display: "block",
                            margin: "0 auto",
                        }}
                    />
                </FrameBox>
            )}
        </>
    );
};

export default SheetManager;
