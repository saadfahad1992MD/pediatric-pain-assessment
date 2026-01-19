// Pharmacological Pain Management for Pediatrics
// Sources: Stanford Pediatric Pain Reference, AAP 2024, CPS 2022, WHO Guidelines

export type MedicationCategory = 
  | 'non_opioid'
  | 'opioid'
  | 'topical_local'
  | 'adjuvant'
  | 'intranasal';

export type RouteOfAdministration = 'PO' | 'IV' | 'IM' | 'PR' | 'IN' | 'SL' | 'TD' | 'Topical';

export interface DosingInfo {
  route: RouteOfAdministration;
  dose: string;
  frequency: string;
  maxDose?: string;
  notes?: string;
}

export interface MedicationInfo {
  id: string;
  name: string;
  genericName: string;
  category: MedicationCategory;
  description: string;
  ageRestrictions?: string;
  dosing: DosingInfo[];
  indications: string[];
  contraindications: string[];
  sideEffects: string[];
  precautions: string[];
  monitoring?: string[];
  evidenceLevel: 'A' | 'B' | 'C';
  evidenceSource: string;
  painLevelIndication: ('mild' | 'moderate' | 'severe')[];
  blackBoxWarning?: string;
}

export interface MedicationRecommendation {
  medication: MedicationInfo;
  rationale: string;
  priority: number;
}

// ============ NON-OPIOID ANALGESICS ============

export const NON_OPIOID_MEDICATIONS: MedicationInfo[] = [
  {
    id: 'acetaminophen',
    name: 'Acetaminophen (Paracetamol)',
    genericName: 'Acetaminophen',
    category: 'non_opioid',
    description: 'First-line analgesic and antipyretic with central mechanism of action',
    dosing: [
      { route: 'PO', dose: '10-15 mg/kg/dose', frequency: 'Q4-6h', maxDose: '75 mg/kg/day (max 4g/day)', notes: 'Infants and children' },
      { route: 'PR', dose: '15-20 mg/kg/dose', frequency: 'Q4-6h', maxDose: '75 mg/kg/day', notes: 'Rectal absorption variable' },
      { route: 'IV', dose: '15 mg/kg/dose (10-50kg)', frequency: 'Q6h', maxDose: '60 mg/kg/day (max 2g/day)', notes: '<10kg: 7.5 mg/kg Q6h' },
      { route: 'PO', dose: '10-15 mg/kg/dose', frequency: 'Q6-8h', maxDose: '40 mg/kg/day', notes: 'Neonates' }
    ],
    indications: ['Mild to moderate pain', 'Fever', 'Multimodal analgesia component'],
    contraindications: ['Severe hepatic impairment', 'Known hypersensitivity'],
    sideEffects: ['Hepatotoxicity (overdose)', 'Rare allergic reactions'],
    precautions: ['Hepatic disease', 'Chronic alcohol use', 'Malnutrition', 'G6PD deficiency (relative)'],
    monitoring: ['Liver function if prolonged use'],
    evidenceLevel: 'A',
    evidenceSource: 'AAP, CPS 2022, WHO Guidelines',
    painLevelIndication: ['mild', 'moderate']
  },
  {
    id: 'ibuprofen',
    name: 'Ibuprofen',
    genericName: 'Ibuprofen',
    category: 'non_opioid',
    description: 'NSAID with anti-inflammatory, analgesic, and antipyretic properties',
    ageRestrictions: '≥6 months',
    dosing: [
      { route: 'PO', dose: '5-10 mg/kg/dose', frequency: 'Q6-8h', maxDose: '40 mg/kg/day (max 2.4g/day)' }
    ],
    indications: ['Mild to moderate pain', 'Inflammatory pain', 'Fever', 'Musculoskeletal pain'],
    contraindications: [
      'Age <6 months',
      'Renal impairment',
      'Active GI bleeding or ulcer',
      'Aspirin/NSAID allergy',
      'Dehydration',
      'Post-tonsillectomy (increased bleeding risk)'
    ],
    sideEffects: ['GI upset', 'GI bleeding', 'Renal impairment', 'Platelet dysfunction'],
    precautions: ['Asthma', 'Coagulopathy', 'Cardiac disease', 'Concurrent anticoagulants'],
    evidenceLevel: 'A',
    evidenceSource: 'AAP, CPS 2022',
    painLevelIndication: ['mild', 'moderate']
  },
  {
    id: 'ketorolac',
    name: 'Ketorolac',
    genericName: 'Ketorolac tromethamine',
    category: 'non_opioid',
    description: 'Potent NSAID for short-term moderate to severe pain management',
    ageRestrictions: '≥2 years',
    dosing: [
      { route: 'IV', dose: '0.5 mg/kg/dose', frequency: 'Q6h', maxDose: '30 mg/dose, 5 days max', notes: '2-16 years' },
      { route: 'IM', dose: '0.5 mg/kg/dose', frequency: 'Q6h', maxDose: '30 mg/dose, 5 days max' },
      { route: 'IV', dose: '15-30 mg/dose', frequency: 'Q6h', maxDose: '120 mg/day, 5 days max', notes: '>50 kg' }
    ],
    indications: ['Moderate to severe acute pain', 'Post-operative pain', 'Opioid-sparing'],
    contraindications: [
      'Age <2 years',
      'Renal impairment',
      'Bleeding risk',
      'Post-tonsillectomy',
      'Active peptic ulcer',
      'Concurrent anticoagulants'
    ],
    sideEffects: ['GI bleeding', 'Renal impairment', 'Platelet dysfunction', 'Wound healing impairment'],
    precautions: ['Limit to 5 days maximum', 'Ensure adequate hydration'],
    evidenceLevel: 'A',
    evidenceSource: 'Stanford Pain Reference',
    painLevelIndication: ['moderate', 'severe']
  },
  {
    id: 'naproxen',
    name: 'Naproxen',
    genericName: 'Naproxen',
    category: 'non_opioid',
    description: 'Long-acting NSAID suitable for chronic pain conditions',
    ageRestrictions: '≥2 years',
    dosing: [
      { route: 'PO', dose: '5-7 mg/kg/dose', frequency: 'Q8-12h', maxDose: '20 mg/kg/day (max 1g/day)' }
    ],
    indications: ['Chronic pain', 'Inflammatory conditions', 'Juvenile arthritis', 'Dysmenorrhea'],
    contraindications: ['Age <2 years', 'Renal impairment', 'GI bleeding', 'NSAID allergy'],
    sideEffects: ['GI upset', 'GI bleeding', 'Renal effects'],
    precautions: ['Asthma', 'Cardiac disease', 'Hepatic impairment'],
    evidenceLevel: 'A',
    evidenceSource: 'AAP Guidelines',
    painLevelIndication: ['mild', 'moderate']
  }
];

