// Clinical Guidelines for Pediatric Pain Management
// Sources: WHO Guidelines 2020, AAP 2024, CPS 2022, SickKids Comfort Promise, ChildKind International

import type { PainLevel } from './painScales';

export interface GuidelineSection {
  title: string;
  icon: string;
  content: string[];
  links?: { text: string; url: string }[];
}

export interface ClinicalGuideline {
  painLevel: PainLevel;
  whoLadderStep: number;
  whoLadderDescription: string;
  reassessmentTiming: string;
  keyDecisionPoints: string[];
  treatmentGoals: string[];
  escalationCriteria: string[];
  sections: GuidelineSection[];
}

export const CLINICAL_GUIDELINES: Record<PainLevel, ClinicalGuideline> = {
  none: {
    painLevel: 'none',
    whoLadderStep: 0,
    whoLadderDescription: 'No pharmacological intervention typically required',
    reassessmentTiming: 'Reassess every 4-6 hours or with change in condition',
    keyDecisionPoints: [
      'Continue monitoring for changes in pain status',
      'Maintain comfort measures and supportive care',
      'Document baseline pain assessment for comparison'
    ],
    treatmentGoals: [
      'Maintain comfort and prevent pain development',
      'Continue age-appropriate activities',
      'Support normal sleep patterns'
    ],
    escalationCriteria: [
      'Any increase in pain score',
      'New painful procedure planned',
      'Change in clinical condition'
    ],
    sections: [
      {
        title: 'Preventive Strategies',
        icon: 'shield',
        content: [
          'Implement comfort positioning and environmental modifications',
          'Use non-pharmacological interventions proactively before procedures',
          'Educate caregivers on pain recognition signs',
          'Consider topical anesthetics before planned procedures'
        ]
      },
      {
        title: 'Monitoring Recommendations',
        icon: 'activity',
        content: [
          'Document pain scores at regular intervals',
          'Monitor for behavioral changes indicating discomfort',
          'Assess effectiveness of comfort measures',
          'Track sleep quality and feeding patterns (infants)'
        ]
      }
    ]
  },

  mild: {
    painLevel: 'mild',
    whoLadderStep: 1,
    whoLadderDescription: 'WHO Step 1: Non-opioid analgesics ± adjuvants',
    reassessmentTiming: 'Reassess 30-60 minutes after intervention, then every 2-4 hours',
    keyDecisionPoints: [
      'Start with non-pharmacological interventions',
      'Consider acetaminophen or ibuprofen if non-pharmacological measures insufficient',
      'Combine pharmacological and non-pharmacological approaches',
      'Identify and address underlying cause of pain'
    ],
    treatmentGoals: [
      'Reduce pain score to 0-1/10',
      'Restore normal function and activity',
      'Enable adequate sleep and rest',
      'Minimize distress and anxiety'
    ],
    escalationCriteria: [
      'Pain persists >1 hour after intervention',
      'Pain score increases to moderate (4-6/10)',
      'Inadequate response to non-opioid analgesics',
      'Functional impairment despite treatment'
    ],
    sections: [
      {
        title: 'First-Line Pharmacological Options',
        icon: 'pill',
        content: [
          'Acetaminophen: 10-15 mg/kg PO/PR Q4-6h (max 75 mg/kg/day)',
          'Ibuprofen: 5-10 mg/kg PO Q6-8h (≥6 months, max 40 mg/kg/day)',
          'Consider combination therapy for enhanced effect',
          'Use scheduled dosing rather than PRN for ongoing pain'
        ]
      },
      {
        title: 'Non-Pharmacological First',
        icon: 'heart',
        content: [
          'Distraction techniques (age-appropriate)',
          'Comfort positioning and physical support',
          'Parental presence and comfort holding',
          'Environmental modifications (lighting, noise reduction)',
          'Breathing exercises for older children'
        ]
      },
      {
        title: 'Special Considerations',
        icon: 'alert',
        content: [
          'Avoid ibuprofen in dehydration, renal impairment, or post-tonsillectomy',
          'Consider acetaminophen dose reduction in hepatic impairment',
          'Account for recent doses when calculating totals',
          'Document allergies and previous medication responses'
        ]
      }
    ]
  },

  moderate: {
    painLevel: 'moderate',
    whoLadderStep: 2,
    whoLadderDescription: 'WHO Step 2: Non-opioids + weak opioids or low-dose strong opioids ± adjuvants',
    reassessmentTiming: 'Reassess 15-30 minutes after IV, 30-60 minutes after PO, then every 1-2 hours',
    keyDecisionPoints: [
      'Ensure non-opioid analgesics are optimized',
      'Consider adding low-dose opioid if non-opioids insufficient',
      'Evaluate for procedural or acute cause requiring specific treatment',
      'Assess need for specialist pain consultation'
    ],
    treatmentGoals: [
      'Reduce pain score to mild (1-3/10) within 1 hour',
      'Enable participation in care activities',
      'Achieve adequate pain control for sleep',
      'Prevent progression to severe pain'
    ],
    escalationCriteria: [
      'Pain score remains ≥4/10 after 2 intervention cycles',
      'Pain score increases to severe (7-10/10)',
      'Signs of opioid-related adverse effects',
      'Hemodynamic instability or respiratory compromise'
    ],
    sections: [
      {
        title: 'Multimodal Approach Required',
        icon: 'layers',
        content: [
          'Continue scheduled non-opioid analgesics (acetaminophen + NSAID)',
          'Add opioid: Morphine 0.05-0.1 mg/kg IV/SC Q2-4h or PO 0.2-0.3 mg/kg Q4h',
          'Consider intranasal fentanyl 1.5-2 mcg/kg for rapid onset',
          'Maintain non-pharmacological interventions alongside medications'
        ]
      },
      {
        title: 'Monitoring Requirements',
        icon: 'activity',
        content: [
          'Sedation score with each opioid dose',
          'Respiratory rate and oxygen saturation',
          'Pain score before and after interventions',
          'Watch for nausea, pruritus, constipation'
        ]
      },
      {
        title: 'When to Escalate',
        icon: 'arrow-up',
        content: [
          'Consult pain service if pain uncontrolled after 2-3 opioid doses',
          'Consider patient-controlled analgesia (PCA) for ongoing needs',
          'Evaluate for regional anesthesia options',
          'Investigate underlying cause if pain disproportionate to condition'
        ]
      }
    ]
  },

  severe: {
    painLevel: 'severe',
    whoLadderStep: 3,
    whoLadderDescription: 'WHO Step 3: Strong opioids + non-opioids ± adjuvants - Urgent intervention required',
    reassessmentTiming: 'Reassess every 10-15 minutes until pain controlled, then every 30-60 minutes',
    keyDecisionPoints: [
      'URGENT: Initiate strong opioid therapy immediately',
      'Ensure IV access for rapid medication delivery',
      'Consider pain service or anesthesia consultation',
      'Evaluate for surgical or procedural intervention needs'
    ],
    treatmentGoals: [
      'Achieve significant pain reduction (≥50%) within 30 minutes',
      'Reduce pain to moderate or mild level within 1-2 hours',
      'Prevent pain crisis and associated trauma',
      'Establish sustainable pain management plan'
    ],
    escalationCriteria: [
      'No improvement after initial opioid bolus',
      'Respiratory depression or excessive sedation',
      'Hemodynamic instability',
      'Pain refractory to standard opioid doses'
    ],
    sections: [
      {
        title: 'Immediate Actions',
        icon: 'zap',
        content: [
          'IV Morphine 0.1 mg/kg (max 5mg) - may repeat Q5-10min PRN',
          'OR IV Fentanyl 1-2 mcg/kg - faster onset, shorter duration',
          'Continue non-opioid analgesics as adjuncts',
          'Ensure naloxone readily available (0.01 mg/kg for reversal)'
        ]
      },
      {
        title: 'Continuous Monitoring',
        icon: 'monitor',
        content: [
          'Continuous pulse oximetry',
          'Respiratory rate every 5-10 minutes during titration',
          'Sedation scoring (POSS or similar)',
          'Blood pressure monitoring',
          'Pain reassessment with each intervention'
        ]
      },
      {
        title: 'Advanced Options',
        icon: 'settings',
        content: [
          'Patient-Controlled Analgesia (PCA) for ongoing management',
          'Continuous opioid infusion with breakthrough doses',
          'Regional anesthesia: epidural, nerve blocks',
          'Ketamine infusion for opioid-refractory pain',
          'Palliative care consultation for complex cases'
        ]
      },
      {
        title: 'Safety Alerts',
        icon: 'alert-triangle',
        content: [
          'Never leave patient unmonitored after opioid administration',
          'Have bag-valve mask and suction available',
          'Know location of naloxone and reversal protocols',
          'Document all doses, times, and patient responses',
          'Consider ICU admission for high opioid requirements'
        ]
      }
    ]
  }
};

