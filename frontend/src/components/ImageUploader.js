function ImageUploader({ onChange, uploaderStyle, inputStyle }) {
  return (
    <div style={uploaderStyle}>
      <label>
        <input type="file" accept="image/*" onChange={onChange} style={inputStyle} />
      </label>
    </div>
  );
}

export default ImageUploader;