// ============ OPIOID ANALGESICS ============

export const OPIOID_MEDICATIONS: MedicationInfo[] = [
  {
    id: 'morphine',
    name: 'Morphine',
    genericName: 'Morphine sulfate',
    category: 'opioid',
    description: 'Gold standard opioid for moderate to severe pain; reference standard for equianalgesic dosing',
    dosing: [
      { route: 'IV', dose: '0.05-0.1 mg/kg/dose', frequency: 'Q2-4h PRN', maxDose: '15 mg/dose (opioid-naive)', notes: 'Start low, titrate to effect' },
      { route: 'PO', dose: '0.2-0.5 mg/kg/dose', frequency: 'Q4-6h PRN', notes: 'Immediate release' },
      { route: 'IV', dose: '0.05 mg/kg/dose', frequency: 'Q4-6h', notes: 'Neonates - reduce 50% in preterm' },
      { route: 'IV', dose: '0.02 mg/kg bolus', frequency: '6-10 min lockout', notes: 'PCA: continuous 0.01-0.03 mg/kg/hr' }
    ],
    indications: ['Moderate to severe pain', 'Post-operative pain', 'Trauma', 'Cancer pain', 'Sickle cell crisis'],
    contraindications: [
      'Respiratory depression',
      'Paralytic ileus',
      'Known hypersensitivity',
      'Concurrent MAO inhibitors'
    ],
    sideEffects: ['Respiratory depression', 'Sedation', 'Nausea/vomiting', 'Pruritus', 'Constipation', 'Urinary retention'],
    precautions: [
      'Obstructive sleep apnea',
      'Obesity',
      'Neuromuscular disorders',
      'Renal impairment (active metabolites)',
      'Hepatic impairment'
    ],
    monitoring: ['Respiratory rate', 'Sedation level', 'Pain scores', 'Oxygen saturation'],
    evidenceLevel: 'A',
    evidenceSource: 'AAP 2024, WHO Guidelines',
    painLevelIndication: ['moderate', 'severe']
  },
  {
    id: 'fentanyl',
    name: 'Fentanyl',
    genericName: 'Fentanyl citrate',
    category: 'opioid',
    description: 'Potent synthetic opioid with rapid onset; preferred for procedural pain and hemodynamically unstable patients',
    dosing: [
      { route: 'IV', dose: '0.5-1 mcg/kg/dose', frequency: 'Q30-60 min PRN', notes: 'Procedural pain; onset 1-2 min' },
      { route: 'IN', dose: '1.5-2 mcg/kg/dose', frequency: 'Single dose', maxDose: '100 mcg', notes: 'Use MAD device; onset 5-10 min' },
      { route: 'SL', dose: '10-15 mcg/kg', frequency: 'PRN', notes: 'Transmucosal; breakthrough pain' }
    ],
    indications: ['Procedural pain', 'Severe acute pain', 'Hemodynamic instability', 'Renal failure (no active metabolites)'],
    contraindications: ['Respiratory depression', 'Known hypersensitivity'],
    sideEffects: ['Respiratory depression', 'Chest wall rigidity (rapid IV)', 'Bradycardia', 'Nausea'],
    precautions: [
      'Administer IV slowly to prevent chest wall rigidity',
      'Have naloxone available',
      'Monitor closely in opioid-naive patients'
    ],
    monitoring: ['Respiratory rate', 'Heart rate', 'Oxygen saturation'],
    evidenceLevel: 'A',
    evidenceSource: 'Stanford Pain Reference, AAP 2024',
    painLevelIndication: ['moderate', 'severe']
  },
  {
    id: 'hydromorphone',
    name: 'Hydromorphone',
    genericName: 'Hydromorphone HCl',
    category: 'opioid',
    description: 'Potent opioid (5x morphine); useful when morphine not tolerated',
    dosing: [
      { route: 'IV', dose: '0.015 mg/kg/dose', frequency: 'Q3-4h PRN', notes: '5x morphine potency' },
      { route: 'PO', dose: '0.03-0.08 mg/kg/dose', frequency: 'Q4-6h PRN' }
    ],
    indications: ['Moderate to severe pain', 'Morphine intolerance', 'Renal impairment (preferred over morphine)'],
    contraindications: ['Respiratory depression', 'Known hypersensitivity'],
    sideEffects: ['Respiratory depression', 'Sedation', 'Nausea', 'Pruritus', 'Constipation'],
    precautions: ['High potency - careful dose calculation', 'Opioid-naive patients'],
    monitoring: ['Respiratory rate', 'Sedation level', 'Pain scores'],
    evidenceLevel: 'A',
    evidenceSource: 'Stanford Pain Reference',
    painLevelIndication: ['moderate', 'severe']
  },
  {
    id: 'oxycodone',
    name: 'Oxycodone',
    genericName: 'Oxycodone HCl',
    category: 'opioid',
    description: 'Oral opioid for moderate to severe pain; 1.5x oral morphine potency',
    dosing: [
      { route: 'PO', dose: '0.05-0.15 mg/kg/dose', frequency: 'Q4-6h PRN', notes: 'Immediate release' }
    ],
    indications: ['Moderate to severe pain', 'Transition from IV opioids', 'Outpatient pain management'],
    contraindications: ['Respiratory depression', 'Paralytic ileus', 'Known hypersensitivity'],
    sideEffects: ['Sedation', 'Nausea', 'Constipation', 'Respiratory depression'],
    precautions: ['Prescribe limited quantities', 'Educate on safe storage'],
    evidenceLevel: 'A',
    evidenceSource: 'AAP 2024',
    painLevelIndication: ['moderate', 'severe']
  },
  {
    id: 'codeine',
    name: 'Codeine',
    genericName: 'Codeine phosphate',
    category: 'opioid',
    description: 'Prodrug requiring CYP2D6 metabolism; NOT RECOMMENDED in children <12 years',
    ageRestrictions: 'NOT recommended <12 years',
    dosing: [
      { route: 'PO', dose: 'NOT RECOMMENDED', frequency: 'N/A', notes: 'FDA Black Box Warning' }
    ],
    indications: [],
    contraindications: [
      'Age <12 years',
      'Post-tonsillectomy/adenoidectomy (any age)',
      'Known ultra-rapid CYP2D6 metabolizers',
      'Respiratory conditions'
    ],
    sideEffects: ['Respiratory depression', 'Death in ultra-rapid metabolizers'],
    precautions: ['Variable metabolism makes dosing unpredictable'],
    evidenceLevel: 'A',
    evidenceSource: 'FDA Black Box Warning, AAP',
    painLevelIndication: [],
    blackBoxWarning: 'FDA BLACK BOX WARNING: Deaths have occurred in children who received codeine following tonsillectomy/adenoidectomy. Contraindicated in children <12 years and post-tonsillectomy at any age.'
  },
  {
    id: 'tramadol',
    name: 'Tramadol',
    genericName: 'Tramadol HCl',
    category: 'opioid',
    description: 'Weak opioid with serotonin/norepinephrine reuptake inhibition; NOT RECOMMENDED in children <12 years',
    ageRestrictions: 'NOT recommended <12 years',
    dosing: [
      { route: 'PO', dose: 'NOT RECOMMENDED', frequency: 'N/A', notes: 'FDA Warning' }
    ],
    indications: [],
    contraindications: [
      'Age <12 years',
      'Post-tonsillectomy/adenoidectomy',
      'Concurrent serotonergic drugs',
      'Seizure history'
    ],
    sideEffects: ['Respiratory depression', 'Seizures', 'Serotonin syndrome'],
    precautions: ['Similar CYP2D6 concerns as codeine'],
    evidenceLevel: 'A',
    evidenceSource: 'FDA Warning, AAP',
    painLevelIndication: [],
    blackBoxWarning: 'FDA WARNING: Contraindicated in children <12 years due to risk of serious breathing problems. Similar metabolism concerns as codeine.'
  }
];

