import React, { useRef, useState } from 'react';
import {
  Button,
  ButtonGroup,
  ButtonProps,
  ClickAwayListener,
  MenuList,
  MenuItem,
  Paper,
  Popover,
  Box,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

interface ActionItem {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
}

interface ActionButtonProps extends Omit<ButtonProps, 'onClick'> {
  label: string;
  actions: ActionItem[];
  onClick?: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  actions,
  onClick,
  ...buttonProps
}) => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }
    setOpen(false);
  };

  const handleMenuItemClick = (onClick: () => void) => {
    onClick();
    setOpen(false);
  };

  return (
    <>
      <ButtonGroup
        fullWidth
        variant={buttonProps.variant}
        color={buttonProps.color || 'primary'}

      
        ref={anchorRef}
        aria-label="split button"
      >
        <Button
          {...buttonProps}
          onClick={onClick}
          sx={{
            textTransform: 'none',
            flex: 1,
            ...buttonProps.sx
          }}
        >
          {label}
        </Button>
        <Button
       
          aria-controls={open ? 'split-button-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup="menu"
          onClick={handleToggle}
          sx={{
            px: 0.5,
            flex: .5,
          }}
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      <Popover
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        onClose={handleClose}
      >
        <Paper>
          <ClickAwayListener onClickAway={handleClose}>
            <MenuList id="split-button-menu" autoFocusItem>
              {actions.map((action, index) => (
                <MenuItem
                  key={index}
                  onClick={() => handleMenuItemClick(action.onClick)}
                >
                  {action.icon && (
                    <ListItemIcon sx={{ color: action.color }}>
                      {action.icon}
                    </ListItemIcon>
                  )}
                  <ListItemText sx={{ color: action.color }}>
                    {action.label}
                  </ListItemText>
                </MenuItem>
              ))}
            </MenuList>
          </ClickAwayListener>
        </Paper>
      </Popover>
    </>
  );
};

export default ActionButton;
