import { useState } from "react";
import { readFile } from "../utils/imageHelpers"; // dopasuj ścieżkę do pliku helpera

function useImageCrop() {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1.9);
  const [croppedImage, setCroppedImage] = useState(null);
  const [noBgImage, setNoBgImage] = useState(null);

  const reset = () => {
    setImageSrc(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1.9);
    setCroppedImage(null);
    setNoBgImage(null);
  };

  const onFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64 = await readFile(file);
    setImageSrc(base64);
    setCroppedImage(null);
    setNoBgImage(null);
  };

  return {
    imageSrc,
    crop,
    setCrop,
    zoom,
    setZoom,
    croppedImage,
    setCroppedImage,
    noBgImage,
    setNoBgImage,
    onFileChange,
    reset
  };
}

export default useImageCrop;
