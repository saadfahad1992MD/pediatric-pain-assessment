// Pain Scale Types and Constants

export type PainScaleType = 'pipp_r' | 'flacc' | 'wong_baker' | 'cheops' | 'nips' | 'vas';

export type PainLevel = 'none' | 'mild' | 'moderate' | 'severe';

export type AssessmentContext = 
  | 'routine' 
  | 'pre_procedure' 
  | 'during_procedure' 
  | 'post_procedure' 
  | 'post_operative' 
  | 'medication_evaluation' 
  | 'comfort_check' 
  | 'other';

export type InterventionType = 
  | 'sucrose' 
  | 'skin_to_skin' 
  | 'breastfeeding' 
  | 'non_nutritive_sucking'
  | 'swaddling' 
  | 'positioning' 
  | 'distraction_visual' 
  | 'distraction_auditory'
  | 'comfort_holding' 
  | 'reduced_stimulation' 
  | 'topical_anesthetic' 
  | 'other';

export interface PainScaleInfo {
  id: PainScaleType;
  name: string;
  fullName: string;
  ageRange: string;
  ageRangeDescription: string;
  minAge: number; // in days, -1 for gestational
  maxAge: number; // in days
  gestationalWeeksMax?: number; // for PIPP-R
  type: 'behavioral' | 'self_report' | 'hybrid';
  maxScore: number;
  description: string;
  useCase: string;
  components: PainScaleComponent[];
  scoringGuide: ScoringThreshold[];
}

export interface PainScaleComponent {
  id: string;
  name: string;
  description: string;
  options: ComponentOption[];
}

export interface ComponentOption {
  value: number;
  label: string;
  description: string;
}

export interface ScoringThreshold {
  minScore: number;
  maxScore: number;
  level: PainLevel;
  description: string;
  color: string;
}

export interface InterventionInfo {
  id: InterventionType;
  name: string;
  description: string;
  ageAppropriate: string[];
  evidenceLevel: 'A' | 'B' | 'C';
  instructions: string[];
  contraindications?: string[];
}

// ============ PAIN SCALE DEFINITIONS ============

