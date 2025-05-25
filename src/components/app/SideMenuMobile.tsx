"use client";
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Drawer, { drawerClasses } from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import MenuButton from './MenuButton';
import { type MenuContentProps, MenuContent } from './MenuContent';
import { CardAlert, type CardAlertProps } from './CardAlert';
import type {} from '@mui/material/themeCssVarsAugmentation';
import { useAuth } from '@/utils/auth';


interface SideMenuMobileProps {
  open: boolean | undefined;
  toggleDrawer: (newOpen: boolean) => () => void;
  menuContent: MenuContentProps;
  cardAlert: Omit<CardAlertProps, 'onClick'>;
}

export default function SideMenuMobile({ open, toggleDrawer, menuContent, cardAlert }: SideMenuMobileProps) {
  const { user, signout } = useAuth();
  
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={toggleDrawer(false)}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        [`& .${drawerClasses.paper}`]: {
          backgroundImage: 'none',
          backgroundColor: 'background.paper',
        },
      }}
    >
      <Stack
        sx={{
          maxWidth: '70dvw',
          height: '100%',
        }}
      >
        <Stack direction="row" sx={{ p: 2, pb: 0, gap: 1 }}>
          <Stack
            direction="row"
            sx={{ gap: 1, alignItems: 'center', flexGrow: 1, p: 1 }}
          >
            <Avatar
              sizes="small"
              alt={user && 'name' in user ? user.name : "User"}
              src={user && 'photoURL' in user ? user.photoURL : "/static/images/avatar/7.jpg"}
              sx={{ width: 24, height: 24 }}
            />
            <Typography component="p" variant="h6">
              {user && 'name' in user ? user.name : "User"}
            </Typography>
          </Stack>
          <MenuButton >
            {/* <NotificationsRoundedIcon /> */}
          </MenuButton>
        </Stack>
        <Divider />
        <Stack sx={{ flexGrow: 1 }}>
          <MenuContent {...menuContent} />
          <Divider />
        </Stack>
    
        <Stack sx={{ p: 2 }}>
          <Button 
            variant="outlined" 
            fullWidth 
            startIcon={<LogoutRoundedIcon />}
            onClick={signout}
          >
            Logout
          </Button>
        </Stack>
      </Stack>
    </Drawer>
  );
}
