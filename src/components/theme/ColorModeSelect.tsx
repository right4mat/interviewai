'use client';
import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectProps } from '@mui/material/Select';
import { useColorScheme } from '@mui/material/styles';

export default function ColorModeSelect(props: SelectProps) {
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = React.useState(false);
  
  // After mounting, we have access to the color scheme
  React.useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return null;
  }
  
  const currentMode = mode || 'system';
  
  return (
    <Select
      value={currentMode}
      onChange={(event) =>
        setMode(event.target.value as 'system' | 'light' | 'dark')
      }
      SelectDisplayProps={{
        // @ts-ignore
        'data-screenshot': 'toggle-mode',
      }}
      {...props}
    >
      <MenuItem value="system">System</MenuItem>
      <MenuItem value="light">Light</MenuItem>
      <MenuItem value="dark">Dark</MenuItem>
    </Select>
  );
}
