"use client";
import { type ReactElement } from "react";

// @mui
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
// @project
import { SECTION_COMMON_PY } from "@/utils/constant";

// @assets
import Error404 from "@/images/maintenance/Error404";

/***************************  ERROR 404 - PAGES  ***************************/

interface Error404PageProps {
  primaryBtn?: {
    children: React.ReactNode;
    [key: string]: any;
  };
  heading: string;
}

export default function Error404Page({ primaryBtn, heading }: Error404PageProps): ReactElement {
  return (
    <Container>
      <Stack
        sx={{
          alignItems: "center",
          justifyContent: "center",
          width: 1,
          height: "100vh",
          py: SECTION_COMMON_PY,
          minHeight: { xs: 450, sm: 600, md: 800 }
        }}
      >
        <Card sx={{ width: 1, height: 1, py: { xs: 3, sm: 4, md: 6 } }}>
          <Stack sx={{ justifyContent: "center", height: 1, gap: { xs: 4, sm: 1 } }}>
            <Error404 />
            <Stack sx={{ gap: 2.25, alignItems: "center", mt: { sm: -5, lg: -6.25 } }}>
              <Typography sx={{ width: { xs: 210, sm: 300 }, textAlign: "center" }}>{heading}</Typography>
              {primaryBtn && (
                <Button
                  variant="contained"
                  size="medium"
                  {...primaryBtn}
                  onClick={() => {
                    window.history.back();
                  }}
                />
              )}
            </Stack>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
}
