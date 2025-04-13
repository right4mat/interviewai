import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Link from 'next/link';
import { PAGE_PATH } from '@/path';

const StyledBox = styled('div')(({ theme }) => ({
  zIndex: -1,
  marginTop: -120,
  alignSelf: 'center',
  width: '90vw',
  height: 500, // Reduced height for mobile
  backgroundImage: `url(/assets/images/graphics/hero.png)`,
  backgroundSize: 'contain',
  [theme.breakpoints.up('sm')]: {
    height: 600, // Reduced height for tablet
  },
  [theme.breakpoints.up('md')]: {
    height: 800, // Medium height for desktop
  },
  [theme.breakpoints.up('lg')]: {
    height: 1000, // Original height for large screens
  },
  ...theme.applyStyles('dark', {
    boxShadow: '0 0 24px 12px hsla(210, 100%, 25%, 0.2)',
    backgroundImage: `url(/assets/images/graphics/hero.png)`,
    outlineColor: 'hsla(220, 20%, 42%, 0.1)',
    borderColor: (theme.vars || theme).palette.grey[700],
  }),
}));

export interface HeroConfig {
  title: string;
  subtitle: string;
  info: string;
  button: { text: string; onClick: () => void };
}

export function Hero({ title, subtitle, info, button }: HeroConfig) {
  return (
    <Box
      id="hero"
      sx={(theme) => ({
        width: '100%',
        backgroundRepeat: 'no-repeat',

        backgroundImage:
          'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 90%), transparent)',
        ...theme.applyStyles('dark', {
          backgroundImage:
            'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 16%), transparent)',
        }),
      })}
    >
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: { xs: 14, sm: 20 },
          pb: { xs: 0, sm: 0 },
        }}
      >
        <Stack
          spacing={2}
          useFlexGap
          sx={{ alignItems: 'center', width: { xs: '100%', sm: '100%' } }}
        >
          <Typography
            variant="h1"
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              fontSize: 'clamp(3rem, 10vw, 3.5rem)',
              textAlign: 'center',
            }}
          >
            {title}
          
          </Typography>
          <Typography
              variant="h1"
              sx={(theme) => ({
                textAlign: 'center',
                fontSize: 'clamp(3rem, 10vw, 3.5rem)',
                color: 'primary.main',
                ...theme.applyStyles('dark', {
                  color: 'primary.light',
                }),
              })}
            >
              {subtitle}
            </Typography>
          <Typography
            sx={{
              textAlign: 'center',
              color: 'text.secondary',
              width: { sm: '100%', md: '80%' },
            }}
          >
           
            {info}
          </Typography>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1}
            useFlexGap
            justifyContent="center"
            sx={{ pt: 2, width: { xs: '100%', sm: '350px' } }}
          >
          
      
            <Button
              variant="contained"
              color="primary"
              size="small"
              sx={{ minWidth: 'fit-content' }}
              onClick={button.onClick}
            >
              {button.text}
            </Button>
          </Stack>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ textAlign: 'center' }}
          >
            By clicking &quot;Start now&quot; you agree to our&nbsp;
            <Link href={PAGE_PATH.termsConditionPage} style={{ color: 'var(--mui-palette-primary-main)' }}>
              Terms & Conditions
            </Link>
            .
          </Typography>
        </Stack>
        <StyledBox id="image" />
      </Container>
    </Box>
  );
}
