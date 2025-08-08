import {Box} from "@mui/material";

const FrameBox = ({children, sx = {}}) => (
    <Box
        sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            p: 2,
            bgcolor: "background.paper",
            boxShadow: 3,
            maxWidth: 400,
            width: "100%",   // by skalowało się responsywnie
            mx: "auto",
            ...sx,
        }}
    >
        {children}
    </Box>
);

export default FrameBox;