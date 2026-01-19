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

export type InterventionCategory = 
  | 'physical'
  | 'psychological'
  | 'environmental'
  | 'pharmacological_adjunct';

export type InterventionType = 
  | 'sucrose' 
  | 'skin_to_skin' 
  | 'breastfeeding' 
  | 'non_nutritive_sucking'
  | 'swaddling' 
  | 'facilitated_tucking'
  | 'comfort_positioning'
  | 'gentle_touch'
  | 'massage'
  | 'warm_compress'
  | 'cold_compress'
  | 'distraction_visual' 
  | 'distraction_auditory'
  | 'distraction_tactile'
  | 'distraction_breathing'
  | 'guided_imagery'
  | 'relaxation'
  | 'cognitive_coping'
  | 'preparation_education'
  | 'parental_presence'
  | 'comfort_holding' 
  | 'reduced_stimulation' 
  | 'quiet_environment'
  | 'dim_lighting'
  | 'music_therapy'
  | 'vibration_device'
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
  category: InterventionCategory;
  ageAppropriate: string[];
  evidenceLevel: 'A' | 'B' | 'C';
  evidenceSource: string;
  instructions: string[];
  tips?: string[];
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
    useCase: 'Best for children who can self-report, acute and post-operative pain',
    components: [
      {
        id: 'faces',
        name: 'Pain Faces',
        description: 'Point to the face that shows how much you hurt right now',
        options: [
          { value: 0, label: '😊 No Hurt', description: 'No pain at all' },
          { value: 2, label: '🙂 Hurts Little Bit', description: 'A tiny bit of pain' },
          { value: 4, label: '😐 Hurts Little More', description: 'A little more pain' },
          { value: 6, label: '😟 Hurts Even More', description: 'Even more pain' },
          { value: 8, label: '😢 Hurts Whole Lot', description: 'A lot of pain' },
          { value: 10, label: '😭 Hurts Worst', description: 'The worst pain possible' }
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
    ageRangeDescription: 'Children 1 to 7 years old, primarily for post-operative pain',
    minAge: 365,
    maxAge: 2555,
    type: 'behavioral',
    maxScore: 13,
    description: 'A behavioral observational scale developed for post-operative pain assessment.',
    useCase: 'Post-operative pain assessment in young children',
    components: [
      {
        id: 'cry',
        name: 'Cry',
        description: 'Crying behavior',
        options: [
          { value: 1, label: 'No cry', description: 'Not crying' },
          { value: 2, label: 'Moaning', description: 'Soft moaning or whimpering' },
          { value: 2, label: 'Crying', description: 'Gentle crying' },
          { value: 3, label: 'Screaming', description: 'Full-lunged crying or screaming' }
        ]
      },
      {
        id: 'facial',
        name: 'Facial',
        description: 'Facial expression',
        options: [
          { value: 0, label: 'Smiling', description: 'Positive expression' },
          { value: 1, label: 'Composed', description: 'Neutral expression' },
          { value: 2, label: 'Grimace', description: 'Negative expression, frown, grimace' }
        ]
      },
      {
        id: 'child_verbal',
        name: 'Child Verbal',
        description: 'What the child says',
        options: [
          { value: 0, label: 'Positive', description: 'Talks about other things, no complaints' },
          { value: 1, label: 'None', description: 'Not talking' },
          { value: 1, label: 'Complaints other than pain', description: 'Complaining but not about pain' },
          { value: 2, label: 'Pain complaints', description: 'Complaining about pain' },
          { value: 2, label: 'Both complaints', description: 'Complaining about pain and other things' }
        ]
      },
      {
        id: 'torso',
        name: 'Torso',
        description: 'Body position',
        options: [
          { value: 1, label: 'Neutral', description: 'Body at rest, torso inactive' },
          { value: 2, label: 'Shifting', description: 'Changing position, restless' },
          { value: 2, label: 'Tense', description: 'Body tense or rigid' },
          { value: 2, label: 'Shivering', description: 'Shaking or shivering' },
          { value: 2, label: 'Upright', description: 'Sitting upright or vertical' },
          { value: 2, label: 'Restrained', description: 'Restrained movement' }
        ]
      },
      {
        id: 'touch',
        name: 'Touch',
        description: 'How child touches wound',
        options: [
          { value: 1, label: 'Not touching', description: 'Not touching or grabbing wound' },
          { value: 2, label: 'Reach', description: 'Reaching toward wound' },
          { value: 2, label: 'Touch', description: 'Gently touching wound area' },
          { value: 2, label: 'Grab', description: 'Grabbing vigorously at wound' },
          { value: 2, label: 'Restrained', description: 'Arms restrained' }
        ]
      },
      {
        id: 'legs',
        name: 'Legs',
        description: 'Leg position',
        options: [
          { value: 1, label: 'Neutral', description: 'Legs in relaxed position' },
          { value: 2, label: 'Squirming/kicking', description: 'Definitive uneasy movements' },
          { value: 2, label: 'Drawn up/tensed', description: 'Legs drawn up or tense' },
          { value: 2, label: 'Standing', description: 'Standing, crouching, or kneeling' },
          { value: 2, label: 'Restrained', description: 'Legs restrained' }
        ]
      }
    ],
    scoringGuide: [
      { minScore: 4, maxScore: 6, level: 'none', description: 'No pain (note: minimum score is 4)', color: '#22c55e' },
      { minScore: 7, maxScore: 9, level: 'mild', description: 'Mild pain', color: '#eab308' },
      { minScore: 10, maxScore: 11, level: 'moderate', description: 'Moderate pain', color: '#f97316' },
      { minScore: 12, maxScore: 13, level: 'severe', description: 'Severe pain', color: '#ef4444' }
    ]
  },
  
  nips: {
    id: 'nips',
    name: 'NIPS',
    fullName: 'Neonatal Infant Pain Scale',
    ageRange: '<1 year',
    ageRangeDescription: 'Neonates and infants up to 1 year of age',
    minAge: 0,
    maxAge: 365,
    type: 'behavioral',
    maxScore: 7,
    description: 'A behavioral assessment tool for procedural pain in neonates and infants.',
    useCase: 'Procedural pain in neonates and young infants',
    components: [
      {
        id: 'facial_expression',
        name: 'Facial Expression',
        description: 'Facial muscle tension',
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
        description: 'Respiratory pattern',
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
        description: 'Alertness level',
        options: [
          { value: 0, label: 'Sleeping/Awake', description: 'Quiet, peaceful, sleeping or alert and settled' },
          { value: 1, label: 'Fussy', description: 'Alert, restless, thrashing' }
        ]
      }
    ],
    scoringGuide: [
      { minScore: 0, maxScore: 2, level: 'none', description: 'No pain to mild pain', color: '#22c55e' },
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
    ageRangeDescription: 'Children 8 years and older who can understand the concept',
    minAge: 2920, // ~8 years
    maxAge: 6570, // ~18 years
    type: 'self_report',
    maxScore: 10,
    description: 'A horizontal line scale where patients mark their pain level from no pain to worst pain.',
    useCase: 'Self-report for older children and adolescents',
    components: [
      {
        id: 'vas_slider',
        name: 'Pain Level',
        description: 'Mark on the line how much pain you have right now',
        options: [
          { value: 0, label: 'No Pain', description: 'No pain at all' },
          { value: 10, label: 'Worst Pain', description: 'Worst pain imaginable' }
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

// ============ ENHANCED EVIDENCE-BASED INTERVENTIONS ============
// Sources: Canadian Paediatric Society 2022, SickKids Comfort Promise, Cochrane Reviews, IASP Guidelines

export const INTERVENTIONS: Record<InterventionType, InterventionInfo> = {
  // === PHYSICAL INTERVENTIONS - ORAL ===
  sucrose: {
    id: 'sucrose',
    name: 'Oral Sucrose (24%)',
    description: 'Sweet solution given orally 2 minutes before procedure to activate endogenous opioid pathways',
    category: 'physical',
    ageAppropriate: ['neonate', 'infant'],
    evidenceLevel: 'A',
    evidenceSource: 'Cochrane Review 2023, CPS 2022',
    instructions: [
      'Administer 0.1-0.5 mL of 24% sucrose solution',
      'Give 2 minutes before painful procedure',
      'Place on anterior tongue',
      'Can repeat dose during prolonged procedures',
      'Most effective when combined with non-nutritive sucking'
    ],
    tips: [
      'Effect lasts approximately 5-7 minutes',
      'Can be used for heel pricks, IV insertions, immunizations',
      'Maximum 2-3 doses per procedure'
    ],
    contraindications: ['Fructose intolerance', 'NPO status (relative)', 'Necrotizing enterocolitis']
  },
  
  breastfeeding: {
    id: 'breastfeeding',
    name: 'Breastfeeding',
    description: 'Direct breastfeeding during procedure combines sucking, sweet taste, skin contact, and maternal comfort',
    category: 'physical',
    ageAppropriate: ['neonate', 'infant'],
    evidenceLevel: 'A',
    evidenceSource: 'Cochrane Review 2023, WHO Guidelines',
    instructions: [
      'Position infant at breast before procedure',
      'Allow infant to latch and begin feeding',
      'Maintain breastfeeding throughout procedure',
      'Continue until infant is calm after procedure'
    ],
    tips: [
      'Most effective single intervention for infant procedural pain',
      'Combines multiple pain-relieving mechanisms',
      'Mother should be comfortable and supported'
    ]
  },
  
  non_nutritive_sucking: {
    id: 'non_nutritive_sucking',
    name: 'Non-Nutritive Sucking (Pacifier)',
    description: 'Pacifier use to provide comfort through sucking reflex',
    category: 'physical',
    ageAppropriate: ['neonate', 'infant'],
    evidenceLevel: 'A',
    evidenceSource: 'Cochrane Review 2023',
    instructions: [
      'Offer clean pacifier before procedure',
      'Dip in sucrose solution if available',
      'Maintain throughout procedure',
      'Allow continued use during recovery'
    ],
    tips: [
      'Most effective when combined with sucrose',
      'Use appropriate size for infant age',
      'Parent can hold pacifier in place if needed'
    ]
  },
  
  // === PHYSICAL INTERVENTIONS - POSITIONING ===
  skin_to_skin: {
    id: 'skin_to_skin',
    name: 'Skin-to-Skin Contact (Kangaroo Care)',
    description: 'Direct skin contact between infant and parent provides warmth, comfort, and pain reduction',
    category: 'physical',
    ageAppropriate: ['neonate', 'infant'],
    evidenceLevel: 'A',
    evidenceSource: 'Cochrane Review 2023, WHO Guidelines',
    instructions: [
      'Place infant in diaper only on parent\'s bare chest',
      'Cover with warm blanket',
      'Begin at least 15 minutes before procedure',
      'Maintain position throughout and after procedure'
    ],
    tips: [
      'Parent should be in comfortable reclined position',
      'Works for both mothers and fathers',
      'Can be combined with breastfeeding'
    ]
  },
  
  swaddling: {
    id: 'swaddling',
    name: 'Swaddling',
    description: 'Secure wrapping to provide containment, warmth, and comfort',
    category: 'physical',
    ageAppropriate: ['neonate', 'infant'],
    evidenceLevel: 'A',
    evidenceSource: 'Cochrane Review 2023',
    instructions: [
      'Wrap infant snugly in blanket with arms contained',
      'Ensure hips can flex naturally (hip-healthy swaddling)',
      'Maintain warmth without overheating',
      'Leave access to procedure site'
    ],
    tips: [
      'Use thin, breathable blanket',
      'Can swaddle with one arm out for IV access',
      'Particularly effective for preterm infants'
    ]
  },
  
  facilitated_tucking: {
    id: 'facilitated_tucking',
    name: 'Facilitated Tucking',
    description: 'Holding infant in flexed, contained position with gentle hand containment',
    category: 'physical',
    ageAppropriate: ['neonate', 'infant'],
    evidenceLevel: 'A',
    evidenceSource: 'Cochrane Review 2023',
    instructions: [
      'Hold infant with limbs flexed toward midline',
      'Use hands to provide gentle containment',
      'One hand on head, one on feet/bottom',
      'Maintain position throughout procedure'
    ],
    tips: [
      'Can be done by parent or healthcare provider',
      'Mimics intrauterine positioning',
      'Particularly effective for preterm infants'
    ]
  },
  
  comfort_positioning: {
    id: 'comfort_positioning',
    name: 'Comfort Positioning (Upright/Sitting)',
    description: 'Positioning child upright in parent\'s lap rather than lying supine',
    category: 'physical',
    ageAppropriate: ['infant', 'toddler', 'child'],
    evidenceLevel: 'A',
    evidenceSource: 'SickKids Comfort Promise, CPS 2022',
    instructions: [
      'Seat child upright in parent\'s lap',
      'Face child toward or away from procedure based on preference',
      'Ensure procedure site is accessible',
      'Parent provides secure hold without restraining'
    ],
    tips: [
      'Reduces fear compared to lying down',
      'Parent can provide distraction simultaneously',
      'Avoid supine "restraint" positioning'
    ]
  },
  
  comfort_holding: {
    id: 'comfort_holding',
    name: 'Comfort Holding by Parent',
    description: 'Parent holds and comforts child during procedure',
    category: 'physical',
    ageAppropriate: ['infant', 'toddler', 'child'],
    evidenceLevel: 'A',
    evidenceSource: 'CPS 2022, SickKids Comfort Promise',
    instructions: [
      'Position child comfortably in parent\'s lap or arms',
      'Ensure procedure site is accessible',
      'Coach parent on supportive behaviors',
      'Avoid restraining language or actions'
    ],
    tips: [
      'Parent presence reduces child anxiety',
      'Coach parents to stay calm and reassuring',
      'Avoid saying "don\'t cry" or "be brave"'
    ]
  },
  
  gentle_touch: {
    id: 'gentle_touch',
    name: 'Gentle Touch/Stroking',
    description: 'Light, rhythmic stroking or gentle touch to provide comfort',
    category: 'physical',
    ageAppropriate: ['neonate', 'infant', 'toddler'],
    evidenceLevel: 'B',
    evidenceSource: 'Cochrane Review 2023',
    instructions: [
      'Use slow, gentle stroking motions',
      'Focus on head, back, or limbs',
      'Maintain consistent rhythm',
      'Continue throughout procedure'
    ],
    tips: [
      'Avoid tickling or light touch that may startle',
      'Watch infant cues for preference',
      'Can be done by parent or provider'
    ]
  },
  
  massage: {
    id: 'massage',
    name: 'Massage',
    description: 'Gentle massage to promote relaxation and comfort',
    category: 'physical',
    ageAppropriate: ['infant', 'toddler', 'child', 'adolescent'],
    evidenceLevel: 'B',
    evidenceSource: 'IASP Guidelines',
    instructions: [
      'Use gentle, firm pressure',
      'Focus on non-painful areas (back, feet, hands)',
      'Use slow, rhythmic movements',
      'Can use lotion if appropriate'
    ],
    tips: [
      'Teach parents simple massage techniques',
      'Helpful for chronic pain management',
      'Avoid areas near procedure site'
    ]
  },
  
  warm_compress: {
    id: 'warm_compress',
    name: 'Warm Compress',
    description: 'Application of warmth to provide comfort and vasodilation',
    category: 'physical',
    ageAppropriate: ['toddler', 'child', 'adolescent'],
    evidenceLevel: 'B',
    evidenceSource: 'Clinical Practice Guidelines',
    instructions: [
      'Apply warm (not hot) compress to area',
      'Test temperature on inner wrist first',
      'Apply for 10-15 minutes',
      'Can help with blood draw site preparation'
    ],
    tips: [
      'Useful before IV insertion to dilate veins',
      'Avoid in acute injuries (first 48 hours)',
      'Never apply directly to skin without barrier'
    ],
    contraindications: ['Acute injury', 'Inflammation', 'Impaired sensation']
  },
  
  cold_compress: {
    id: 'cold_compress',
    name: 'Cold Compress/Ice',
    description: 'Application of cold to reduce pain and inflammation',
    category: 'physical',
    ageAppropriate: ['toddler', 'child', 'adolescent'],
    evidenceLevel: 'B',
    evidenceSource: 'Clinical Practice Guidelines',
    instructions: [
      'Wrap ice pack in cloth',
      'Apply for 10-15 minutes',
      'Remove if skin becomes numb',
      'Can alternate with warm compress'
    ],
    tips: [
      'Helpful for acute injuries and post-procedure',
      'Never apply ice directly to skin',
      'Watch for signs of frostbite'
    ],
    contraindications: ['Raynaud\'s disease', 'Cold sensitivity', 'Impaired circulation']
  },
  
  // === PSYCHOLOGICAL INTERVENTIONS - DISTRACTION ===
  distraction_visual: {
    id: 'distraction_visual',
    name: 'Visual Distraction',
    description: 'Using visual stimuli to redirect attention away from pain',
    category: 'psychological',
    ageAppropriate: ['infant', 'toddler', 'child', 'adolescent'],
    evidenceLevel: 'A',
    evidenceSource: 'Cochrane Review, CPS 2022',
    instructions: [
      'Choose age-appropriate visual stimuli',
      'Engage child before procedure begins',
      'Maintain engagement throughout procedure',
      'Consider child\'s interests and preferences'
    ],
    tips: [
      'Infants: High-contrast toys, mobiles, lights',
      'Toddlers: Bubbles, pinwheels, pop-up books',
      'Children: Videos, tablets, "I Spy" games',
      'Adolescents: Phones, videos, virtual reality'
    ]
  },
  
  distraction_auditory: {
    id: 'distraction_auditory',
    name: 'Auditory Distraction',
    description: 'Using sounds or music to redirect attention',
    category: 'psychological',
    ageAppropriate: ['neonate', 'infant', 'toddler', 'child', 'adolescent'],
    evidenceLevel: 'A',
    evidenceSource: 'Cochrane Review, CPS 2022',
    instructions: [
      'Play calming music or familiar sounds',
      'Use parent\'s voice for young infants',
      'Consider headphones for older children',
      'Match music to child\'s preferences'
    ],
    tips: [
      'Neonates: Soft lullabies, white noise, heartbeat sounds',
      'Toddlers: Familiar songs, nursery rhymes',
      'Children: Favorite music, audiobooks',
      'Adolescents: Personal playlist, podcasts'
    ]
  },
  
  distraction_tactile: {
    id: 'distraction_tactile',
    name: 'Tactile Distraction',
    description: 'Using touch-based stimuli to redirect attention',
    category: 'psychological',
    ageAppropriate: ['toddler', 'child', 'adolescent'],
    evidenceLevel: 'B',
    evidenceSource: 'SickKids Comfort Promise',
    instructions: [
      'Offer stress balls, fidget toys, or textured objects',
      'Encourage squeezing during painful moments',
      'Use Play-Doh or slime for distraction',
      'Consider vibration devices near (not on) procedure site'
    ],
    tips: [
      'Squeezing gives child sense of control',
      'Fidget spinners popular with school-age children',
      'Textured items helpful for sensory-seeking children'
    ]
  },
  
  distraction_breathing: {
    id: 'distraction_breathing',
    name: 'Breathing Exercises/Blowing',
    description: 'Controlled breathing or blowing activities to reduce pain and anxiety',
    category: 'psychological',
    ageAppropriate: ['toddler', 'child', 'adolescent'],
    evidenceLevel: 'A',
    evidenceSource: 'Cochrane Review, CPS 2022',
    instructions: [
      'Teach slow, deep breathing before procedure',
      'Use blowing activities (bubbles, pinwheels, party blowers)',
      'Count breaths together',
      'Practice "birthday candle" or "smell the flower" breathing'
    ],
    tips: [
      'Toddlers: Blow bubbles, pinwheels',
      'Children: "Blow out the birthday candles" game',
      'Adolescents: 4-7-8 breathing technique',
      'Blowing naturally slows breathing and reduces tension'
    ]
  },
  
  // === PSYCHOLOGICAL INTERVENTIONS - COGNITIVE ===
  guided_imagery: {
    id: 'guided_imagery',
    name: 'Guided Imagery',
    description: 'Using imagination to create calming mental images',
    category: 'psychological',
    ageAppropriate: ['child', 'adolescent'],
    evidenceLevel: 'A',
    evidenceSource: 'Cochrane Review, IASP Guidelines',
    instructions: [
      'Ask child to imagine a favorite place',
      'Guide them through sensory details (sights, sounds, smells)',
      'Encourage deep, slow breathing',
      'Maintain calm, soothing voice'
    ],
    tips: [
      'Practice before procedure day if possible',
      '"Magic glove" imagery popular for hand procedures',
      'Beach, forest, or space themes work well',
      'Let child choose their own imagery'
    ]
  },
  
  relaxation: {
    id: 'relaxation',
    name: 'Relaxation Techniques',
    description: 'Progressive muscle relaxation and calming exercises',
    category: 'psychological',
    ageAppropriate: ['child', 'adolescent'],
    evidenceLevel: 'A',
    evidenceSource: 'Cochrane Review, CPS 2022',
    instructions: [
      'Teach progressive muscle relaxation',
      'Start with toes, work up to head',
      'Tense each muscle group for 5 seconds, then release',
      'Combine with slow breathing'
    ],
    tips: [
      'Practice before procedure day',
      'Use "robot/ragdoll" game for children',
      'Apps available for guided relaxation',
      'Particularly helpful for chronic pain'
    ]
  },
  
  cognitive_coping: {
    id: 'cognitive_coping',
    name: 'Cognitive Coping Statements',
    description: 'Teaching positive self-talk and coping strategies',
    category: 'psychological',
    ageAppropriate: ['child', 'adolescent'],
    evidenceLevel: 'B',
    evidenceSource: 'CPS 2022, IASP Guidelines',
    instructions: [
      'Teach positive coping statements',
      'Practice before procedure',
      'Encourage child to repeat during procedure',
      'Praise use of coping strategies'
    ],
    tips: [
      'Examples: "I can do this", "It will be over soon"',
      '"I am brave and strong"',
      '"My body knows how to heal"',
      'Let child create their own statements'
    ]
  },
  
  preparation_education: {
    id: 'preparation_education',
    name: 'Preparation & Education',
    description: 'Age-appropriate explanation of what to expect',
    category: 'psychological',
    ageAppropriate: ['toddler', 'child', 'adolescent'],
    evidenceLevel: 'A',
    evidenceSource: 'CPS 2022, SickKids Comfort Promise',
    instructions: [
      'Explain procedure in age-appropriate terms',
      'Use honest, simple language',
      'Describe sensations they may feel',
      'Avoid false reassurances ("It won\'t hurt")'
    ],
    tips: [
      'Toddlers: Explain just before procedure',
      'Children: Explain day before or morning of',
      'Use dolls or medical play for young children',
      'Answer questions honestly'
    ]
  },
  
  parental_presence: {
    id: 'parental_presence',
    name: 'Parental Presence & Coaching',
    description: 'Having parent present and coaching them to support child',
    category: 'psychological',
    ageAppropriate: ['neonate', 'infant', 'toddler', 'child', 'adolescent'],
    evidenceLevel: 'A',
    evidenceSource: 'CPS 2022, SickKids Comfort Promise',
    instructions: [
      'Invite parent to stay during procedure',
      'Coach parent on supportive behaviors',
      'Encourage calm, reassuring tone',
      'Position parent where child can see them'
    ],
    tips: [
      'Teach parents distraction techniques',
      'Avoid "It\'s okay" or "Don\'t cry"',
      'Use "You\'re doing great" and "Almost done"',
      'Parent anxiety affects child - help parent stay calm'
    ]
  },
  
  // === ENVIRONMENTAL INTERVENTIONS ===
  reduced_stimulation: {
    id: 'reduced_stimulation',
    name: 'Reduced Environmental Stimulation',
    description: 'Minimizing sensory input to reduce stress',
    category: 'environmental',
    ageAppropriate: ['neonate', 'infant'],
    evidenceLevel: 'B',
    evidenceSource: 'NICU Guidelines, Cochrane Review',
    instructions: [
      'Dim lights in procedure area',
      'Minimize noise and conversation',
      'Reduce handling and interruptions',
      'Cluster care activities when possible'
    ],
    tips: [
      'Particularly important for preterm infants',
      'Cover isolette during procedures',
      'Speak softly near infant',
      'Allow rest periods between interventions'
    ]
  },
  
  quiet_environment: {
    id: 'quiet_environment',
    name: 'Quiet Environment',
    description: 'Creating a calm, quiet space for procedures',
    category: 'environmental',
    ageAppropriate: ['neonate', 'infant', 'toddler', 'child', 'adolescent'],
    evidenceLevel: 'B',
    evidenceSource: 'Clinical Practice Guidelines',
    instructions: [
      'Move to quiet room if possible',
      'Close doors to reduce noise',
      'Limit number of people present',
      'Turn off unnecessary equipment sounds'
    ],
    tips: [
      'Reduces anxiety for all ages',
      'Allows better communication',
      'Child can hear parent\'s reassurance'
    ]
  },
  
  dim_lighting: {
    id: 'dim_lighting',
    name: 'Dim Lighting',
    description: 'Reducing bright lights to create calming environment',
    category: 'environmental',
    ageAppropriate: ['neonate', 'infant', 'toddler', 'child'],
    evidenceLevel: 'B',
    evidenceSource: 'NICU Guidelines',
    instructions: [
      'Dim overhead lights',
      'Use task lighting for procedure only',
      'Shield infant\'s eyes from bright lights',
      'Consider eye covers for neonates'
    ],
    tips: [
      'Bright lights increase stress response',
      'Particularly important for preterm infants',
      'Natural light preferable when possible'
    ]
  },
  
  music_therapy: {
    id: 'music_therapy',
    name: 'Music Therapy',
    description: 'Structured use of music to reduce pain and anxiety',
    category: 'environmental',
    ageAppropriate: ['neonate', 'infant', 'toddler', 'child', 'adolescent'],
    evidenceLevel: 'A',
    evidenceSource: 'Cochrane Review, IASP Guidelines',
    instructions: [
      'Select calming, age-appropriate music',
      'Begin music before procedure',
      'Maintain consistent volume',
      'Continue during recovery'
    ],
    tips: [
      'Live music more effective than recorded when available',
      'Lullabies effective for infants',
      'Let older children choose their music',
      '60-80 BPM tempo most calming'
    ]
  },
  
  // === PHARMACOLOGICAL ADJUNCTS ===
  vibration_device: {
    id: 'vibration_device',
    name: 'Vibration Device (Buzzy)',
    description: 'External vibration applied near procedure site to reduce pain sensation',
    category: 'pharmacological_adjunct',
    ageAppropriate: ['toddler', 'child', 'adolescent'],
    evidenceLevel: 'B',
    evidenceSource: 'Clinical Studies, SickKids Comfort Promise',
    instructions: [
      'Apply vibrating device proximal to procedure site',
      'Turn on 30-60 seconds before procedure',
      'Maintain throughout procedure',
      'Can combine with ice wings for additional effect'
    ],
    tips: [
      'Works via gate control theory',
      'Child can hold device themselves',
      'Buzzy bee design appeals to young children',
      'Reusable and cost-effective'
    ]
  },
  
  topical_anesthetic: {
    id: 'topical_anesthetic',
    name: 'Topical Anesthetic (Numbing Cream)',
    description: 'Lidocaine/prilocaine cream (EMLA) or liposomal lidocaine applied before procedures',
    category: 'pharmacological_adjunct',
    ageAppropriate: ['neonate', 'infant', 'toddler', 'child', 'adolescent'],
    evidenceLevel: 'A',
    evidenceSource: 'CPS 2022, SickKids Comfort Promise',
    instructions: [
      'Apply thick layer to intact skin at procedure site',
      'Cover with occlusive dressing (Tegaderm)',
      'EMLA: Apply 60 minutes before procedure',
      'Liposomal lidocaine: Apply 30 minutes before',
      'Remove and clean site before procedure'
    ],
    tips: [
      'Part of SickKids "4 Ps" Comfort Promise',
      'Can apply at home before clinic visit',
      'Mark application time on dressing',
      'Vapocoolant spray alternative for immediate effect'
    ],
    contraindications: [
      'Methemoglobinemia risk (especially <3 months)',
      'Allergy to local anesthetics',
      'Broken or inflamed skin',
      'Use on mucous membranes'
    ]
  },
  
  other: {
    id: 'other',
    name: 'Other Intervention',
    description: 'Other non-pharmacological intervention not listed above',
    category: 'physical',
    ageAppropriate: ['neonate', 'infant', 'toddler', 'child', 'adolescent'],
    evidenceLevel: 'C',
    evidenceSource: 'Clinical judgment',
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

export function getInterventionsByCategory(
  ageCategory: 'neonate' | 'infant' | 'toddler' | 'child' | 'adolescent'
): Record<InterventionCategory, InterventionInfo[]> {
  const result: Record<InterventionCategory, InterventionInfo[]> = {
    physical: [],
    psychological: [],
    environmental: [],
    pharmacological_adjunct: []
  };
  
  for (const info of Object.values(INTERVENTIONS)) {
    if (info.ageAppropriate.includes(ageCategory) && info.id !== 'other') {
      result[info.category].push(info);
    }
  }
  
  // Sort each category by evidence level
  for (const category of Object.keys(result) as InterventionCategory[]) {
    result[category].sort((a, b) => {
      const levelOrder = { 'A': 0, 'B': 1, 'C': 2 };
      return levelOrder[a.evidenceLevel] - levelOrder[b.evidenceLevel];
    });
  }
  
  return result;
}

export function getAgeCategory(ageInDays: number): 'neonate' | 'infant' | 'toddler' | 'child' | 'adolescent' {
  if (ageInDays < 28) return 'neonate';
  if (ageInDays < 365) return 'infant';
  if (ageInDays < 1095) return 'toddler'; // < 3 years
  if (ageInDays < 4380) return 'child'; // < 12 years
  return 'adolescent';
}

export function getAgeCategoryLabel(category: 'neonate' | 'infant' | 'toddler' | 'child' | 'adolescent'): string {
  const labels = {
    neonate: 'Neonate (0-28 days)',
    infant: 'Infant (1-12 months)',
    toddler: 'Toddler (1-3 years)',
    child: 'Child (3-12 years)',
    adolescent: 'Adolescent (12+ years)'
  };
  return labels[category];
}
