import React from 'react';
import { Button, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';

const TabSelector = ({ tabs, activeTab, onTabChange }) => {
    const { t } = useTranslation();

    return (
        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 3, flexWrap: 'wrap' }}>
            {tabs.map((tab) => (
                <Button
                    key={tab.key}
                    variant={activeTab === tab.key ? 'contained' : 'outlined'}
                    color={activeTab === tab.key ? 'primary' : 'inherit'}
                    onClick={() => onTabChange(tab.key)}
                    sx={{
                        fontWeight: 'bold',
                        fontFamily: 'Roboto, sans-serif',
                        textTransform: 'none',
                        fontSize: { xs: 14, sm: 16 },       // mniejsze na telefonie
                        minHeight: { xs: 36, sm: 40 },      // mniejsze na telefonie
                        padding: { xs: '4px 12px', sm: '6px 16px' }, // mniejsze paddingi
                        buttonShadow: activeTab === tab.key ? '0 0 30px rgba(25, 118, 210, 0.25)' : 'none',
                    }}
                >
                    {t(tab.labelKey)}
                </Button>
            ))}
        </Stack>
    );
};

export default TabSelector;
