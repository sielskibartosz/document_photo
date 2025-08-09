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
                        fontWeight: 'bold',
                        fontSize: 16,
                        fontFamily: 'Roboto, sans-serif',
                        textTransform: 'none',
                        minHeight: 40,          // wysokość spójna z inputem
                        padding: '6px 16px',    // domyślne paddingi, możesz dostosować
                        boxSizing: 'border-box',
                    }}
                >
                    {tab.label}
                </Button>
            ))}
        </Stack>
    );
};

export default TabSelector;
