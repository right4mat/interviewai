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
import GrainCorp from "@/images/clientele/GrainCorp";
import Elders from "@/images/clientele/Elders";
import Wesfarmers from "@/images/clientele/Wesfarmers";
import BusinessIcon from '@mui/icons-material/Business';

export const clientele: ClienteleConfig = {
  clienteleList: [
    <GrainCorp  imageSize={{width: 200, height: 200}}  />,
    <Elders   imageSize={{width: 200, height: 200}} />,
    <Wesfarmers   imageSize={{width: 200, height: 200}} />
  ]
};
