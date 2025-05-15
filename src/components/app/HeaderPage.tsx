import * as React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Grid from "@mui/material/Grid";
import { useT } from "@/i18n/client";
import Typography from "@mui/material/Typography";
export default function Header({
  translationKey,
  text,
  onClick,
  isBackButton
}: {
  translationKey: string;
  text: string;
  onClick?: () => void;
  isBackButton: boolean;
}): React.ReactElement {
  const { t } = useT(translationKey);

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 12 }}>
        {!isBackButton ? (
          <Typography color="text.secondary" variant="subtitle1" sx={{ mb: 2 }} textAlign="center">{t(text)}</Typography>
        ) : (
          <Button
            fullWidth
            startIcon={<ArrowBackIcon />}
            onClick={onClick}
            sx={{
              mb: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
              fontSize: "1.2rem",
              color: "text.secondary",
              textTransform: "none",
              "&:hover": {
                //backgroundColor: "transparent",
              }
            }}
          >
            {t(text)}
          </Button>
        )}
        <Grid size={{ xs: 12, md: 12 }}>
          <Divider />
        </Grid>
      </Grid>
    </Grid>
  );
}
