import * as React from "react";
import { styled } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import MuiDrawer, { drawerClasses } from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { MenuContentProps, MenuContent } from "@/components/app/MenuContent";
import { CardAlert, CardAlertProps } from "@/components/app/CardAlert";
import { OptionsMenu, OptionsMenuProps } from "@/components/app/OptionsMenu";
import type {} from "@mui/material/themeCssVarsAugmentation";
import LogoDash from "@/icons/LogoDash";
import { useAuth } from "@/utils/auth";
import Link from "next/link";
import LogoIcon from "@/icons/LogoIcon";

const drawerWidth = 240;
const collapsedDrawerWidth = 72;

const Drawer = styled(MuiDrawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: "border-box",
  mt: 10,
  whiteSpace: "nowrap",
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen
  }),
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: "border-box",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  "&.collapsed": {
    width: collapsedDrawerWidth,
    [`& .${drawerClasses.paper}`]: {
      width: collapsedDrawerWidth
    }
  }
}));

export interface SideMenuProps {
  avatar: {
    href: string;
  };
  menuContent: MenuContentProps;
  cardAlert: Omit<CardAlertProps, "onClick">;
  optionsMenu: OptionsMenuProps;
}

export function SideMenu({ menuContent, cardAlert, optionsMenu, avatar }: SideMenuProps) {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = React.useState(true);
  const [openOptionsMenu, setOpenOptionsMenu] = React.useState(false);
  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Drawer
      variant="permanent"
      className={collapsed ? "collapsed" : ""}
      sx={{
        display: { xs: "none", md: "block" },
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: "background.paper"
        }
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mt: "calc(var(--template-frame-height, 0px) + 4px)",
          p: 1
        }}
      >
        <LogoIcon width={36} height={36} />
      </Box>
      <Divider />
      <Box
        sx={{
          overflow: "auto",
          height: "100%",
          display: "flex",
          flexDirection: "column"
        }}
      >
        {/*<IconButton onClick={toggleCollapse} size="small" sx={{mt: 2}}>
          {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>*/}
        <MenuContent {...menuContent} collapsed={collapsed} />
      </Box>
      <Stack
        direction="row"
        sx={{
          p: 2,
          gap: 1,
          alignItems: "center",
          borderTop: "1px solid",
          borderColor: "divider"
        }}
      >
        <Avatar
          onClick={() => {
            collapsed && setOpenOptionsMenu(!openOptionsMenu);
          }}
          sizes="small"
          alt={(typeof user === "object" && user?.name) || ""}
          src="/static/images/avatar/7.jpg"
          sx={{ width: 36, height: 36, cursor: !collapsed ? "default" : "pointer" }}
        />

        {!collapsed && (
          <Box sx={{ mr: "auto" }}>
            <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: "16px" }}>
              {(typeof user === "object" && user?.name) || ""}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              {(typeof user === "object" && user?.email) || ""}
            </Typography>
          </Box>
        )}
        <OptionsMenu {...optionsMenu} open={openOptionsMenu} onOpenChange={setOpenOptionsMenu} collapsed={collapsed} />
      </Stack>
    </Drawer>
  );
}
