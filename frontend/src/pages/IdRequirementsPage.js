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
    <Box
      sx={{
        minHeight: '100vh',
        p: { xs: 2, sm: 4 }, // zmniejszony padding
        width: { xs: '95vw', sm: '80vw', md: '60vw' },
        mx: 'auto',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: darkTheme.palette.text.primary,
        background:
          darkTheme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #1f2937 0%, #374151 100%)'
            : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        borderRadius: 3,
        boxShadow: darkTheme.shadows[3],
        position: 'relative',
      }}
    >
      {/* Strzałka wstecz */}
      <IconButton
        onClick={() => navigate(-1)}
        sx={{ position: 'absolute', top: 12, left: 12, color: 'primary.main' }}
        aria-label="back"
      >
        <ArrowBackIcon fontSize="medium" />
      </IconButton>

      <Box sx={{ maxWidth: 600, mx: 'auto', textAlign: 'center' }}>
        <Typography
          variant="h5" // zmniejszony nagłówek
          gutterBottom
          sx={{ fontWeight: 'bold', mb: 2 }}
        >
          {title}
        </Typography>

        <Typography variant="body2" paragraph sx={{ mb: 2, lineHeight: 1.5 }}>
          {header}
        </Typography>

        {/* Zdjęcia pod tytułem */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' }, // w desktopie obok siebie
            gap: 2,
            mb: 2,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box
            component="img"
            src="/images/correct_id_photo.png"
            sx={{ width: { xs: '100%', sm: '180px' }, borderRadius: 2, boxShadow: 2 }}
          />
          <Box
            component="img"
            src="/images/incorrect_id_photo.png"
            sx={{ width: { xs: '100%', sm: '180px' }, borderRadius: 2, boxShadow: 2 }}
          />
        </Box>

        <List sx={{ mb: 0 }}>
          {list.map((item, index) => (
            <React.Fragment key={index}>
              <ListItem
                sx={{
                  display: 'block', // brak kropek
                  pl: 0,            // usuwa padding
                }}
              >
                <ListItemText
                  primary={item.primary}
                  secondary={item.secondary}
                  primaryTypographyProps={{ fontWeight: 500, fontSize: '0.9rem' }}
                  secondaryTypographyProps={{ lineHeight: 1.4, fontSize: '0.85rem' }}
                />
              </ListItem>
              {index < list.length - 1 && <Divider sx={{ my: 0.5 }} />}
            </React.Fragment>
          ))}
        </List>


        <Typography variant="body2" paragraph sx={{ lineHeight: 1.5, mt: 1.5 }}>
          {footer}
        </Typography>
      </Box>
    </Box>
  );
};

export default IdRequirementsPage;
