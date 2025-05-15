// @project
import SmartToyIcon from '@mui/icons-material/SmartToy';
import BrandingWatermarkIcon from '@mui/icons-material/BrandingWatermark';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import ScienceIcon from '@mui/icons-material/Science';

interface Feature {
  icon: React.ReactNode;
  title: string;
  content: string;
}

export const features: Feature[] = [
    //start ---- top 4 will appear on signup, login
  {
    icon: <SmartToyIcon />,
    title: "features.items.feature1.title",
    content: "features.items.feature1.description"
  },

  {
    icon: <FormatListBulletedIcon />,
    title: "features.items.feature2.title",
    content: "features.items.feature2.description"
  },
  {
    icon: <CloudUploadIcon />,
    title: "features.items.feature3.title",
    content: "features.items.feature3.description"
  },
  //end ---- top 4 will appear on signup, login
  //start ---- bottom 4 will appear on dashboard
  {
    icon: <AttachMoneyIcon />,
    title: "features.items.feature4.title",
    content: "features.items.feature4.description"
  },
  {
    icon: <AgricultureIcon />,
    title: "features.items.feature5.title",
    content: "features.items.feature5.description"
  },
  {
    icon: <AnalyticsIcon />,
    title: "features.items.feature6.title",
    content: "features.items.feature6.description"
  },
  {
    icon: <ScienceIcon />,
    title: "features.items.feature7.title",
    content: "features.items.feature7.description"
  }
  //end ---- bottom 4 will appear on dashboard
]