// Sekcje i FAQ strony z constants/seoPages.json ("sections", "faq").
// Ta sama treść trafia do statycznego HTML (scripts/prerender-routes.js), więc to, co widzi Google,
// zgadza się z tym, co widzi użytkownik po starcie aplikacji.
import React from "react";
import { Accordion, AccordionDetails, AccordionSummary, Box, Link, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Link as RouterLink } from "react-router-dom";

const SeoContent = ({ page }) => {
  if (!page || (!page.sections && !page.faq)) return null;

  return (
    <Box component="section" sx={{ maxWidth: 760, mx: "auto", mt: 4, textAlign: "left" }}>
      {(page.sections || []).map((section) => (
        <Box key={section.h2} sx={{ mb: 3 }}>
          <Typography variant="h6" component="h2" fontWeight={600} gutterBottom>
            {section.h2}
          </Typography>
          {(section.paragraphs || []).map((text, i) => (
            <Typography key={i} variant="body1" color="text.secondary" paragraph>
              {text}
            </Typography>
          ))}
          {section.list && (
            <Box component="ul" sx={{ pl: 3, m: 0, color: "text.secondary" }}>
              {section.list.map((item, i) => (
                <Typography key={i} component="li" variant="body1" sx={{ mb: 0.5 }}>
                  {item}
                </Typography>
              ))}
            </Box>
          )}
          {section.link && (
            <Link component={RouterLink} to={section.link[0]}>{section.link[1]}</Link>
          )}
        </Box>
      ))}

      {page.faq && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" component="h2" fontWeight={600} gutterBottom>
            Najczęstsze pytania
          </Typography>
          {page.faq.map(({ q, a }) => (
            <Accordion key={q} disableGutters sx={{ background: "transparent" }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography component="h3" fontWeight={500}>{q}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary">{a}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default SeoContent;
