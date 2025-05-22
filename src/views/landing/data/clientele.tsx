"use client";

import { type ClienteleConfig } from "@/components/landing/Clientele";
import ProductHunt from "@/images/clientele/ProductHunt";
import ToolifyAI from "@/images/clientele/ToolifyAI";

export const clientele: ClienteleConfig = {
  clienteleList: [
    <ProductHunt  imageSize={{width: 350, height: 200}}  />,
    <ToolifyAI   imageSize={{width: 350, height: 200}} />
  ]
};
