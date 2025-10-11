import React from 'react';
import { Box, Typography, List, ListItem, ListItemText, Divider, IconButton } from '@mui/material';
import { darkTheme } from '../styles/theme';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useTranslation } from 'react-i18next';

const IdRequirementsPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const title = t('idRequirements.title');
  const header = t('idRequirements.header');
  const list = t('idRequirements.list', { returnObjects: true });
  const footer = t('idRequirements.footer');

  return (
    <Box sx={{ minHeight: '100vh', p: { xs: 3, sm: 6 }, width: { xs: '95vw', sm: '70vw', md: '60vw' }, mx: 'auto', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", color: darkTheme.palette.text.primary, background: darkTheme.palette.mode === 'dark' ? 'linear-gradient(135deg, #1f2937 0%, #374151 100%)' : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', borderRadius: 4, boxShadow: darkTheme.shadows[5], position: 'relative' }}>

      {/* Strzałka wstecz */}
      <IconButton onClick={() => navigate(-1)} sx={{ position: 'absolute', top: 16, left: 16, color: 'primary.main' }} aria-label="back">
        <ArrowBackIcon fontSize="large" />
      </IconButton>

      <Box sx={{ maxWidth: 700, mx: 'auto', textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
          {title}
        </Typography>

        <Typography variant="body1" paragraph sx={{ mb: 3, lineHeight: 1.7 }}>
          {header}
        </Typography>

        {/* Zdjęcia pod tytułem */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3, alignItems: 'center' }}>
          <Box component="img" src="/images/correct_id_photo.png" sx={{ width: { xs: '95%', sm: '400px' }, borderRadius: 2, boxShadow: 3 }} />
          <Box component="img" src="/images/incorrect_id_photo.png" sx={{ width: { xs: '95%', sm: '400px' }, borderRadius: 2, boxShadow: 3 }} />
        </Box>

        <List sx={{ mb: 0 }}>
          {list.map((item, index) => (
            <React.Fragment key={index}>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 3 }}>
                <ListItemText
                  primary={item.primary}
                  secondary={item.secondary}
                  primaryTypographyProps={{ fontWeight: 500 }}
                  secondaryTypographyProps={{ lineHeight: 1.6 }}
                />
              </ListItem>
              {index < list.length - 1 && <Divider sx={{ my: 1 }} />}
            </React.Fragment>
          ))}
        </List>

        <Typography variant="body1" paragraph sx={{ lineHeight: 1.7, mt: 2 }}>
          {footer}
        </Typography>
      </Box>
    </Box>
  );
};

export default IdRequirementsPage;
