import { useCallback } from "react";

export const useSheetActions = (
  noBgImage,
  aspectRatio,
  resetImageStates,
  setSheetImages,
  setShowSheetPreview
) => {
  const addToSheet = useCallback(() => {
    if (!noBgImage) return;
    setSheetImages((prev) => [...prev, { image: noBgImage, aspectRatio }]);
    resetImageStates();
    setShowSheetPreview(true);
  }, [noBgImage, aspectRatio, resetImageStates, setSheetImages, setShowSheetPreview]);

  return { addToSheet };
};