// ============ TOPICAL/LOCAL ANESTHETICS ============

export const TOPICAL_MEDICATIONS: MedicationInfo[] = [
  {
    id: 'emla',
    name: 'EMLA Cream',
    genericName: 'Lidocaine 2.5% + Prilocaine 2.5%',
    category: 'topical_local',
    description: 'Eutectic mixture providing dermal anesthesia for needle procedures',
    dosing: [
      { route: 'Topical', dose: '1-2g per 10 cm²', frequency: '60 min before procedure', maxDose: '10 cm² (0-3 mo)', notes: 'Apply with occlusive dressing' },
      { route: 'Topical', dose: '1-2g per 10 cm²', frequency: '60 min before procedure', maxDose: '20 cm² (3-12 mo)' },
      { route: 'Topical', dose: '1-2g per 10 cm²', frequency: '60 min before procedure', maxDose: '100 cm² (1-6 yr)' },
      { route: 'Topical', dose: '1-2g per 10 cm²', frequency: '60 min before procedure', maxDose: '200 cm² (7-12 yr)' }
    ],
    indications: ['IV insertion', 'Blood draws', 'Lumbar puncture', 'Minor procedures'],
    contraindications: [
      'Methemoglobinemia risk (especially <3 months)',
      'G6PD deficiency',
      'Allergy to amide local anesthetics',
      'Application to mucous membranes'
    ],
    sideEffects: ['Local skin reaction', 'Blanching', 'Methemoglobinemia (rare)'],
    precautions: ['Limit application area in young infants', 'Monitor for methemoglobinemia signs'],
    evidenceLevel: 'A',
    evidenceSource: 'CPS 2022, SickKids Comfort Promise',
    painLevelIndication: ['mild', 'moderate']
  },
  {
    id: 'lmx4',
    name: 'LMX 4%',
    genericName: 'Liposomal Lidocaine 4%',
    category: 'topical_local',
    description: 'Liposomal lidocaine cream with faster onset than EMLA',
    dosing: [
      { route: 'Topical', dose: 'Apply thick layer', frequency: '30 min before procedure', notes: 'No occlusive dressing required' }
    ],
    indications: ['IV insertion', 'Blood draws', 'Minor procedures'],
    contraindications: ['Allergy to lidocaine', 'Broken skin'],
    sideEffects: ['Local skin reaction', 'Erythema'],
    precautions: ['For intact skin only'],
    evidenceLevel: 'A',
    evidenceSource: 'Clinical Studies',
    painLevelIndication: ['mild', 'moderate']
  },
  {
    id: 'jtip',
    name: 'J-Tip (Needle-free Lidocaine)',
    genericName: 'Buffered Lidocaine 1%',
    category: 'topical_local',
    description: 'Needle-free jet injection system for rapid local anesthesia',
    dosing: [
      { route: 'Topical', dose: '0.2-0.5 mL', frequency: 'Immediately before procedure', notes: 'Onset 1-3 minutes; depth 5-8mm' }
    ],
    indications: ['IV insertion', 'Blood draws', 'When rapid anesthesia needed'],
    contraindications: ['Lidocaine allergy', 'Infected skin'],
    sideEffects: ['Brief stinging sensation', 'Local erythema'],
    precautions: ['May cause brief discomfort on administration'],
    evidenceLevel: 'B',
    evidenceSource: 'Clinical Studies',
    painLevelIndication: ['mild']
  },
  {
    id: 'vapocoolant',
    name: 'Vapocoolant Spray',
    genericName: 'Ethyl Chloride or Alkane mixture',
    category: 'topical_local',
    description: 'Rapid-acting topical anesthetic through skin cooling',
    dosing: [
      { route: 'Topical', dose: 'Spray 3-7 seconds', frequency: 'Immediately before procedure', notes: 'Onset immediate; duration seconds' }
    ],
    indications: ['Needle procedures', 'When no time for topical cream'],
    contraindications: ['Cold sensitivity', 'Raynaud disease'],
    sideEffects: ['Temporary skin blanching', 'Brief stinging'],
    precautions: ['Very brief duration - proceed immediately'],
    evidenceLevel: 'B',
    evidenceSource: 'Clinical Studies',
    painLevelIndication: ['mild']
  }
];

