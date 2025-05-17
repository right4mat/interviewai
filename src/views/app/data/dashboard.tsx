"use client";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import HelpRoundedIcon from "@mui/icons-material/HelpRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import AgricultureRoundedIcon from "@mui/icons-material/AgricultureRounded";
import { PAGE_PATH } from "@/path";
import { logout } from "@/utils/db";
import { DashboardProps } from "@/blocks/app/Dashboard";

export const dashboard: DashboardProps = {
  sideMenu: {
    avatar: {
      href: PAGE_PATH.settingsPage
    },
    menuContent: {
      mainListItems: [{ text: "Home", icon: <HomeRoundedIcon />, href: PAGE_PATH.dashboardPage }],
      secondaryListItems: [
        { text: "Settings", icon: <SettingsRoundedIcon />, href: PAGE_PATH.settingsPage },
        { text: "About", icon: <InfoRoundedIcon />, href: PAGE_PATH.aboutPage },
        { text: "Feedback", icon: <HelpRoundedIcon />, href: PAGE_PATH.feedbackPage }
      ]
    },
    optionsMenu: {
      profileItems: [
        { text: "Profile", href: PAGE_PATH.settingsPage },
        { text: "Settings", href: PAGE_PATH.settingsPage }
      ],
      accountItems: [],
      settingsItems: []
    },
    cardAlert: {
      title: "Upgrade your plan",
      description: "Check our documentation",
      buttonText: "Upgrade Now",
      icon: <AutoAwesomeRoundedIcon fontSize="small" />
    }
  },
  appNavbar: {
    title: "",
    menuContent: {
      mainListItems: [{ text: "Home", icon: <HomeRoundedIcon />, href: PAGE_PATH.dashboardPage }],
      secondaryListItems: [
        { text: "Settings", icon: <SettingsRoundedIcon />, href: PAGE_PATH.settingsPage },
        { text: "About", icon: <InfoRoundedIcon />, href: PAGE_PATH.aboutPage },
        { text: "Feedback", icon: <HelpRoundedIcon />, href: PAGE_PATH.feedbackPage }
      ]
    },
    cardAlert: {
      title: "Upgrade your plan",
      description: "Check our documentation",
      buttonText: "Upgrade Now",
      icon: <AutoAwesomeRoundedIcon fontSize="small" />
    }
  }
};
