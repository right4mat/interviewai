import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Image from "next/image";

interface LogoProps {
  width?: number;
  height?: number;
}

const Logo: React.FC<LogoProps> = ({ width = 150, height = 70 }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative"
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center"
        }}
      >
        <Image src="/assets/images/icons/icon2.png" alt="Logo Icon" style={{ objectFit: "contain" }} width={width} height={height} />
      </Box>
    </Box>
  );
};

export default Logo;
