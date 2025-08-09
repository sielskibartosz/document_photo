// theme.js
import { createTheme } from "@mui/material/styles";
import { grey } from "@mui/material/colors";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const greyTheme = createTheme({
  palette: {
    mode: "dark",  // tryb ciemny
    primary: {
      main: grey[800],      // ciemny szary jako primary
    },
    secondary: {
      main: grey[500],      // szary jako secondary
    },
    background: {
      default: grey[900],   // bardzo ciemny szary jako tło strony
      paper: grey[800],     // ciemniejszy szary dla kart, papieru itp.
    },
    text: {
      primary: "#fff",      // biały tekst główny
      secondary: grey[400], // jaśniejszy szary tekst pomocniczy
    },
  },
});

export { darkTheme, greyTheme };
