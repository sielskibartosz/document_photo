import React from 'react';
import { Button, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';

const TabSelector = ({ tabs, activeTab, onTabChange }) => {
    const { t } = useTranslation();

    return (
        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 3 }}>
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
                        minHeight: 40,
                        padding: '6px 16px',
                    }}
                >
                    {t(tab.labelKey)}
                </Button>
            ))}
        </Stack>
    );
};

export default TabSelector;
