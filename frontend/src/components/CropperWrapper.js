import React from "react";
import Cropper from "react-easy-crop";
import {Box, Typography, Slider, Paper} from "@mui/material";

function CropperWrapper({
                            imageSrc,
                            crop,
                            setCrop,
                            zoom,
                            setZoom,
                            aspectRatio,
                            onCropComplete,
                        }) {

    return (
        <div display="flex" flexDirection="column" alignItems="center">
            {/* Ramka croppera */}
            <Paper
                elevation={3}
                sx={{
                    width: "100%",       // pełna szerokość rodzica
                    maxWidth: "90vw",       // max 360px na dużych ekranach
                    aspectRatio: aspectRatio, // zachowanie proporcji (nowoczesne przeglądarki)
                    backgroundColor: "#f0f0f0",
                    overflow: "hidden",
                    borderRadius: 2,
                    position: "relative",
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
                    cropShape="rect"
                    showGrid

                />
            </Paper>

            {/* Slider powiększenia */}
            <div mt={3} width="90%" alignItems="center">
                <Typography variant="body2" gutterBottom>
                    Powiększenie
                </Typography>
                <Slider
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.01}
                    onChange={(e, value) => setZoom(value)}
                    valueLabelDisplay="auto"
                />
            </div>
        </div>
    );
}

export default CropperWrapper;
