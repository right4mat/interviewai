import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/system";
import { ReactNode } from "react";
export interface Testimonial {
  avatar: ReactNode;
  brandIcon: ReactNode;
  name: string;
  occupation: string;
  testimonial: string;
}

export interface TestimonialsConfig {
  title: string;
  description: string;
  testimonials: Testimonial[];
}

export interface Testimonial {
  avatar: ReactNode;
  brandIcon: ReactNode;
  name: string;
  occupation: string;
  testimonial: string;
}

export interface TestimonialsConfig {
  title: string;
  description: string;
  testimonials: Testimonial[];
}

export function Testimonials({ testimonials, title, description }: TestimonialsConfig) {
  const theme = useTheme();

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
          {title}
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary" }}>
          {description}
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
                  {testimonial.testimonial}
                </Typography>
              </CardContent>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between"
                }}
              >
                <CardHeader avatar={testimonial.avatar} title={testimonial.name} subheader={testimonial.occupation} />
                <Box sx={{ opacity: 0.5 }}>{testimonial.brandIcon}</Box>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