export const PAIN_SCALES: Record<PainScaleType, PainScaleInfo> = {
  pipp_r: {
    id: 'pipp_r',
    name: 'PIPP-R',
    fullName: 'Premature Infant Pain Profile - Revised',
    ageRange: '≤48 weeks PMA',
    ageRangeDescription: 'Neonates up to 48 weeks post-menstrual age (approximately 2 months corrected age)',
    minAge: -1,
    maxAge: 60, // ~2 months
    gestationalWeeksMax: 48,
    type: 'behavioral',
    maxScore: 21,
    description: 'A bio-behavioral observational tool for acute and procedural pain in premature and term neonates.',
    useCase: 'Best for NICU patients, procedural pain assessment in neonates',
    components: [
      {
        id: 'gestational_age',
        name: 'Gestational Age',
        description: 'Gestational age at birth',
        options: [
          { value: 0, label: '≥36 weeks', description: 'Term or near-term infant' },
          { value: 1, label: '32-35 weeks 6 days', description: 'Moderate preterm' },
          { value: 2, label: '28-31 weeks 6 days', description: 'Very preterm' },
          { value: 3, label: '<28 weeks', description: 'Extremely preterm' }
        ]
      },
      {
        id: 'behavioral_state',
        name: 'Behavioral State',
        description: 'Baseline behavioral state before procedure',
        options: [
          { value: 0, label: 'Active/Awake, eyes open, facial movements', description: 'Alert and active' },
          { value: 1, label: 'Quiet/Awake, eyes open, no facial movements', description: 'Calm and alert' },
          { value: 2, label: 'Active/Sleep, eyes closed, facial movements', description: 'Active sleep' },
          { value: 3, label: 'Quiet/Sleep, eyes closed, no facial movements', description: 'Deep sleep' }
        ]
      },
      {
        id: 'heart_rate_max',
        name: 'Maximum Heart Rate',
        description: 'Maximum heart rate increase from baseline',
        options: [
          { value: 0, label: '0-4 bpm increase', description: 'Minimal change' },
          { value: 1, label: '5-14 bpm increase', description: 'Slight increase' },
          { value: 2, label: '15-24 bpm increase', description: 'Moderate increase' },
          { value: 3, label: '≥25 bpm increase', description: 'Significant increase' }
        ]
      },
      {
        id: 'oxygen_saturation',
        name: 'Oxygen Saturation',
        description: 'Minimum oxygen saturation decrease from baseline',
        options: [
          { value: 0, label: '0-2.4% decrease', description: 'Minimal change' },
          { value: 1, label: '2.5-4.9% decrease', description: 'Slight decrease' },
          { value: 2, label: '5.0-7.4% decrease', description: 'Moderate decrease' },
          { value: 3, label: '≥7.5% decrease', description: 'Significant decrease' }
        ]
      },
      {
        id: 'brow_bulge',
        name: 'Brow Bulge',
        description: 'Duration of brow bulge during observation',
        options: [
          { value: 0, label: 'None (0-9% of time)', description: 'Absent or minimal' },
          { value: 1, label: 'Minimum (10-39% of time)', description: 'Occasional' },
          { value: 2, label: 'Moderate (40-69% of time)', description: 'Frequent' },
          { value: 3, label: 'Maximum (≥70% of time)', description: 'Persistent' }
        ]
      },
      {
        id: 'eye_squeeze',
        name: 'Eye Squeeze',
        description: 'Duration of eye squeeze during observation',
        options: [
          { value: 0, label: 'None (0-9% of time)', description: 'Absent or minimal' },
          { value: 1, label: 'Minimum (10-39% of time)', description: 'Occasional' },
          { value: 2, label: 'Moderate (40-69% of time)', description: 'Frequent' },
          { value: 3, label: 'Maximum (≥70% of time)', description: 'Persistent' }
        ]
      },
      {
        id: 'nasolabial_furrow',
        name: 'Nasolabial Furrow',
        description: 'Duration of nasolabial furrow during observation',
        options: [
          { value: 0, label: 'None (0-9% of time)', description: 'Absent or minimal' },
          { value: 1, label: 'Minimum (10-39% of time)', description: 'Occasional' },
          { value: 2, label: 'Moderate (40-69% of time)', description: 'Frequent' },
          { value: 3, label: 'Maximum (≥70% of time)', description: 'Persistent' }
        ]
      }
    ],
    scoringGuide: [
      { minScore: 0, maxScore: 6, level: 'none', description: 'No pain or minimal pain', color: '#22c55e' },
      { minScore: 7, maxScore: 12, level: 'mild', description: 'Mild pain - consider comfort measures', color: '#eab308' },
      { minScore: 13, maxScore: 17, level: 'moderate', description: 'Moderate pain - intervention recommended', color: '#f97316' },
      { minScore: 18, maxScore: 21, level: 'severe', description: 'Severe pain - immediate intervention required', color: '#ef4444' }
    ]
  },
  
  flacc: {
    id: 'flacc',
    name: 'FLACC',
    fullName: 'Face, Legs, Activity, Cry, Consolability',
    ageRange: '2 months - 7 years',
    ageRangeDescription: 'Infants and children from 2 months to 7 years, or non-verbal patients',
    minAge: 60,
    maxAge: 2555, // ~7 years
    type: 'behavioral',
    maxScore: 10,
    description: 'A behavioral observational scale for scoring postoperative and procedural pain in young children.',
    useCase: 'Ideal for post-operative pain, procedural pain, and non-verbal children',
    components: [
      {
        id: 'face',
        name: 'Face',
        description: 'Facial expression',
        options: [
          { value: 0, label: 'No particular expression or smile', description: 'Relaxed face' },
          { value: 1, label: 'Occasional grimace or frown, withdrawn, disinterested', description: 'Occasional discomfort' },
          { value: 2, label: 'Frequent to constant frown, clenched jaw, quivering chin', description: 'Persistent pain expression' }
        ]
      },
      {
        id: 'legs',
        name: 'Legs',
        description: 'Leg position and movement',
        options: [
          { value: 0, label: 'Normal position or relaxed', description: 'Relaxed legs' },
          { value: 1, label: 'Uneasy, restless, tense', description: 'Some tension' },
          { value: 2, label: 'Kicking or legs drawn up', description: 'Significant distress' }
        ]
      },
      {
        id: 'activity',
        name: 'Activity',
        description: 'Body activity and position',
        options: [
          { value: 0, label: 'Lying quietly, normal position, moves easily', description: 'Comfortable' },
          { value: 1, label: 'Squirming, shifting back and forth, tense', description: 'Restless' },
          { value: 2, label: 'Arched, rigid, or jerking', description: 'Severe distress' }
        ]
      },
      {
        id: 'cry',
        name: 'Cry',
        description: 'Crying behavior',
        options: [
          { value: 0, label: 'No cry (awake or asleep)', description: 'Not crying' },
          { value: 1, label: 'Moans or whimpers, occasional complaint', description: 'Mild distress' },
          { value: 2, label: 'Crying steadily, screams or sobs, frequent complaints', description: 'Significant distress' }
        ]
      },
      {
        id: 'consolability',
        name: 'Consolability',
        description: 'Response to comfort measures',
        options: [
          { value: 0, label: 'Content, relaxed', description: 'Easily consoled' },
          { value: 1, label: 'Reassured by occasional touching, hugging, or being talked to; distractible', description: 'Can be consoled' },
          { value: 2, label: 'Difficult to console or comfort', description: 'Inconsolable' }
        ]
      }
    ],
    scoringGuide: [
      { minScore: 0, maxScore: 0, level: 'none', description: 'Relaxed and comfortable', color: '#22c55e' },
      { minScore: 1, maxScore: 3, level: 'mild', description: 'Mild discomfort', color: '#eab308' },
      { minScore: 4, maxScore: 6, level: 'moderate', description: 'Moderate pain', color: '#f97316' },
      { minScore: 7, maxScore: 10, level: 'severe', description: 'Severe discomfort/pain', color: '#ef4444' }
    ]
  },
  
  wong_baker: {
    id: 'wong_baker',
    name: 'Wong-Baker FACES',
    fullName: 'Wong-Baker FACES Pain Rating Scale',
    ageRange: '3+ years',
    ageRangeDescription: 'Children 3 years and older who can self-report',
    minAge: 1095, // ~3 years
    maxAge: 6570, // ~18 years
    type: 'self_report',
    maxScore: 10,
    description: 'A self-assessment tool using cartoon faces to help children communicate about their pain.',
    useCase: 'Self-report for verbal children who can understand and choose a face',
    components: [
      {
        id: 'pain_face',
        name: 'Pain Level',
        description: 'Ask the child to choose the face that best describes how they feel',
        options: [
          { value: 0, label: 'No Hurt', description: 'Happy face - no pain at all' },
          { value: 2, label: 'Hurts Little Bit', description: 'Slight discomfort' },
          { value: 4, label: 'Hurts Little More', description: 'Noticeable pain' },
          { value: 6, label: 'Hurts Even More', description: 'Significant pain' },
          { value: 8, label: 'Hurts Whole Lot', description: 'Very bad pain' },
          { value: 10, label: 'Hurts Worst', description: 'Worst possible pain' }
        ]
      }
    ],
    scoringGuide: [
      { minScore: 0, maxScore: 0, level: 'none', description: 'No pain', color: '#22c55e' },
      { minScore: 1, maxScore: 4, level: 'mild', description: 'Mild pain', color: '#eab308' },
      { minScore: 5, maxScore: 6, level: 'moderate', description: 'Moderate pain', color: '#f97316' },
      { minScore: 7, maxScore: 10, level: 'severe', description: 'Severe pain', color: '#ef4444' }
    ]
  },
  
  cheops: {
    id: 'cheops',
    name: 'CHEOPS',
    fullName: "Children's Hospital of Eastern Ontario Pain Scale",
    ageRange: '1-7 years',
    ageRangeDescription: 'Children 1 to 7 years old, primarily for postoperative pain',
    minAge: 365,
    maxAge: 2555,
    type: 'behavioral',
    maxScore: 13,
    description: 'A behavioral scale for evaluating postoperative pain in young children.',
    useCase: 'Post-operative pain assessment, monitoring intervention effectiveness',
    components: [
      {
        id: 'cry',
        name: 'Cry',
        description: 'Crying behavior',
        options: [
          { value: 1, label: 'No cry', description: 'Child is not crying' },
          { value: 2, label: 'Moaning', description: 'Child is moaning or quietly vocalizing' },
          { value: 2, label: 'Crying', description: 'Child is crying but not screaming' },
          { value: 3, label: 'Screaming', description: 'Child is screaming or sobbing' }
        ]
      },
      {
        id: 'facial',
        name: 'Facial Expression',
        description: 'Facial expression',
        options: [
          { value: 0, label: 'Smiling', description: 'Positive facial expression' },
          { value: 1, label: 'Composed', description: 'Neutral, calm expression' },
          { value: 2, label: 'Grimace', description: 'Negative facial expression, frown, grimace' }
        ]
      },
      {
        id: 'verbal',
        name: 'Child Verbal',
        description: 'What the child says',
        options: [
          { value: 0, label: 'Positive', description: 'Child says positive things or talks about other things' },
          { value: 1, label: 'None', description: 'Child is not talking' },
          { value: 1, label: 'Other complaints', description: 'Child complains but not about pain' },
          { value: 2, label: 'Pain complaints', description: 'Child complains about pain' },
          { value: 2, label: 'Both complaints', description: 'Child complains about pain and other things' }
        ]
      },
      {
        id: 'torso',
        name: 'Torso',
        description: 'Body position',
        options: [
          { value: 1, label: 'Neutral', description: 'Body is at rest, trunk is inactive' },
          { value: 2, label: 'Shifting', description: 'Body is in motion in a shifting or serpentine fashion' },
          { value: 2, label: 'Tense', description: 'Body is arched or rigid' },
          { value: 2, label: 'Shivering', description: 'Body is shuddering or shaking' },
          { value: 2, label: 'Upright', description: 'Child is in a vertical or upright position' },
          { value: 2, label: 'Restrained', description: 'Body is restrained' }
        ]
      },
      {
        id: 'touch',
        name: 'Touch',
        description: 'Child touching wound or affected area',
        options: [
          { value: 1, label: 'Not touching', description: 'Child is not touching or grabbing at wound' },
          { value: 2, label: 'Reach', description: 'Child is reaching for but not touching wound' },
          { value: 2, label: 'Touch', description: 'Child is gently touching wound or wound area' },
          { value: 2, label: 'Grab', description: 'Child is grabbing vigorously at wound' },
          { value: 2, label: 'Restrained', description: 'Child\'s arms are restrained' }
        ]
      },
      {
        id: 'legs',
        name: 'Legs',
        description: 'Leg position',
        options: [
          { value: 1, label: 'Neutral', description: 'Legs may be in any position but are relaxed' },
          { value: 2, label: 'Squirming/kicking', description: 'Definitive uneasy or restless movements' },
          { value: 2, label: 'Drawn up/tensed', description: 'Legs tensed and/or pulled up tightly to body' },
          { value: 2, label: 'Standing', description: 'Standing, crouching, or kneeling' },
          { value: 2, label: 'Restrained', description: 'Child\'s legs are restrained' }
        ]
      }
    ],
    scoringGuide: [
      { minScore: 4, maxScore: 4, level: 'none', description: 'No pain', color: '#22c55e' },
      { minScore: 5, maxScore: 7, level: 'mild', description: 'Mild pain', color: '#eab308' },
      { minScore: 8, maxScore: 10, level: 'moderate', description: 'Moderate pain', color: '#f97316' },
      { minScore: 11, maxScore: 13, level: 'severe', description: 'Severe pain', color: '#ef4444' }
    ]
  },
  
  nips: {
    id: 'nips',
    name: 'NIPS',
    fullName: 'Neonatal/Infant Pain Scale',
    ageRange: '0-12 months',
    ageRangeDescription: 'Neonates and infants less than 1 year of age',
    minAge: 0,
    maxAge: 365,
    type: 'behavioral',
    maxScore: 7,
    description: 'A behavioral assessment tool for pain in preterm and full-term neonates.',
    useCase: 'Procedural pain assessment in neonates and young infants',
    components: [
      {
        id: 'facial_expression',
        name: 'Facial Expression',
        description: 'Observe facial expression',
        options: [
          { value: 0, label: 'Relaxed muscles', description: 'Restful face, neutral expression' },
          { value: 1, label: 'Grimace', description: 'Tight facial muscles, furrowed brow, chin, jaw' }
        ]
      },
      {
        id: 'cry',
        name: 'Cry',
        description: 'Crying behavior',
        options: [
          { value: 0, label: 'No cry', description: 'Quiet, not crying' },
          { value: 1, label: 'Whimper', description: 'Mild moaning, intermittent' },
          { value: 2, label: 'Vigorous cry', description: 'Loud scream, rising, shrill, continuous' }
        ]
      },
      {
        id: 'breathing_patterns',
        name: 'Breathing Patterns',
        description: 'Breathing pattern',
        options: [
          { value: 0, label: 'Relaxed', description: 'Usual pattern for infant' },
          { value: 1, label: 'Change in breathing', description: 'Irregular, faster than usual, gagging, breath holding' }
        ]
      },
      {
        id: 'arms',
        name: 'Arms',
        description: 'Arm movement',
        options: [
          { value: 0, label: 'Relaxed/Restrained', description: 'No muscular rigidity, occasional random movements' },
          { value: 1, label: 'Flexed/Extended', description: 'Tense, straight arms, rigid, rapid extension/flexion' }
        ]
      },
      {
        id: 'legs',
        name: 'Legs',
        description: 'Leg movement',
        options: [
          { value: 0, label: 'Relaxed/Restrained', description: 'No muscular rigidity, occasional random movements' },
          { value: 1, label: 'Flexed/Extended', description: 'Tense, straight legs, rigid, rapid extension/flexion' }
        ]
      },
      {
        id: 'state_of_arousal',
        name: 'State of Arousal',
        description: 'Arousal state',
        options: [
          { value: 0, label: 'Sleeping/Awake', description: 'Quiet, peaceful, sleeping or alert and settled' },
          { value: 1, label: 'Fussy', description: 'Alert, restless, thrashing' }
        ]
      }
    ],
    scoringGuide: [
      { minScore: 0, maxScore: 2, level: 'none', description: 'No pain to mild discomfort', color: '#22c55e' },
      { minScore: 3, maxScore: 4, level: 'mild', description: 'Mild to moderate pain', color: '#eab308' },
      { minScore: 5, maxScore: 6, level: 'moderate', description: 'Moderate pain', color: '#f97316' },
      { minScore: 7, maxScore: 7, level: 'severe', description: 'Severe pain', color: '#ef4444' }
    ]
  },
  
  vas: {
    id: 'vas',
    name: 'VAS',
    fullName: 'Visual Analogue Scale',
    ageRange: '8+ years',
    ageRangeDescription: 'Older children and adolescents who can understand the concept',
    minAge: 2920, // ~8 years
    maxAge: 6570, // ~18 years
    type: 'self_report',
    maxScore: 10,
    description: 'A 10cm line where the patient marks their pain level.',
    useCase: 'Self-report for older children and adolescents',
    components: [
      {
        id: 'pain_level',
        name: 'Pain Level',
        description: 'Mark on the line where your pain is',
        options: [
          { value: 0, label: '0', description: 'No pain' },
          { value: 1, label: '1', description: 'Very mild' },
          { value: 2, label: '2', description: 'Mild' },
          { value: 3, label: '3', description: 'Mild-moderate' },
          { value: 4, label: '4', description: 'Moderate' },
          { value: 5, label: '5', description: 'Moderate' },
          { value: 6, label: '6', description: 'Moderate-severe' },
          { value: 7, label: '7', description: 'Severe' },
          { value: 8, label: '8', description: 'Very severe' },
          { value: 9, label: '9', description: 'Very severe' },
          { value: 10, label: '10', description: 'Worst possible pain' }
        ]
      }
    ],
    scoringGuide: [
      { minScore: 0, maxScore: 0, level: 'none', description: 'No pain', color: '#22c55e' },
      { minScore: 1, maxScore: 3, level: 'mild', description: 'Mild pain', color: '#eab308' },
      { minScore: 4, maxScore: 6, level: 'moderate', description: 'Moderate pain', color: '#f97316' },
      { minScore: 7, maxScore: 10, level: 'severe', description: 'Severe pain', color: '#ef4444' }
    ]
  }
};

