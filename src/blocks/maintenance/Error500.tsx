'use client';
import { type ReactElement } from 'react';

// @mui
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';

// @project
import { SECTION_COMMON_PY } from '@/utils/constant';

// @assets
import Error500 from '@/images/maintenance/Error500';
import Error500Server from '@/images/maintenance/Error500Server';

/***************************  ERROR 500 - PAGES  ***************************/

interface Error500PageProps {
  primaryBtn?: {
    children: React.ReactNode;
    [key: string]: any;
  };
  heading: string;
}

export default function Error500Page({ primaryBtn, heading }: Error500PageProps): ReactElement {
  return (
    <Container>
      <Stack sx={{ width: 1, height: '100vh', py: SECTION_COMMON_PY, minHeight: { xs: 450, sm: 600, md: 800 } }}>
        <Card sx={{ width: 1, height: 1, position: 'relative' }}>
          <Stack sx={{ alignItems: 'center', justifyContent: 'center', gap: 2.25, height: '70%' }}>
            <Box sx={{ width: 1, maxWidth: { xs: 340, sm: 486, md: 728 }, p: 2 }}>
              <Error500 />
            </Box>
            <Typography sx={{ textAlign: 'center', width: { xs: 248, sm: 340, md: 448 } }}>{heading}</Typography>
            {primaryBtn && <Button variant="contained" size="medium" {...primaryBtn} sx={{ zIndex: 1 }} />}
          </Stack>
          <Box sx={{ width: { xs: '95%', md: '90%' }, position: 'absolute', left: -2, bottom: -6 }}>
            <Error500Server />
          </Box>
        </Card>
      </Stack>
    </Container>
  );
}
