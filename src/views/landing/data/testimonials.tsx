"use client";
import { Avatar } from "@mui/material";
import React, { ReactNode } from "react";
import GrainCorp from "@/images/clientele/ProductHunt";
import Wesfarmers from "@/images/clientele/ToolifyAI";
import EldersLimited from "@/images/clientele/Elders";

export interface Testimonial {
  avatar: ReactNode;
  brandIcon: ReactNode;
  name: string;
  occupation: string;
  testimonial: string;
}

export interface TestimonialsConfig {
  testimonials: Testimonial[];
}

export const testimonials: TestimonialsConfig = {
  testimonials: [
    {
      avatar: <Avatar alt="Sarah Johnson" src="/static/images/avatar/1.jpg" />,
      brandIcon: <GrainCorp imageSize={{ width: 80, height: 80 }} />,
      name: "testimonial.item1.name",
      occupation: "testimonial.item1.occupation",
      testimonial: "testimonial.item1.testimonial"
    },
    {
      avatar: <Avatar alt="Michael Rodriguez" src="/static/images/avatar/2.jpg" />,
      brandIcon: <Wesfarmers imageSize={{ width: 80, height: 80 }} />,
      name: "testimonial.item2.name",
      occupation: "testimonial.item2.occupation",
      testimonial: "testimonial.item2.testimonial"
    },
    {
      avatar: <Avatar alt="Emma Chen" src="/static/images/avatar/3.jpg" />,
      brandIcon: <EldersLimited imageSize={{ width: 80, height: 80 }} />,
      name: "testimonial.item3.name",
      occupation: "testimonial.item3.occupation",
      testimonial: "testimonial.item3.testimonial"
    },
    {
      avatar: <Avatar alt="David Wilson" src="/static/images/avatar/4.jpg" />,
      brandIcon: <Wesfarmers imageSize={{ width: 80, height: 80 }} />,
      name: "testimonial.item4.name",
      occupation: "testimonial.item4.occupation",
      testimonial: "testimonial.item4.testimonial"
    },
    {
      avatar: <Avatar alt="Jessica Patel" src="/static/images/avatar/5.jpg" />,
      brandIcon: <EldersLimited imageSize={{ width: 80, height: 80 }} />,
      name: "testimonial.item5.name",
      occupation: "testimonial.item5.occupation",
      testimonial: "testimonial.item5.testimonial"
    },
    {
      avatar: <Avatar alt="Robert Thompson" src="/static/images/avatar/6.jpg" />,
      brandIcon: <GrainCorp imageSize={{ width: 80, height: 80 }} />,
      name: "testimonial.item6.name",
      occupation: "testimonial.item6.occupation",
      testimonial: "testimonial.item6.testimonial"
    }
  ]
};
