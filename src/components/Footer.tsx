import { Container, Typography, Box, Link } from "@mui/material";

const Footer = () => {
  return (
    <Box component="footer" sx={{ mt: "auto", bgcolor: "background.paper" }}>
      <Container>
        <Box sx={{ p: 1 }}>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            © Copyright {new Date().getFullYear()} | All Rights Reserved
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Designed and developed by{" "}
            <Link href="https://vd-developer.vercel.app/" target="_blank">
              Vladyslav Dihtiarenko
            </Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
