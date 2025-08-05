// components/SheetManager.js
import React from "react";
import { cmToPx, createImage } from "../utils/cropImage.js"; // dostosuj ścieżki

const PAPER_FORMATS = {
  "9/13 cm": { width: 8.9, height: 12.7 },
  A4: { width: 21, height: 29.7 },
};

const SheetManager = ({
  sheetImages,
  selectedFormat,
  sheetUrl,
  setSheetUrl,
  setSheetImages,
  buttonBaseStyle,
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
    const photoHeightCm = 4.5;
    const imgWidth = Math.round(cmToPx(photoWidthCm, dpi));
    const imgHeight = Math.round(cmToPx(photoHeightCm, dpi));
    const cols = Math.floor((widthPx + margin) / (imgWidth + margin));
    const rows = Math.floor((heightPx + margin) / (imgHeight + margin));

    for (let i = 0; i < sheetImages.length; i++) {
      if (i >= cols * rows) break;

      const img = await createImage(sheetImages[i]);
      const x = margin + (i % cols) * (imgWidth + margin);
      const y = margin + Math.floor(i / cols) * (imgHeight + margin);

      ctx.drawImage(img, x, y, imgWidth, imgHeight);
      ctx.lineWidth = 2;
      ctx.strokeStyle = "black";
      ctx.strokeRect(x, y, imgWidth, imgHeight);
    }

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        resolve(url);
      }, "image/png");
    });
  };

  const createSheetImage = async () => {
    const url = await generateSheet();
    if (url) setSheetUrl(url);
  };

  const downloadSheet = () => {
    if (!sheetUrl) return;
    const link = document.createElement("a");
    link.href = sheetUrl;
    link.download = `sheet_${selectedFormat}.png`;
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
            Zdjęcia dodane do kartki ({selectedFormat}): {sheetImages.length}
          </h3>
          <button
            onClick={createSheetImage}
            style={{
              ...buttonBaseStyle,
              marginRight: 14,
              backgroundColor: "#2980b9",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#1c5980")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#2980b9")
            }
          >
            Pokaż podgląd kartki
          </button>
          <button
            onClick={clearSheet}
            style={{
              ...buttonBaseStyle,
              backgroundColor: "#c0392b",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#89231d")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#c0392b")
            }
          >
            Wyczyść kartkę
          </button>
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
            Podgląd kartki {selectedFormat}
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
          <br />
          <button
            onClick={downloadSheet}
            style={{
              ...buttonBaseStyle,
              marginTop: 16,
              backgroundColor: "#16a085",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#117a65")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#16a085")
            }
          >
            Pobierz kartkę
          </button>
        </div>
      )}
    </>
  );
};

export default SheetManager;
