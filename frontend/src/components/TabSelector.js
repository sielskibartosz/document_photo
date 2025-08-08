// TabSelector.js
import React from 'react';
import {Button, Stack} from '@mui/material';

const TabSelector = ({tabs, activeTab, onTabChange}) => {
    return (
        <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            sx={{marginBottom: 3}}
        >
            {tabs.map((tab) => (
                <Button
                    key={tab.key}
                    variant={activeTab === tab.key ? 'contained' : 'outlined'}
                    color={activeTab === tab.key ? 'primary' : 'inherit'}
                    onClick={() => onTabChange(tab.key)}
                    sx={{
                        fontWeight: activeTab === tab.key ? 'bold' : 'bold',
                        fontSize: 16, // optional
                        fontFamily: 'Roboto, sans-serif', // optional
                        textTransform: 'none' // optional: prevent uppercase
                    }}
                >
                    {tab.label}
                </Button>
            ))}
        </Stack>
    );
};

export default TabSelector;
