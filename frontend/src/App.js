import React, { useState, useCallback, useRef } from 'react';
import Cropper from 'react-easy-crop';

function App() {
  const [imageSrc, setImageSrc] = useState(null);   // oryginał
  const [crop, setCrop] = useState({ x: 0, y: 0 }); // pozycja crop
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [noBgImage, setNoBgImage] = useState(null);

  const inputRef = useRef(null);

  // Wymiary ramki i proporcje
  const FRAME_WIDTH = 300;
  const FRAME_HEIGHT = Math.round(FRAME_WIDTH * (45 / 35)); // 7:9

  const onFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const imageDataUrl = await readFile(file);
      setImageSrc(imageDataUrl);
      setNoBgImage(null);
      setCroppedImage(null);
    }
  };

  const readFile = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.addEventListener('load', () => resolve(reader.result));
      reader.readAsDataURL(file);
    });
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createCroppedImage = async () => {
    try {
      // Skalujemy wycięty obszar do takich samych wymiarów jak ramka, by obraz był większy
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels, FRAME_WIDTH, FRAME_HEIGHT);
      setCroppedImage(croppedImage);
      setNoBgImage(null);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSend = async () => {
    if (!croppedImage) return;
    const res = await fetch(croppedImage);
    const blob = await res.blob();

    const formData = new FormData();
    formData.append('image', blob, 'cropped.png');

    const response = await fetch('http://localhost:8000/api/remove-bg/', {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    setNoBgImage('data:image/png;base64,' + data.image_no_bg);
  };

  // Funkcja pobrania pliku
  const downloadImage = () => {
    if (!noBgImage) return;
    const link = document.createElement('a');
    link.href = noBgImage;
    link.download = 'image_no_bg.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', gap: 20, padding: 20 }}>
      <div>
        <h3>Dodaj zdjęcie</h3>
        <input type="file" accept="image/*" onChange={onFileChange} ref={inputRef} />
        {imageSrc && (
          <div
            style={{
              position: 'relative',
              width: FRAME_WIDTH,
              height: FRAME_HEIGHT,
              background: '#333',
              marginTop: 20,
            }}
          >
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={35 / 45}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              objectFit="horizontal-cover"
            />
          </div>
        )}

        {imageSrc && (
          <>
            <button onClick={createCroppedImage} style={{ marginTop: 20 }}>
              Przytnij do 35/45
            </button>
          </>
        )}
      </div>

      <div>
        <h3>Przycięte zdjęcie</h3>
        {croppedImage && (
          <img
            src={croppedImage}
            alt="Przycięte"
            style={{ width: FRAME_WIDTH, height: FRAME_HEIGHT, objectFit: 'contain', border: '1px solid #ccc' }}
          />
        )}
        {croppedImage && (
          <button onClick={handleSend} style={{ marginTop: 20 }}>
            Wyślij i usuń tło
          </button>
        )}
      </div>

      <div>
        <h3>Zdjęcie po usunięciu tła</h3>
        {noBgImage && (
          <>
            <img
              src={noBgImage}
              alt="Bez tła"
              style={{ width: FRAME_WIDTH, height: FRAME_HEIGHT, objectFit: 'contain', border: '1px solid #ccc' }}
            />
            <button onClick={downloadImage} style={{ marginTop: 10 }}>
              Pobierz zdjęcie bez tła
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default App;

// Funkcja wycinająca i skalująca obraz do zadanych wymiarów
async function getCroppedImg(imageSrc, pixelCrop, outputWidth, outputHeight) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  canvas.width = outputWidth;
  canvas.height = outputHeight;
  const ctx = canvas.getContext('2d');

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
      const croppedImageUrl = URL.createObjectURL(blob);
      resolve(croppedImageUrl);
    }, 'image/png');
  });
}

function createImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });
}
