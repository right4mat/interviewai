import { 
  GrowthStagesMapType, 
  CropCompassMapType, 
  ApplicationMethodMapType,
  GrowthStageKey,
  CropCompassKey,
  ApplicationMethodKey
} from '@/types/cropCompass';

export const getCropCompassResult = (value: number): string => {
  if (value > -50) {
    return "cropCompass.maxOverbalance";
  } else if (value > -60) {
    return "cropCompass.moderateOverbalance";
  } else if (value > -70) {
    return "cropCompass.fruitFill";
  } else if (value > -80) {
    return "cropCompass.flowering";
  } else if (value > -100) {
    return "cropCompass.maxGrowth";
  } else if (value > -110) {
    return "cropCompass.moderateUnbalanced";
  } else {
    return "cropCompass.maxUnbalanced";
  }
};

export const getWhiltRisk = (value: number): string => {
  if (value <= 10) {
    return "wiltRisk.recover";
  } else if (value <= 20) {
    return "wiltRisk.minorStress";
  } else if (value <= 30) {
    return "wiltRisk.moderateStress";
  } else if (value <= 40) {
    return "wiltRisk.significantStress";
  } else if (value <= 50) {
    return "wiltRisk.mightRecover";
  } else if (value <= 60) {
    return "wiltRisk.recoveryUnlikely";
  } else if (value <= 70) {
    return "wiltRisk.severeDamage";
  } else if (value <= 80) {
    return "wiltRisk.criticalCondition";
  } else if (value <= 90) {
    return "wiltRisk.terminalDecline";
  } else {
    return "wiltRisk.death";
  }
};

export const getWhiltRiskColor = (value: number): string => {
  if (value <= 30) return "#5D7761"; // Green for low risk
  if (value <= 60) return "#E6C875"; // Yellow/amber for medium risk
  return "#D68060"; // Red for high risk
};

export const getCropCompassColor = (value: number): string => {
  if (value >= -50 && value <= 0) return "#D68060"; // Max Overbalance
  if (value >= -60 && value < -50) return "#E6C875"; // Moderate Overbalance  
  if (value >= -70 && value < -60) return "#A9BE9C"; // Fruit fill / Early Harvest
  if (value >= -80 && value < -70) return "#4A90E2"; // Flowering / fruit set
  if (value >= -100 && value < -80) return "#5D7761"; // Max Growth
  if (value >= -110 && value < -100) return "#E6C875"; // Moderate unbalanced
  if (value < -110) return "#D68060"; // Max unbalanced
  return "#D68060"; // Default case
};

export const growthStagesMap: GrowthStagesMapType = {
  "max_growth": "growthStages.maxGrowth",
  "flowering": "growthStages.flowering",
  "fruit_fill": "growthStages.fruitFill"
};

export const cropCompassMap: CropCompassMapType = {
  "max_overbalance": "cropCompass.maxOverbalance",
  "moderate_overbalance": "cropCompass.moderateOverbalance",
  "fruit_fill": "cropCompass.fruitFill",
  "flowering": "cropCompass.flowering",
  "max_growth": "cropCompass.maxGrowth",
  "moderate_unbalanced": "cropCompass.moderateUnbalanced",
  "max_unbalanced": "cropCompass.maxUnbalanced"
};

export const applicationMethodMap: ApplicationMethodMapType = {
  "PPB": "applicationMethods.prePlantBaseBanded",
  "PPBr": "applicationMethods.prePlantBaseBroadcast",
  "SDB": "applicationMethods.sideDressBanded",
  "SDBr": "applicationMethods.sideDressBroadcast",
  "SS": "applicationMethods.soilSpray",
  "F": "applicationMethods.foliar",
  "Fert": "applicationMethods.fertigation",
};
