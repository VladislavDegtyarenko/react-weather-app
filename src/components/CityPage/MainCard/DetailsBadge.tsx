import { Box, Typography } from "@mui/material";

interface DetailsBadgeProps {
  heading: string;
  value: string;
}

const DetailsBadge = ({ heading, value }: DetailsBadgeProps) => {
  return (
    <Box>
      <Typography variant="body2" color="text.secondary">
        {heading}
      </Typography>
      <Typography variant="body1">{value}</Typography>
    </Box>
  );
};

export default DetailsBadge;
