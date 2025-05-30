"use client";
import { useState } from "react";
import { styled, alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Drawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import Logo from "@/icons/Logo";
import { scrollToSection } from "@/utils/util";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useMediaQuery , useTheme} from "@mui/material";

export interface Logo {
  href?: string;
  onClick?: () => void;
}

export interface NavigationItem {
  label: string;
  onClick?: () => void;
  href?: string;
}

export interface AuthButton {
  label: string;
  href: string;
}

export interface AppBarConfig {
  translationKey: string;
  logo: Logo;
  navigationItems: NavigationItem[];
  authButtons: {
    signIn: AuthButton;
    signUp: AuthButton;
  };
}

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: "blur(24px)",
  border: "1px solid",
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
    : alpha(theme.palette.background.default, 0.8),
  boxShadow: (theme.vars || theme).shadows[1],
  padding: "8px 12px"
}));

export default function AppAppBar({ navigationItems, authButtons, logo, translationKey }: AppBarConfig) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation(translationKey);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return (
    <AppBar
      position="fixed"
      enableColorOnDark
      sx={{
        width: "100vw",
        boxShadow: 0,
        bgcolor: "transparent",
        backgroundImage: "none",
        mt: isSmallScreen ? 0 : "calc(var(--template-frame-height, 0px) + 28px)"
      }}
    >
      <Container maxWidth="xl" sx={{px: isSmallScreen ? 0 : 2}}>
        <StyledToolbar variant="dense" disableGutters sx={{borderRadius: isSmallScreen ? 0 : undefined}}>
          <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", px: 0 }}>
            {typeof logo?.href === "string" ? (
              <Link href={logo.href} passHref>
                <Box sx={{ mr: 2, cursor: "pointer" }}>
                  <Logo fontSize={24} />
                </Box>
              </Link>
            ) : (
              <Box sx={{ mr: 2, cursor: "pointer" }} onClick={() => scrollToSection("hero")}>
                <Logo fontSize={24} />
              </Box>
            )}
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              {navigationItems.map((item,index) =>
                typeof item?.href === "string" ? (
                  <Link key={index+''} href={item.href} passHref>
                    <Button component="div" variant="text" color="info" size="small">
                      {t(item.label)}
                    </Button>
                  </Link>
                ) : (
                  <Button key={index+''} variant="text" color="info" size="small" onClick={item.onClick}>
                    {t(item.label)}
                  </Button>
                )
              )}
            </Box>
          </Box>
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 1,
              alignItems: "center"
            }}
          >
            <Link href={authButtons.signIn.href} passHref>
              <Button component="div" color="primary" variant="text" size="small">
                {t(authButtons.signIn.label)}
              </Button>
            </Link>
            <Link href={authButtons.signUp.href} passHref>
              <Button component="div" color="primary" variant="contained" size="small">
                {t(authButtons.signUp.label)}
              </Button>
            </Link>
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" }, gap: 1 }}>
            <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="top"
              open={open}
              onClose={toggleDrawer(false)}
              PaperProps={{
                sx: {
                  top: "var(--template-frame-height, 0px)"
                }
              }}
            >
              <Box sx={{ p: 2, backgroundColor: "background.default" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end"
                  }}
                >
                  <IconButton onClick={toggleDrawer(false)}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>

                {navigationItems.map((item,index) =>
                  typeof item?.href === "string" ? (
                    <MenuItem key={index+''} onClick={toggleDrawer(false)}>
                      <Link href={item.href} style={{ width: "100%", textDecoration: "none", color: "inherit" }}>
                        {t(item.label)}
                      </Link>
                    </MenuItem>
                  ) : (
                    <MenuItem
                      key={index+''}
                      onClick={() => {
                        item.onClick?.();
                        toggleDrawer(false)();
                      }}
                    >
                      {t(item.label)}
                    </MenuItem>
                  )
                )}
                <Divider sx={{ my: 3 }} />
                <MenuItem>
                  <Link href={authButtons.signUp.href} style={{ width: "100%" }}>
                    <Button color="primary" variant="contained" fullWidth>
                      {t(authButtons.signUp.label)}
                    </Button>
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link href={authButtons.signIn.href} style={{ width: "100%" }}>
                    <Button color="primary" variant="outlined" fullWidth>
                      {t(authButtons.signIn.label)}
                    </Button>
                  </Link>
                </MenuItem>
              </Box>
            </Drawer>
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
}
