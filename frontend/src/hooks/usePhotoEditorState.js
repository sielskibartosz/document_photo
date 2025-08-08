import { useState } from "react";

export const usePhotoEditorState = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [removedBgImage, setRemovedBgImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1.9);
  const [aspect, setAspect] = useState(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [activeTab, setActiveTab] = useState("original");

  const reset = () => {
    setImageSrc(null);
    setCroppedImage(null);
    setRemovedBgImage(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1.9);
    setAspect(null);
    setCroppedAreaPixels(null);
    setActiveTab("original");
  };

  return {
    imageSrc, setImageSrc,
    croppedImage, setCroppedImage,
    removedBgImage, setRemovedBgImage,
    crop, setCrop,
    zoom, setZoom,
    aspect, setAspect,
    croppedAreaPixels, setCroppedAreaPixels,
    activeTab, setActiveTab,
    reset,
  };
};
