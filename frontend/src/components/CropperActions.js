// components/CropAndCropButton.js
import React, {useCallback, useState} from "react";
import CropperWrapper from "./CropperWrapper";
import StyledButton from "./buttons/StyledButton";
import {getCroppedImg} from "../utils/cropImage";

const CropperActions = ({
                            imageSrc,
                            crop,
                            setCrop,
                            zoom,
                            setZoom,
                            aspectRatio,
                            onCropped,
                        }) => {
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const onCropComplete = useCallback((_, areaPixels) => {
        setCroppedAreaPixels(areaPixels);
    }, []);

    const handleCrop = async () => {
        if (!imageSrc || !croppedAreaPixels) return;
        const width = 350;
        const height = width / aspectRatio;
        const cropped = await getCroppedImg(imageSrc, croppedAreaPixels, width, height);
        onCropped(cropped);
    };

    return (
        <div>
            <CropperWrapper
                imageSrc={imageSrc}
                crop={crop}
                setCrop={setCrop}
                zoom={zoom}
                setZoom={setZoom}
                aspectRatio={aspectRatio}
                onCropComplete={onCropComplete}
                label="Przycinanie"
            />
            <StyledButton onClick={handleCrop}>Przytnij zdjęcie</StyledButton>
        </div>
    );
};

export default CropperActions;
