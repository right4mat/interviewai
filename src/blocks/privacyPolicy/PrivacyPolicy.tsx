'use client';
import { useEffect, useState, ReactNode } from 'react';
import { useT } from '@/i18n/client';

// @mui
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// @project
import { SECTION_COMMON_PY } from '@/utils/constant';
import Container from '@mui/material/Container';
import { MenuItem, PrivacyPolicyConfig } from '@/views/privacyPolicy/data/privacyPolicy';

// Helper functions for scrollspy
const clamp = (value: number): number => Math.max(0, value);
const isBetween = (value: number, floor: number, ceil: number): boolean => value >= floor && value <= ceil;

/***************************  HOOKS - SCROLLSPY  ***************************/

interface Position {
  id: string;
  top: number;
  bottom: number;
}

function useScrollspy(ids: string[], offset = 0): string {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const listener = (): void => {
      const scroll = window.scrollY;

      const position = ids
        .map((id) => {
          const element = document.getElementById(id);
          if (!element) return { id, top: -1, bottom: -1 };

          const rect = element.getBoundingClientRect();
          const top = clamp(rect.top + scroll - offset);
          const bottom = clamp(rect.bottom + scroll - offset);

          return { id, top, bottom };
        })
        .find(({ top, bottom }: Position) => isBetween(scroll, top, bottom));

      setActiveId(position?.id || '');
    };

    window.addEventListener('scroll', listener);
    window.addEventListener('resize', listener);
    listener(); // Initial call to set the activeId

    return () => {
      window.removeEventListener('scroll', listener);
      window.removeEventListener('resize', listener);
    };
  }, [ids, offset]);

  return activeId;
}

/***************************  SECTIONS - PRIVACY POLICY  ***************************/

export default function PrivacyPolicyPage({ menuItems }: PrivacyPolicyConfig): ReactNode {
  const { t } = useT('privacyPolicy');
  const ids = menuItems.map((item) => item.id);

  // Adjust offset as per header height
  const activeId = useScrollspy(ids, 60);
  const [selectedID, setSelectedID] = useState<string>(activeId);

  useEffect(() => {
    if (activeId) {
      setSelectedID(activeId);
    }
  }, [activeId]);

  return (
    <Container sx={{ pb: SECTION_COMMON_PY }}>
      <Grid container spacing={{ xs: 2, md: 3 }}>
        <Grid size={{ xs: 12, sm: 4, md: 3 }}>
          <List component="div" sx={{ position: 'sticky', top: 20 }} disablePadding>
            {menuItems.map((item, index) => (
              <ListItemButton
                key={index}
                href={`#${item.id}`}
                sx={{
                  py: 1.25,
                  px: 1.5,
                  borderRadius: 3,
                  mb: 0.75,
                  ...(selectedID === item.id && { color: 'primary.main', bgcolor: 'grey.50' }),
                  '&:hover': { color: 'grey.50' }
                }}
                onClick={() => setSelectedID(item.id)}
              >
                <ListItemText 
                  primary={t(item.heading)} 
                  primaryTypographyProps={{ variant: 'subtitle1' }} 
                  sx={{ my: 0 }} 
                />
              </ListItemButton>
            ))}
          </List>
          <Divider sx={{ display: { xs: 'block', sm: 'none' } }} />
        </Grid>
        <Grid size={{ xs: 12, sm: 8, md: 9 }}>
          {menuItems.map((item, index) => (
            <Stack
              key={index}
              id={item.id}
              sx={{ py: { xs: 1, sm: 1.5, md: 3 }, px: { md: 3 }, gap: 1, '&:first-of-type': { pt: { sm: 0 } } }}
            >
              <Typography variant="h4">{t(item.heading)}</Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                {t(item.caption)}
              </Typography>
            </Stack>
          ))}
        </Grid>
      </Grid>
    </Container>
  );
}
