'use client';
import { createTheme, alpha, PaletteMode, Shadows } from '@mui/material/styles';

declare module '@mui/material/Paper' {
  interface PaperPropsVariantOverrides {
    highlighted: true;
  }
}
declare module '@mui/material/styles' {
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
    interview: {
      primary: string;
      secondary: string;
      accent: string;
    }
  }
}

const defaultTheme = createTheme();

const customShadows: Shadows = [...defaultTheme.shadows];

// Intervue.ai brand colors - professional, tech-focused palette based on #8cc6f0 and #194f8d
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
  50: 'hsl(207, 35%, 97%)',
  100: 'hsl(207, 30%, 94%)',
  200: 'hsl(207, 20%, 88%)',
  300: 'hsl(207, 20%, 80%)',
  400: 'hsl(207, 20%, 65%)',
  500: 'hsl(207, 20%, 42%)',
  600: 'hsl(207, 20%, 35%)',
  700: 'hsl(207, 20%, 25%)',
  800: 'hsl(207, 30%, 6%)',
  900: 'hsl(207, 35%, 3%)',
};

// Success color for positive feedback on interview performance
export const green = {
  50: 'hsl(145, 80%, 98%)',
  100: 'hsl(145, 75%, 94%)',
  200: 'hsl(145, 75%, 87%)',
  300: 'hsl(145, 61%, 77%)',
  400: 'hsl(145, 44%, 53%)',
  500: 'hsl(145, 59%, 30%)',
  600: 'hsl(145, 70%, 25%)',
  700: 'hsl(145, 75%, 16%)',
  800: 'hsl(145, 84%, 10%)',
  900: 'hsl(145, 87%, 6%)',
};

// Warning color for areas of improvement in interview responses
export const orange = {
  50: 'hsl(35, 100%, 97%)',
  100: 'hsl(35, 92%, 90%)',
  200: 'hsl(35, 94%, 80%)',
  300: 'hsl(35, 90%, 65%)',
  400: 'hsl(35, 90%, 40%)',
  500: 'hsl(35, 90%, 35%)',
  600: 'hsl(35, 91%, 25%)',
  700: 'hsl(35, 94%, 20%)',
  800: 'hsl(35, 95%, 16%)',
  900: 'hsl(35, 93%, 12%)',
};

// Error color for critical feedback
export const red = {
  50: 'hsl(0, 100%, 97%)',
  100: 'hsl(0, 92%, 90%)',
  200: 'hsl(0, 94%, 80%)',
  300: 'hsl(0, 90%, 65%)',
  400: 'hsl(0, 90%, 40%)',
  500: 'hsl(0, 90%, 30%)',
  600: 'hsl(0, 91%, 25%)',
  700: 'hsl(0, 94%, 18%)',
  800: 'hsl(0, 95%, 12%)',
  900: 'hsl(0, 93%, 6%)',
};

// Secondary accent color for Intervue.ai
export const purple = {
  50: 'hsl(220, 100%, 97%)',
  100: 'hsl(220, 92%, 90%)',
  200: 'hsl(220, 94%, 80%)',
  300: 'hsl(220, 90%, 65%)',
  400: 'hsl(220, 90%, 50%)',
  500: 'hsl(220, 90%, 45%)',
  600: 'hsl(220, 91%, 40%)',
  700: 'hsl(220, 94%, 30%)',
  800: 'hsl(220, 95%, 20%)',
  900: 'hsl(220, 93%, 12%)',
};

