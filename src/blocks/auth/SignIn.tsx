import * as React from 'react';
import Stack from '@mui/material/Stack';
import SignInCard from '@/components/auth/SignInCard';
import Content from '@/components/auth/Content';
import { useTheme, useMediaQuery, Box } from '@mui/material';
interface SignInProps {
  // Define any props here if needed
}

export default function SignIn(props: SignInProps) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  return (<>
      <Stack
        direction="column"
        component="main"
        sx={[
          {
            justifyContent: 'center',
            height: {xs: '100%', sm: '100%', md: 'calc((1 - var(--template-frame-height, 0)) * 100%)'},
            marginTop: {xs: 0, sm: 0, md: 'max(40px - var(--template-frame-height, 0px), 0px)'},
            minHeight: '100%',
          },
          (theme) => ({
            '&::before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              zIndex: -1,
              inset: 0,
              backgroundImage:
                'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
              backgroundRepeat: 'no-repeat',
              ...theme.applyStyles('dark', {
                backgroundImage:
                  'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
              }),
            },
          }),
        ]}
      >
        <Stack
          direction={{ xs: 'column-reverse', md: 'row' }}
          sx={{
            height:"100%",
            justifyContent: 'center',
            gap: { xs: 0, sm: 12 },
            p:  {xs: 0, sm: 0, md: 2},
            mx: {xs: 0, sm: 0, md: 'auto'},
     
          }}
        >
          <Stack
            direction={{ xs: 'column-reverse', md: 'row' }}
            sx={{
              justifyContent: 'center',
              gap: { xs: 0, sm: 12 },
              p: { xs: 0, sm: 4 },
              m: {xs: 0, sm: 'auto', md: 'auto'},
            }}
          >
            <Box sx={{p:4}}>
             <Content />
             </Box>
            <SignInCard />
          </Stack>
        </Stack>
      </Stack>
      </>
  );
}