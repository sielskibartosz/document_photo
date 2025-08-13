import React, { useState } from "react";
import ImagePreview from "./ImagePreview";
import { Box, Button } from "@mui/material";

function RemoveBackgroundPanel({ croppedImage, aspectRatio, setNoBgImage, bgColor = "#ffffff" }) {
    const [loading, setLoading] = useState(false);

    // Funkcja pomocnicza do konwersji data URL -> Blob
    const dataURLtoBlob = (dataurl) => {
        const arr = dataurl.split(",");
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    };

    const removeBackground = async () => {
        if (!croppedImage) return;
        setLoading(true);

        try {
            // Konwersja data URL na Blob
            const blob = croppedImage.startsWith("data:")
                ? dataURLtoBlob(croppedImage)
                : await (await fetch(croppedImage)).blob();

            const formData = new FormData();
            formData.append("image", blob, "cropped.png");
            formData.append("bg_color", bgColor); // kolor tła w formacie HEX

            const response = await fetch("http://localhost:8000/remove-background/", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.detail || "Błąd przy usuwaniu tła");
            }

            const data = await response.json();
            setNoBgImage("data:image/png;base64," + data.image_no_bg);
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center" gap={2} mt={0}>
            <ImagePreview image={croppedImage} aspectRatio={aspectRatio} />
            <Button
                variant="contained"
                onClick={removeBackground}
                disabled={loading}
                sx={{ fontWeight: 600 }}
            >
                {loading ? "Usuwanie..." : "Usuń tło"}
            </Button>
        </Box>
    );
}

export default RemoveBackgroundPanel;
