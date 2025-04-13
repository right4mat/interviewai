import { features as featuresConfig } from "@/features";
import { FeaturesConfig } from "@/components/landing/Features";
import branding from "@/branding.json";
import { ReactNode } from "react";

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
  })),
  title: `${branding.brandName} Features`,
  description: `A product that is built with the latest technologies and is designed to be easy to use and customize.`,
};
