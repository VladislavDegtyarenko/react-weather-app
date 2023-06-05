import { Grow, Box, Typography, Button, Container } from "@mui/material";
import { ReactNode } from "react";
import { useTheme } from "@mui/material";
import { SxProps } from "@mui/system";
import Footer from "../components/Footer";
interface PageWrapperProps {
  isDaytime?: boolean;
  sx?: SxProps;
  children: ReactNode;
}

const PageWrapper = ({ isDaytime = true, sx = {}, children }: PageWrapperProps) => {
  const theme = useTheme();

  return (
    <Box
      display="flex"
      flexDirection="column"
      pt={0}
      minHeight="100svh"
      sx={{
        background: isDaytime
          ? theme.palette.background.day
          : theme.palette.background.night,
      }}
    >
      <Container sx={{ flexGrow: "1", display: "flex", flexDirection: "column" }}>
        <Grow appear={true} in={true}>
          <Box
            color="text.primary"
            pt={10}
            display="flex"
            flexDirection="column"
            flexGrow="1"
            gap={4}
            position={"relative"}
            zIndex="1"
            width="100%"
            height="100%"
            sx={{ ...sx }}
          >
            {children}
          </Box>
        </Grow>
      </Container>
      <Footer />
    </Box>
  );
};

export default PageWrapper;
