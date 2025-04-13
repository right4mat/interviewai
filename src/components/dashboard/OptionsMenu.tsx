import * as React from "react";
import { styled } from "@mui/material/styles";
import Divider, { dividerClasses } from "@mui/material/Divider";
import Menu from "@mui/material/Menu";
import MuiMenuItem from "@mui/material/MenuItem";
import { paperClasses } from "@mui/material/Paper";
import { listClasses } from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon, { listItemIconClasses } from "@mui/material/ListItemIcon";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import MenuButton from "./MenuButton";
import type {} from "@mui/material/themeCssVarsAugmentation";
import Link from "next/link";
import { logout } from "@/utils/db";
import { PAGE_PATH } from "@/path";
import { useRouter } from "next/navigation";

const MenuItem = styled(MuiMenuItem)(({ theme }) => ({
  margin: "4px 0",
  borderRadius: theme.shape.borderRadius,
  padding: "8px 16px",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  }
}));

export interface MenuItemProps {
  text: string;
  href: string;
}

export interface OptionsMenuProps {
  profileItems?: MenuItemProps[];
  accountItems?: MenuItemProps[];
  settingsItems?: MenuItemProps[];
  onLogout?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  collapsed?: boolean;
}

export function OptionsMenu({
  profileItems = [],
  accountItems = [],
  settingsItems = [],
  open,
  onOpenChange,
  collapsed,
}: OptionsMenuProps) {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const menuButtonRef = React.useRef<HTMLButtonElement>(null);
  
  // Use the controlled open state if provided, otherwise use the internal state
  const isMenuOpen = open !== undefined ? open : Boolean(anchorEl);
  
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    if (onOpenChange) {
      onOpenChange(true);
    }
  };
  
  const handleClose = () => {
    setAnchorEl(null);
    if (onOpenChange) {
      onOpenChange(false);
    }
  };
  
  const handleLogout = () => {
    handleClose();
    logout();
    router.push(PAGE_PATH.signIn);
  };
  
  // Effect to sync the anchorEl when open prop changes
  React.useEffect(() => {
    if (open === false && anchorEl !== null) {
      setAnchorEl(null);
    }
    if (open === true && anchorEl === null && menuButtonRef.current) {
      setAnchorEl(menuButtonRef.current);
    }
  }, [open, anchorEl]);
  
  // Prepare menu items
  const menuItems = [
    // Profile items
    ...profileItems.map((item, index) => (
      <Link key={`profile-${index}`} href={item.href} passHref style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
        <MenuItem onClick={handleClose}>{item.text}</MenuItem>
      </Link>
    )),
    ...(profileItems.length > 0 ? [<Divider key="divider-profile" sx={{ my: 1 }} />] : []),
    
    // Account items
    ...accountItems.map((item, index) => (
      <Link key={`account-${index}`} href={item.href} passHref style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
        <MenuItem onClick={handleClose}>{item.text}</MenuItem>
      </Link>
    )),
    ...(accountItems.length > 0 ? [<Divider key="divider-account" sx={{ my: 1 }} />] : []),
    
    // Settings items
    ...settingsItems.map((item, index) => (
      <Link key={`settings-${index}`} href={item.href} passHref style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
        <MenuItem onClick={handleClose}>{item.text}</MenuItem>
      </Link>
    )),
    ...(settingsItems.length > 0 ? [<Divider key="divider-settings" sx={{ my: 1 }} />] : []),
    
    // Logout item
    <MenuItem
      key="logout"
      onClick={handleLogout}
      sx={{
        [`& .${listItemIconClasses.root}`]: {
          ml: "auto",
          minWidth: 0,
          color: "error.main"
        }
      }}
    >
      <ListItemText primary="Logout" sx={{ color: "error.main" }} />
      <ListItemIcon>
        <LogoutRoundedIcon fontSize="small" />
      </ListItemIcon>
    </MenuItem>
  ];
  
  return (
    <React.Fragment>
      <MenuButton 
        ref={menuButtonRef}
        aria-label="Open menu" 
        onClick={handleClick} 
        sx={{ 
          visibility: collapsed ? "hidden" : "visible",
          borderColor: "transparent",
          "&:hover": {
            backgroundColor: "action.hover",
          }
        }}
      >
        <MoreVertRoundedIcon />
      </MenuButton>
      <Menu
        anchorEl={anchorEl || menuButtonRef.current}
        id="menu"
        open={isMenuOpen}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        sx={{
          [`& .${listClasses.root}`]: {
            padding: "8px"
          },
          [`& .${paperClasses.root}`]: {
            minWidth: 200,
            boxShadow: (theme) => theme.shadows[3],
            mt: 1.5
          },
          [`& .${dividerClasses.root}`]: {
            margin: "8px 0"
          }
        }}
        slotProps={{
          paper: {
            elevation: 3,
          }
        }}
      >
        {menuItems}
      </Menu>
    </React.Fragment>
  );
}
