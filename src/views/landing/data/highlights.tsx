"use client";
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import DescriptionIcon from '@mui/icons-material/Description';
import { type HighlightsConfig } from "@/components/landing/Highlights";


export const highlights: HighlightsConfig = {
  title: 'highlights.title',
  description: 'highlights.description',
  highlights: [
    {
      icon: <PeopleAltIcon />,
      title: 'highlights.items.highlight1.title',
      description: 'highlights.items.highlight1.description',
    },
    {
      icon: <TrendingUpIcon />,
      title: 'highlights.items.highlight2.title',
      description: 'highlights.items.highlight2.description',
    },
    {
      icon: <AddBusinessIcon />,
      title: 'highlights.items.highlight3.title',
      description: 'highlights.items.highlight3.description',
    },
    {
      icon: <AgricultureIcon />,
      title: 'highlights.items.highlight4.title',
      description: 'highlights.items.highlight4.description',
    },
    {
      icon: <TouchAppIcon />,
      title: 'highlights.items.highlight5.title',
      description: 'highlights.items.highlight5.description',
    },
    {
      icon: <DescriptionIcon />,
      title: 'highlights.items.highlight6.title',
      description: 'highlights.items.highlight6.description',
    },
  ]
};