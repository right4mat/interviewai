import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import MuiLink from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/X';
import LogoIcon from '@/icons/Logo';
import branding from '@/branding.json';
import { footerContent } from '@/footer';
import NextLink from 'next/link';

function Copyright() {
  return (
    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
      {footerContent.copyright.text}
      <NextLink href={footerContent.copyright.link.path} passHref legacyBehavior>
        <MuiLink color="text.secondary">
          {footerContent.copyright.link.label}
        </MuiLink>
      </NextLink>
      &nbsp;
      {new Date().getFullYear()}
    </Typography>
  );
}

export default function Footer() {
  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: { xs: 4, sm: 8 },
        py: { xs: 8, sm: 10 },
        textAlign: { sm: 'center', md: 'left' },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          width: '100%',
          justifyContent: 'space-between',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            minWidth: { xs: '100%', sm: '60%' },
          }}
        >
          <Box sx={{ width: { xs: '100%', sm: '60%' } }}>
            <Typography variant="body2" gutterBottom sx={{ fontWeight: 600, mt: 2 }}>
              {branding.brandName}
            </Typography>
            <Typography variant="body2" gutterBottom sx={{ fontWeight: 600, mt: 2 }}>
              {footerContent.newsletter.title}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
              {footerContent.newsletter.description}
            </Typography>
            <InputLabel htmlFor="email-newsletter">{footerContent.newsletter.inputLabel}</InputLabel>
            <Stack direction="row" spacing={1} useFlexGap>
              <TextField
                id="email-newsletter"
                hiddenLabel
                size="small"
                variant="outlined"
                fullWidth
                aria-label={footerContent.newsletter.inputPlaceholder}
                placeholder={footerContent.newsletter.inputPlaceholder}
                slotProps={{
                  input: {
                    autoComplete: 'off',
                    'aria-label': footerContent.newsletter.inputPlaceholder,
                  },
                }}
                sx={{ width: '250px' }}
              />
              <Button
                variant="contained"
                color="primary"
                size="small"
                sx={{ flexShrink: 0 }}
              >
                {footerContent.newsletter.buttonText}
              </Button>
            </Stack>
          </Box>
        </Box>
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
            {footerContent.sections.product.title}
          </Typography>
          {footerContent.sections.product.links.map((link) => (
            <NextLink key={link.label} href={link.path} passHref legacyBehavior>
              <MuiLink color="text.secondary" variant="body2">
                {link.label}
              </MuiLink>
            </NextLink>
          ))}
        </Box>
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
            {footerContent.sections.company.title}
          </Typography>
          {footerContent.sections.company.links.map((link) => (
            <NextLink key={link.label} href={link.path} passHref legacyBehavior>
              <MuiLink color="text.secondary" variant="body2">
                {link.label}
              </MuiLink>
            </NextLink>
          ))}
        </Box>
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
            {footerContent.sections.legal.title}
          </Typography>
          {footerContent.sections.legal.links.map((link) => (
            <NextLink key={link.label} href={link.path} passHref legacyBehavior>
              <MuiLink color="text.secondary" variant="body2">
                {link.label}
              </MuiLink>
            </NextLink>
          ))}
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          pt: { xs: 4, sm: 8 },
          width: '100%',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <div>
          <NextLink href={footerContent.bottomLinks.privacyPolicy.path} passHref legacyBehavior>
            <MuiLink color="text.secondary" variant="body2">
              {footerContent.bottomLinks.privacyPolicy.label}
            </MuiLink>
          </NextLink>
          <Typography sx={{ display: 'inline', mx: 0.5, opacity: 0.5 }}>
            &nbsp;•&nbsp;
          </Typography>
          <NextLink href={footerContent.bottomLinks.termsOfService.path} passHref legacyBehavior>
            <MuiLink color="text.secondary" variant="body2">
              {footerContent.bottomLinks.termsOfService.label}
            </MuiLink>
          </NextLink>
          <Copyright />
        </div>
        <Stack
          direction="row"
          spacing={1}
          useFlexGap
          sx={{ justifyContent: 'left', color: 'text.secondary' }}
        >
          <IconButton
            color="inherit"
            size="small"
            href={footerContent.socialLinks.github.path}
            aria-label={footerContent.socialLinks.github.label}
            sx={{ alignSelf: 'center' }}
          >
            <GitHubIcon />
          </IconButton>
          <IconButton
            color="inherit"
            size="small"
            href={footerContent.socialLinks.twitter.path}
            aria-label={footerContent.socialLinks.twitter.label}
            sx={{ alignSelf: 'center' }}
          >
            <TwitterIcon />
          </IconButton>
          <IconButton
            color="inherit"
            size="small"
            href={footerContent.socialLinks.linkedin.path}
            aria-label={footerContent.socialLinks.linkedin.label}
            sx={{ alignSelf: 'center' }}
          >
            <LinkedInIcon />
          </IconButton>
        </Stack>
      </Box>
    </Container>
  );
}