// ============ ADJUVANT MEDICATIONS ============

export const ADJUVANT_MEDICATIONS: MedicationInfo[] = [
  {
    id: 'gabapentin',
    name: 'Gabapentin',
    genericName: 'Gabapentin',
    category: 'adjuvant',
    description: 'Anticonvulsant used for neuropathic and chronic pain',
    ageRestrictions: '≥3 years for pain',
    dosing: [
      { route: 'PO', dose: '5 mg/kg/day', frequency: 'Divided TID', maxDose: '50 mg/kg/day (max 3600 mg)', notes: 'Start low, titrate over 3-7 days' }
    ],
    indications: ['Neuropathic pain', 'Chronic pain syndromes', 'Phantom limb pain', 'Complex regional pain syndrome'],
    contraindications: ['Known hypersensitivity'],
    sideEffects: ['Sedation', 'Dizziness', 'Ataxia', 'Peripheral edema'],
    precautions: ['Renal dose adjustment', 'Taper to discontinue'],
    evidenceLevel: 'B',
    evidenceSource: 'IASP Guidelines',
    painLevelIndication: ['moderate', 'severe']
  },
  {
    id: 'amitriptyline',
    name: 'Amitriptyline',
    genericName: 'Amitriptyline HCl',
    category: 'adjuvant',
    description: 'Tricyclic antidepressant for neuropathic and chronic pain',
    ageRestrictions: '≥6 years',
    dosing: [
      { route: 'PO', dose: '0.1 mg/kg at bedtime', frequency: 'Once daily', maxDose: '1 mg/kg/day (max 75 mg)', notes: 'Start low, titrate slowly' }
    ],
    indications: ['Neuropathic pain', 'Chronic headaches', 'Fibromyalgia', 'Functional abdominal pain'],
    contraindications: ['Recent MI', 'Concurrent MAO inhibitors', 'Arrhythmias'],
    sideEffects: ['Sedation', 'Dry mouth', 'Constipation', 'QT prolongation', 'Weight gain'],
    precautions: ['ECG before starting', 'Monitor for suicidal ideation'],
    monitoring: ['ECG', 'Mental status'],
    evidenceLevel: 'B',
    evidenceSource: 'IASP Guidelines',
    painLevelIndication: ['moderate', 'severe']
  },
  {
    id: 'ketamine_low',
    name: 'Ketamine (Low-dose Adjuvant)',
    genericName: 'Ketamine HCl',
    category: 'adjuvant',
    description: 'NMDA antagonist providing opioid-sparing analgesia at sub-anesthetic doses',
    dosing: [
      { route: 'IV', dose: '0.1-0.3 mg/kg', frequency: 'Single dose or infusion', notes: 'Opioid-sparing; sub-anesthetic' },
      { route: 'IV', dose: '0.1-0.2 mg/kg/hr', frequency: 'Continuous infusion', notes: 'For opioid-tolerant patients' }
    ],
    indications: ['Opioid-tolerant patients', 'Opioid-sparing', 'Neuropathic pain', 'Sickle cell crisis'],
    contraindications: ['Uncontrolled hypertension', 'Increased ICP', 'Psychosis history'],
    sideEffects: ['Dysphoria', 'Hallucinations', 'Hypertension', 'Hypersalivation'],
    precautions: ['Monitor for emergence reactions', 'Have benzodiazepine available'],
    evidenceLevel: 'B',
    evidenceSource: 'Stanford Pain Reference',
    painLevelIndication: ['moderate', 'severe']
  },
  {
    id: 'clonidine',
    name: 'Clonidine',
    genericName: 'Clonidine HCl',
    category: 'adjuvant',
    description: 'Alpha-2 agonist providing analgesia, sedation, and anxiolysis',
    dosing: [
      { route: 'PO', dose: '1-5 mcg/kg/dose', frequency: 'Q6-8h', maxDose: '10 mcg/kg/day' },
      { route: 'TD', dose: '0.1-0.3 mg patch', frequency: 'Weekly', notes: 'For chronic pain/opioid withdrawal' }
    ],
    indications: ['Adjuvant analgesia', 'Opioid withdrawal', 'Anxiety', 'Sleep disturbance'],
    contraindications: ['Hypotension', 'Bradycardia', 'Heart block'],
    sideEffects: ['Hypotension', 'Bradycardia', 'Sedation', 'Dry mouth'],
    precautions: ['Monitor BP and HR', 'Taper to discontinue'],
    evidenceLevel: 'B',
    evidenceSource: 'Clinical Guidelines',
    painLevelIndication: ['mild', 'moderate']
  },
  {
    id: 'dexmedetomidine',
    name: 'Dexmedetomidine',
    genericName: 'Dexmedetomidine HCl',
    category: 'adjuvant',
    description: 'Selective alpha-2 agonist for sedation and analgesia without respiratory depression',
    dosing: [
      { route: 'IV', dose: '0.5-1 mcg/kg', frequency: 'Over 10 min, then 0.2-0.7 mcg/kg/hr', notes: 'Procedural sedation' },
      { route: 'IN', dose: '2-3 mcg/kg', frequency: 'Single dose', notes: 'Onset 25-45 min; anxiolysis/sedation' }
    ],
    indications: ['Procedural sedation', 'ICU sedation', 'Anxiolysis', 'Opioid-sparing'],
    contraindications: ['Heart block', 'Severe bradycardia'],
    sideEffects: ['Bradycardia', 'Hypotension', 'Transient hypertension'],
    precautions: ['Cardiac monitoring required', 'Avoid rapid bolus'],
    monitoring: ['Continuous cardiac monitoring', 'Blood pressure'],
    evidenceLevel: 'A',
    evidenceSource: 'Stanford Pain Reference',
    painLevelIndication: ['mild', 'moderate']
  }
];

