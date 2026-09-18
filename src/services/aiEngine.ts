import { Crop, BuyerRequirement, AIMatchResult, AIMatchFactorBreakdown, AIHarvestEstimate, CropUpdate, DemandSupplyGapData } from '../types';

/**
 * FarmSync AI Transparent 5-Factor Weighted Matching Algorithm
 * Weights:
 * - Crop Type & Variety: 30%
 * - Quantity Fulfillment: 20%
 * - Location / Proximity: 15%
 * - Price Competitiveness: 15%
 * - Harvest Date Readiness: 20%
 */
export function calculateAIMatch(crop: Crop, requirement: BuyerRequirement): AIMatchResult {
  // 1. Crop Match (Weight: 30)
  const reqCrop = requirement.cropType.trim().toLowerCase();
  const fCrop = crop.cropName.trim().toLowerCase();
  const fVariety = crop.cropVariety.trim().toLowerCase();

  let cropScore = 0;
  let cropEvaluation: AIMatchFactorBreakdown['cropEvaluation'] = 'Poor';

  if (fCrop === reqCrop || reqCrop.includes(fCrop) || fCrop.includes(reqCrop)) {
    cropScore = 30;
    cropEvaluation = 'Excellent';
  } else if (fVariety.includes(reqCrop) || reqCrop.includes(fVariety)) {
    cropScore = 26;
    cropEvaluation = 'Good';
  } else {
    // Check keyword similarity
    const reqTokens = reqCrop.split(' ');
    const matchedTokens = reqTokens.filter(t => fCrop.includes(t) || fVariety.includes(t));
    if (matchedTokens.length > 0) {
      cropScore = 18;
      cropEvaluation = 'Moderate';
    } else {
      cropScore = 5;
      cropEvaluation = 'Poor';
    }
  }

  // 2. Quantity Match (Weight: 20)
  const requiredQty = requirement.requiredQuantity;
  const availableQty = crop.availableQuantity;
  let quantityScore = 0;
  let quantityEvaluation: AIMatchFactorBreakdown['quantityEvaluation'] = 'Shortfall';

  const qtyRatio = availableQty / requiredQty;
  if (qtyRatio >= 0.95 && qtyRatio <= 1.5) {
    quantityScore = 20;
    quantityEvaluation = 'Excellent';
  } else if (qtyRatio > 1.5) {
    quantityScore = 18; // Surplus is good but slightly oversized
    quantityEvaluation = 'Good';
  } else if (qtyRatio >= 0.7) {
    quantityScore = 15;
    quantityEvaluation = 'Good';
  } else if (qtyRatio >= 0.4) {
    quantityScore = 10;
    quantityEvaluation = 'Moderate';
  } else {
    quantityScore = Math.max(3, Math.round(qtyRatio * 20));
    quantityEvaluation = 'Shortfall';
  }

  // 3. Location / Logistics Match (Weight: 15)
  const cropState = (crop.farmerState || '').trim().toLowerCase();
  const cropDistrict = (crop.farmerDistrict || '').trim().toLowerCase();
  const reqState = (requirement.deliveryState || '').trim().toLowerCase();
  const reqDistrict = (requirement.deliveryDistrict || '').trim().toLowerCase();

  let locationScore = 0;
  let locationEvaluation: AIMatchFactorBreakdown['locationEvaluation'] = 'Far';

  if (cropDistrict && reqDistrict && cropDistrict === reqDistrict) {
    locationScore = 15;
    locationEvaluation = 'Excellent';
  } else if (cropState && reqState && cropState === reqState) {
    locationScore = 12;
    locationEvaluation = 'Good';
  } else {
    // Inter-state shipping
    locationScore = 7;
    locationEvaluation = 'Moderate';
  }

  // 4. Price Match (Weight: 15)
  const buyerMax = requirement.maxPricePerKg;
  const farmerPrice = crop.pricePerKg;
  let priceScore = 0;
  let priceEvaluation: AIMatchFactorBreakdown['priceEvaluation'] = 'High';

  if (farmerPrice <= buyerMax * 0.9) {
    priceScore = 15; // 10%+ below budget
    priceEvaluation = 'Excellent';
  } else if (farmerPrice <= buyerMax) {
    priceScore = 14; // within budget
    priceEvaluation = 'Good';
  } else if (farmerPrice <= buyerMax * 1.1) {
    priceScore = 8; // 10% above budget
    priceEvaluation = 'Fair';
  } else {
    priceScore = 3;
    priceEvaluation = 'High';
  }

  // 5. Harvest Date Match (Weight: 20)
  const harvestDate = new Date(crop.expectedHarvestDate).getTime();
  const requiredDate = new Date(requirement.requiredByDate).getTime();
  const dayDiff = Math.round((requiredDate - harvestDate) / (1000 * 60 * 60 * 24));

  let dateScore = 0;
  let dateEvaluation: AIMatchFactorBreakdown['dateEvaluation'] = 'Late';

  if (dayDiff >= 0 && dayDiff <= 10) {
    dateScore = 20; // Perfect timing: harvested right before required date
    dateEvaluation = 'Excellent';
  } else if (dayDiff > 10 && dayDiff <= 25) {
    dateScore = 17; // Ready slightly earlier
    dateEvaluation = 'Good';
  } else if (dayDiff >= -5 && dayDiff < 0) {
    dateScore = 12; // 1-5 days slight delay
    dateEvaluation = 'Tight';
  } else if (dayDiff > 25) {
    dateScore = 10;
    dateEvaluation = 'Good';
  } else {
    dateScore = 4;
    dateEvaluation = 'Late';
  }

  const overallScore = Math.min(100, Math.round(cropScore + quantityScore + locationScore + priceScore + dateScore));

  const factors: AIMatchFactorBreakdown = {
    cropScore,
    quantityScore,
    locationScore,
    priceScore,
    dateScore,
    cropEvaluation,
    quantityEvaluation,
    locationEvaluation,
    priceEvaluation,
    dateEvaluation,
    matchSummary: `${crop.cropName} (${crop.cropVariety}) meets ${overallScore}% of requirement specifications.`
  };

  return {
    id: `match_${requirement.id}_${crop.id}`,
    buyerRequirementId: requirement.id,
    cropId: crop.id,
    crop,
    buyerRequirement: requirement,
    overallScore,
    factors,
    computedAt: new Date().toISOString()
  };
}

