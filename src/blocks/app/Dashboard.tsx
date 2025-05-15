"use client";
import { ReactNode } from "react";
import type {} from "@mui/x-date-pickers/themeAugmentation";
import type {} from "@mui/x-charts/themeAugmentation";
import type {} from "@mui/x-tree-view/themeAugmentation";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Header from "@/components/app/Header";
import type {} from "@mui/material/themeCssVarsAugmentation";
import { SideMenuProps, SideMenu } from "@/components/app/SideMenu";
import { AppNavbar, AppNavbarProps } from "@/components/app/AppNavbar";
export interface DashboardProps {
  sideMenu: SideMenuProps;
  appNavbar: AppNavbarProps;
}

export default function Dashboard({ sideMenu, appNavbar, children }: DashboardProps & { children: ReactNode }) {
  return (
    <Box sx={{ display: "flex" }}>
      <SideMenu {...sideMenu} />
      <AppNavbar {...appNavbar} />
      {/* Main content */}
      <Box
        component="main"
        sx={(theme) => ({
          flexGrow: 1,
          backgroundColor: theme.vars
            ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
            : alpha(theme.palette.background.default, 1),
          overflow: "auto"
        })}
      >
        <Stack
          spacing={2}
          sx={{
            alignItems: "center",
            mx: 3,
            pb: 5,
            mt: { xs: 8, md: 0 }
          }}
        >
          <Header />
          {children}
        </Stack>
      </Box>
    </Box>
  );
}
