"use client";
import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import MuiToolbar from "@mui/material/Toolbar";
import { tabsClasses } from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import SideMenuMobile from "@/components/app/SideMenuMobile";
import MenuButton from "@/components/app/MenuButton";
import ColorModeIconDropdown from "@/components/theme/ColorModeIconDropdown";
import type {} from "@mui/material/themeCssVarsAugmentation";
import { type MenuContentProps } from "@/components/app/MenuContent";
import { type CardAlertProps } from "@/components/app/CardAlert";
import Logo from "@/icons/LogoDash";
import LogoIcon from "@/icons/LogoIcon";
import InterviewStatusIndicator from "./interview/InterviewStatusIndicator";
import { useInterviewStore } from "@/stores/interviewStore";
import { useMediaQuery } from "@mui/material";
const Toolbar = styled(MuiToolbar)({
  width: "100%",
  padding: "12px",
  display: "flex",
  flexDirection: "column",
  alignItems: "start",
  justifyContent: "center",
  gap: "12px",
  flexShrink: 0,
  [`& ${tabsClasses.flexContainer}`]: {
    gap: "8px",
    p: "8px",
    pb: 0
  }
});

export interface AppNavbarProps {
  title?: string;
  menuContent: MenuContentProps;
  cardAlert: Omit<CardAlertProps, "onClick">;
}

export function AppNavbar({ title = "Dashboard", menuContent, cardAlert }: AppNavbarProps) {
  const [open, setOpen] = React.useState(false);
  const { isGettingReply, answerWillCompleteIn, buildingAnswer } = useInterviewStore();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        display: { xs: "auto", md: "none" },
        boxShadow: 0,
        bgcolor: "background.paper",
        backgroundImage: "none",
        borderBottom: "1px solid",
        borderColor: "divider",
        top: "var(--template-frame-height, 0px)"
      }}
    >
      <Toolbar variant="regular">
        <Stack
          direction="row"
          sx={{
            alignItems: "center",
            flexGrow: 1,
            width: "100%",
            gap: 1
          }}
        >
          <Stack direction="row" spacing={1} sx={{ justifyContent: "center", mr: "auto" }}>
            <LogoIcon width={50} height={50} />
          </Stack>
          {isSmallScreen && <InterviewStatusIndicator isGettingReply={isGettingReply} answerWillCompleteIn={answerWillCompleteIn} buildingAnswer={buildingAnswer} />}
          {/* <ColorModeIconDropdown /> */}
          <MenuButton aria-label="menu" onClick={toggleDrawer(true)}>
            <MenuRoundedIcon />
          </MenuButton>
          <SideMenuMobile open={open} toggleDrawer={toggleDrawer} menuContent={menuContent} cardAlert={cardAlert} />
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

export function CustomIcon() {
  return (
    <Box
      sx={{
        width: "1.5rem",
        height: "1.5rem",
        bgcolor: "black",
        borderRadius: "999px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        backgroundImage: "linear-gradient(135deg, hsl(210, 98%, 60%) 0%, hsl(210, 100%, 35%) 100%)",
        color: "hsla(210, 100%, 95%, 0.9)",
        border: "1px solid",
        borderColor: "hsl(210, 100%, 55%)",
        boxShadow: "inset 0 2px 5px rgba(255, 255, 255, 0.3)"
      }}
    >
      <DashboardRoundedIcon color="inherit" sx={{ fontSize: "1rem" }} />
    </Box>
  );
}
