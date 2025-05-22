"use client";
import { features as featuresConfig } from "@/features";
import { type FeaturesConfig } from "@/components/landing/Features1";
import { type ReactNode } from "react";

// Define a type that matches the structure of items in featuresConfig
interface SourceFeature {
  icon: React.ReactNode;
  title: string;
  content: string;
  description?: string;
  imageLight?: string;
  imageDark?: string;
}

export const features: FeaturesConfig = {
  features: featuresConfig.slice(4, 8).map((feature: SourceFeature) => ({
    icon: feature.icon as ReactNode,
    title: feature.title,
    content: feature.content,
    description: feature.description || "",
    imageLight: feature.imageLight || "",
    imageDark: feature.imageDark || ""
  }))
};
