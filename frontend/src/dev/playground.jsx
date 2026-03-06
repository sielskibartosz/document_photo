import React, { useState } from "react";
import HintBubble from "../components/HintBubble"; // poprawna ścieżka do komponentu

export default function Playground() {
  const [open, setOpen] = useState(true);

  return (
    <div style={{ padding: 50 }}>
      <button onClick={() => setOpen(!open)}>Toggle Hint Bubble</button>
      <HintBubble open={open} onClose={() => setOpen(false)} />
    </div>
  );
}