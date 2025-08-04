import React, { useState, useCallback } from "react";
import ImageUploader from "./components/ImageUploader";
import CropperWrapper from "./components/CropperWrapper";
import ImagePreview from "./components/ImagePreview";
import {
  parseAspectRatio,
  getCroppedImg,
  cmToPx,
} from "./utils/cropImage";
import { readFile, createImage } from "./utils/imageHelpers";

const PAPER_FORMATS = {
  "9x13": { width: 8.9, height: 12.7 },
  A4: { width: 21, height: 29.7 },
};

function App() {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1.9);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [noBgImage, setNoBgImage] = useState(null);
  const [aspectInput, setAspectInput] = useState("35/45");
  const [selectedFormat, setSelectedFormat] = useState("9x13");
  const [sheetImages, setSheetImages] = useState([]);
  const [sheetUrl, setSheetUrl] = useState(null);

  const aspectRatio = parseAspectRatio(aspectInput) || 35 / 45;

  const onCropComplete = useCallback((_, areaPixels) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  const onFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64 = await readFile(file);
    setImageSrc(base64);
    setCroppedImage(null);
    setNoBgImage(null);
  };

  const createCroppedImage = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    const width = 350; // px — tutaj możesz zostawić jak jest
    const height = width / aspectRatio;
    const cropped = await getCroppedImg(imageSrc, croppedAreaPixels, width, height);
    setCroppedImage(cropped);
    setNoBgImage(null);
  };

  const handleSend = async () => {
    if (!croppedImage) return;

    const res = await fetch(croppedImage);
    const blob = await res.blob();

    const formData = new FormData();
    formData.append("image", blob, "cropped.png");

    const response = await fetch("http://localhost:8000/api/remove-bg/", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      alert("Błąd przy usuwaniu tła");
      return;
    }

    const data = await response.json();
    setNoBgImage("data:image/png;base64," + data.image_no_bg);
  };

  const addToSheet = () => {
    if (!noBgImage) return;
    setSheetImages((prev) => [...prev, noBgImage]);
    setNoBgImage(null);
    setImageSrc(null);
    setCroppedImage(null);
  };

  const generateSheet = async () => {
    if (sheetImages.length === 0) return;
    const format = PAPER_FORMATS[selectedFormat];
    const widthPx = Math.round(cmToPx(format.width));
    const heightPx = Math.round(cmToPx(format.height));

    const canvas = document.createElement("canvas");
    canvas.width = widthPx;
    canvas.height = heightPx;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, widthPx, heightPx);

    const margin = 20;

    // stałe wymiary zdjęcia w cm
    const photoWidthCm = 3.5;  // 35 mm
    const photoHeightCm = 4.5; // 45 mm

    // wymiary w px
    const imgWidth = Math.round(cmToPx(photoWidthCm));
    const imgHeight = Math.round(cmToPx(photoHeightCm));

    // liczymy ile kolumn i wierszy zmieści się na kartce
    const cols = Math.floor((widthPx + margin) / (imgWidth + margin));
    const rows = Math.floor((heightPx + margin) / (imgHeight + margin));

    for (let i = 0; i < sheetImages.length; i++) {
      if (i >= cols * rows) break; // nie przekraczamy liczby dostępnych miejsc

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
    setSheetUrl(url);
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
    <div
      style={{
        padding: 32,
        maxWidth: 900,
        margin: "40px auto",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: "#333",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        borderRadius: 12,
        boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginBottom: 32,
          fontWeight: 700,
          fontSize: 28,
          color: "#2c3e50",
          textShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        Document photo
      </h2>

      <div style={{ marginBottom: 24 }}>
        <ImageUploader onChange={onFileChange} />
      </div>

      <div
        style={{
          display: "flex",
          gap: 24,
          flexWrap: "wrap",
          marginBottom: 32,
          justifyContent: "center",
        }}
      >
        <label style={{ flex: "1 1 180px", minWidth: 180 }}>
          <div
            style={{
              marginBottom: 6,
              fontWeight: 600,
              color: "#34495e",
              fontSize: 14,
            }}
          >
            Proportion (mm, np. 35/45):
          </div>
          <input
            type="text"
            value={aspectInput}
            onChange={(e) => setAspectInput(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 12px",
              fontSize: 15,
              borderRadius: 6,
              border: "1.5px solid #bdc3c7",
              transition: "border-color 0.3s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#3498db")}
            onBlur={(e) => (e.target.style.borderColor = "#bdc3c7")}
          />
        </label>

        <label style={{ flex: "1 1 180px", minWidth: 180 }}>
          <div
            style={{
              marginBottom: 6,
              fontWeight: 600,
              color: "#34495e",
              fontSize: 14,
            }}
          >
            Size:
          </div>
          <select
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 12px",
              fontSize: 15,
              borderRadius: 6,
              border: "1.5px solid #bdc3c7",
              cursor: "pointer",
              transition: "border-color 0.3s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#3498db")}
            onBlur={(e) => (e.target.style.borderColor = "#bdc3c7")}
          >
            {Object.keys(PAPER_FORMATS).map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </label>
      </div>

      {imageSrc && (
        <div
          style={{
            marginBottom: 28,
            textAlign: "center",
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            borderRadius: 12,
            padding: 12,
            backgroundColor: "white",
            maxWidth: 400,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <CropperWrapper
            imageSrc={imageSrc}
            crop={crop}
            setCrop={setCrop}
            zoom={zoom}
            setZoom={setZoom}
            aspectRatio={aspectRatio}
            onCropComplete={onCropComplete}
          />
          <button
            onClick={createCroppedImage}
            style={{
              marginTop: 16,
              padding: "12px 28px",
              fontSize: 17,
              backgroundColor: "#3498db",
              color: "white",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(52,152,219,0.4)",
              transition: "background-color 0.25s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#2980b9")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#3498db")
            }
          >
            Przytnij zdjęcie
          </button>
        </div>
      )}

      <div
        style={{
          display: "flex",
          gap: 30,
          flexWrap: "wrap",
          justifyContent: "center",
          marginBottom: 36,
        }}
      >
        {croppedImage && (
          <div
            style={{
              textAlign: "center",
              maxWidth: 360,
              backgroundColor: "white",
              borderRadius: 12,
              padding: 16,
              boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
            }}
          >
            <ImagePreview image={croppedImage} label="Przycięte zdjęcie" />
            <button
              onClick={handleSend}
              style={{
                marginTop: 14,
                padding: "10px 20px",
                fontSize: 15,
                backgroundColor: "#f39c12",
                color: "white",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                boxShadow: "0 3px 10px rgba(243,156,18,0.5)",
                transition: "background-color 0.25s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#d87e00")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#f39c12")
              }
            >
              Usuń tło
            </button>
          </div>
        )}

        {noBgImage && (
          <div
            style={{
              textAlign: "center",
              maxWidth: 360,
              backgroundColor: "white",
              borderRadius: 12,
              padding: 16,
              boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
            }}
          >
            <ImagePreview image={noBgImage} label="Zdjęcie po usunięciu tła" />
            <button
              onClick={addToSheet}
              style={{
                marginTop: 14,
                padding: "10px 20px",
                fontSize: 15,
                backgroundColor: "#27ae60",
                color: "white",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                boxShadow: "0 3px 10px rgba(39,174,96,0.5)",
                transition: "background-color 0.25s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#1e8449")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#27ae60")
              }
            >
              Dodaj zdjęcie do kartki ({selectedFormat})
            </button>
          </div>
        )}
      </div>

      {sheetImages.length > 0 && (
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h3
            style={{
              fontWeight: 600,
              color: "#34495e",
              marginBottom: 18,
            }}
          >
            Zdjęcia dodane do kartki ({selectedFormat}): {sheetImages.length}
          </h3>
          <button
            onClick={createSheetImage}
            style={{
              marginRight: 14,
              padding: "12px 24px",
              fontSize: 16,
              backgroundColor: "#2980b9",
              color: "white",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              boxShadow: "0 3px 14px rgba(41,128,185,0.6)",
              transition: "background-color 0.25s ease",
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
              padding: "12px 24px",
              fontSize: 16,
              backgroundColor: "#c0392b",
              color: "white",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              boxShadow: "0 3px 14px rgba(192,57,43,0.6)",
              transition: "background-color 0.25s ease",
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
          <h3
            style={{
              marginBottom: 18,
              color: "#34495e",
              fontWeight: 600,
            }}
          >
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
              marginTop: 16,
              padding: "12px 28px",
              fontSize: 17,
              backgroundColor: "#16a085",
              color: "white",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(22,160,133,0.5)",
              transition: "background-color 0.25s ease",
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
    </div>
  );
}

export default App;
