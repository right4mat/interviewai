// @project
import SmartToyIcon from '@mui/icons-material/SmartToy';
import DescriptionIcon from '@mui/icons-material/Description';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SettingsIcon from '@mui/icons-material/Settings';
import AssessmentIcon from '@mui/icons-material/Assessment';
import FeedbackIcon from '@mui/icons-material/Feedback';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PersonIcon from '@mui/icons-material/Person';

interface Feature {
  icon: React.ReactNode;
  title: string;
  content: string;
  description?: string;
  imageLight?: string;
  imageDark?: string;
}

export const features: Feature[] = [
    //start ---- top 4 will appear on signup, login
  {
    icon: <SmartToyIcon />,
    title: "AI-Powered Interviews",
    content: "Experience realistic interview scenarios with our advanced AI that adapts questions based on your responses, creating a dynamic and authentic interview environment."
  },
  {
    icon: <DescriptionIcon />,
    title: "Resume & Job Analysis",
    content: "Upload your resume and job description to receive tailored interview questions that focus on the specific skills and experiences relevant to your target position."
  },
  {
    icon: <SettingsIcon />,
    title: "Customizable Experience",
    content: "Select your preferred interview difficulty level and interviewer type (technical, behavioral, HR) to practice for exactly the kind of interview you're preparing for."
  },
  {
    icon: <AssignmentIcon />,
    title: "Real-time Feedback",
    content: "Receive instant guidance during your interview session, helping you refine your answers and communication style as you practice."
  },
  //end ---- top 4 will appear on signup, login
  //start ---- bottom 4 will appear on dashboard
  {
    icon: <AssessmentIcon />,
    title: "Performance Analytics",
    content: "Get comprehensive scoring across multiple dimensions including content quality, communication skills, and technical accuracy to understand your interview strengths."
  },
  {
    icon: <FeedbackIcon />,
    title: "Personalized Insights",
    content: "After each session, receive detailed feedback with specific suggestions for improvement tailored to your performance and the requirements of your target role."
  },
  {
    icon: <TrendingUpIcon />,
    title: "Progress Tracking",
    content: "Monitor your improvement over time with detailed analytics that show how your interview skills are developing across multiple practice sessions."
  },
  {
    icon: <PersonIcon />,
    title: "Industry-Specific Preparation",
    content: "Access specialized interview modules designed for different industries and roles, ensuring you're prepared for the unique challenges of your field."
  }
  //end ---- bottom 4 will appear on dashboard
]