export const getDesignTokens = (mode: PaletteMode) => {
  customShadows[1] =
    mode === 'dark'
      ? 'hsla(207, 30%, 5%, 0.7) 0px 4px 16px 0px, hsla(207, 25%, 10%, 0.8) 0px 8px 16px -5px'
      : 'hsla(207, 30%, 5%, 0.07) 0px 4px 16px 0px, hsla(207, 25%, 10%, 0.07) 0px 8px 16px -5px';

  return {
    palette: {
      mode,
      primary: {
        light: brand[200],
        main: brand[500],
        dark: brand[800], // Using #194f8d equivalent
        contrastText: brand[50],
        ...(mode === 'dark' && {
          contrastText: brand[50],
          light: brand[300],
          main: brand[500],
          dark: brand[800],
        }),
      },
      info: {
        light: brand[100],
        main: brand[300],
        dark: brand[600],
        contrastText: gray[50],
        ...(mode === 'dark' && {
          contrastText: brand[300],
          light: brand[500],
          main: brand[700],
          dark: brand[900],
        }),
      },
      warning: {
        light: orange[300],
        main: orange[400],
        dark: orange[800],
        ...(mode === 'dark' && {
          light: orange[400],
          main: orange[500],
          dark: orange[700],
        }),
      },
      error: {
        light: red[300],
        main: red[400],
        dark: red[800],
        ...(mode === 'dark' && {
          light: red[400],
          main: red[500],
          dark: red[700],
        }),
      },
      success: {
        light: green[300],
        main: green[400],
        dark: green[800],
        ...(mode === 'dark' && {
          light: green[400],
          main: green[500],
          dark: green[700],
        }),
      },
      grey: {
        ...gray,
      },
      divider: mode === 'dark' ? alpha(gray[700], 0.6) : alpha(gray[300], 0.4),
      background: {
        default: 'hsl(207, 20%, 99%)',
        paper: 'hsl(207, 35%, 97%)',
        ...(mode === 'dark' && { default: gray[900], paper: 'hsl(207, 30%, 7%)' }),
      },
      text: {
        primary: gray[800],
        secondary: gray[600],
        warning: orange[400],
        ...(mode === 'dark' && { primary: 'hsl(0, 0%, 100%)', secondary: gray[400] }),
      },
      action: {
        hover: alpha(brand[200], 0.2),
        selected: `${alpha(brand[200], 0.3)}`,
        ...(mode === 'dark' && {
          hover: alpha(brand[600], 0.2),
          selected: alpha(brand[600], 0.3),
        }),
      },
      // Intervue.ai specific colors
      interview: {
        primary: mode === 'dark' ? brand[400] : brand[800], // Light: #194f8d equivalent, Dark: lighter blue
        secondary: mode === 'dark' ? purple[400] : purple[600],
        accent: mode === 'dark' ? green[400] : green[500],
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontSize: defaultTheme.typography.pxToRem(48),
        fontWeight: 700,
        lineHeight: 1.2,
        letterSpacing: -0.5,
      },
      h2: {
        fontSize: defaultTheme.typography.pxToRem(36),
        fontWeight: 700,
        lineHeight: 1.2,
      },
      h3: {
        fontSize: defaultTheme.typography.pxToRem(30),
        lineHeight: 1.2,
        fontWeight: 600,
      },
      h4: {
        fontSize: defaultTheme.typography.pxToRem(24),
        fontWeight: 600,
        lineHeight: 1.5,
      },
      h5: {
        fontSize: defaultTheme.typography.pxToRem(20),
        fontWeight: 600,
      },
      h6: {
        fontSize: defaultTheme.typography.pxToRem(18),
        fontWeight: 600,
      },
      subtitle1: {
        fontSize: defaultTheme.typography.pxToRem(18),
        fontWeight: 500,
      },
      subtitle2: {
        fontSize: defaultTheme.typography.pxToRem(14),
        fontWeight: 500,
      },
      body1: {
        fontSize: defaultTheme.typography.pxToRem(16),
      },
      body2: {
        fontSize: defaultTheme.typography.pxToRem(14),
        fontWeight: 400,
      },
      caption: {
        fontSize: defaultTheme.typography.pxToRem(12),
        fontWeight: 400,
      },
      button: {
        fontSize: defaultTheme.typography.pxToRem(14),
        fontWeight: 600,
        textTransform: 'none',
      },
    },
    shape: {
      borderRadius: 10,
    },
    shadows: customShadows,
  };
};

