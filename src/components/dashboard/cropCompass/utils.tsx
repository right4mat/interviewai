export const getCropCompassResult = (value: number): string => {
  if (value > -50) {
    return "Max Overbalance";
  } else if (value > -60) {
    return "Moderate Overbalance";
  } else if (value > -70) {
    return "Fruit fill / Early Harvest";
  } else if (value > -80) {
    return "Flowering / Early Harvest";
  } else if (value > -100) {
    return "Max Growth";
  } else if (value > -110) {
    return "Moderate unbalanced";
  } else {
    return "Max unbalanced";
  }
};

export const getWhiltRisk = (value: number): string => {
  if (value <= 10) {
    return "Plant Will Recover";
  } else if (value <= 20) {
    return "Minor Stress";
  } else if (value <= 30) {
    return "Moderate Stress";
  } else if (value <= 40) {
    return "Significant Stress";
  } else if (value <= 50) {
    return "Plant Might Recover";
  } else if (value <= 60) {
    return "Recovery Unlikely";
  } else if (value <= 70) {
    return "Severe Damage";
  } else if (value <= 80) {
    return "Critical Condition";
  } else if (value <= 90) {
    return "Terminal Decline";
  } else {
    return "Plant Death Imminent";
  }
};

interface Row {
  id: number;
  element: string;
  ppm: string | number | null;
  percent: string | number | null;
}

export const calculateWhiltRiskValue = (rows: Row[]): number => {
  const ppmValues: Record<string, number> = {};
  rows.forEach((row: Row) => {
    if (row.ppm !== "" && row.ppm !== null && row.ppm !== undefined) {
      ppmValues[row.element] = Number(row.ppm);
    }
  });

  const potassium = ppmValues["Potassium"] || 0;
  const chloride = ppmValues["Chloride"] || 0;
  const difference = potassium - chloride;

  if (difference > 3000) {
    return 10;
  } else if (difference > 2000) {
    return 20;
  } else if (difference > 1000) {
    return 30;
  } else if (difference > 0) {
    return 40;
  } else if (difference === 0) {
    return 50;
  } else if (difference > -500) {
    return 60;
  } else if (difference > -1000) {
    return 70;
  } else if (difference > -2000) {
    return 80;
  } else if (difference > -3000) {
    return 90;
  } else {
    return 100;
  }
};

export const calculateNetChargeBalance = (rows: Row[]): number => {
  const charges: Record<number, number> = {
    1: -1,
    2: 1,
    3: -3,
    4: 1,
    5: 2,
    6: 2,
    7: -2,
    8: 2,
    9: 1,
    10: 2,
    11: 3,
    12: -1,
    13: 6,
    14: 0, // Special case handled separately
    15: 1,
    16: 4,
    17: 3
  };

  let negativeCharge = 0;
  let positiveCharge = 0;

  rows.forEach((row: Row) => {
    let value = 0;
    
    // Check if row has ppm value first (preferred)
    if (row.ppm !== null && row.ppm !== undefined && row.ppm !== "") {
      value = isNaN(Number(row.ppm)) ? 0 : Number(row.ppm);
    } 
    // If no ppm but has percent, use percent value converted to comparable scale
    else if (row.percent !== null && row.percent !== undefined && row.percent !== "") {
      // Convert percentage to a comparable value (multiply by 10000 to make it similar scale to ppm)
      value = isNaN(Number(row.percent)) ? 0 : Number(row.percent) * 10000;
    }
    
    const charge = charges[row.id] || 0;

    // Special case for Chloride - split 50/50 between negative and positive
    if (row.element === "Chloride") {
      negativeCharge -= value * 0.5;
      positiveCharge += value * 0.5;
      return;
    }

    // Calculate charge and add to appropriate total
    const calculatedCharge = value * charge;
    if (charge < 0) {
      negativeCharge += calculatedCharge; // This will be a negative number
    } else {
      positiveCharge += calculatedCharge;
    }
  });

  // Calculate the ratio of negative to positive charge
  // Avoid division by zero
  if (positiveCharge === 0) return 0;

  // Calculate the final balance as negative charge divided by positive charge
  const netChargeBalance = (negativeCharge / positiveCharge) * 100;

  return netChargeBalance;
};

export const getWhiltRiskColor = (value: number): string => {
  if (value <= 30) return "#5D7761"; // Green for low risk
  if (value <= 60) return "#FFC107"; // Yellow/amber for medium risk
  return "#D68060"; // Red for high risk
};

export const getCropCompassColor = (value: number): string => {
  if (value > -50) return "#D68060"; // Max Overbalance
  if (value > -60) return "#E6C875"; // Moderate Overbalance
  if (value > -70) return "#A9BE9C"; // Fruit fill / Early Harvest
  if (value > -80) return "#5D7761"; // Flowering / Early Harvest
  if (value > -100) return "#5D7761"; // Max Growth
  if (value > -110) return "#E6C875"; // Moderate unbalanced
  return "#D68060"; // Max unbalanced
};

export const getComments = (value: number): string => {
  if (value > -50)
    return "Small crops will not respond to any anion applications, like nitrogen if a calculated result of -50 or less is shown. Plants will look very pale and some may completely collapse. At this stage the only way to finish a small crop with this calculated value is to foliar apply the fertiliser until harvest. Tree crops may recover but recovery will be slow and may also only respond to foliar applications at this stage, please use Nu Intri Tri Pac or Nu Intri Urea Zn. Crop growth without foliar fertiliser will be almost non-existent.";
  if (value > -60)
    return "Small crop will be visibly stressed with leaves being very dry in appearance, possibly even very pale in colour. At this stage the plant may not respond to fertigated nitrogen applications so foliar application will need to be a consideration. Nu Intri Tri Pac or Nu Intri Urea Zn would be some of the better options.";
  if (value > -70)
    return "In small crops, plants and starting to visibly harden off with leaves becoming leathery the closer the calculated value gets to -60. The plant is still able to respond to fertiliser applications, this will ideally be the result of the last lot of test before harvest to ensure plants can go the distance for multiple harvests or can recover well for post harvest applications if dealing with a perennial crop.";
  if (value > -80)
    return "Plant growth is still good but starting to slow down, plant is still responsive to applied fertiliser and very easy to return plants to a balanced state. Ideal for flowering and early fruit set stage.";
  if (value > -100)
    return "Maximum plant growth is observed, plant is balanced and will readily accept applied fertiliser. Plant will have maximum natural tolerance to pest and disease and should not require much input from agricultural chemicals. Ideal for Early vegetative growth stage or where maximum vegetative growth is required.";
  if (value > -110)
    return "Plant growth is slow and may appear soft. Insect pressures are still present but natural tolerance should be increasing. Once balance is restored the plant will increase in growth rate. Adding extra potassium or another cation like calcium will help speed up the balance process during this phase, be for not to over apply.";
  return "Plant growth has stalled and will not start again until anion levels have decreased, primarily nitrogen. Insect and disease pressures will be at their greatest as plants will be soft and unable to cope with external stress events like high temperatures. Foliar applications of Nu Intri 303 should be applied to help the plant process the excess nitrogen in the plant, at the same time increase applications of potassium to help improve the time till balance is achieved.";
};
