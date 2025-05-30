"use client";
import * as React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useMemo, Fragment } from "react";
import type { ThemeOptions } from "@mui/material/styles";
import { inputsCustomizations } from "./customizations/inputs";
import { dataDisplayCustomizations } from "./customizations/dataDisplay";
import { feedbackCustomizations } from "./customizations/feedback";
import { navigationCustomizations } from "./customizations/navigation";
import { surfacesCustomizations } from "./customizations/surfaces";
import { colorSchemes, typography, shadows, shape, globalStyles } from "./themePrimitives";
import { CssBaseline } from "@mui/material";
import { dataGridCustomizations } from "./customizations/dataGrid";

interface AppThemeProps {
  children: React.ReactNode;
  /**
   * This is for the docs site. You can ignore it or remove it.
   */
  disableCustomTheme?: boolean;
  themeComponents?: ThemeOptions["components"];
  /**
   * Force a specific color mode
   */
  colorMode?: 'light' | 'dark' | 'system';
}

export default function AppTheme(props: AppThemeProps) {
  const { children, disableCustomTheme, themeComponents, colorMode = 'system' } = props;
  
  const theme = useMemo(() => {
    return disableCustomTheme
      ? {}
      : createTheme({
          // For more details about CSS variables configuration, see https://mui.com/material-ui/customization/css-theme-variables/configuration/
          cssVariables: {
            colorSchemeSelector: "class",
            cssVarPrefix: "M7X"
          },
          colorSchemes, // Recently added in v6 for building light & dark mode app, see https://mui.com/material-ui/customization/palette/#color-schemes
          typography,
          shadows,
          shape,
          components: {
            ...globalStyles,
            ...dataGridCustomizations,
            ...inputsCustomizations,
            ...dataDisplayCustomizations,
            ...feedbackCustomizations,
           // ...navigationCustomizations,
            ...surfacesCustomizations,
            ...themeComponents
          }
        });
  }, [disableCustomTheme, themeComponents]);
  
  if (disableCustomTheme) {
    return <Fragment>{children}</Fragment>;
  }

  return (
    <ThemeProvider 
      theme={theme} 
      defaultMode={colorMode}
      disableTransitionOnChange
    >
      <CssBaseline enableColorScheme />
      {children}
    </ThemeProvider>
  );
}
