import { createTheme } from "@mui/material/styles";
import darkScrollbar from "@mui/material/darkScrollbar";
// Crie seu próprio tema:
export const theme = createTheme({
  palette: {
    primary: {
      light: "#4db8a2",
      main: "#50893E",
      dark: "#3e5935",
      contrastText: "#fff",
    },
    secondary: {
      light: "#ff7961",
      main: "#f44336",
      dark: "#ba000d",
      contrastText: "#000",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: () => ({
        body: darkScrollbar(),
      }),
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          padding: "0px 4px 0px 4px",
          fontSize: "0.55rem",
          lineHeight: "0px",
          textAlign: "center",
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "#50893E",
            color: "#fff",
          },
          "&.Mui-selected": {
            backgroundColor: "#50893E",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#50893E",
            },
          },
        },
      },
    },
    MuiButtonBase: {
      styleOverrides: {
        root: {
          color: "#333",
          "&.Mui-selected": {
            color: "#fff !important",
            backgroundColor: "#50893E",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          // color:'#333'
          borderRadius: "4px",
          fontSize: "0.875rem",
          textTransform: "initial",
          // padding: "8px 15px",
        },
      },
    },
    MuiTypography: {
      defaultProps: {
        color: "#333",
      },
      styleOverrides: {
        h6: {
          color: "#444",
          fontSize: "1rem",
          fontWeight: "bold",
          letterSpacing: "0",
        },
      },
    },
    MuiSpeedDialAction: {
      styleOverrides: {
        staticTooltipLabel: {
          width: "170px !important",
          fontSize: "0.8rem",
          textAlign: "right",
          padding: "5px 10px",
        },
      },
    },
  },
});

// primaryColor: "#50893E",
// secondaryColor: "#3e5935",
// darkGray: "#121212",
// white: "#fff",
// whiteSmoke: "#f8f8f8",
// grey: "#EDEDF1",
// FoggyGrey: "#ACA99F",
// SonicSilver: "#777777",
// Warning: "#D24340",
// LightYellow: "#FBC81D",
// YellowOrange: "#FFB343",
// OrangeFire:"#DD571C",

//  import { createTheme, ThemeProvider } from '@mui/material/styles';

//  const theme = createTheme({
//    palette: {
//      primary: {
//        main: '#1976d2',
//      },
//    },
//    components: {
//      MuiButton: {
//        styleOverrides: {
//          root: {
//            borderRadius: 20,
//          },
//        },
//      },
//    },
//  });
