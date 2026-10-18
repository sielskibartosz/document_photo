import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

const SheetContext = createContext();

const normalizeSavedImages = (raw) => {
  if (!Array.isArray(raw)) return [];
  return raw.filter((item) => {
    if (!item || typeof item !== "object") return false;
    if (typeof item.image !== "string" || !item.image.trim()) return false;
    if (item.image.startsWith("blob:")) return false;
    if (typeof item.aspectRatio !== "number" || Number.isNaN(item.aspectRatio)) return false;
    return true;
  });
};

// blob: URL-e nie przetrwają przeładowania strony, więc ich nie zapisujemy;
// localStorage może też rzucić QuotaExceededError dla dużych data URL
const persistImages = (images) => {
  try {
    const persistable = images.filter((item) => !item.image.startsWith("blob:"));
    if (persistable.length) localStorage.setItem("sheetImages", JSON.stringify(persistable));
    else localStorage.removeItem("sheetImages");
  } catch {
    // brak miejsca / zablokowany storage - arkusz działa dalej w pamięci
  }
};

export const useSheet = () => {
  const context = useContext(SheetContext);
  if (!context) throw new Error("useSheet must be used within a SheetProvider");
  return context;
};

export const SheetProvider = ({ children }) => {
  const [sheetImages, setSheetImages] = useState(() => {
    try {
      const saved = localStorage.getItem("sheetImages");
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      const normalized = normalizeSavedImages(parsed);
      if (normalized.length !== parsed.length) {
        localStorage.setItem("sheetImages", JSON.stringify(normalized));
      }
      return normalized;
    } catch {
      localStorage.removeItem("sheetImages");
      return [];
    }
  });

  const [selectedSheetUrl, setSelectedSheetUrl] = useState(null);
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [showFullSheet, setShowFullSheet] = useState(false);

  const showSheet = useCallback(() => setShowFullSheet(true), []);
  const hideSheet = useCallback(() => setShowFullSheet(false), []);
  const toggleSheet = useCallback(() => setShowFullSheet((prev) => !prev), []);

  const addToSheet = useCallback((image, aspectRatio, sizeMm) => {
    if (!image) return;
    setSheetImages((prev) => [...prev, { image, aspectRatio, sizeMm }]);
    showSheet();
  }, [showSheet]);

  const duplicateLastImage = useCallback(() => {
    setSheetImages((prev) => (prev.length ? [...prev, prev[prev.length - 1]] : prev));
    showSheet();
  }, [showSheet]);

  const clearSheet = useCallback(() => {
    sheetImages.forEach(({ image }) => {
      if (image.startsWith("blob:")) URL.revokeObjectURL(image);
    });
    setSheetImages([]);
    setSelectedSheetUrl(null);
    setThumbnailUrl(null);
    setShowFullSheet(false);
  }, [sheetImages]);

  useEffect(() => {
    persistImages(sheetImages);
  }, [sheetImages]);

  return (
    <SheetContext.Provider
      value={{
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
        showSheet,
        hideSheet,
        toggleSheet,
      }}
    >
      {children}
    </SheetContext.Provider>
  );
};
