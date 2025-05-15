export interface NutrientRow {
  id: number;
  element: string;
  ppm: number | string | null;
  percent: number | string | null;
}

export interface Fertilizer {
  id: number;
  brand?: string;
  name?: string;
  n?: number | string;
  p?: number | string;
  k?: number | string;
  s?: number | string;
  ca?: number | string;
  mg?: number | string;
  zn?: number | string;
  b?: number | string;
  fe?: number | string;
  cu?: number | string;
  mn?: number | string;
  mo?: number | string;
  si?: number | string;
  cl?: number | string;
  co?: number | string;
}

export interface FertilizerRecommendation {
  id?: string; // Optional for client-side operations
  fertilizer: number;
  rate: number;
  appTime: number;
  appMethod: string;
}

export interface Report {
  id: string;
  farmId: number;
  block: string;
  blockSize: number | null;
  sampleId: string;
  dateSampled: string;
  crop: string;
  cropStage: string;
  targetCropStage: string;
  nutrients: NutrientRow[];
  isGraftedPlant: boolean;
  isDryTissue: boolean;
  isSelected: boolean;
  dateRecommended: string;
  moonSampledPhase: string | null;
  moonReportedPhase: string | null;
  comments: string | null;
  fertilizers: FertilizerRecommendation[] | null;
  cropCompass: number | null;
  whiltRisk: number | null;
}

// Growth Stages
export type GrowthStageKey = 'max_growth' | 'flowering' | 'fruit_fill';
export type GrowthStageTranslationKey = 'growthStages.maxGrowth' | 'growthStages.flowering' | 'growthStages.fruitFill';
export type GrowthStageEnglishValue = 'Max Growth' | 'Flowering' | 'Fruit Fill';

// Crop Compass
export type CropCompassKey = 'max_overbalance' | 'moderate_overbalance' | 'fruit_fill' | 'flowering' | 'max_growth' | 'moderate_unbalanced' | 'max_unbalanced';
export type CropCompassTranslationKey = 'cropCompass.maxOverbalance' | 'cropCompass.moderateOverbalance' | 'cropCompass.fruitFill' | 'cropCompass.flowering' | 'cropCompass.maxGrowth' | 'cropCompass.moderateUnbalanced' | 'cropCompass.maxUnbalanced';
export type CropCompassEnglishValue = 'Max Overbalance' | 'Moderate Overbalance' | 'Fruit Fill' | 'Flowering' | 'Max Growth' | 'Moderate Unbalanced' | 'Max Unbalanced';

// Application Methods
export type ApplicationMethodKey = 'PPB' | 'PPBr' | 'SDB' | 'SDBr' | 'SS' | 'F' | 'Fert';
export type ApplicationMethodTranslationKey = 'applicationMethods.prePlantBaseBanded' | 'applicationMethods.prePlantBaseBroadcast' | 'applicationMethods.sideDressBanded' | 'applicationMethods.sideDressBroadcast' | 'applicationMethods.soilSpray' | 'applicationMethods.foliar' | 'applicationMethods.fertigation';
export type ApplicationMethodEnglishValue = 'Pre Plant Base Banded' | 'Pre Plant Base Broadcast' | 'Side Dress Banded' | 'Side Dress Broadcast' | 'Soil Spray' | 'Foliar' | 'Fertigation';

// Map type definitions
export type GrowthStagesMapType = {
  [K in GrowthStageKey]: GrowthStageTranslationKey;
};

export type CropCompassMapType = {
  [K in CropCompassKey]: CropCompassTranslationKey;
};

export type ApplicationMethodMapType = {
  [K in ApplicationMethodKey]: ApplicationMethodTranslationKey;
};

// English map type definitions
export type GrowthStagesEnglishMapType = {
  [K in GrowthStageKey]: GrowthStageEnglishValue;
};

export type CropCompassEnglishMapType = {
  [K in CropCompassKey]: CropCompassEnglishValue;
};

export type ApplicationMethodEnglishMapType = {
  [K in ApplicationMethodKey]: ApplicationMethodEnglishValue;
};

