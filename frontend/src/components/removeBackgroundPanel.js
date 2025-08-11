import React, {useState} from "react";
import ImagePreview from "./ImagePreview";
import StyledButton from "./buttons/StyledButton";
import {Box, Button} from "@mui/material";
import FrameBox from "../styles/imagesStyles";

function RemoveBackgroundPanel({croppedImage, aspectRatio, setNoBgImage, bgColor = "#fff"}) {
    const [loading, setLoading] = useState(false);

    const removeBackground = async () => {
    if (!croppedImage) return;
    setLoading(true);

    try {
        const res = await fetch(croppedImage);
        const blob = await res.blob();

        const formData = new FormData();
        formData.append("image", blob, "cropped.png");
        formData.append("bg_color", bgColor);  // <--- dodajemy kolor tła tutaj

        const response = await fetch("http://localhost:8000/api/remove-bg/", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) throw new Error("Błąd przy usuwaniu tła");

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

            <ImagePreview image={croppedImage} aspectRatio={aspectRatio}/>
            <Button variant="contained" onClick={removeBackground} disabled={loading} sx={{ fontWeight: 600 }}>
                {loading ? "Usuwanie..." : "Usuń tło"}
            </Button>

        </Box>
    );
}

export default RemoveBackgroundPanel;
