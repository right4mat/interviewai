import SmartToyIcon from '@mui/icons-material/SmartToy';
import DescriptionIcon from '@mui/icons-material/Description';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import FeedbackIcon from '@mui/icons-material/Feedback';
import branding from "@/branding.json"
import { HighlightsConfig } from "@/components/landing/Highlights";

export const highlights: HighlightsConfig = {
  title: `Why ${branding.brandName}?`,
  description: `${branding.brandName} is the ultimate AI-powered interview practice platform designed to boost your confidence and readiness for real interviews.`,
  highlights: [
    {
      icon: <SmartToyIcon />,
      title: 'Realistic AI Interviews',
      description:
        'Experience authentic interview scenarios with our advanced AI that adapts questions based on your responses, creating a dynamic and realistic interview environment.',
    },
    {
      icon: <DescriptionIcon />,
      title: 'Tailored to Your Profile',
      description:
        'Upload your resume and job description to receive customized interview questions focused on the specific skills and experiences relevant to your target position.',
    },
    {
      icon: <AssessmentIcon />,
      title: 'Comprehensive Performance Analysis',
      description:
        'Receive detailed scoring across multiple dimensions including content quality, communication skills, and technical accuracy to understand your interview strengths and weaknesses.',
    },
    {
      icon: <FeedbackIcon />,
      title: 'Personalized Feedback',
      description:
        'Get actionable insights and specific recommendations on how to improve your responses, helping you refine your interview strategy and presentation.',
    },
    {
      icon: <SettingsIcon />,
      title: 'Fully Customizable Experience',
      description:
        'Select your preferred interview difficulty level and interviewer type (technical, behavioral, HR) to practice for exactly the kind of interview you are preparing for.',
    },
    {
      icon: <TrendingUpIcon />,
      title: 'Track Your Progress',
      description:
        'Monitor your improvement over time with detailed analytics and progress tracking, helping you build confidence as you see tangible growth in your interview performance.',
    },
  ]
};