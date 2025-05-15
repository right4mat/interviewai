"use client";
import {ReactNode} from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import LogoIcon from "@/icons/LogoIcon";
import { features } from "@/features";
import { PAGE_PATH } from "@/path";
import { useT } from "@/i18n/client";

export default function Content(): ReactNode {
  const { t } = useT('features');

  return (
    <Stack sx={{ flexDirection: "column", alignSelf: "center", gap: 4, maxWidth: 450 }}>
      <Box sx={{ display: { xs: "none", md: "flex" } }}>
        <a href={PAGE_PATH.homePage} style={{ textDecoration: "none" }}>
          <LogoIcon />
        </a>
      </Box>
      {features.slice(0, 4).map((item, index) => (
        <Stack key={index} direction="row" sx={{ gap: 2 }}>
          {item.icon}
          <div>
            <Typography gutterBottom sx={{ fontWeight: "medium" }}>
              {t(`feature${index + 1}.title`)}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {t(`feature${index + 1}.description`)}
            </Typography>
          </div>
        </Stack>
      ))}
    </Stack>
  );
}
