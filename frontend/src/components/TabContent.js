import React from "react";
import {Box, Typography, Link, TextField} from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";
import {TABS, TAB_DESCTIPTION} from "../constants/tabs";

const TabContent = ({tabKey, aspectInput, setAspectInput}) => {
    const tab = TAB_DESCTIPTION[tabKey] || {};
    const tabFromList = TABS.find((t) => t.key === tabKey);
    const aspect = tabFromList ? tabFromList.aspect : "";

    // Handler zmiany inputa proporcji
    const handleAspectChange = (e) => {
        setAspectInput(e.target.value);
    };

    return (
        <Box sx={{textAlign: "center", mb: 0}}>
            {tab.image && (
                <Box
                    sx={{
                        maxWidth: tabKey === "custom" ? 250 : 400,
                        mx: "auto",
                        mb: 2,
                    }}
                >
                    <Box
                        component="img"
                        src={tab.image}
                        alt={`Przykład zdjęcia - ${tabKey}`}
                        sx={{
                            width: "100%",
                            borderRadius: 2,
                            boxShadow: 3,
                            display: "block",
                        }}
                    />
                </Box>
            )}

            {tab.title && (
                <Typography
                    variant="body1"
                    sx={{mb: 2, fontWeight: "normal", textAlign: "center"}}
                >
                    {tab.title}
                </Typography>
            )}

            {tab.description && (
                <Typography
                    variant="body1"
                    sx={{
                        mb: 2,
                        fontWeight: 600,
                        color: "text.primary",
                        maxWidth: 600,
                        mx: "auto",
                        lineHeight: 1.7,
                        textAlign: "justify",
                        whiteSpace: "pre-line",
                    }}
                >
                    {tab.description}
                </Typography>
            )}

            {tab.text && (
                <Typography
                    variant="body1"
                    sx={{
                        mb: 2,
                        fontWeight: 600,
                        color: "text.primary",
                        maxWidth: 600,
                        mx: "auto",
                        lineHeight: 1.7,
                        textAlign: "justify",
                        whiteSpace: "pre-line",
                    }}
                >
                    {tab.text}
                </Typography>
            )}

            {tab.link && (
                <Link
                    href={tab.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 0.5,
                        fontWeight: 700,
                        color: "primary.main",
                        textDecoration: "none",
                        "&:hover": {textDecoration: "underline"},
                        maxWidth: 600,
                        mx: "auto",
                    }}
                >
                    <LinkIcon fontSize="small"/>
                    Link do wymagań gov.pl
                </Link>
            )}

            {tabKey === "custom" && (
                <Box
                    sx={{
                        maxWidth: 180,  // stała szerokość, np. taka sama jak FormatSelector
                        mx: "auto",
                        mt: 3,
                    }}
                >
                    <TextField
                        label={`Podaj proporcje [mm]`}
                        variant="outlined"
                        size="small"
                        value={aspectInput}
                        onChange={handleAspectChange}
                        InputProps={{sx: {height: 40}}}
                        inputProps={{style: {fontSize: 16, fontFamily: "Roboto, sans-serif"}}}
                        placeholder={`np. ${aspect}`}
                        fullWidth

                    />
                </Box>
            )}
        </Box>
    );
};

export default TabContent;
