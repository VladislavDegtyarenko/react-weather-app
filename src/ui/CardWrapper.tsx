import { Box, Typography } from "@mui/material";
import { ReactNode } from "react";

interface CardWrapperProps {
  children: ReactNode;
  inactive?: boolean;
  sx?: Object;
}

const CardWrapper = ({ children, inactive, sx = {} }: CardWrapperProps) => {
  return (
    <Box
      bgcolor={inactive ? "card.inactive" : "card.active"}
      sx={{
        borderRadius: 2,
        padding: 2,
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

export default CardWrapper;
