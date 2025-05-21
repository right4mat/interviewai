import Chip from '@mui/material/Chip';
import CodeIcon from '@mui/icons-material/Code';
import PsychologyIcon from '@mui/icons-material/Psychology';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import CategoryIcon from '@mui/icons-material/Category';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import BarChartIcon from '@mui/icons-material/BarChart';
import { SxProps } from '@mui/system';

// Types
export type InterviewType = 'technical' | 'behavioral' | 'mixed' | string;
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | string;

interface StyledChipProps {
  label: string;
  customSx?: SxProps;
  size?: 'small' | 'medium';
  onClick?: () => void;
}

// Interview Type Chip
export const InterviewTypeChip: React.FC<StyledChipProps> = ({ 
  label, 
  customSx = {},
  size = 'medium'
}) => {
  // Default styling
  let chipStyle: any = {
    background: '#f0f0f0',
    color: '#666', // Slightly less dark
    border: '1px solid #ddd',
    fontWeight: 'bold'
  };
  
  let iconStyle = { color: '#666' }; // Slightly less dark
  let icon = <CategoryIcon sx={iconStyle} />;
  
  // Type-specific styling
  switch(label.toLowerCase()) {
    case "technical":
      chipStyle = {
        background: 'linear-gradient(135deg, #6b9fed 0%, #a1c4ff 50%, #6b9fed 100%)',
        color: '#243b5a', // Slightly less dark
        border: '1px solid #5a8ae3',
        fontWeight: 'bold',
        textShadow: '0px 1px 1px rgba(255, 255, 255, 0.5)'
      };
      iconStyle = { color: '#243b5a' }; // Slightly less dark
      icon = <CodeIcon sx={iconStyle} />;
      break;
    case "behavioral":
      chipStyle = {
        background: 'linear-gradient(135deg, #a073e6 0%, #c7b0f7 50%, #a073e6 100%)',
        color: '#3a1a6d', // Slightly less dark
        border: '1px solid #8a5ad9',
        fontWeight: 'bold',
        textShadow: '0px 1px 1px rgba(255, 255, 255, 0.5)'
      };
      iconStyle = { color: '#3a1a6d' }; // Slightly less dark
      icon = <PsychologyIcon sx={iconStyle} />;
      break;
    case "mixed":
      chipStyle = {
        background: 'linear-gradient(135deg, #5cc489 0%, #9fe3c0 50%, #5cc489 100%)',
        color: '#1b4d36', // Slightly less dark
        border: '1px solid #4aaa76',
        fontWeight: 'bold',
        textShadow: '0px 1px 1px rgba(255, 255, 255, 0.5)'
      };
      iconStyle = { color: '#1b4d36' }; // Slightly less dark
      icon = <IntegrationInstructionsIcon sx={iconStyle} />;
      break;
    default:
      // Use default styling
  }
  
  return (
    <Chip
      label={label}
      icon={icon}
      sx={{ 
        textTransform: 'capitalize',
        boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
        ...chipStyle,
        ...customSx,
        '& .MuiChip-label': {
          color: chipStyle.color, // <-- fix: target the label
        },
        '& .MuiChip-icon': {
          color: chipStyle.color, // <- icon color
        },
      }}
      size={size}
    />
  );
};

// Difficulty Chip
export const DifficultyChip: React.FC<StyledChipProps> = ({ 
  label, 
  customSx = {},
  size = 'medium',
  onClick
}) => {
  // Default (beginner) - Bronze
  let chipStyle: any = {
    background: 'linear-gradient(135deg, #CD7F32 0%, #E6B980 50%, #CD7F32 100%)',
    color: '#775533', // Slightly less dark
    border: '1px solid #8B5A2B',
    fontWeight: 'bold',
    textShadow: '0px 1px 1px rgba(255, 255, 255, 0.5)'
  };
  
  let iconStyle = { color: '#775533' }; // Slightly less dark
  let icon = <SportsEsportsIcon sx={iconStyle} />;
  
  // Difficulty-specific styling
  switch(label.toLowerCase()) {
    case "intermediate":
      // Silver
      chipStyle = {
        background: 'linear-gradient(135deg, #C0C0C0 0%, #E8E8E8 50%, #C0C0C0 100%)',
        color: '#666666', // Slightly less dark
        border: '1px solid #7D7D7D',
        fontWeight: 'bold',
        textShadow: '0px 1px 1px rgba(255, 255, 255, 0.5)'
      };
      iconStyle = { color: '#666666' }; // Slightly less dark
      icon = <FitnessCenterIcon sx={iconStyle} />;
      break;
    case "advanced":
      // Gold
      chipStyle = {
        background: 'linear-gradient(135deg, #FFD700 0%, #FFF089 50%, #FFD700 100%)',
        color: '#7D5F00', // Slightly less dark
        border: '1px solid #B29600',
        fontWeight: 'bold',
        textShadow: '0px 1px 1px rgba(255, 255, 255, 0.5)'
      };
      iconStyle = { color: '#7D5F00' }; // Slightly less dark
      icon = <EmojiEventsIcon sx={iconStyle} />;
      break;
    case "beginner":
      // Bronze (default style already set)
      break;
    default:
      // Use default bronze style for unknown values
      icon = <BarChartIcon sx={iconStyle} />;
  }
  
  return (
    <Chip
      label={label}
      icon={icon}
      onClick={onClick}
      sx={{ 
        textTransform: 'capitalize',
        boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
        ...chipStyle,
        '& .MuiChip-label': {
          color: chipStyle.color, // <-- fix: target the label
        },
        '& .MuiChip-icon': {
          color: chipStyle.color, // <- icon color
        },
      }}
      size={size}
    />
  );
}; 