// Reassessment timing by context
export const REASSESSMENT_TIMING = {
  postProcedure: {
    mild: '30 minutes, then Q2-4h',
    moderate: '15-30 minutes, then Q1-2h',
    severe: 'Q10-15 min until controlled'
  },
  postOperative: {
    mild: 'Q4h while awake',
    moderate: 'Q2h for first 24h',
    severe: 'Continuous monitoring'
  },
  chronicPain: {
    mild: 'Daily assessment',
    moderate: 'Twice daily',
    severe: 'Q4-6h minimum'
  }
};

// Age-specific considerations
export const AGE_SPECIFIC_GUIDELINES = {
  neonate: {
    title: 'Neonates (0-28 days)',
    considerations: [
      'Use validated neonatal pain scales (PIPP-R, NIPS)',
      'Sucrose/glucose for procedural pain (0.1-0.5 mL of 24% solution)',
      'Non-nutritive sucking enhances analgesic effect',
      'Opioid doses typically 25-50% of infant doses',
      'Higher risk of apnea - monitor closely with opioids',
      'Skin-to-skin contact highly effective'
    ]
  },
  infant: {
    title: 'Infants (1-12 months)',
    considerations: [
      'Behavioral scales remain primary assessment tool',
      'Breastfeeding provides analgesia during procedures',
      'Ibuprofen can be used from 6 months',
      'Distraction with visual/auditory stimuli effective',
      'Parental presence crucial for comfort'
    ]
  },
  toddler: {
    title: 'Toddlers (1-3 years)',
    considerations: [
      'Limited verbal communication - rely on behavioral cues',
      'FLACC scale appropriate for this age',
      'Separation anxiety may amplify pain response',
      'Simple explanations and choices helpful',
      'Comfort objects (blankets, toys) important'
    ]
  },
  preschool: {
    title: 'Preschool (3-5 years)',
    considerations: [
      'Can begin to use self-report with faces scales',
      'Magical thinking may affect pain perception',
      'Preparation and play therapy beneficial',
      'May deny pain to avoid treatment',
      'Reward systems can be motivating'
    ]
  },
  schoolAge: {
    title: 'School Age (6-12 years)',
    considerations: [
      'Reliable self-report with numeric or faces scales',
      'Can understand cause and effect',
      'Distraction and relaxation techniques effective',
      'May have specific fears about procedures',
      'Involve in treatment decisions when appropriate'
    ]
  },
  adolescent: {
    title: 'Adolescents (12+ years)',
    considerations: [
      'Adult pain scales appropriate (VAS, NRS)',
      'Privacy and autonomy important',
      'May underreport or overreport pain',
      'Consider psychosocial factors',
      'Discuss opioid risks and safe storage',
      'Screen for substance use in appropriate contexts'
    ]
  }
};

