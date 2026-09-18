export interface DiseaseDiagnosticResult {
  id: string;
  diseaseName: string;
  scientificName: string;
  affectedCrop: string;
  severity: 'Mild' | 'Moderate' | 'Severe' | 'Healthy';
  confidencePercentage: number;
  symptoms: string[];
  organicRemedy: string;
  chemicalRemedy?: string;
  preventionTips: string[];
  estimatedYieldImpact: string;
  urgency: 'Immediate Action' | 'Monitor 48h' | 'Optimal Health';
}

export const SAMPLE_DISEASE_SCANS: { [key: string]: DiseaseDiagnosticResult } = {
  'tomato_blight': {
    id: 'diag_tom_01',
    diseaseName: 'Early Blight (Alternaria solani)',
    scientificName: 'Alternaria solani',
    affectedCrop: 'Tomato / Capsicum',
    severity: 'Moderate',
    confidencePercentage: 94.2,
    symptoms: [
      'Concentric dark brown rings on lower foliage (target-board appearance)',
      'Yellow halo surrounding necrotic lesions',
      'Stem collar rot near soil surface'
    ],
    organicRemedy: 'Foliar spray of 5% Neem seed kernel extract (NSKE) + Trichoderma viride biological bio-fungicide (5g/L). Repeat every 7 days.',
    chemicalRemedy: 'Mancozeb 75% WP @ 2.5g/L or Copper Oxychloride 50% WP @ 3g/L',
    preventionTips: [
      'Improve furrow drainage to avoid standing root moisture',
      'Mulch soil bed with paddy straw to prevent spore splashing',
      'Prune lower 6 inches of foliage to enhance airflow'
    ],
    estimatedYieldImpact: 'Potential 12-18% loss if untreated within 5 days',
    urgency: 'Immediate Action'
  },
  'rice_blast': {
    id: 'diag_rice_01',
    diseaseName: 'Rice Leaf Blast (Magnaporthe oryzae)',
    scientificName: 'Magnaporthe oryzae',
    affectedCrop: 'Paddy / Rice',
    severity: 'Severe',
    confidencePercentage: 96.8,
    symptoms: [
      'Spindle-shaped diamond lesions with gray or whitish center and brown borders',
      'Collar rot at leaf junctions',
      'Panicle blast causing unfilled grains'
    ],
    organicRemedy: 'Pseudomonas fluorescens foliar spray @ 10g/L + Vermiwash foliar application',
    chemicalRemedy: 'Tricyclazole 75% WP @ 0.6g/L or Isoprothiolane 40% EC @ 1.5ml/L',
    preventionTips: [
      'Avoid excessive nitrogen fertilization during humid weather',
      'Maintain continuous 2-inch standing water layer during tillering',
      'Use certified blast-resistant seed varieties (e.g. BPT-5204 treated)'
    ],
    estimatedYieldImpact: 'High risk: 25-35% loss if panicle blast develops',
    urgency: 'Immediate Action'
  },
  'chilli_curl': {
    id: 'diag_chilli_01',
    diseaseName: 'Chilli Leaf Curl Virus (ChiLCV) & Thrips Damage',
    scientificName: 'Begomovirus / Scirtothrips dorsalis vector',
    affectedCrop: 'Green Chilli',
    severity: 'Moderate',
    confidencePercentage: 91.5,
    symptoms: [
      'Upward and downward curling of leaf margins (boat-shaped leaf)',
      'Puckering and stunted internode elongation',
      'Flower drop and reduced pod setting'
    ],
    organicRemedy: 'Yellow and blue sticky traps (15 traps/acre) + Agniastra (botanical garlic-chilli-cow urine ferment) foliar spray @ 20ml/L',
    chemicalRemedy: 'Diafenthiuron 50% WP @ 1.2g/L for whitefly/thrips vector control',
    preventionTips: [
      'Erect border barrier crops with 3 rows of Maize or Sorghum',
      'Spray cow milk (10%) + Asafetida solution to inhibit viral replication',
      'Uproot and bury severely stunted symptomatic plants'
    ],
    estimatedYieldImpact: 'Moderate: 15-20% yield reduction on flower buds',
    urgency: 'Immediate Action'
  },
  'potato_blight': {
    id: 'diag_pot_01',
    diseaseName: 'Late Blight (Phytophthora infestans)',
    scientificName: 'Phytophthora infestans',
    affectedCrop: 'Potato',
    severity: 'Severe',
    confidencePercentage: 95.7,
    symptoms: [
      'Water-soaked dark lesions on leaf tips and margins',
      'White fungal downy growth on underside of leaves in high humidity',
      'Rapid stem browning and tuber rot'
    ],
    organicRemedy: 'Bordeaux mixture spray (1%) + Trichoderma harzianum soil and foliar drench. Discard infected vines.',
    chemicalRemedy: 'Cymoxanil 8% + Mancozeb 64% WP @ 2.5g/L or Dimethomorph 50% WP @ 1g/L',
    preventionTips: [
      'Plant certified disease-free seed tubers (Kufri Jyoti / Kufri Girdhari)',
      'Ensure proper earthing-up so tubers remain at least 4 inches below soil surface',
      'Avoid overhead sprinkler irrigation late in the evening'
    ],
    estimatedYieldImpact: 'Severe: 30-40% tuber yield destruction if left uncontrolled',
    urgency: 'Immediate Action'
  },
  'okra_yellow_vein': {
    id: 'diag_okra_01',
    diseaseName: 'Yellow Vein Mosaic Virus (YVMV)',
    scientificName: 'Bhendi yellow vein mosaic virus (BYVMV)',
    affectedCrop: 'Okra / Ladyfinger',
    severity: 'Moderate',
    confidencePercentage: 93.1,
    symptoms: [
      'Network of clear yellow veins contrasting against green leaf lamina',
      'Vein thickening and severe stunting of upper shoots',
      'Small, yellowish-white, fibrous and unmarketable pods'
    ],
    organicRemedy: 'Neem oil spray (10,000 ppm) @ 3ml/L + Installation of 20 yellow sticky traps/acre for whitefly control',
    chemicalRemedy: 'Acetamiprid 20% SP @ 0.4g/L or Imidacloprid 17.8% SL @ 0.5ml/L for vector management',
    preventionTips: [
      'Grow YVMV-tolerant hybrid varieties like Pusa Sawani or Arka Anamika',
      'Uproot and burn initial volunteer host weeds in field bunds',
      'Sow seeds with barrier crop border of pearl millet / maize'
    ],
    estimatedYieldImpact: 'Moderate to High: 20-30% loss in pod quality and weight',
    urgency: 'Immediate Action'
  },
  'onion_purple_blotch': {
    id: 'diag_onion_01',
    diseaseName: 'Purple Blotch (Alternaria porri)',
    scientificName: 'Alternaria porri',
    affectedCrop: 'Red Onion / Garlic',
    severity: 'Moderate',
    confidencePercentage: 92.4,
    symptoms: [
      'Small water-soaked sunken spots developing purple centers',
      'Yellow halos expanding along the length of cylindrical leaves',
      'Leaf stalk collapse causing premature foliage drying'
    ],
    organicRemedy: 'Cow urine ferment + Panchagavya (3%) spray + Bio-fertilizer foliar application every 10 days',
    chemicalRemedy: 'Difenoconazole 25% EC @ 1ml/L or Tebuconazole 25.9% EC @ 1.25ml/L',
    preventionTips: [
      'Follow 3-year crop rotation without Allium species',
      'Provide well-drained raised beds to avoid stagnant moisture around bulb neck',
      'Dip seedlings in Trichoderma suspension (10g/L) prior to transplanting'
    ],
    estimatedYieldImpact: 'Moderate: 15-25% bulb size reduction',
    urgency: 'Monitor 48h'
  },
  'healthy_crop': {
    id: 'diag_healthy_01',
    diseaseName: 'Healthy Vigor (Zero Pathogen Detected)',
    scientificName: 'Optimal Chlorophyll Index',
    affectedCrop: 'All Cultivars',
    severity: 'Healthy',
    confidencePercentage: 98.4,
    symptoms: [
      'Vibrant deep green chlorophyll coloration',
      'Clean leaf lamina without necrotic spots',
      'Strong apical shoot turgidity'
    ],
    organicRemedy: 'Maintain regular scheduled irrigation and bio-fertilizer fertigation cycle.',
    preventionTips: [
      'Continue proactive preventative neem oil sprays every 14 days',
      'Monitor weekly soil moisture telemetry'
    ],
    estimatedYieldImpact: '0% yield impact — Optimal harvest yield forecasted',
    urgency: 'Optimal Health'
  }
};

export function diagnoseCropImage(sampleKey?: string): DiseaseDiagnosticResult {
  if (sampleKey && SAMPLE_DISEASE_SCANS[sampleKey]) {
    return SAMPLE_DISEASE_SCANS[sampleKey];
  }
  return SAMPLE_DISEASE_SCANS['tomato_blight'];
}
