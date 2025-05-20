"use client";
// @project
import branding from "@/branding.json";
import Mui from "@/images/clientele/Mui";
import Syd from "@/images/clientele/Syd";
import Terra from "@/images/clientele/Terra";
import Bern from "@/images/clientele/Bern";
import { ReactElement } from "react";
import Mon from "@/images/clientele/Mon";
import Col from "@/images/clientele/Col";
import { ClienteleConfig } from "@/components/landing/Clientele";
import ProductHunt from "@/images/clientele/ProductHunt";
import Elders from "@/images/clientele/Elders";
import ToolifyAI from "@/images/clientele/ToolifyAI";
import BusinessIcon from '@mui/icons-material/Business';

export const clientele: ClienteleConfig = {
  clienteleList: [
    <ProductHunt  imageSize={{width: 350, height: 200}}  />,
    <ToolifyAI   imageSize={{width: 350, height: 200}} />
  ]
};
