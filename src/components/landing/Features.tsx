"use client";
import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useT } from '@/i18n/client';

interface Step {
  image: string;
  title: string;
  description: string;
}

export function Features() {
  const { t } = useT('landing');

  const steps: Step[] = [
    {
      image: '/assets/images/graphics/resumeHero.png',
      title: 'Upload Your Resume',
      description: 'Start by uploading your resume to help us understand your background and experience.'
    },
    {
      image: '/assets/images/graphics/interviewHero.png',
      title: 'Begin Your Interview',
      description: 'Start your AI-powered interview and receive real-time feedback and guidance.'
    },
    {
      image: '/assets/images/graphics/responseHero.png',
      title: 'Get Detailed Feedback',
      description: 'Receive comprehensive feedback on your responses and areas for improvement.'
    },
    {
      image: '/assets/images/graphics/trackHero.png',
      title: 'Track Your Progress',
      description: 'Monitor your interview performance and track your improvement over time.'
    }
  ];

  return (
    <Container id="features" sx={{ py: { xs: 8, sm: 16 } }}>
      <Box sx={{ textAlign: 'center', mb: { xs: 6, sm: 10 } }}>
        <Typography
          component="h2"
          variant="h3"
          gutterBottom
          sx={{ 
            color: 'text.primary',
            fontWeight: 'bold',
            mb: 2
          }}
        >
          {t('features.title')}
        </Typography>
        <Typography
          variant="h6"
          sx={{ 
            color: 'text.secondary',
            maxWidth: '800px',
            mx: 'auto'
          }}
        >
          {t('features.subtitle')}
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 4,
          justifyContent: 'center',
          alignItems: 'center',
          flexWrap: { md: 'wrap' }
        }}
      >
        {steps.map((step, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              maxWidth: { xs: '100%', md: '280px' },
              textAlign: 'center',
              position: 'relative',
              mb: { md: 4 }
            }}
          >
            <Box
              sx={{
                width: '100%',
                height: '300px',
                mb: 3,
                backgroundImage: `url(${step.image})`,
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.05)'
                }
              }}
            />
            <Typography
              variant="h5"
              sx={{
                color: 'text.primary',
                fontWeight: 'bold',
                mb: 2
              }}
            >
              {step.title}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                lineHeight: 1.6
              }}
            >
              {step.description}
            </Typography>
            {index < steps.length - 1 && (
              <Box
                sx={{
                  display: { xs: 'none', md: 'block' },
                  position: 'absolute',
                  right: '-32px',
                  top: '150px',
                  width: '64px',
                  height: '2px',
                  bgcolor: 'divider'
                }}
              />
            )}
          </Box>
        ))}
      </Box>
    </Container>
  );
}
