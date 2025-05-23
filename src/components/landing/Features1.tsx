"use client";
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Chip, { type ChipProps } from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { useT } from '@/i18n/client';

interface FeatureItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  imageLight: string;
  imageDark: string;
}

interface CustomChipProps extends ChipProps {
  selected?: boolean;
}

const ChipCustom = styled(Chip, {
  shouldForwardProp: (prop) => prop !== 'selected',
})<CustomChipProps>(({ theme, selected }) => ({
  ...(selected && {
    background: 'linear-gradient(to bottom right, hsl(210, 98%, 48%), hsl(210, 98%, 35%))',
    color: 'hsl(0, 0%, 100%)',
    borderColor: (theme.vars || theme).palette.primary.light,
    '& .MuiChip-label': {
      color: 'hsl(0, 0%, 100%)',
    },
    ...theme.applyStyles('dark', {
      borderColor: (theme.vars || theme).palette.primary.dark,
    }),
  })
}));

interface MobileLayoutProps {
  selectedItemIndex: number;
  handleItemClick: (index: number) => void;
  selectedFeature: FeatureItem;
}

export function MobileLayout({
  selectedItemIndex,
  handleItemClick,
  selectedFeature,
}: MobileLayoutProps) {
  const { t } = useT('landing');
  return (
    <Box
      sx={{
        display: { xs: 'flex', sm: 'none' },
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Box sx={{ display: 'flex', gap: 2, overflow: 'auto' }}>
        {selectedFeature && (
          <ChipCustom
            size="medium"
            label={t(selectedFeature.title)}
            onClick={() => handleItemClick(0)}
            selected={true}
          />
        )}
      </Box>
      <Card variant="outlined">
        <Box
          sx={(theme) => ({
            mb: 2,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: 280,
            backgroundImage: 'var(--items-imageLight)',
            ...theme.applyStyles('dark', {
              backgroundImage: 'var(--items-imageDark)',
            }),
          })}
          style={
            selectedFeature
              ? ({
                  '--items-imageLight': `url(${selectedFeature.imageLight})`,
                  '--items-imageDark': `url(${selectedFeature.imageDark})`,
                } as React.CSSProperties)
              : {}
          }
        />
        <Box sx={{ px: 2, pb: 2 }}>
          <Typography
            gutterBottom
            sx={{ color: 'text.primary', fontWeight: 'medium' }}
          >
            {t(selectedFeature.title)}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1.5 }}>
            {t(selectedFeature.description)}
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}

export interface Feature {
  icon: React.ReactNode;
  imageLight: string;
  imageDark: string;
  title: string;
  description: string;
}

export interface FeaturesConfig {
  features: Feature[];
}

export function Features({ features }: FeaturesConfig) {
  const { t } = useT('landing');
  const { t: tFeatures } = useT('features');
  const [selectedItemIndex, setSelectedItemIndex] = React.useState(0);

  const handleItemClick = (index: number) => {
    setSelectedItemIndex(index);
  };

  const selectedFeature = features[selectedItemIndex];

  return (
    <Container id="features" sx={{ py: { xs: 8, sm: 16 } }}>
      <Box sx={{ width: { sm: '100%', md: '60%' } }}>
        <Typography
          component="h2"
          variant="h4"
          gutterBottom
          sx={{ color: 'text.primary' }}
        >
          {t('features.title')}
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: 'text.secondary', mb: { xs: 2, sm: 4 } }}
        >
          {t('features.subtitle')}
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row-reverse' },
          gap: 2,
        }}
      >
        <div>
          <Box
            sx={{
              display: { xs: 'none', sm: 'flex' },
              flexDirection: 'column',
              gap: 2,
              height: '100%',
            }}
          >
            {features.map(({ icon }, index: number) => (
              <Box
                key={index}
                component={Button}
                onClick={() => handleItemClick(index)}
                sx={[
                  (theme) => ({
                    p: 2,
                    height: '100%',
                    width: '100%',
                    '&:hover': {
                      backgroundColor: (theme.vars || theme).palette.action.hover,
                    },
                  }),
                  selectedItemIndex === index && {
                    backgroundColor: 'action.selected',
                  },
                ]}
              >
                <Box
                  sx={[
                    {
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'left',
                      gap: 1,
                      textAlign: 'left',
                      textTransform: 'none',
                      color: 'text.secondary',
                    },
                    selectedItemIndex === index && {
                      color: 'text.primary',
                    },
                  ]}
                >
                  {icon}
                  <Typography variant="h6">
                    {tFeatures(`feature${index + 1}.title`)}
                  </Typography>
                  <Typography variant="body2">
                    {tFeatures(`feature${index + 1}.description`)}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
          <MobileLayout
            selectedItemIndex={selectedItemIndex}
            handleItemClick={handleItemClick}
            selectedFeature={{
              icon: selectedFeature?.icon,
              imageLight: selectedFeature?.imageLight ?? '',
              imageDark: selectedFeature?.imageDark ?? '',
              title: tFeatures(`feature${selectedItemIndex + 1}.title`),
              description: tFeatures(`feature${selectedItemIndex + 1}.description`)
            }}
          />
        </div>
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            width: { xs: '100%', md: '70%' },
            height: 'var(--items-image-height)',
          }}
        >
          <Card
            variant="outlined"
            sx={{
              height: '100%',
              width: '100%',
              display: { xs: 'none', sm: 'flex' },
              pointerEvents: 'none',
            }}
          >
            <Box
              sx={(theme) => ({
                m: 'auto',
                width: 420,
                height: 500,
                backgroundSize: 'contain',
                backgroundImage: 'var(--items-imageLight)',
                ...theme.applyStyles('dark', {
                  backgroundImage: 'var(--items-imageDark)',
                }),
              })}
              style={
                selectedFeature
                  ? ({
                      '--items-imageLight': `url(${selectedFeature.imageLight})`,
                      '--items-imageDark': `url(${selectedFeature.imageDark})`,
                    } as React.CSSProperties)
                  : {}
              }
            />
          </Card>
        </Box>
      </Box>
    </Container>
  );
}
