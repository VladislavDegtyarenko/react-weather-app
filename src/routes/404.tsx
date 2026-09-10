import { Link } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";

import PageWrapper from "../ui/PageWrapper";

export default function NotFoundPage() {
  return (
    <PageWrapper
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Box>
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
          404 City not found
        </Typography>
        <Button variant="contained" component={Link} to="/" sx={{ color: "text.primary" }}>
          Go to home
        </Button>
      </Box>
    </PageWrapper>
  );
}
