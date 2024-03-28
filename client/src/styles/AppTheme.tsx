import { SimplePaletteColorOptions, createTheme } from "@mui/material/styles";
import type {} from "@mui/x-data-grid/themeAugmentation";

// Update the Typography's variant prop options
declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    secondary: true;
    legend: true;
  }
}
declare module "@mui/material/styles" {
  interface Palette {
    primaryGrey: SimplePaletteColorOptions;
    secondaryGrey: SimplePaletteColorOptions;
  }
  // allow configuration using `createTheme`
  interface PaletteOptions {
    primaryGrey: SimplePaletteColorOptions;
    secondaryGrey: SimplePaletteColorOptions;
  }

  interface TypographyVariants {
    secondary: React.CSSProperties;
    legend: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    secondary?: React.CSSProperties;
    legend?: React.CSSProperties;
  }
}

// colors
const PRIMARY = "#2573ff";
const PRIMARY_GREY = "#454E53";
const SECONDARY_GREY = "#ACB5B9";
const SECONDARY = "#2066DF";
const ERROR = "#ff1744";
const BACKGROUND = "#EAEAEA";
const TEXT_PRIMARY = "#232729";
const WHITE = "#FFFFFF";

// Create theme
export const AppTheme = createTheme({
  palette: {
    primary: {
      main: PRIMARY,
      contrastText: WHITE,
    },
    primaryGrey: {
      main: PRIMARY_GREY,
    },
    secondaryGrey: {
      main: SECONDARY_GREY,
    },
    secondary: {
      main: SECONDARY,
    },
    error: {
      main: ERROR,
    },
    background: {
      default: BACKGROUND,
    },
    text: {
      primary: TEXT_PRIMARY,
    },
  },
  typography: {
    h1: {
      fontSize: "24px",
      fontWeight: 700,
      letterSpacing: "0.15px",
    },
    h2: {
      fontSize: "20px",
      fontWeight: 600,
      letterSpacing: "0.15px",
    },
    h3: {
      fontSize: "16px",
      fontWeight: 600,
      letterSpacing: "0.15px",
    },
    body1: {
      fontSize: "14px",
      fontWeight: 400,
      letterSpacing: "0.15px",
    },
    secondary: {
      textDecoration: "none !important",
      fontSize: "10px",
      lineHeight: "15px",
      color: `${SECONDARY} !important`,
      fontWeight: "500",
    },
    legend: {
      fontSize: "12px",
      lineHeight: "16px",
      fontWeight: "400",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
      defaultProps: {
        disableElevation: true,
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "transparent",
          },
        },
      },
    },
   
    MuiTextField: {
      defaultProps: {
        size: "small",
      },
      styleOverrides: {
        root: {
          backgroundColor: WHITE,
        },
      },
    },
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          secondary: "p",
          legend: "span",
        },
      },
    },
    MuiDataGrid: {
      
      styleOverrides: {

        iconButtonContainer: {
          "& .MuiButtonBase-root:hover": {
            backgroundColor: "transparent",
          },
        },
        columnHeader: {
          backgroundColor: "#F4F5F6",
          ":focus-within": {
            outline: "none",
          },
        },
        columnHeaders: {
          backgroundColor: "#F4F5F6",
        },
        columnHeaderTitle: {
          fontWeight: 600,
          fontSize: "12px",
          letterSpacing: "0.25px",
        },
        checkboxInput:{
          padding: 0,
        },
        cell: {
          ":focus-within": {
            outline: "none",
          },
          
        },
        cellContent: {
          fontWeight: 400,
          fontSize: 12,
        },
      },
      defaultProps: {
        columnHeaderHeight: 48,
        disableColumnMenu: true,
        rowSelection: false,
        
      },
    },
    
   MuiCard:{
     styleOverrides:{
     }
   },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: TEXT_PRIMARY,
          fontWeight: 600,
          fontSize: "14px",
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          "&:focus": {
            backgroundColor: "transparent",
          },
          "&:hover": {
            opacity: 0.7,
          },
          padding:'10px'
        },
        standard: {
          fontSize: "14px",
          fontWeight: 600,
          padding: 0,
          "&:focus": {
            backgroundColor: "transparent",
          },
        },
        iconStandard: {
          color: "inherit",
          opacity: "inherit",
        },
      },
    },
   
    MuiToolbar:{
      styleOverrides:{
        root:{
          // background:'rgb(255 235 59 / 28%)'

        }
      }
    }
    
  },
});