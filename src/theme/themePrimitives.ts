"use client";
import { createTheme, alpha, PaletteMode, Shadows } from "@mui/material/styles";

declare module "@mui/material/Paper" {
  interface PaperPropsVariantOverrides {
    highlighted: true;
  }
}
declare module "@mui/material/styles" {
  interface ColorRange {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  }

  interface PaletteColor extends ColorRange {}

  interface Palette {
    baseShadow: string;
  }
}

const defaultTheme = createTheme();

const customShadows: Shadows = [...defaultTheme.shadows];

export const brand = {
  50: 'hsl(207, 80%, 97%)',
  100: 'hsl(207, 80%, 92%)',
  200: 'hsl(207, 80%, 85%)', // Lighter version of #8cc6f0
  300: 'hsl(207, 78%, 75%)',
  400: 'hsl(207, 76%, 65%)',
  500: 'hsl(207, 74%, 55%)', // #8cc6f0 (adjusted)
  600: 'hsl(207, 72%, 45%)',
  700: 'hsl(207, 70%, 35%)',
  800: 'hsl(207, 68%, 25%)', // Darker version of #194f8d
  900: 'hsl(207, 66%, 15%)',
};

export const gray = {
  50: "hsl(30, 10%, 97%)",
  100: "hsl(30, 10%, 94%)",
  200: "hsl(30, 10%, 88%)",
  300: "hsl(30, 10%, 80%)",
  400: "hsl(30, 10%, 65%)",
  500: "hsl(30, 10%, 50%)", // Soft gray
  600: "hsl(30, 10%, 40%)",
  700: "hsl(30, 10%, 30%)",
  800: "hsl(30, 10%, 20%)",
  900: "hsl(30, 10%, 10%)"
};

export const green = {
  50: "hsl(100, 20%, 98%)",
  100: "hsl(100, 20%, 94%)",
  200: "hsl(100, 20%, 87%)",
  300: "hsl(100, 20%, 75%)",
  400: "hsl(100, 20%, 60%)",
  500: "hsl(100, 20%, 45%)", // #5D7761 (sage green)
  600: "hsl(100, 20%, 35%)",
  700: "hsl(100, 20%, 25%)",
  800: "hsl(100, 20%, 15%)",
  900: "hsl(100, 20%, 10%)"
};

export const orange = {
  50: "hsl(35, 80%, 97%)",
  100: "hsl(35, 80%, 90%)",
  200: "hsl(35, 80%, 80%)",
  300: "hsl(35, 80%, 65%)",
  400: "hsl(35, 80%, 50%)", // #F7931E (muted orange)
  500: "hsl(35, 80%, 45%)",
  600: "hsl(35, 80%, 35%)",
  700: "hsl(35, 80%, 30%)",
  800: "hsl(35, 80%, 25%)",
  900: "hsl(35, 80%, 20%)"
};

export const red = {
  50: "hsl(20, 80%, 97%)",
  100: "hsl(20, 80%, 90%)",
  200: "hsl(20, 80%, 80%)",
  300: "hsl(20, 80%, 65%)",
  400: "hsl(20, 80%, 50%)", // Softer red
  500: "hsl(20, 80%, 40%)",
  600: "hsl(20, 80%, 30%)",
  700: "hsl(20, 80%, 25%)",
  800: "hsl(20, 80%, 20%)",
  900: "hsl(20, 80%, 15%)"
};

export const getDesignTokens = (mode: PaletteMode) => {
  customShadows[1] = "hsla(142, 20%, 10%, 0.07) 0px 4px 16px 0px, hsla(142, 20%, 15%, 0.07) 0px 8px 16px -5px";

  return {
    palette: {
      mode,
      primary: {
        light: brand[200],
        main: brand[500], // #697F6E (sage green)
        dark: brand[700],
        contrastText: brand[50]
      },
      info: {
        light: brand[100],
        main: brand[300],
        dark: brand[600],
        contrastText: gray[50]
      },
      warning: {
        light: orange[300],
        main: orange[400], // #F7931E (muted orange)
        dark: orange[800]
      },
      error: {
        light: red[300],
        main: red[400], // Softer red
        dark: red[800]
      },
      success: {
        light: green[300],
        main: green[500], // #5D7761 (sage green)
        dark: green[700]
      },
      grey: {
        ...gray
      },
      divider: alpha(gray[300], 0.4),
      background: {
        default: brand[50], // Using brand lightest color
        paper: brand[100] // Using brand very light color
      },
      text: {
        primary: brand[700],
        secondary: brand[600],
        warning: orange[400]
      },
      action: {
        hover: alpha(gray[200], 0.2),
        selected: `${alpha(gray[200], 0.3)}`
      }
    },
    typography: {
      fontFamily: "Inter, sans-serif",
      h1: {
        fontSize: defaultTheme.typography.pxToRem(48),
        fontWeight: 600,
        lineHeight: 1.2,
        letterSpacing: -0.5
      },
      h2: {
        fontSize: defaultTheme.typography.pxToRem(36),
        fontWeight: 600,
        lineHeight: 1.2
      },
      h3: {
        fontSize: defaultTheme.typography.pxToRem(30),
        lineHeight: 1.2
      },
      h4: {
        fontSize: defaultTheme.typography.pxToRem(24),
        fontWeight: 600,
        lineHeight: 1.5
      },
      h5: {
        fontSize: defaultTheme.typography.pxToRem(20),
        fontWeight: 600
      },
      h6: {
        fontSize: defaultTheme.typography.pxToRem(18),
        fontWeight: 600
      },
      subtitle1: {
        fontSize: defaultTheme.typography.pxToRem(18)
      },
      subtitle2: {
        fontSize: defaultTheme.typography.pxToRem(14),
        fontWeight: 500
      },
      body1: {
        fontSize: defaultTheme.typography.pxToRem(14)
      },
      body2: {
        fontSize: defaultTheme.typography.pxToRem(14),
        fontWeight: 400
      },
      caption: {
        fontSize: defaultTheme.typography.pxToRem(12),
        fontWeight: 400
      }
    },
    shape: {
      borderRadius: 8
    },
    shadows: customShadows,
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          // Fix for autofill background color
          "input:-webkit-autofill, input:-webkit-autofill:hover, input:-webkit-autofill:focus, input:-webkit-autofill:active": {
            WebkitBoxShadow: `0 0 0 30px ${brand[100]} inset !important`,
            WebkitTextFillColor: `${brand[900]} !important`,
            caretColor: `${brand[500]}`,
            borderRadius: "inherit"
          }
        }
      },
      MuiButton: {
        styleOverrides: {
          contained: {
            backgroundColor: brand[500],
            color: brand[50],
            "&:hover": {
              backgroundColor: brand[600]
            }
          }
        }
      }
    }
  };
};

