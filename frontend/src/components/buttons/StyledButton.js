import React, { useState } from "react";
import { buttonFrameStyle } from "../../styles/buttonStyles";

const StyledButton = ({ onClick, children, style: customStyle = {} }) => {
  const [hover, setHover] = useState(false);

  const style = {
    ...buttonFrameStyle,
    ...customStyle,
    backgroundColor: hover ? "#2980b9" : "#3498db",
  };

  return (
    <button
      onClick={onClick}
      style={style}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {children}
    </button>
  );
};

export default StyledButton;
