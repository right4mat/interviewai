"use client";
import PropTypes from 'prop-types';
import { useT } from '@/i18n/client';
// @next
import NextLink from 'next/link';

// @mui
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

// @project
import { SECTION_COMMON_PY } from '@/utils/constant';

// @types
interface ChipLink {
  href: string;
  children: React.ReactNode;
  [key: string]: any;
}

interface ChipProps {
  label: string | React.ReactNode;
  link?: ChipLink;
}

interface SmallHero3Props {
  translationKey: string;
  chip?: ChipProps;
  headline: string;
  caption?: string;
  exploreBtn?: {
    href: string;
    children: React.ReactNode;
    [key: string]: any;
  };
}

/***************************  SMALL HERO - 3  ***************************/

export default function SmallHero({ chip, translationKey, headline, caption, exploreBtn }: SmallHero3Props) {
  const { t } = useT(translationKey);
  
  return (
    <Container sx={{ py: SECTION_COMMON_PY }}>
      <Stack sx={{ alignItems: 'start', gap: { xs: 1.5, md: 4 }, mt: 10 }}>
        {chip && (
          <Chip
            label={
              typeof chip.label === 'string' ? (
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {chip.label}
                  {chip.link && (
                    <Link
                      component={NextLink}
                      variant="caption"
                      color="primary.main"
                      {...chip.link}
                      underline="hover"
                      sx={{ '&:hover': { color: 'primary.dark' } }}
                    />
                  )}
                </Typography>
              ) : (
                chip.label
              )
            }
            sx={{ bgcolor: 'grey.100' }}
          />
        )}

        <Stack direction="row" sx={{ justifyContent: 'space-between', flexWrap: { xs: 'wrap', md: 'unset' }, width: 1, gap: 3 }}>
          <Stack sx={{ gap: 1.5 }}>
            <Typography variant="h1">{t(headline)}</Typography>
            {caption && (
              <Typography variant="h6" sx={{ color: 'text.secondary', width: { md: '85%' } }}>
                {t(caption)}
              </Typography>
            )}
          </Stack>
          {exploreBtn && (
            <Stack direction="row" sx={{ alignItems: 'end', justifyContent: 'center', minWidth: 'fit-content' }}>
              <Button size="large" variant="outlined" {...exploreBtn} />
            </Stack>
          )}
        </Stack>
      </Stack>
    </Container>
  );
}