export const colorSchemes = {
  light: {
    palette: {
      primary: {
        extraLight: brand[50],
        light: brand[200],
        main: brand[500], // #697F6E (sage green)
        dark: brand[700],
        contrastText: brand[50]
      },
      info: {
        light: brand[100],
        main: brand[300],
        dark: brand[600],
        contrastText: gray[50]
      },
      warning: {
        light: orange[300],
        main: orange[400], // #F7931E (muted orange)
        dark: orange[800]
      },
      error: {
        light: red[300],
        main: red[400], // Softer red
        dark: red[800]
      },
      success: {
        light: green[300],
        main: green[500], // #5D7761 (sage green)
        dark: green[700]
      },
      grey: {
        ...gray
      },
      divider: alpha(gray[300], 0.4),
      background: {
        default: brand[50], // Using brand lightest color
        paper: brand[100], // Using brand very light color
        card: '#fff'
      },
      text: {
        primary: brand[700],
        secondary: brand[600],
        warning: orange[400]
      },
      action: {
        hover: alpha(gray[200], 0.2),
        selected: `${alpha(gray[200], 0.3)}`
      },
      baseShadow: "hsla(142, 20%, 10%, 0.07) 0px 4px 16px 0px, hsla(142, 20%, 15%, 0.07) 0px 8px 16px -5px"
    }
  }
};

export const typography = {
  fontFamily: "Inter, sans-serif",
  h1: {
    fontSize: defaultTheme.typography.pxToRem(48),
    fontWeight: 600,
    lineHeight: 1.2,
    letterSpacing: -0.5
  },
  h2: {
    fontSize: defaultTheme.typography.pxToRem(36),
    fontWeight: 600,
    lineHeight: 1.2
  },
  h3: {
    fontSize: defaultTheme.typography.pxToRem(30),
    lineHeight: 1.2
  },
  h4: {
    fontSize: defaultTheme.typography.pxToRem(24),
    fontWeight: 600,
    lineHeight: 1.5
  },
  h5: {
    fontSize: defaultTheme.typography.pxToRem(20),
    fontWeight: 600
  },
  h6: {
    fontSize: defaultTheme.typography.pxToRem(18),
    fontWeight: 600
  },
  subtitle1: {
    fontSize: defaultTheme.typography.pxToRem(18)
  },
  subtitle2: {
    fontSize: defaultTheme.typography.pxToRem(14),
    fontWeight: 500
  },
  body1: {
    fontSize: defaultTheme.typography.pxToRem(14)
  },
  body2: {
    fontSize: defaultTheme.typography.pxToRem(14),
    fontWeight: 400
  },
  caption: {
    fontSize: defaultTheme.typography.pxToRem(12),
    fontWeight: 400
  }
};

export const shape = {
  borderRadius: 8
};

// @ts-ignore
const defaultShadows: Shadows = ["none", "var(--template-palette-baseShadow)", ...defaultTheme.shadows.slice(2)];
export const shadows = defaultShadows;

// Global styles to fix autofill styling
export const globalStyles = {
  MuiCssBaseline: {
    styleOverrides: `
        *:-webkit-autofill,
        *:-webkit-autofill:hover, 
        *:-webkit-autofill:focus,
        *:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 30px ${brand[100]} inset !important;
          -webkit-text-fill-color: ${brand[900]} !important;
          caret-color: ${brand[500]};
          transition: background-color 5000s ease-in-out 0s;
        }
      `
  }
};
