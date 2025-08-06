import React, { useEffect } from "react";
import { cmToPx, createImage } from "../utils/cropImage.js";
import StyledButton from "./buttons/StyledButton";
import { PAPER_FORMATS } from "../constants/paperFormats";

const SheetManager = ({
  sheetImages,
  selectedFormat,
  sheetUrl,
  setSheetUrl,
  setSheetImages,
  onDuplicate,
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
  const photoWidthCm = 3.5; // stała szerokość zdjęcia w cm na arkuszu
  const imgWidth = Math.round(cmToPx(photoWidthCm, dpi));

  // Obliczymy maksymalną wysokość zdjęcia na podstawie wysokości formatu (opcjonalnie)
  // lub ustalamy maksymalną wysokość dla wygody (np. 4.5cm)
  const maxPhotoHeightCm = 4.5;

  // Liczymy ile zdjęć zmieści się w kolumnach i wierszach (będą się mogły różnić wysokości)
  // dlatego kolumny policzymy na bazie szerokości zdjęcia + margines
  const cols = Math.floor((widthPx + margin) / (imgWidth + margin));

  // Pozycjonowanie y zagnieżdżone w pętli (więc trzeba dynamicznie liczyć y - bardziej skomplikowane, więc uprościmy)

  // Zmienna do śledzenia wysokości każdej linii w px
  let currentY = margin;
  let currentRowHeight = 0;

  let colIndex = 0;

  for (let i = 0; i < sheetImages.length; i++) {
    if (i >= cols * Math.floor(heightPx / (cmToPx(maxPhotoHeightCm, dpi) + margin))) break;

    const { image, aspectRatio } = sheetImages[i];
    const img = await createImage(image);

    // Obliczamy wysokość zgodnie z proporcją: height = width / aspectRatio
    let imgHeight = Math.round(imgWidth / aspectRatio);

    // Nie przekraczamy maksymalnej wysokości zdjęcia
    const maxHeightPx = Math.round(cmToPx(maxPhotoHeightCm, dpi));
    if (imgHeight > maxHeightPx) {
      imgHeight = maxHeightPx;
      // w takim wypadku przelicz szerokość, żeby proporcje były ok
      imgWidth = Math.round(imgHeight * aspectRatio);
    }

    // Obliczamy pozycję x i y:
    const x = margin + colIndex * (imgWidth + margin);
    const y = currentY;

    ctx.drawImage(img, x, y, imgWidth, imgHeight);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "black";
    ctx.strokeRect(x, y, imgWidth, imgHeight);

    // Aktualizujemy wysokość bieżącego wiersza, jeśli obecne zdjęcie jest wyższe
    if (imgHeight > currentRowHeight) {
      currentRowHeight = imgHeight;
    }

    colIndex++;

    // Jeśli przekroczyliśmy kolumny, to przechodzimy do nowego wiersza
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
    if (url) setSheetUrl(url);
  };

  useEffect(() => {
    if (sheetImages.length > 0) {
      createSheetImage();
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

  const clearSheet = () => {
    setSheetImages([]);
    setSheetUrl(null);
  };


  return (
    <>
      {sheetImages.length > 0 && (
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h3 style={{ fontWeight: 600, color: "#34495e", marginBottom: 18 }}>
            Zdjęcia dodane do arkusza ({selectedFormat}): {sheetImages.length}
          </h3>
          <StyledButton onClick={onDuplicate}>Powiel zdjęcie</StyledButton>
          <StyledButton onClick={() => {
            setSheetImages([]);
            setSheetUrl(null);
          }}>Wyczyść</StyledButton>
          <StyledButton onClick={() => {
            if (!sheetUrl) return;
            const link = document.createElement("a");
            link.href = sheetUrl;
            link.download = `sheet_${selectedFormat}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}>Pobierz arkusz</StyledButton>
        </div>
      )}

      {sheetUrl && (
        <div
          style={{
            textAlign: "center",
            marginBottom: 24,
            backgroundColor: "white",
            borderRadius: 12,
            padding: 16,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          }}
        >
          <h3 style={{ marginBottom: 18, color: "#34495e", fontWeight: 600 }}>
            Podgląd arkusza {selectedFormat}
          </h3>
          <img
            src={sheetUrl}
            alt="sheet"
            style={{
              maxWidth: "100%",
              borderRadius: 10,
              boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
              border: "1px solid #ddd",
            }}
          />
        </div>
      )}
    </>
  );
};

export default SheetManager;