// ============ INTERVENTIONS ============

export const INTERVENTIONS: Record<InterventionType, InterventionInfo> = {
  sucrose: {
    id: 'sucrose',
    name: 'Oral Sucrose',
    description: 'Sweet solution given orally 2 minutes before procedure',
    ageAppropriate: ['neonate', 'infant'],
    evidenceLevel: 'A',
    instructions: [
      'Administer 0.1-0.5 mL of 24% sucrose solution',
      'Give 2 minutes before the painful procedure',
      'Allow infant to suck on pacifier if available',
      'Can repeat dose during prolonged procedures'
    ],
    contraindications: ['NPO status', 'Suspected NEC', 'Fructose intolerance']
  },
  skin_to_skin: {
    id: 'skin_to_skin',
    name: 'Skin-to-Skin Contact',
    description: 'Kangaroo care with parent during or after procedure',
    ageAppropriate: ['neonate', 'infant'],
    evidenceLevel: 'A',
    instructions: [
      'Place infant in diaper only on parent\'s bare chest',
      'Cover with warm blanket',
      'Maintain position for at least 15 minutes before procedure',
      'Continue during and after procedure if possible'
    ]
  },
  breastfeeding: {
    id: 'breastfeeding',
    name: 'Breastfeeding',
    description: 'Breastfeeding during or immediately before procedure',
    ageAppropriate: ['neonate', 'infant'],
    evidenceLevel: 'A',
    instructions: [
      'Begin breastfeeding 2-3 minutes before procedure',
      'Continue throughout procedure if possible',
      'Combines sucking, sweet taste, and skin contact'
    ],
    contraindications: ['NPO status', 'Mother unavailable']
  },
  non_nutritive_sucking: {
    id: 'non_nutritive_sucking',
    name: 'Non-Nutritive Sucking',
    description: 'Pacifier use for comfort during procedures',
    ageAppropriate: ['neonate', 'infant', 'toddler'],
    evidenceLevel: 'B',
    instructions: [
      'Offer pacifier before procedure begins',
      'Can be combined with sucrose for enhanced effect',
      'Maintain throughout procedure'
    ]
  },
  swaddling: {
    id: 'swaddling',
    name: 'Swaddling',
    description: 'Secure wrapping to provide containment and comfort',
    ageAppropriate: ['neonate', 'infant'],
    evidenceLevel: 'B',
    instructions: [
      'Wrap infant snugly in blanket with arms contained',
      'Ensure hips can flex naturally',
      'Maintain warmth without overheating',
      'Can be combined with other interventions'
    ]
  },
  positioning: {
    id: 'positioning',
    name: 'Facilitated Tucking/Positioning',
    description: 'Holding infant in flexed, contained position',
    ageAppropriate: ['neonate', 'infant'],
    evidenceLevel: 'B',
    instructions: [
      'Hold infant with limbs flexed toward midline',
      'Provide gentle containment with hands',
      'Maintain position throughout procedure',
      'Can be done by parent or healthcare provider'
    ]
  },
  distraction_visual: {
    id: 'distraction_visual',
    name: 'Visual Distraction',
    description: 'Using visual stimuli to redirect attention',
    ageAppropriate: ['infant', 'toddler', 'child', 'adolescent'],
    evidenceLevel: 'B',
    instructions: [
      'Use age-appropriate visual stimuli (toys, videos, books)',
      'Engage child before procedure begins',
      'Maintain engagement throughout procedure',
      'Consider child\'s interests and preferences'
    ]
  },
  distraction_auditory: {
    id: 'distraction_auditory',
    name: 'Auditory Distraction',
    description: 'Using sounds or music to redirect attention',
    ageAppropriate: ['neonate', 'infant', 'toddler', 'child', 'adolescent'],
    evidenceLevel: 'B',
    instructions: [
      'Play calming music or familiar sounds',
      'Use parent\'s voice for young infants',
      'Consider headphones for older children',
      'Match music to child\'s preferences'
    ]
  },
  comfort_holding: {
    id: 'comfort_holding',
    name: 'Comfort Holding',
    description: 'Parent or caregiver holding child during procedure',
    ageAppropriate: ['infant', 'toddler', 'child'],
    evidenceLevel: 'B',
    instructions: [
      'Position child comfortably in parent\'s lap',
      'Ensure procedure site is accessible',
      'Coach parent on supportive behaviors',
      'Avoid restraining language or actions'
    ]
  },
  reduced_stimulation: {
    id: 'reduced_stimulation',
    name: 'Environmental Modification',
    description: 'Reducing light, sound, and handling',
    ageAppropriate: ['neonate', 'infant'],
    evidenceLevel: 'C',
    instructions: [
      'Dim lights in procedure area',
      'Minimize noise and conversation',
      'Cluster care activities when possible',
      'Allow rest periods between interventions'
    ]
  },
  topical_anesthetic: {
    id: 'topical_anesthetic',
    name: 'Topical Anesthetic',
    description: 'Topical lidocaine/prilocaine cream application',
    ageAppropriate: ['neonate', 'infant', 'toddler', 'child', 'adolescent'],
    evidenceLevel: 'A',
    instructions: [
      'Apply to intact skin at procedure site',
      'Cover with occlusive dressing',
      'Allow 30-60 minutes for effect',
      'Remove before procedure'
    ],
    contraindications: ['Methemoglobinemia risk', 'Allergy to local anesthetics', 'Broken skin']
  },
  other: {
    id: 'other',
    name: 'Other Intervention',
    description: 'Other non-pharmacological intervention',
    ageAppropriate: ['neonate', 'infant', 'toddler', 'child', 'adolescent'],
    evidenceLevel: 'C',
    instructions: ['Document specific intervention used']
  }
};

