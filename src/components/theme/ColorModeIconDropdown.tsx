'use client';
import * as React from 'react';
import DarkModeIcon from '@mui/icons-material/DarkModeRounded';
import LightModeIcon from '@mui/icons-material/LightModeRounded';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';
import Box from '@mui/material/Box';
import IconButton, { IconButtonOwnProps } from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useColorScheme } from '@mui/material/styles';

export default function ColorModeIconDropdown(props: IconButtonOwnProps) {
  const { mode, setMode } = useColorScheme();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mounted, setMounted] = React.useState(false);
  
  // After mounting, we have access to the color scheme
  React.useEffect(() => {
    setMounted(true);
  }, []);
  
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleMode = (targetMode: 'system' | 'light' | 'dark') => () => {
    setMode(targetMode);
    handleClose();
  };
  
  if (!mounted) {
    return (
      <Box
        data-screenshot="toggle-mode"
        sx={(theme) => ({
          verticalAlign: 'bottom',
          display: 'inline-flex',
          width: '2.25rem',
          height: '2.25rem',
          borderRadius: (theme.vars || theme).shape.borderRadius,
          border: '1px solid',
          borderColor: (theme.vars || theme).palette.divider,
        })}
      />
    );
  }
  
  const icon = {
    light: <LightModeIcon />,
    dark: <DarkModeIcon />,
    system: <SettingsBrightnessIcon />,
  }[mode as 'light' | 'dark' | 'system'] || <SettingsBrightnessIcon />;
  
  return (
    <React.Fragment>
      <IconButton
        data-screenshot="toggle-mode"
        onClick={handleClick}
        disableRipple
        size="small"
        aria-controls={open ? 'color-scheme-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        {...props}
      >
        {icon}
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            variant: 'outlined',
            elevation: 0,
            sx: {
              my: '4px',
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem selected={mode === 'system'} onClick={handleMode('system')}>
          System
        </MenuItem>
        <MenuItem selected={mode === 'light'} onClick={handleMode('light')}>
          Light
        </MenuItem>
        <MenuItem selected={mode === 'dark'} onClick={handleMode('dark')}>
          Dark
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
