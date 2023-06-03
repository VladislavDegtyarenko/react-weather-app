import { ReactNode } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";

declare module "@mui/material/styles/createPalette" {
  interface TypeBackground {
    day: string;
    night: string;
  }
}

declare module "@mui/material/styles" {
  interface PaletteOptions {
    card?: {
      inactive?: string;
      active?: string;
    };
  }
}

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#2c6fb1",
      day: "linear-gradient(to bottom, #24619d, #1a407d)",
      night: "linear-gradient(to bottom, #27436b, #142444)",
    },
    card: {
      inactive: "#5888b939", // Soft grey color (25% opacity) for inactive card background
      active: "#5888b960", // Soft grey color (50% opacity) for active card background
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 480,
      md: 768,
      lg: 1024,
      xl: 1440,
    },
  },
});

const MUIProvider = ({ children }: { children: ReactNode }) => {
  return <ThemeProvider theme={darkTheme}>{children}</ThemeProvider>;
};

export default MUIProvider;