// ============ HELPER FUNCTIONS ============

export function calculateAgeInDays(dateOfBirth: Date, gestationalWeeks?: number): number {
  const now = new Date();
  const ageInMs = now.getTime() - dateOfBirth.getTime();
  const ageInDays = Math.floor(ageInMs / (1000 * 60 * 60 * 24));
  
  // For premature infants, calculate corrected age
  if (gestationalWeeks && gestationalWeeks < 40) {
    const weeksEarly = 40 - gestationalWeeks;
    const daysEarly = weeksEarly * 7;
    return Math.max(0, ageInDays - daysEarly);
  }
  
  return ageInDays;
}

export function calculatePostMenstrualAge(dateOfBirth: Date, gestationalWeeks: number): number {
  const now = new Date();
  const ageInMs = now.getTime() - dateOfBirth.getTime();
  const ageInWeeks = ageInMs / (1000 * 60 * 60 * 24 * 7);
  return gestationalWeeks + ageInWeeks;
}

export function formatAge(dateOfBirth: Date, gestationalWeeks?: number): string {
  const ageInDays = calculateAgeInDays(dateOfBirth, gestationalWeeks);
  
  if (gestationalWeeks && gestationalWeeks < 40) {
    const pma = calculatePostMenstrualAge(dateOfBirth, gestationalWeeks);
    if (pma < 48) {
      return `${Math.round(pma)} weeks PMA`;
    }
  }
  
  if (ageInDays < 30) {
    return `${ageInDays} days`;
  } else if (ageInDays < 365) {
    const months = Math.floor(ageInDays / 30);
    return `${months} month${months > 1 ? 's' : ''}`;
  } else {
    const years = Math.floor(ageInDays / 365);
    const remainingMonths = Math.floor((ageInDays % 365) / 30);
    if (remainingMonths > 0) {
      return `${years} year${years > 1 ? 's' : ''}, ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`;
    }
    return `${years} year${years > 1 ? 's' : ''}`;
  }
}