export const colorSchemes = {
  light: {
    palette: {
      primary: {
        light: brand[200],
        main: brand[500], // #8cc6f0 equivalent
        dark: brand[800], // #194f8d equivalent
        contrastText: brand[50],
      },
      info: {
        light: brand[100],
        main: brand[300],
        dark: brand[600],
        contrastText: gray[50],
      },
      warning: {
        light: orange[300],
        main: orange[400],
        dark: orange[800],
      },
      error: {
        light: red[300],
        main: red[400],
        dark: red[800],
      },
      success: {
        light: green[300],
        main: green[400],
        dark: green[800],
      },
      grey: {
        ...gray,
      },
      divider: alpha(gray[300], 0.4),
      background: {
        default: 'hsl(207, 20%, 99%)',
        paper: 'hsl(207, 35%, 97%)',
      },
      text: {
        primary: gray[800],
        secondary: gray[600],
        warning: orange[400],
      },
      action: {
        hover: alpha(brand[200], 0.2),
        selected: `${alpha(brand[200], 0.3)}`,
      },
      baseShadow:
        'hsla(207, 30%, 5%, 0.07) 0px 4px 16px 0px, hsla(207, 25%, 10%, 0.07) 0px 8px 16px -5px',
      interview: {
        primary: brand[800], // #194f8d equivalent
        secondary: purple[600],
        accent: green[500],
      },
    },
  },
  dark: {
    palette: {
      primary: {
        contrastText: brand[50],
        light: brand[300],
        main: brand[500], // #8cc6f0 equivalent
        dark: brand[800], // #194f8d equivalent
      },
      info: {
        contrastText: brand[300],
        light: brand[500],
        main: brand[700],
        dark: brand[900],
      },
      warning: {
        light: orange[400],
        main: orange[500],
        dark: orange[700],
      },
      error: {
        light: red[400],
        main: red[500],
        dark: red[700],
      },
      success: {
        light: green[400],
        main: green[500],
        dark: green[700],
      },
      grey: {
        ...gray,
      },
      divider: alpha(gray[700], 0.6),
      background: {
        default: gray[900],
        paper: 'hsl(207, 30%, 7%)',
      },
      text: {
        primary: 'hsl(0, 0%, 100%)',
        secondary: gray[400],
      },
      action: {
        hover: alpha(brand[600], 0.2),
        selected: alpha(brand[600], 0.3),
      },
      baseShadow:
        'hsla(207, 30%, 5%, 0.7) 0px 4px 16px 0px, hsla(207, 25%, 10%, 0.8) 0px 8px 16px -5px',
      interview: {
        primary: brand[400], // Lighter blue for dark mode
        secondary: purple[400],
        accent: green[400],
      },
    },
  },
};

export const typography = {
  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  h1: {
    fontSize: defaultTheme.typography.pxToRem(48),
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: defaultTheme.typography.pxToRem(36),
    fontWeight: 700,
    lineHeight: 1.2,
  },
  h3: {
    fontSize: defaultTheme.typography.pxToRem(30),
    lineHeight: 1.2,
    fontWeight: 600,
  },
  h4: {
    fontSize: defaultTheme.typography.pxToRem(24),
    fontWeight: 600,
    lineHeight: 1.5,
  },
  h5: {
    fontSize: defaultTheme.typography.pxToRem(20),
    fontWeight: 600,
  },
  h6: {
    fontSize: defaultTheme.typography.pxToRem(18),
    fontWeight: 600,
  },
  subtitle1: {
    fontSize: defaultTheme.typography.pxToRem(18),
    fontWeight: 500,
  },
  subtitle2: {
    fontSize: defaultTheme.typography.pxToRem(14),
    fontWeight: 500,
  },
  body1: {
    fontSize: defaultTheme.typography.pxToRem(16),
  },
  body2: {
    fontSize: defaultTheme.typography.pxToRem(14),
    fontWeight: 400,
  },
  caption: {
    fontSize: defaultTheme.typography.pxToRem(12),
    fontWeight: 400,
  },
  button: {
    fontSize: defaultTheme.typography.pxToRem(14),
    fontWeight: 600,
    textTransform: 'none',
  },
};

export const shape = {
  borderRadius: 10,
};

// @ts-ignore
const defaultShadows: Shadows = [
  'none',
  'var(--template-palette-baseShadow)',
  ...defaultTheme.shadows.slice(2),
];
export const shadows = defaultShadows;
