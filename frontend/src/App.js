import React, { useState, useCallback } from "react";
import ImageUploader from "./components/ImageUploader";
import CropperWrapper from "./components/CropperWrapper";
import ImagePreview from "./components/ImagePreview";
import TabContent from "./components/TabContent";

import {
  parseAspectRatio,
  getCroppedImg,
  cmToPx,
} from "./utils/cropImage";
import { readFile, createImage } from "./utils/imageHelpers";

const PAPER_FORMATS = {
  "9/13 cm": { width: 8.9, height: 12.7 },
  A4: { width: 21, height: 29.7 },
};

const TABS = [
  { key: "id", label: "Zdjęcie do dowodu", aspect: "35/45" },
  { key: "license", label: "Zdjęcie do prawa jazdy", aspect: "50/50" },
  { key: "visa", label: "Visa", aspect: "50/50" },
  { key: "custom", label: "Inne", aspect: "50/50" },
];

function App() {
  const [activeTab, setActiveTab] = useState("id");
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1.9);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [noBgImage, setNoBgImage] = useState(null);
  const [aspectInput, setAspectInput] = useState(TABS[0].aspect);
  const [selectedFormat, setSelectedFormat] = useState("9/13 cm");
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
    const width = 350;
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
    const dpi = 300;
    const format = PAPER_FORMATS[selectedFormat];
    const widthPx = Math.round(cmToPx(format.width,dpi));
    const heightPx = Math.round(cmToPx(format.height,dpi));

    const canvas = document.createElement("canvas");
    canvas.width = widthPx;
    canvas.height = heightPx;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, widthPx, heightPx);

    const margin = 20;

    const photoWidthCm = 3.5;
    const photoHeightCm = 4.5;

    const imgWidth = Math.round(cmToPx(photoWidthCm,dpi));
    const imgHeight = Math.round(cmToPx(photoHeightCm,dpi));

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

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    const tab = TABS.find((t) => t.key === tabKey);
    setAspectInput(tab.aspect);
    setImageSrc(null);
    setCroppedImage(null);
    setNoBgImage(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1.9);
    setCroppedAreaPixels(null);
  };

  // Styl bazowy dla wszystkich przycisków
  const buttonBaseStyle = {
    padding: "12px 28px",
    fontSize: 16,
    color: "white",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    transition: "background-color 0.25s ease",
    fontWeight: 600,
    userSelect: "none",
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
        Twoje zdjęcie do dokumentów
      </h2>

      <div style={{ display: "flex", gap: 12, marginBottom: 24, justifyContent: "center" }}>
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            style={{
              padding: "10px 24px",
              fontSize: 16,
              borderRadius: 8,
              border: activeTab === tab.key ? "2px solid #3498db" : "1.5px solid #bdc3c7",
              background: activeTab === tab.key ? "#eaf6fb" : "white",
              color: "#2c3e50",
              fontWeight: activeTab === tab.key ? 700 : 500,
              cursor: "pointer",
              boxShadow: activeTab === tab.key ? "0 2px 8px #3498dbaa" : "none",
              transition: "all 0.2s",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <TabContent tabKey={activeTab} setAspectInput={setAspectInput} aspectInput={aspectInput} />

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
            Format drukowanej kartki:
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
              ...buttonBaseStyle,
              marginTop: 16,
              backgroundColor: "#3498db",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#3498db")
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
                ...buttonBaseStyle,
                marginTop: 14,
                backgroundColor: "#3498db",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#3498db")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#3498db")
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
                ...buttonBaseStyle,
                marginTop: 14,
                backgroundColor: "#3498db",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#3498db")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#3498db")
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
    </div>
  );
}

export default App;
