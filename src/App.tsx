// Redux
import { Provider } from "react-redux";
import store from "./store/store";

// MUI
import { Box, Container } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

// Main UI Components
import Header from "./components/Header";

// Router
import { Outlet } from "react-router-dom";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <Provider store={store}>
        <Box sx={{ minHeight: "100vh", bgcolor: "background.paper" }}>
          <Header />
          <Container maxWidth="sm">
            <Outlet />
          </Container>
        </Box>
      </Provider>
    </ThemeProvider>
  );
}

export default App;