// ============ INTRANASAL MEDICATIONS ============

export const INTRANASAL_MEDICATIONS: MedicationInfo[] = [
  {
    id: 'fentanyl_in',
    name: 'Intranasal Fentanyl',
    genericName: 'Fentanyl citrate',
    category: 'intranasal',
    description: 'Rapid-acting opioid via nasal mucosa; ideal for acute pain without IV access',
    dosing: [
      { route: 'IN', dose: '1.5-2 mcg/kg', frequency: 'Single dose', maxDose: '100 mcg', notes: 'Use MAD device; onset 5-10 min' }
    ],
    indications: ['Acute severe pain', 'Fractures', 'Burns', 'No IV access', 'Emergency department'],
    contraindications: ['Nasal obstruction', 'Epistaxis', 'Respiratory depression'],
    sideEffects: ['Nasal irritation', 'Sedation', 'Nausea', 'Respiratory depression'],
    precautions: ['Maximum 0.3-0.5 mL per nostril', 'Split dose between nostrils if volume >0.5 mL'],
    monitoring: ['Respiratory rate', 'Sedation level', 'Oxygen saturation'],
    evidenceLevel: 'A',
    evidenceSource: 'Emergency Medicine Guidelines',
    painLevelIndication: ['moderate', 'severe']
  },
  {
    id: 'ketamine_in',
    name: 'Intranasal Ketamine',
    genericName: 'Ketamine HCl',
    category: 'intranasal',
    description: 'Dissociative anesthetic/analgesic via nasal route for procedural sedation',
    dosing: [
      { route: 'IN', dose: '0.5-1 mg/kg', frequency: 'Single dose', notes: 'Onset 5-15 min; procedural sedation/analgesia' }
    ],
    indications: ['Procedural sedation', 'Acute pain', 'Anxiolysis', 'Fracture reduction'],
    contraindications: ['Age <3 months', 'Increased ICP', 'Psychosis'],
    sideEffects: ['Emergence reactions', 'Hypersalivation', 'Nausea', 'Nystagmus'],
    precautions: ['Have suction available', 'Monitor for emergence reactions'],
    evidenceLevel: 'B',
    evidenceSource: 'Emergency Medicine Guidelines',
    painLevelIndication: ['moderate', 'severe']
  }
];

