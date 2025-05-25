"use client";
import Typography from '@mui/material/Typography';
import { type HighlightsConfig } from "@/components/landing/Highlights";

export const highlights: HighlightsConfig = {
  title: 'highlights.title',
  description: 'highlights.description',
  highlights: [
    {
      icon: <Typography sx={{ fontSize: '2em' }}>🎯</Typography>,
      title: 'highlights.items.highlight1.title', 
      description: 'highlights.items.highlight1.description',
    },
    {
      icon: <Typography sx={{ fontSize: '2em' }}>📊</Typography>,
      title: 'highlights.items.highlight2.title',
      description: 'highlights.items.highlight2.description',
    },
    {
      icon: <Typography sx={{ fontSize: '2em' }}>💡</Typography>,
      title: 'highlights.items.highlight3.title',
      description: 'highlights.items.highlight3.description',
    },
    {
      icon: <Typography sx={{ fontSize: '2em' }}>🚀</Typography>,
      title: 'highlights.items.highlight4.title',
      description: 'highlights.items.highlight4.description',
    },
    {
      icon: <Typography sx={{ fontSize: '2em' }}>🔄</Typography>,
      title: 'highlights.items.highlight5.title',
      description: 'highlights.items.highlight5.description',
    },
    {
      icon: <Typography sx={{ fontSize: '2em' }}>🎓</Typography>,
      title: 'highlights.items.highlight6.title',
      description: 'highlights.items.highlight6.description',
    },
  ]
};