// Quick reference for common scenarios
export const QUICK_REFERENCE = {
  proceduralPain: {
    title: 'Procedural Pain Management',
    steps: [
      '1. Prepare: Explain procedure, apply topical anesthetic if time allows',
      '2. Position: Comfort positioning, parental presence',
      '3. Distract: Age-appropriate distraction during procedure',
      '4. Treat: Pharmacological intervention based on expected pain level',
      '5. Reassess: Evaluate effectiveness, document response'
    ]
  },
  postOperative: {
    title: 'Post-Operative Pain Protocol',
    steps: [
      '1. Scheduled multimodal analgesia (acetaminophen + NSAID)',
      '2. Opioid PRN for breakthrough pain',
      '3. Regular pain assessments Q2-4h',
      '4. Wean opioids as pain improves',
      '5. Transition to oral medications when tolerating PO'
    ]
  },
  emergencyDepartment: {
    title: 'ED Pain Management',
    steps: [
      '1. Rapid pain assessment on arrival',
      '2. Early analgesia - don\'t wait for diagnosis',
      '3. Intranasal fentanyl for rapid relief',
      '4. Reassess frequently during workup',
      '5. Discharge with appropriate analgesics and follow-up'
    ]
  }
};

export function getGuidelineForPainLevel(level: PainLevel): ClinicalGuideline {
  return CLINICAL_GUIDELINES[level];
}

export function getAgeSpecificGuideline(ageInMonths: number) {
  if (ageInMonths < 1) return AGE_SPECIFIC_GUIDELINES.neonate;
  if (ageInMonths < 12) return AGE_SPECIFIC_GUIDELINES.infant;
  if (ageInMonths < 36) return AGE_SPECIFIC_GUIDELINES.toddler;
  if (ageInMonths < 72) return AGE_SPECIFIC_GUIDELINES.preschool;
  if (ageInMonths < 144) return AGE_SPECIFIC_GUIDELINES.schoolAge;
  return AGE_SPECIFIC_GUIDELINES.adolescent;
}
