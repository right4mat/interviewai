import {ReactNode} from "react";
import Link from "next/link";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import type {} from "@mui/material/themeCssVarsAugmentation";
import { usePathname } from "next/navigation";
import { PAGE_PATH } from "@/path";

export interface MenuContentProps {
  mainListItems: { text: string; icon: ReactNode; href: string }[];
  secondaryListItems: { text: string; icon: ReactNode; href: string }[];
  collapsed?: boolean;
}

export function MenuContent({ mainListItems, secondaryListItems, collapsed = false }: MenuContentProps) {
  const pathname = usePathname();

  const isItemSelected = (itemHref: string) => {
    // For home, only match exact dashboard path
    if (itemHref === PAGE_PATH.dashboardPage) {
      return pathname === PAGE_PATH.dashboardPage;
    }

    // For other items, match if the pathname starts with the item's href
    // This handles both /dashboard/users and /dashboard/users/12345
    return pathname.startsWith(itemHref) && pathname !== PAGE_PATH.dashboardPage;
  };

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
      <List dense>
        {mainListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <Link href={item.href} passHref style={{ textDecoration: "none", color: "inherit" }}>
              <ListItemButton 
                selected={isItemSelected(item.href)} 
                component="div"
                sx={{
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  minHeight: 40,
                  px: collapsed ? 1 : 2,
                }}
              >
                <ListItemIcon sx={{ 
                  minWidth: collapsed ? 'auto' : 40,
                  justifyContent: 'center',
                }}>
                  {item.icon}
                </ListItemIcon>
                {!collapsed && <ListItemText primary={item.text} />}
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>
      <List dense>
        {secondaryListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <Link href={item.href} passHref style={{ textDecoration: "none", color: "inherit" }}>
              <ListItemButton 
                selected={isItemSelected(item.href)} 
                component="div"
                sx={{
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  minHeight: 40,
                  px: collapsed ? 1 : 2,
                }}
              >
                <ListItemIcon sx={{ 
                  minWidth: collapsed ? 'auto' : 40,
                  justifyContent: 'center',
                }}>
                  {item.icon}
                </ListItemIcon>
                {!collapsed && <ListItemText primary={item.text} />}
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
