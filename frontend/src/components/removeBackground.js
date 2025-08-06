import React, {useState} from "react";
import ImagePreview from "./ImagePreview";
import StyledButton from "./buttons/StyledButton";

function RemoveBackground({croppedImage, aspectRatio, setNoBgImage, addToSheet}) {
    const [loading, setLoading] = useState(false);

    const removeBackground = async () => {
        if (!croppedImage) return;
        setLoading(true);

        try {
            const res = await fetch(croppedImage);
            const blob = await res.blob();

            const formData = new FormData();
            formData.append("image", blob, "cropped.png");

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
        <div style={{marginTop: 20}}>
            <ImagePreview image={croppedImage} label="Przycięte zdjęcie" aspectRatio={aspectRatio}/>
            <StyledButton onClick={removeBackground} disabled={loading}>
                {loading ? "Usuwanie..." : "Usuń tło"}
            </StyledButton>
        </div>
    );
}

export default RemoveBackground;