// ============ OPIOID REVERSAL ============

export const REVERSAL_MEDICATIONS: MedicationInfo[] = [
  {
    id: 'naloxone',
    name: 'Naloxone',
    genericName: 'Naloxone HCl',
    category: 'adjuvant',
    description: 'Opioid antagonist for reversal of opioid-induced respiratory depression',
    dosing: [
      { route: 'IV', dose: '0.01 mg/kg', frequency: 'Q2-3 min PRN', notes: 'Titrate for respiratory depression' },
      { route: 'IV', dose: '0.1 mg/kg', frequency: 'Single dose', maxDose: '2 mg', notes: 'Complete reversal' },
      { route: 'IM', dose: '0.1 mg/kg', frequency: 'Single dose', notes: 'If no IV access' },
      { route: 'IN', dose: '0.1 mg/kg', frequency: 'Single dose', maxDose: '2 mg', notes: 'Emergency use' }
    ],
    indications: ['Opioid-induced respiratory depression', 'Opioid overdose'],
    contraindications: ['Known hypersensitivity'],
    sideEffects: ['Acute withdrawal', 'Hypertension', 'Tachycardia', 'Pulmonary edema'],
    precautions: ['May precipitate withdrawal', 'Short duration - may need repeat dosing', 'Monitor for resedation'],
    monitoring: ['Respiratory rate', 'Sedation level', 'Vital signs'],
    evidenceLevel: 'A',
    evidenceSource: 'AAP, Emergency Guidelines',
    painLevelIndication: []
  }
];

