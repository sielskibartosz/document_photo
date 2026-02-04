import React from 'react';
import { Box, Typography, List, ListItem, ListItemText, Divider, IconButton } from '@mui/material';
import { darkTheme } from '../styles/theme';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useTranslation } from 'react-i18next';
import SEO from "../components/SEO";

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
        p: { xs: 2, sm: 4 },
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
      }}
    >
    {/* SEO */}
      <SEO
        title="PhotoIDCreator – Wymagania zdjęcia do dowodu"
        description="Dowiedz się, jakie są wymagania zdjęcia do dowodu, paszportu i legitymacji. Z PhotoIDCreator przygotujesz zdjęcie idealne do dokumentów."
        url="https://photoidcreator.com/id-requirements"
      />
      {/* Górny pasek: strzałka + tytuł */}
        <Box sx={{ position: 'relative', mb: 3, textAlign: 'center' }}>
          {/* Strzałka wstecz */}
          <IconButton
            onClick={() => navigate(-1)}
            sx={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', color: 'primary.main' }}
            aria-label="back"
          >
            <ArrowBackIcon fontSize="medium" />
          </IconButton>

          {/* Tytuł wyśrodkowany */}
          <Typography
            variant="h5"
            sx={{
              fontWeight: 'bold',
              lineHeight: 1.2,
              display: 'inline-block', // żeby textAlign center działał
            }}
          >
            {title}
          </Typography>
        </Box>


      {/* Wstęp / nagłówek */}
      <Typography variant="body2" paragraph sx={{ mb: 3, lineHeight: 1.5 }}>
        {header}
      </Typography>

      {/* Zdjęcia pod tytułem */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          mb: 3,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Box
          component="img"
          src="/images/correct_id_photo.png"
          sx={{ width: { xs: '100%', sm: '180px' }, borderRadius: 2, boxShadow: 3 }}
        />
        <Box
          component="img"
          src="/images/incorrect_id_photo.png"
          sx={{ width: { xs: '100%', sm: '180px' }, borderRadius: 2, boxShadow: 3 }}
        />
      </Box>

      {/* Lista wymagań */}
      <List sx={{ mb: 0 }}>
        {list.map((item, index) => (
          <React.Fragment key={index}>
            <ListItem sx={{ display: 'block', pl: 0 }}>
              <ListItemText
                primary={item.primary}
                secondary={item.secondary}
                primaryTypographyProps={{ fontWeight: 500, fontSize: '0.95rem' }}
                secondaryTypographyProps={{ lineHeight: 1.4, fontSize: '0.85rem' }}
              />
            </ListItem>
            {index < list.length - 1 && <Divider sx={{ my: 0.5 }} />}
          </React.Fragment>
        ))}
      </List>

      {/* Stopka */}
      <Typography variant="body2" paragraph sx={{ lineHeight: 1.6, mt: 3 }}>
        {footer}
      </Typography>
    </Box>
  );
};

export default IdRequirementsPage;
