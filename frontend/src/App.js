import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";

const DPI = 300;
const cmToPx = (cm) => (cm / 2.54) * DPI;

const PAPER_FORMATS = {
  "9x13": { width: 9, height: 13 }, // w cm
  "A4": { width: 21, height: 29.7 },
};

// Konwersja proporcji mm na float aspect ratio
function parseAspectRatio(ratioStr) {
  // np. "35/45" => 35/45 = 0.777...
  if (!ratioStr.includes("/")) return null;
  const [w, h] = ratioStr.split("/").map((v) => parseFloat(v));
  if (!w || !h) return null;
  return w / h;
}

function App() {
  // Stany globalne
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1.9);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [noBgImage, setNoBgImage] = useState(null);

  // Proporcja do cropowania wpisana przez użytkownika (string)
  const [aspectInput, setAspectInput] = useState("35/45");
  const aspectRatio = parseAspectRatio(aspectInput) || 35 / 45;

  // Format kartki do układania zdjęć
  const [selectedFormat, setSelectedFormat] = useState("9x13");

  // Tablica zdjęć bez tła dodanych do kartki
  const [sheetImages, setSheetImages] = useState([]);
  const [sheetUrl, setSheetUrl] = useState(null);

  // Cropper callbacks
  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Wczytanie pliku i konwersja do base64
  const onFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const base64 = await readFile(file);
      setImageSrc(base64);
      setCroppedImage(null);
      setNoBgImage(null);
    }
  };

  // Przycięcie zdjęcia wg cropu i proporcji (zmieniamy rozmiar na 350x (350 / aspect))
  const createCroppedImage = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    const width = 350;
    const height = width / aspectRatio;
    const cropped = await getCroppedImg(imageSrc, croppedAreaPixels, width, height);
    setCroppedImage(cropped);
    setNoBgImage(null);
  };

  // Wysyłamy przycięte zdjęcie do backendu (usuwanie tła)
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

  // Dodaj aktualne zdjęcie bez tła do tablicy zdjęć na kartce
  const addToSheet = () => {
    if (!noBgImage) return;
    setSheetImages((prev) => [...prev, noBgImage]);
    setNoBgImage(null);
    setImageSrc(null);
    setCroppedImage(null);
  };

  // Generowanie kartki z ułożonymi zdjęciami
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

    // Parametry układu zdjęć na kartce
    const margin = 20;
    const cols = 3;
    const imgWidth = (widthPx - margin * (cols + 1)) / cols;
    const imgHeight = imgWidth / aspectRatio;

    const rows = Math.floor((heightPx - margin) / (imgHeight + margin));

    // Rysujemy zdjęcia po kolei, dodając ramkę
    for (let i = 0; i < sheetImages.length; i++) {
      const img = await createImage(sheetImages[i]);
      const x = margin + (i % cols) * (imgWidth + margin);
      const y = margin + Math.floor(i / cols) * (imgHeight + margin);

      if (y + imgHeight > heightPx) break; // za dużo zdjęć na kartkę

      ctx.drawImage(img, x, y, imgWidth, imgHeight);

      // ramka wokół zdjęcia
      ctx.lineWidth = 3;
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

  // Tworzymy i ustawiamy podgląd kartki
  const createSheetImage = async () => {
    const url = await generateSheet();
    setSheetUrl(url);
  };

  // Pobieranie kartki
  const downloadSheet = () => {
    if (!sheetUrl) return;
    const link = document.createElement("a");
    link.href = sheetUrl;
    link.download = `sheet_${selectedFormat}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Usuwanie wszystkich zdjęć z kartki
  const clearSheet = () => {
    setSheetImages([]);
    setSheetUrl(null);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Dodaj zdjęcie, przytnij i usuń tło</h2>

      <input type="file" accept="image/*" onChange={onFileChange} />
      <br />
      <label>
        Proporcje przycinania (mm, np. 35/45):{" "}
        <input
          type="text"
          value={aspectInput}
          onChange={(e) => setAspectInput(e.target.value)}
          style={{ width: 80 }}
        />
      </label>
      <br />

      <label>
        Format kartki:{" "}
        <select value={selectedFormat} onChange={(e) => setSelectedFormat(e.target.value)}>
          {Object.keys(PAPER_FORMATS).map((key) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </select>
      </label>

      {imageSrc && (
        <>
          <div
            style={{
              position: "relative",
              width: 350,
              height: 350 / aspectRatio,
              marginTop: 20,
              background: "#333",
            }}
          >
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={aspectRatio}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              objectFit="horizontal-cover"
            />
          </div>
          <div style={{ marginTop: 10 }}>

        </div>

          <button onClick={createCroppedImage} style={{ marginTop: 10 }}>
            Przytnij zdjęcie
          </button>
        </>
      )}

      {croppedImage && (
        <>
          <h3>Przycięte zdjęcie</h3>
          <img
            src={croppedImage}
            alt="cropped"
            style={{ maxWidth: 350, border: "1px solid #ccc" }}
          />

          <br />
          <button onClick={handleSend} style={{ marginTop: 10 }}>
            Usuń tło
          </button>
        </>
      )}

      {noBgImage && (
        <>
          <h3>Zdjęcie po usunięciu tła</h3>
          <img src={noBgImage} alt="no-bg" style={{ maxWidth: 350, border: "1px solid black" }} />
          <br />
          <button onClick={addToSheet} style={{ marginTop: 10 }}>
            Dodaj zdjęcie do kartki ({selectedFormat})
          </button>
        </>
      )}

      {sheetImages.length > 0 && (
        <>
          <h3>Zdjęcia dodane do kartki ({selectedFormat}): {sheetImages.length}</h3>
          <button onClick={createSheetImage}>Pokaż podgląd kartki</button>{" "}
          <button onClick={clearSheet}>Wyczyść kartkę</button>
        </>
      )}

      {sheetUrl && (
        <>
          <h3>Podgląd kartki {selectedFormat} z Twoimi zdjęciami</h3>
          <img src={sheetUrl} alt="sheet" style={{ maxWidth: "100%", border: "1px solid #ccc" }} />
          <br />
          <button onClick={downloadSheet} style={{ marginTop: 10 }}>
            Pobierz kartkę
          </button>
        </>
      )}
    </div>
  );
}

export default App;

// Pomocnicze funkcje

function readFile(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result));
    reader.readAsDataURL(file);
  });
}

async function createImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", (e) => reject(e));
    img.setAttribute("crossOrigin", "anonymous");
    img.src = url;
  });
}

async function getCroppedImg(imageSrc, pixelCrop, outputWidth, outputHeight) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  canvas.width = outputWidth;
  canvas.height = outputHeight;
  const ctx = canvas.getContext("2d");

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    outputWidth,
    outputHeight
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      resolve(url);
    }, "image/png");
  });
}