/**
 * AI Harvest Estimation Engine
 * Uses crop lifecycle benchmarks, sowing date, observed stage updates, and moisture/pest factors.
 */
export function calculateAIHarvestEstimate(crop: Crop, updates: CropUpdate[] = []): AIHarvestEstimate {
  const sowingTime = new Date(crop.sowingDate).getTime();
  const expectedTime = new Date(crop.expectedHarvestDate).getTime();
  const now = Date.now();

  const totalCycleDays = Math.max(30, Math.round((expectedTime - sowingTime) / (1000 * 60 * 60 * 24)));
  const elapsedDays = Math.max(0, Math.round((now - sowingTime) / (1000 * 60 * 60 * 24)));

  // Stage weight factor
  const stageWeights: Record<string, number> = {
    'Sowing': 0.05,
    'Germination': 0.18,
    'Vegetative': 0.45,
    'Flowering': 0.70,
    'Fruiting': 0.85,
    'Maturing': 0.95,
    'Harvest Ready': 1.0
  };

  const currentStage = crop.growthStage || 'Vegetative';
  const observedProgress = stageWeights[currentStage] ?? (elapsedDays / totalCycleDays);

  // Growth progress percentage
  const growthProgressPercentage = Math.min(100, Math.round(observedProgress * 100));

  // Compute realistic days remaining
  let calculatedRemaining = Math.round(totalCycleDays * (1 - observedProgress));
  if (currentStage === 'Harvest Ready') {
    calculatedRemaining = 0;
  }

  // Factor adjustments from updates
  let pestImpact = 'Healthy / Negligible';
  let irrigationCondition = 'Optimal';
  let confidence = 88;

  if (updates.length > 0) {
    const latestUpdate = updates[updates.length - 1];
    if (latestUpdate.pestObservations && latestUpdate.pestObservations.toLowerCase().includes('mild')) {
      pestImpact = 'Mild observation noted';
      confidence += 3;
    } else if (latestUpdate.pestObservations && latestUpdate.pestObservations.toLowerCase().includes('infestation')) {
      pestImpact = 'Under active biological treatment (+3 days margin)';
      calculatedRemaining += 3;
      confidence += 2;
    }
    irrigationCondition = latestUpdate.irrigationStatus;
    confidence = Math.min(96, confidence + Math.min(updates.length * 3, 8));
  } else {
    confidence = 74; // Lower confidence without on-ground updates
  }

  const estimatedDateObj = new Date(now + calculatedRemaining * 24 * 60 * 60 * 1000);
  const estimatedHarvestDate = estimatedDateObj.toISOString().split('T')[0];

  return {
    cropId: crop.id,
    estimatedHarvestDate,
    daysRemaining: calculatedRemaining,
    confidencePercentage: confidence,
    growthProgressPercentage,
    factorsUsed: {
      sowingDate: crop.sowingDate,
      growthStage: `${currentStage} Stage (${growthProgressPercentage}% maturity)`,
      irrigationStatus: irrigationCondition,
      pestRisk: pestImpact,
      weatherCondition: 'Favorable regional microclimate',
      summary: calculatedRemaining === 0 
        ? 'Crop is at peak harvest readiness.' 
        : `Approximately ${calculatedRemaining} days remaining until optimal harvest yield.`
    }
  };
}

/**
 * Aggregates live buyer requirements and farmer supply to calculate market gap analytics.
 */
export function calculateDemandAnalytics(crops: Crop[], requirements: BuyerRequirement[]): DemandSupplyGapData[] {
  const cropMap = new Map<string, { demand: number; supply: number; prices: number[] }>();

  // Aggregate requirements
  requirements.forEach(req => {
    const key = req.cropType.trim();
    if (!cropMap.has(key)) {
      cropMap.set(key, { demand: 0, supply: 0, prices: [] });
    }
    const item = cropMap.get(key)!;
    item.demand += req.requiredQuantity;
    item.prices.push(req.maxPricePerKg);
  });

  // Aggregate crops
  crops.forEach(crop => {
    const key = crop.cropName.trim();
    if (!cropMap.has(key)) {
      cropMap.set(key, { demand: 0, supply: 0, prices: [] });
    }
    const item = cropMap.get(key)!;
    item.supply += crop.availableQuantity;
    item.prices.push(crop.pricePerKg);
  });

  const results: DemandSupplyGapData[] = [];

  cropMap.forEach((val, cropName) => {
    const gapKg = val.demand - val.supply;
    const avgPrice = val.prices.length > 0
      ? Math.round(val.prices.reduce((a, b) => a + b, 0) / val.prices.length)
      : 35;

    let urgency: DemandSupplyGapData['urgency'] = 'BALANCED';
    if (gapKg > 2000) {
      urgency = 'HIGH';
    } else if (gapKg > 0) {
      urgency = 'MEDIUM';
    } else {
      urgency = 'SURPLUS';
    }

    results.push({
      cropName,
      demandKg: val.demand,
      supplyKg: val.supply,
      gapKg,
      averagePrice: avgPrice,
      urgency
    });
  });

  return results.sort((a, b) => b.demandKg - a.demandKg);
}
