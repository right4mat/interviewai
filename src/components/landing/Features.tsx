"use client";
import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { useT } from '@/i18n/client';
import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';

interface Step {
  emoji: string;
  title: string;
  description: string;
}

export function Features() {
  const { t } = useT('landing');
  const [visibleSteps, setVisibleSteps] = useState<number[]>([]);
  const [openVideo, setOpenVideo] = useState(false);

  const handleOpenVideo = () => setOpenVideo(true);
  const handleCloseVideo = () => setOpenVideo(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setVisibleSteps((prevVisibleSteps) => {
          const nextStep = prevVisibleSteps.length;
          if (nextStep < steps.length) {
            return [...prevVisibleSteps, nextStep];
          } else {
            clearInterval(interval);
            return prevVisibleSteps;
          }
        });
      }, 300);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const steps: Step[] = [
    {
      emoji: '📄',
      title: 'Upload Your Resume (Optional)',
      description: 'Optionally upload your resume to provide us with more context about your background and experience.'
    },
    {
      emoji: '📋',
      title: 'Paste Job Description',
      description: 'Paste the job description to tailor your interview experience to the specific role you are targeting.'
    },
    {
      emoji: '🤖',
      title: 'Conversational AI Interview',
      description: 'Engage in a conversational AI interview and receive textual feedback along the way to improve your responses.'
    },
    {
      emoji: '📈',
      title: 'Track Your Results',
      description: 'Track your results as you practice and monitor your progress over time.'
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
            mx: 'auto',
            mb: 4
          }}
        >
          {t('features.subtitle')}
        </Typography>
        
        <Button
          size="large"
          variant="outlined"
          color="primary"
          startIcon={<PlayCircleOutlineIcon />}
          onClick={handleOpenVideo}
          sx={{ 
            borderRadius: 2,
            px: 3,
            py: 1,
            fontSize: '1.1rem'
          }}
        >
          Watch Demo
        </Button>
      </Box>

      <Grid container spacing={4} justifyContent="center">
        {steps.map((step, index) => (
          <Grid
            size={{ xs: 12, md: 3 }}
            key={index}
            sx={{
              opacity: visibleSteps.includes(index) ? 1 : 0,
              transform: visibleSteps.includes(index) ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.5s ease, transform 0.5s ease'
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                position: 'relative',
                mb: { md: 4 }
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  height: '200px',
                  mb: 3,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontSize: '130px',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.05)'
                  }
                }}
              >
                {step.emoji}
              </Box>
                 <Typography
                variant="h6"
                sx={{
                  color: 'text.secondary',
                  mt: 1
                }}
              >
                Step {index + 1}
              </Typography>
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
            </Box>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={openVideo}
        onClose={handleCloseVideo}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            bgcolor: 'background.paper',
            backgroundImage: 'none'
          }
        }}
      >
        <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">Product Demo</Typography>
          <IconButton
            aria-label="close"
            onClick={handleCloseVideo}
            sx={{
              color: (theme) => theme.palette.grey[500]
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 0, aspectRatio: '16/9', position: 'relative' }}>
          <video
            width="100%"
            height="100%"
            controls
            autoPlay
            style={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              backgroundColor: 'black'
            }}
          >
            <source src="/assets/videos/demo.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </DialogContent>
      </Dialog>
    </Container>
  );
}