export function recommendScales(dateOfBirth: Date, gestationalWeeks?: number): PainScaleType[] {
  const ageInDays = calculateAgeInDays(dateOfBirth, gestationalWeeks);
  const recommended: PainScaleType[] = [];
  
  // For premature infants, check PMA
  if (gestationalWeeks) {
    const pma = calculatePostMenstrualAge(dateOfBirth, gestationalWeeks);
    if (pma <= 48) {
      recommended.push('pipp_r');
    }
  }
  
  // NIPS for infants < 1 year
  if (ageInDays < 365) {
    recommended.push('nips');
  }
  
  // FLACC for 2 months - 7 years
  if (ageInDays >= 60 && ageInDays <= 2555) {
    recommended.push('flacc');
  }
  
  // CHEOPS for 1-7 years (postoperative)
  if (ageInDays >= 365 && ageInDays <= 2555) {
    recommended.push('cheops');
  }
  
  // Wong-Baker for 3+ years
  if (ageInDays >= 1095) {
    recommended.push('wong_baker');
  }
  
  // VAS for 8+ years
  if (ageInDays >= 2920) {
    recommended.push('vas');
  }
  
  return recommended;
}

export function getPainLevel(scaleType: PainScaleType, score: number): PainLevel {
  const scale = PAIN_SCALES[scaleType];
  for (const threshold of scale.scoringGuide) {
    if (score >= threshold.minScore && score <= threshold.maxScore) {
      return threshold.level;
    }
  }
  return 'none';
}

export function getRecommendedInterventions(
  painLevel: PainLevel, 
  ageCategory: 'neonate' | 'infant' | 'toddler' | 'child' | 'adolescent'
): InterventionType[] {
  if (painLevel === 'none') return [];
  
  const interventions: InterventionType[] = [];
  
  for (const [id, info] of Object.entries(INTERVENTIONS)) {
    if (info.ageAppropriate.includes(ageCategory)) {
      // Prioritize evidence level A interventions for moderate/severe pain
      if (painLevel === 'severe' || painLevel === 'moderate') {
        if (info.evidenceLevel === 'A') {
          interventions.unshift(id as InterventionType);
        } else {
          interventions.push(id as InterventionType);
        }
      } else {
        interventions.push(id as InterventionType);
      }
    }
  }
  
  return interventions.filter(i => i !== 'other');
}

export function getAgeCategory(ageInDays: number): 'neonate' | 'infant' | 'toddler' | 'child' | 'adolescent' {
  if (ageInDays < 28) return 'neonate';
  if (ageInDays < 365) return 'infant';
  if (ageInDays < 1095) return 'toddler'; // < 3 years
  if (ageInDays < 4380) return 'child'; // < 12 years
  return 'adolescent';
}
