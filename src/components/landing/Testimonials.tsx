"use client";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { useTranslation } from "react-i18next";
import { TestimonialsConfig } from "@/views/landing/data/testimonials";

export function Testimonials({ testimonials }: TestimonialsConfig) {
  const { t } = useTranslation("landing");

  return (
    <Container
      id="testimonials"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: { xs: 3, sm: 6 }
      }}
    >
      <Box
        sx={{
          width: { sm: "100%", md: "60%" },
          textAlign: { sm: "left", md: "center" }
        }}
      >
        <Typography component="h2" variant="h4" gutterBottom sx={{ color: "text.primary" }}>
          {t('testimonials.title')}
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary" }}>
          {t('testimonials.subtitle')}
        </Typography>
      </Box>
      <Grid container spacing={2}>
        {testimonials.map((testimonial, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index} sx={{ display: "flex" }}>
            <Card
              variant="outlined"
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                flexGrow: 1
              }}
            >
              <CardContent>
                <Typography variant="body1" gutterBottom sx={{ color: "text.secondary" }}>
                  {t(testimonial.testimonial)}
                </Typography>
              </CardContent>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between"
                }}
              >
                <CardHeader 
                  avatar={testimonial.avatar} 
                  title={t(testimonial.name)}
                  subheader={t(testimonial.occupation)}
                />
                <Box sx={{ opacity: 0.5 }}>{testimonial.brandIcon}</Box>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
