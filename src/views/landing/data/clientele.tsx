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

export const clientele: ClienteleConfig = {
  title: `${branding.brandName} helps 12k+ farmers optimize crop nutrition and maximize their harvest yields.`,
  clienteleList: [GrainCorp, Elders, Wesfarmers,]
};