// ============ SIDE EFFECT MANAGEMENT ============

export const SIDE_EFFECT_MANAGEMENT = {
  nausea: {
    medication: 'Ondansetron',
    dose: '0.1-0.15 mg/kg IV/PO',
    maxDose: '4 mg',
    frequency: 'Q8h PRN'
  },
  pruritus: {
    medications: [
      { name: 'Nalbuphine', dose: '0.05 mg/kg IV', notes: 'Opioid agonist-antagonist' },
      { name: 'Diphenhydramine', dose: '1 mg/kg IV/PO', maxDose: '50 mg', notes: 'May increase sedation' }
    ]
  },
  constipation: {
    medications: [
      { name: 'Docusate', dose: 'Age-appropriate', notes: 'Stool softener' },
      { name: 'Senna', dose: 'Age-appropriate', notes: 'Stimulant laxative' },
      { name: 'Polyethylene glycol (PEG)', dose: '0.5-1 g/kg/day', notes: 'Osmotic laxative' }
    ]
  }
};

// ============ WHO ANALGESIC LADDER ============

export const WHO_LADDER = {
  step1: {
    name: 'Mild Pain (1-3/10)',
    medications: ['acetaminophen', 'ibuprofen', 'naproxen'],
    description: 'Non-opioid analgesics ± adjuvants',
    nonPharmacological: true
  },
  step2: {
    name: 'Moderate Pain (4-6/10)',
    medications: ['acetaminophen', 'ibuprofen', 'morphine', 'oxycodone'],
    description: 'Non-opioids + low-dose opioids ± adjuvants',
    nonPharmacological: true
  },
  step3: {
    name: 'Severe Pain (7-10/10)',
    medications: ['morphine', 'fentanyl', 'hydromorphone'],
    description: 'Strong opioids + non-opioids ± adjuvants',
    nonPharmacological: true
  }
};

