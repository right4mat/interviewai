"use client";
import * as React from "react";
import Stack from "@mui/material/Stack";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import CustomDatePicker from "@/components/app/CustomDatePicker";
import  { NavbarBreadcrumbs, BreadcrumbItem } from "./NavbarBreadcrumbs";
import MenuButton from "./MenuButton";
import ColorModeIconDropdown from "@/components/theme/ColorModeIconDropdown";
import type {} from "@mui/material/themeCssVarsAugmentation";

import Search from "./Search";

interface HeaderProps {
  breadcrumbs: BreadcrumbItem[];
}

export default function Header({ breadcrumbs }: HeaderProps) {
  return (
    <Stack
      direction="row"
      sx={{
        display: { xs: "none", md: "flex" },
        width: "100%",
        alignItems: { xs: "flex-start", md: "center" },
        justifyContent: "space-between",
        maxWidth: { sm: "100%", md: "1700px" },
        pt: 1.5
      }}
      spacing={2}
    >
      <NavbarBreadcrumbs items={breadcrumbs} />

      {/* <Stack direction="row" sx={{ gap: 1 }}>
        <Search />
        <CustomDatePicker />
        <MenuButton showBadge aria-label="Open notifications">
          <NotificationsRoundedIcon />
        </MenuButton>
        <ColorModeIconDropdown />
      </Stack>*/}
    </Stack>
  );
}
