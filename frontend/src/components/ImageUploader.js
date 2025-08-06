import {textStyles} from "../styles/textStyles";

function ImageUploader({onChange, uploaderStyle, inputStyle}) {
    return (
        <div>
            <div style={textStyles}>
                Wybierz zdjęcie do przesłania:
            </div>
            <div style={uploaderStyle}>
                <label>
                    <input type="file" accept="image/*" onChange={onChange} style={inputStyle}/>
                </label>
            </div>
        </div>
    );
}

export default ImageUploader;