// ============ HELPER FUNCTIONS ============

export function getAllMedications(): MedicationInfo[] {
  return [
    ...NON_OPIOID_MEDICATIONS,
    ...OPIOID_MEDICATIONS,
    ...TOPICAL_MEDICATIONS,
    ...ADJUVANT_MEDICATIONS,
    ...INTRANASAL_MEDICATIONS,
    ...REVERSAL_MEDICATIONS
  ];
}

export function getMedicationsByCategory(category: MedicationCategory): MedicationInfo[] {
  return getAllMedications().filter(med => med.category === category);
}

export function getMedicationById(id: string): MedicationInfo | undefined {
  return getAllMedications().find(med => med.id === id);
}

export function getRecommendedMedications(
  painLevel: 'mild' | 'moderate' | 'severe',
  ageInYears: number
): MedicationRecommendation[] {
  const recommendations: MedicationRecommendation[] = [];
  const allMeds = getAllMedications();
  
  for (const med of allMeds) {
    // Skip medications with age restrictions
    if (med.ageRestrictions) {
      if (med.ageRestrictions.includes('NOT recommended')) continue;
      const minAge = parseInt(med.ageRestrictions.match(/≥(\d+)/)?.[1] || '0');
      if (ageInYears < minAge) continue;
    }
    
    // Skip medications not indicated for this pain level
    if (!med.painLevelIndication.includes(painLevel)) continue;
    
    // Skip codeine and tramadol for children
    if ((med.id === 'codeine' || med.id === 'tramadol') && ageInYears < 12) continue;
    
    let priority = 10;
    let rationale = '';
    
    // Prioritize based on pain level and medication type
    if (painLevel === 'mild') {
      if (med.category === 'non_opioid') {
        priority = 1;
        rationale = 'First-line for mild pain';
      } else if (med.category === 'topical_local') {
        priority = 2;
        rationale = 'Useful for procedural pain';
      }
    } else if (painLevel === 'moderate') {
      if (med.category === 'non_opioid') {
        priority = 1;
        rationale = 'Start with non-opioids';
      } else if (med.category === 'opioid' && med.evidenceLevel === 'A') {
        priority = 2;
        rationale = 'Add if non-opioids insufficient';
      }
    } else if (painLevel === 'severe') {
      if (med.category === 'opioid' && med.evidenceLevel === 'A') {
        priority = 1;
        rationale = 'First-line for severe pain';
      } else if (med.category === 'non_opioid') {
        priority = 2;
        rationale = 'Use in combination for multimodal analgesia';
      }
    }
    
    recommendations.push({
      medication: med,
      rationale,
      priority
    });
  }
  
  return recommendations.sort((a, b) => a.priority - b.priority);
}

export function getMedicationCategoryLabel(category: MedicationCategory): string {
  const labels: Record<MedicationCategory, string> = {
    non_opioid: 'Non-Opioid Analgesics',
    opioid: 'Opioid Analgesics',
    topical_local: 'Topical & Local Anesthetics',
    adjuvant: 'Adjuvant Medications',
    intranasal: 'Intranasal Medications'
  };
  return labels[category];
}
