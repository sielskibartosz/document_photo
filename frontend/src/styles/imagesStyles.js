import {Box} from "@mui/material";

export const uploaderContainer = {
    marginTop: 10,
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#fafafa",
    borderRadius: 8,
    textAlign: "left",
    width: "30%",
};

export const inputStyle = {
    marginTop: 10,
};

export const frameStyle = {
    marginBottom: 28,
    textAlign: "center",
    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
    borderRadius: 12,
    padding: 12,
    backgroundColor: "white",
    maxWidth: 400,
    marginLeft: "auto",
    marginRight: "auto",
}
const FrameBox = ({children, sx = {}}) => {
    return (
        <Box
            sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                p: 2,
                bgcolor: "background.paper",
                boxShadow: 3,
                maxWidth: 400,
                mx: "auto",
                ...sx,
            }}
        >
            {children}
        </Box>
    );
};

export default FrameBox;