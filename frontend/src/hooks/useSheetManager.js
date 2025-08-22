import { useState } from "react";

export default function useSheetManager(initialAspectRatio) {
  const [sheetImages, setSheetImages] = useState([]);
  const [selectedSheetUrl, setSelectedSheetUrl] = useState(null);
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [showFullSheet, setShowFullSheet] = useState(false);

  const addToSheet = (image, aspectRatio) => {
    if (!image) return;
    setSheetImages((prev) => [...prev, { image, aspectRatio }]);
    setShowFullSheet(true);
  };

  const duplicateLastImage = () => {
    if (!sheetImages.length) return;
    setSheetImages((prev) => [...prev, prev[prev.length - 1]]);
    setShowFullSheet(true);
  };

  const clearSheet = () => {
    setSheetImages([]);
    setSelectedSheetUrl(null);
    setThumbnailUrl(null);
    setShowFullSheet(false);
  };

  const toggleSheet = () => setShowFullSheet((prev) => !prev);

  return {
    sheetImages,
    setSheetImages,
    selectedSheetUrl,
    setSelectedSheetUrl,
    thumbnailUrl,
    setThumbnailUrl,
    showFullSheet,
    addToSheet,
    duplicateLastImage,
    clearSheet,
    toggleSheet,
  };
}
