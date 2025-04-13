import { Avatar } from "@mui/material";
import React from "react";
import { TestimonialsConfig } from "@/components/landing/Testimonials";
import branding from "@/branding.json";
import GrainCorp from "@/images/clientele/GrainCorp";
import Wesfarmers from "@/images/clientele/Wesfarmers";
import EldersLimited from "@/images/clientele/Elders";

export const testimonials: TestimonialsConfig = {
  title: "Testimonials",
  description: `What our clients say about ${branding.brandName}`,
  testimonials: [
    {
      avatar: <Avatar alt="Sarah Johnson" src="/static/images/avatar/1.jpg" />,
      brandIcon: <GrainCorp imageSize={{ width: 80, height: 80 }} />,
      name: "Sarah Johnson",
      occupation: "Farm Operations Manager",
      testimonial:
        `Since partnering with them, our customer retention has increased by 22%. The enhanced on-farm services keep us at the forefront of our clients' minds whenever they need agricultural solutions. Their team has become an invaluable extension of our business.`
    },
    {
      avatar: <Avatar alt="Michael Rodriguez" src="/static/images/avatar/2.jpg" />,
      brandIcon: <Wesfarmers imageSize={{ width: 80, height: 80 }} />,
      name: "Michael Rodriguez",
      occupation: "Agricultural Consultant",
      testimonial:
        `I've seen an average increase of $12,500 per client on plant samples alone. The specialized fertilizer recommendations have created an additional revenue stream I hadn't anticipated. My clients trust the science-backed results, which makes selling premium services much easier.`
    },
    {
      avatar: <Avatar alt="Emma Chen" src="/static/images/avatar/3.jpg" />,
      brandIcon: <EldersLimited imageSize={{ width: 80, height: 80 }} />,
      name: "Emma Chen",
      occupation: "Orchard Owner",
      testimonial:
        `The results speak for themselves. We tripled our watermelon yields in just one season following their recommendations. When neighboring farms saw our success, they wanted the same results. I've become something of an unofficial ambassador because the improvements are so dramatic.`
    },
    {
      avatar: <Avatar alt="David Wilson" src="/static/images/avatar/4.jpg" />,
      brandIcon: <Wesfarmers imageSize={{ width: 80, height: 80 }} />,
      name: "David Wilson",
      occupation: "Technology Director, AgriTech Solutions",
      testimonial:
        `As someone who evaluates agricultural technology, I'm impressed by their modern tech stack. The platform is responsive, intuitive, and clearly built with cutting-edge technologies. The performance optimizations make it accessible even in rural areas with limited connectivity.`
    },
    {
      avatar: <Avatar alt="Jessica Patel" src="/static/images/avatar/5.jpg" />,
      brandIcon: <EldersLimited imageSize={{ width: 80, height: 80 }} />,
      name: "Jessica Patel",
      occupation: "Small Farm Owner",
      testimonial:
        `Their support team is exceptional. Whenever I've had questions about implementing recommendations or interpreting results, they've been responsive and helpful. It feels like having a dedicated agronomist on call, which is invaluable for a small operation like mine.`
    },
    {
      avatar: <Avatar alt="Robert Thompson" src="/static/images/avatar/6.jpg" />,
      brandIcon: <GrainCorp imageSize={{ width: 80, height: 80 }} />,
      name: "Robert Thompson",
      occupation: "Regional Manager, Agricultural Supplies",
      testimonial:
        `The performance of crops under their nutrition program has been remarkable. We've documented a 5x increase in capsicum production for several clients, and our zucchini harvests have consistently doubled. These aren't just incremental improvements—they're transformative results that sell themselves.`
    }
  ]
};
