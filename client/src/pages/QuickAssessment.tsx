import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  PAIN_SCALES, 
  INTERVENTIONS,
  getPainLevel, 
  getInterventionsByCategory,
  type PainScaleType,
  type PainLevel,
  type InterventionCategory,
  type InterventionInfo
} from "@shared/painScales";
import {
  CLINICAL_GUIDELINES,
  AGE_SPECIFIC_GUIDELINES,
  QUICK_REFERENCE,
  getGuidelineForPainLevel,
  type ClinicalGuideline,
  type GuidelineSection
} from "@shared/clinicalGuidelines";
import {
  NON_OPIOID_MEDICATIONS,
  OPIOID_MEDICATIONS,
  TOPICAL_MEDICATIONS,
  ADJUVANT_MEDICATIONS,
  INTRANASAL_MEDICATIONS,
  REVERSAL_MEDICATIONS,
  WHO_LADDER,
  SIDE_EFFECT_MANAGEMENT,
  type MedicationInfo,
  type MedicationCategory,
  getMedicationCategoryLabel
} from "@shared/pharmacologicalInterventions";
import { 
  Check, 
  Heart, 
  Home,
  Info, 
  RotateCcw,
  Printer,
  ArrowLeft,
  Hand,
  Brain,
  Sun,
  Pill,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  AlertTriangle,
  BookOpen,
  Syringe,
  Droplets,
  Stethoscope,
  ShieldAlert,
  Activity,
  FileText,
  Clock,
  Target,
  ArrowUpCircle,
  Shield,
  Zap,
  Monitor,
  Settings,
  Layers,
  ExternalLink,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "wouter";

// Wong-Baker FACES score labels
const wongBakerLabels: Record<number, string> = {
  0: 'No Hurt',
  2: 'Hurts Little Bit',
  4: 'Hurts Little More',
  6: 'Hurts Even More',
  8: 'Hurts Whole Lot',
  10: 'Hurts Worst',
};

function getPainLevelStyle(level: PainLevel): { bg: string; text: string; border: string } {
  const styles: Record<PainLevel, { bg: string; text: string; border: string }> = {
    none: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' },
    mild: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300' },
    moderate: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300' },
    severe: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' },
  };
  return styles[level];
}

function getEvidenceBadgeStyle(level: 'A' | 'B' | 'C'): string {
  const styles = {
    'A': 'bg-green-100 text-green-800 border-green-300',
    'B': 'bg-blue-100 text-blue-800 border-blue-300',
    'C': 'bg-gray-100 text-gray-800 border-gray-300',
  };
  return styles[level];
}

function getCategoryIcon(category: InterventionCategory) {
  const icons = {
    physical: Hand,
    psychological: Brain,
    environmental: Sun,
    pharmacological_adjunct: Pill,
  };
  return icons[category];
}

function getCategoryLabel(category: InterventionCategory): string {
  const labels = {
    physical: 'Physical Comfort',
    psychological: 'Psychological Support',
    environmental: 'Environmental',
    pharmacological_adjunct: 'Pharmacological Adjuncts',
  };
  return labels[category];
}

function getMedCategoryIcon(category: MedicationCategory) {
  const icons = {
    non_opioid: Pill,
    opioid: Syringe,
    topical_local: Droplets,
    adjuvant: Stethoscope,
    intranasal: Activity,
  };
  return icons[category];
}

// Intervention Card Component
function InterventionCard({ intervention }: { intervention: InterventionInfo }) {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className="border rounded-lg bg-white overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 text-left hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold">{intervention.name}</span>
              <Badge variant="outline" className={`text-xs ${getEvidenceBadgeStyle(intervention.evidenceLevel)}`}>
                Level {intervention.evidenceLevel}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{intervention.description}</p>
          </div>
          {expanded ? (
            <ChevronUp className="w-5 h-5 text-muted-foreground shrink-0" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
          )}
        </div>
      </button>
      
      {expanded && (
        <div className="px-4 pb-4 space-y-4 border-t bg-muted/20">
          <div className="pt-4">
            <p className="text-xs text-muted-foreground mb-2">
              <BookOpen className="w-3 h-3 inline mr-1" />
              Source: {intervention.evidenceSource}
            </p>
          </div>
          
          {/* Instructions */}
          <div>
            <h4 className="text-sm font-semibold flex items-center gap-2 mb-2">
              <Check className="w-4 h-4 text-primary" />
              Instructions
            </h4>
            <ul className="text-sm space-y-1.5">
              {intervention.instructions.map((instruction, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>{instruction}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Tips */}
          {intervention.tips && intervention.tips.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold flex items-center gap-2 mb-2">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                Tips
              </h4>
              <ul className="text-sm space-y-1.5">
                {intervention.tips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-500 mt-1">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Contraindications */}
          {intervention.contraindications && intervention.contraindications.length > 0 && (
            <div className="bg-red-50 p-3 rounded-lg">
              <h4 className="text-sm font-semibold flex items-center gap-2 mb-2 text-red-800">
                <AlertTriangle className="w-4 h-4" />
                Contraindications
              </h4>
              <ul className="text-sm space-y-1 text-red-700">
                {intervention.contraindications.map((contra, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="mt-1">•</span>
                    <span>{contra}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Medication Card Component
function MedicationCard({ medication }: { medication: MedicationInfo }) {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className={`border rounded-lg bg-white overflow-hidden ${medication.blackBoxWarning ? 'border-red-300' : ''}`}>
      {medication.blackBoxWarning && (
        <div className="bg-red-600 text-white px-4 py-2 text-xs font-semibold flex items-center gap-2">
          <ShieldAlert className="w-4 h-4" />
          FDA BLACK BOX WARNING
        </div>
      )}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 text-left hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold">{medication.name}</span>
              <Badge variant="outline" className={`text-xs ${getEvidenceBadgeStyle(medication.evidenceLevel)}`}>
                Level {medication.evidenceLevel}
              </Badge>
              {medication.ageRestrictions && (
                <Badge variant="outline" className="text-xs bg-amber-50 text-amber-800 border-amber-300">
                  {medication.ageRestrictions}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">{medication.description}</p>
          </div>
          {expanded ? (
            <ChevronUp className="w-5 h-5 text-muted-foreground shrink-0" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
          )}
        </div>
      </button>
      
      {expanded && (
        <div className="px-4 pb-4 space-y-4 border-t bg-muted/20">
          <div className="pt-4">
            <p className="text-xs text-muted-foreground mb-2">
              <BookOpen className="w-3 h-3 inline mr-1" />
              Source: {medication.evidenceSource}
            </p>
          </div>
          
          {/* Dosing Table */}
          <div>
            <h4 className="text-sm font-semibold flex items-center gap-2 mb-2">
              <Pill className="w-4 h-4 text-primary" />
              Dosing
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left p-2 border">Route</th>
                    <th className="text-left p-2 border">Dose</th>
                    <th className="text-left p-2 border">Frequency</th>
                    <th className="text-left p-2 border">Max</th>
                  </tr>
                </thead>
                <tbody>
                  {medication.dosing.map((dose, idx) => (
                    <tr key={idx}>
                      <td className="p-2 border font-medium">{dose.route}</td>
                      <td className="p-2 border">{dose.dose}</td>
                      <td className="p-2 border">{dose.frequency}</td>
                      <td className="p-2 border">{dose.maxDose || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {medication.dosing[0]?.notes && (
              <p className="text-xs text-muted-foreground mt-2 italic">{medication.dosing[0].notes}</p>
            )}
          </div>
          
          {/* Contraindications */}
          {medication.contraindications && medication.contraindications.length > 0 && (
            <div className="bg-red-50 p-3 rounded-lg">
              <h4 className="text-sm font-semibold flex items-center gap-2 mb-2 text-red-800">
                <AlertTriangle className="w-4 h-4" />
                Contraindications
              </h4>
              <ul className="text-sm space-y-1 text-red-700">
                {medication.contraindications.map((contra, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="mt-1">•</span>
                    <span>{contra}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Side Effects */}
          {medication.sideEffects && medication.sideEffects.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold flex items-center gap-2 mb-2">
                <Info className="w-4 h-4 text-amber-500" />
                Side Effects
              </h4>
              <div className="flex flex-wrap gap-1">
                {medication.sideEffects.map((effect, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {effect}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {/* Monitoring */}
          {medication.monitoring && medication.monitoring.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-purple-500" />
                Monitoring Required
              </h4>
              <div className="flex flex-wrap gap-1">
                {medication.monitoring.map((monitor, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs bg-purple-50 text-purple-800 border-purple-200">
                    {monitor}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Guidelines Section Icon Mapper
function getGuidelineIcon(iconName: string) {
  const icons: Record<string, React.ComponentType<{ className?: string }>> = {
    shield: Shield,
    activity: Activity,
    pill: Pill,
    heart: Heart,
    alert: AlertTriangle,
    layers: Layers,
    'arrow-up': ArrowUpCircle,
    zap: Zap,
    monitor: Monitor,
    settings: Settings,
    'alert-triangle': AlertTriangle,
  };
  return icons[iconName] || Info;
}

// Guidelines Content Component
function GuidelinesContent({ 
  painLevel, 
  ageCategory 
}: { 
  painLevel: PainLevel; 
  ageCategory: 'neonate' | 'infant' | 'toddler' | 'child' | 'adolescent';
}) {
  const guideline = getGuidelineForPainLevel(painLevel);
  
  // Map age category to age-specific guidelines
  const ageGuidelineMap: Record<string, keyof typeof AGE_SPECIFIC_GUIDELINES> = {
    neonate: 'neonate',
    infant: 'infant',
    toddler: 'toddler',
    child: 'preschool',
    adolescent: 'adolescent',
  };
  const ageGuideline = AGE_SPECIFIC_GUIDELINES[ageGuidelineMap[ageCategory]];
  
  return (
    <div className="space-y-6">
      {/* WHO Ladder Step */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
            {guideline.whoLadderStep}
          </div>
          <div>
            <h3 className="font-semibold text-blue-900">WHO Analgesic Ladder - Step {guideline.whoLadderStep}</h3>
            <p className="text-sm text-blue-700">{guideline.whoLadderDescription}</p>
          </div>
        </div>
      </div>
      
      {/* Reassessment Timing */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-amber-900 mb-1">Reassessment Timing</h4>
            <p className="text-sm text-amber-800">{guideline.reassessmentTiming}</p>
          </div>
        </div>
      </div>
      
      {/* Treatment Goals & Key Decision Points */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
            <Target className="w-4 h-4" />
            Treatment Goals
          </h4>
          <ul className="space-y-2">
            {guideline.treatmentGoals.map((goal, idx) => (
              <li key={idx} className="text-sm text-green-800 flex items-start gap-2">
                <Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                <span>{goal}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <h4 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Key Decision Points
          </h4>
          <ul className="space-y-2">
            {guideline.keyDecisionPoints.map((point, idx) => (
              <li key={idx} className="text-sm text-purple-800 flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Escalation Criteria */}
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h4 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
          <ArrowUpCircle className="w-4 h-4" />
          When to Escalate
        </h4>
        <ul className="space-y-2">
          {guideline.escalationCriteria.map((criteria, idx) => (
            <li key={idx} className="text-sm text-red-800 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{criteria}</span>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Guideline Sections */}
      {guideline.sections.map((section, idx) => {
        const Icon = getGuidelineIcon(section.icon);
        return (
          <div key={idx} className="border rounded-lg bg-white overflow-hidden">
            <div className="p-4 bg-muted/30 border-b">
              <h4 className="font-semibold flex items-center gap-2">
                <Icon className="w-4 h-4 text-primary" />
                {section.title}
              </h4>
            </div>
            <div className="p-4">
              <ul className="space-y-2">
                {section.content.map((item, itemIdx) => (
                  <li key={itemIdx} className="text-sm flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      })}
      
      {/* Age-Specific Considerations */}
      <div className="border rounded-lg bg-white overflow-hidden">
        <div className="p-4 bg-sky-50 border-b">
          <h4 className="font-semibold flex items-center gap-2 text-sky-900">
            <Info className="w-4 h-4" />
            {ageGuideline.title} - Special Considerations
          </h4>
        </div>
        <div className="p-4">
          <ul className="space-y-2">
            {ageGuideline.considerations.map((consideration, idx) => (
              <li key={idx} className="text-sm flex items-start gap-2">
                <span className="text-sky-500 mt-1">•</span>
                <span>{consideration}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Link to Full Resources */}
      <div className="p-4 bg-muted/30 rounded-lg text-center">
        <p className="text-sm text-muted-foreground mb-3">
          For comprehensive clinical guidelines, evidence sources, and educational materials:
        </p>
        <Link href="/resources">
          <Button variant="outline" className="gap-2">
            <BookOpen className="w-4 h-4" />
            View Full Resources
            <ExternalLink className="w-3 h-3" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function QuickAssessment() {
  // Form state
  const [selectedScale, setSelectedScale] = useState<PainScaleType | null>(null);
  const [scoreData, setScoreData] = useState<Record<string, number>>({});
  const [selectedAgeCategory, setSelectedAgeCategory] = useState<'neonate' | 'infant' | 'toddler' | 'child' | 'adolescent'>('child');
  const [interventionTab, setInterventionTab] = useState<'guidelines' | 'non_pharmacological' | 'pharmacological'>('guidelines');
  
  
  // Get scale info
  const scaleInfo = selectedScale ? PAIN_SCALES[selectedScale] : null;
  
  // Calculate total score
  const totalScore = useMemo(() => {
    return Object.values(scoreData).reduce((sum, val) => sum + val, 0);
  }, [scoreData]);
  
  // Get pain level
  const painLevel = useMemo(() => {
    if (!selectedScale) return 'none' as PainLevel;
    return getPainLevel(selectedScale, totalScore);
  }, [selectedScale, totalScore]);
  
  // Check if assessment is complete
  const isAssessmentComplete = useMemo(() => {
    if (!scaleInfo) return false;
    // For Wong-Baker, check if pain_face is set
    if (selectedScale === 'wong_baker') {
      return scoreData['pain_face'] !== undefined;
    }
    // For VAS, check if pain_level is set
    if (selectedScale === 'vas') {
      return scoreData['pain_level'] !== undefined;
    }
    return Object.keys(scoreData).length === scaleInfo.components.length;
  }, [scaleInfo, scoreData, selectedScale]);
  
  // Get interventions by category based on selected age
  const interventionsByCategory = useMemo(() => {
    return getInterventionsByCategory(selectedAgeCategory);
  }, [selectedAgeCategory]);
  
  // Get recommended medications based on pain level
  const recommendedMedications = useMemo(() => {
    if (painLevel === 'none') return { step: null, medications: [] };
    
    const stepMap = {
      mild: WHO_LADDER.step1,
      moderate: WHO_LADDER.step2,
      severe: WHO_LADDER.step3,
    };
    
    return { step: stepMap[painLevel], medications: stepMap[painLevel].medications };
  }, [painLevel]);
  
  // Get age in years for medication filtering
  const ageInYears = useMemo(() => {
    const ageMap = {
      neonate: 0,
      infant: 0.5,
      toddler: 2,
      child: 6,
      adolescent: 14,
    };
    return ageMap[selectedAgeCategory];
  }, [selectedAgeCategory]);
  
  // Filter medications by age
  const filterMedicationsByAge = (medications: MedicationInfo[]) => {
    return medications.filter(med => {
      if (!med.ageRestrictions) return true;
      if (med.ageRestrictions.includes('NOT recommended')) {
        return ageInYears >= 12;
      }
      const minAge = parseInt(med.ageRestrictions.match(/≥(\d+)/)?.[1] || '0');
      if (med.ageRestrictions.includes('months')) {
        return ageInYears >= minAge / 12;
      }
      return ageInYears >= minAge;
    });
  };
  
  // Update age category when scale changes
  const updateAgeCategoryFromScale = (scale: PainScaleType) => {
    const scaleAgeMap: Record<PainScaleType, 'neonate' | 'infant' | 'toddler' | 'child' | 'adolescent'> = {
      'pipp_r': 'neonate',
      'nips': 'infant',
      'flacc': 'toddler',
      'cheops': 'child',
      'wong_baker': 'child',
      'vas': 'adolescent',
    };
    setSelectedAgeCategory(scaleAgeMap[scale] || 'child');
  };
  
  // Handle score change
  const handleScoreChange = (componentId: string, value: number) => {
    setScoreData(prev => ({ ...prev, [componentId]: value }));
  };
  
  // Handle scale change - reset scores when scale changes
  const handleScaleChange = (scale: PainScaleType) => {
    setSelectedScale(scale);
    setScoreData({});
    updateAgeCategoryFromScale(scale);
  };
  
  // Handle reset
  const handleReset = () => {
    setSelectedScale(null);
    setScoreData({});
  };
  
  // Handle print
  const handlePrint = () => {
    window.print();
  };

  
  
  // Scale options with age recommendations
  const scaleOptions = Object.values(PAIN_SCALES).map(scale => ({
    value: scale.id,
    label: `${scale.name} (${scale.ageRange})`,
  }));
  
  const painStyle = getPainLevelStyle(painLevel);
  
  // Age category options
  const ageCategoryOptions = [
    { value: 'neonate', label: 'Neonate (0-28 days)' },
    { value: 'infant', label: 'Infant (1-12 months)' },
    { value: 'toddler', label: 'Toddler (1-3 years)' },
    { value: 'child', label: 'Child (3-12 years)' },
    { value: 'adolescent', label: 'Adolescent (12+ years)' },
  ];
  
  // Medication categories for tabs
  const medicationCategories: { key: MedicationCategory; medications: MedicationInfo[] }[] = [
    { key: 'non_opioid', medications: NON_OPIOID_MEDICATIONS },
    { key: 'opioid', medications: OPIOID_MEDICATIONS },
    { key: 'topical_local', medications: TOPICAL_MEDICATIONS },
    { key: 'adjuvant', medications: ADJUVANT_MEDICATIONS },
    { key: 'intranasal', medications: INTRANASAL_MEDICATIONS },
  ];
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-sky-50 to-white">
      {/* Disclaimer Banner */}
      <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 print:hidden">
        <div className="container flex items-center justify-center gap-2 text-amber-800 text-sm">
          <AlertTriangle className="w-4 h-4" />
          <span><strong>Disclaimer:</strong> This site is currently under review. This is a test version for evaluation purposes only.</span>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-border/50 sticky top-0 z-10 print:hidden">
        <div className="container py-3 px-4">
          <div className="flex items-center justify-between gap-2">
            {/* Left side - Home button and logo */}
            <div className="flex items-center gap-2 min-w-0">
              <Link href="/">
                <Button variant="outline" size="sm" className="gap-1 text-muted-foreground hover:text-foreground px-2">
                  <Home className="w-4 h-4" />
                  <span className="sm:inline">Home</span>
                </Button>
              </Link>
            </div>
            {/* Right side - Action buttons */}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              <Link href="/resources">
                <Button variant="outline" size="sm" className="px-2 sm:px-3 text-xs sm:text-sm">Resources</Button>
              </Link>
              {isAssessmentComplete && (
                <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1 px-2 sm:px-3">
                  <Printer className="w-4 h-4" />
                  <span className="hidden sm:inline">Print</span>
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={handleReset} className="gap-1 px-2 sm:px-3">
                <RotateCcw className="w-4 h-4" />
                <span className="hidden sm:inline">Reset</span>
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1 container py-8 max-w-4xl">
        {/* Scale Selection */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Select Pain Assessment Scale</CardTitle>
            <CardDescription>Choose the appropriate scale based on patient age and clinical context</CardDescription>
          </CardHeader>
          <CardContent>
            <Select
              value={selectedScale || ''}
              onValueChange={(value) => handleScaleChange(value as PainScaleType)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a pain scale..." />
              </SelectTrigger>
              <SelectContent>
                {scaleOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {scaleInfo && (
              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">{scaleInfo.description}</p>
                <div className="flex flex-wrap gap-4 mt-3 text-sm">
                  <span className="flex items-center gap-1">
                    <Info className="w-4 h-4 text-primary" />
                    Age: {scaleInfo.ageRange}
                  </span>
                  <span className="flex items-center gap-1">
                    <Info className="w-4 h-4 text-primary" />
                    Max Score: {scaleInfo.maxScore}
                  </span>
                  <span className="flex items-center gap-1">
                    <Info className="w-4 h-4 text-primary" />
                    Type: {scaleInfo.type === 'self_report' ? 'Self-Report' : 'Behavioral Observation'}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Assessment Interface */}
        {scaleInfo && (
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{scaleInfo.name} Assessment</CardTitle>
              <CardDescription>{scaleInfo.fullName}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Wong-Baker FACES special rendering with original validated faces image */}
              {selectedScale === 'wong_baker' ? (
                <div className="space-y-4">
                  <div className="bg-muted/50 p-4 sm:p-6 rounded-xl">
                    <p className="text-base font-medium mb-4 text-center">
                      "Point to the face that shows how much you hurt right now."
                    </p>
                    
                    {/* Original Wong-Baker FACES image with clickable face areas and highlight */}
                    <div className="relative flex justify-center mb-2">
                      <div className="relative inline-block">
                        <img 
                          src="/wong-baker-faces-original.webp" 
                          alt="Wong-Baker FACES Pain Rating Scale" 
                          className="max-w-full h-auto"
                        />
                        {/* Clickable overlay areas for each face with highlight when selected */}
                        <div className="absolute inset-0 grid grid-cols-6">
                          {[0, 2, 4, 6, 8, 10].map((score, index) => (
                            <button
                              key={score}
                              onClick={() => handleScoreChange('pain_face', score)}
                              className={`h-full transition-all duration-200 ${
                                scoreData['pain_face'] === score
                                  ? 'bg-primary/30 ring-2 ring-primary ring-inset rounded-lg'
                                  : 'hover:bg-primary/10'
                              }`}
                              aria-label={`Select pain level ${score}: ${wongBakerLabels[score]}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {/* Single row of 6 aligned score buttons */}
                    <div className="grid grid-cols-6 gap-0.5 sm:gap-2 max-w-full">
                      {[0, 2, 4, 6, 8, 10].map((score) => (
                        <button
                          key={score}
                          onClick={() => handleScoreChange('pain_face', score)}
                          className={`flex flex-col items-center justify-start p-1 sm:p-3 rounded-lg border-2 transition-all min-h-[70px] sm:min-h-[90px] ${
                            scoreData['pain_face'] === score
                              ? 'border-primary bg-primary/10 scale-105 shadow-md'
                              : 'border-gray-200 hover:border-primary/50 hover:bg-muted/50'
                          }`}
                        >
                          <span className="text-base sm:text-2xl font-bold">{score}</span>
                          <span className="text-[8px] sm:text-xs text-muted-foreground text-center leading-tight mt-0.5 sm:mt-1 whitespace-normal break-words hyphens-auto">
                            {wongBakerLabels[score]}
                          </span>
                        </button>
                      ))}
                    </div>
                    
                    <p className="text-xs text-center text-muted-foreground mt-4">
                      Wong-Baker FACES® Pain Rating Scale - © 1983 Wong-Baker FACES Foundation. Used with permission.
                    </p>
                  </div>
                </div>
              ) : selectedScale === 'vas' ? (
                /* VAS special rendering */
                <div className="space-y-4">
                  <div className="bg-muted/50 p-6 rounded-xl">
                    <p className="text-base font-medium mb-6 text-center">
                      Mark pain level from 0 (no pain) to 10 (worst pain imaginable)
                    </p>
                    <div className="space-y-6 px-4">
                      <input
                        type="range"
                        min="0"
                        max="10"
                        step="1"
                        value={scoreData['pain_level'] ?? 0}
                        onChange={(e) => handleScoreChange('pain_level', parseInt(e.target.value))}
                        className="w-full h-6 rounded-lg appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, #22c55e 0%, #eab308 50%, #ef4444 100%)`
                        }}
                      />
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">0 - No Pain</span>
                        <span className="font-bold text-4xl">{scoreData['pain_level'] ?? 0}</span>
                        <span className="text-muted-foreground">10 - Worst Pain</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Standard behavioral scale rendering */
                <div className="space-y-6">
                  {scaleInfo.components.map((component) => (
                    <div key={component.id} className="space-y-3">
                      <div>
                        <h3 className="text-base font-semibold">{component.name}</h3>
                        <p className="text-sm text-muted-foreground">{component.description}</p>
                      </div>
                      <div className="grid gap-2">
                        {component.options.map((option, idx) => (
                          <button
                            key={`${component.id}-${idx}`}
                            onClick={() => handleScoreChange(component.id, option.value)}
                            className={`p-4 rounded-lg border-2 text-left transition-all ${
                              scoreData[component.id] === option.value
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/30 hover:bg-muted/30'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex-1">
                                <span className="font-medium">{option.label}</span>
                                <p className="text-sm text-muted-foreground mt-0.5">{option.description}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-lg font-bold w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                                  {option.value}
                                </span>
                                {scoreData[component.id] === option.value && (
                                  <Check className="w-5 h-5 text-primary" />
                                )}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
        
        {/* Score Result */}
        {isAssessmentComplete && scaleInfo && (
          <Card className={`mb-6 border-2 ${painStyle.border}`}>
            <CardContent className={`p-6 ${painStyle.bg}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${painStyle.text} opacity-80`}>Total Score</p>
                  <p className={`text-4xl font-bold ${painStyle.text}`}>
                    {totalScore} <span className="text-xl opacity-70">/ {scaleInfo.maxScore}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${painStyle.text} opacity-80`}>Pain Level</p>
                  <p className={`text-3xl font-bold ${painStyle.text} capitalize`}>{painLevel}</p>
                </div>
              </div>
              
              {/* WHO Ladder Recommendation */}
              {recommendedMedications.step && (
                <div className="mt-4 pt-4 border-t border-current/20">
                  <p className={`text-sm ${painStyle.text}`}>
                    <strong>WHO Analgesic Ladder:</strong> {recommendedMedications.step.name} - {recommendedMedications.step.description}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
        
        {/* Treatment Recommendations */}
        {isAssessmentComplete && (
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary" />
                Treatment Recommendations
              </CardTitle>
              <CardDescription>
                Evidence-based interventions for {painLevel} pain management
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Age Category Selector */}
              <div className="mb-4">
                <label className="text-sm font-medium mb-2 block">Patient Age Category</label>
                <Select
                  value={selectedAgeCategory}
                  onValueChange={(value) => setSelectedAgeCategory(value as typeof selectedAgeCategory)}
                >
                  <SelectTrigger className="w-full md:w-64">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ageCategoryOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Main Treatment Tabs */}
              <Tabs value={interventionTab} onValueChange={(v) => setInterventionTab(v as typeof interventionTab)}>
                <TabsList className="grid w-full grid-cols-3 mb-4 h-auto">
                  <TabsTrigger value="guidelines" className="gap-1 sm:gap-2 px-2 sm:px-3 py-2 text-xs sm:text-sm">
                    <FileText className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                    <span className="truncate">Guidelines</span>
                  </TabsTrigger>
                  <TabsTrigger value="non_pharmacological" className="gap-1 sm:gap-2 px-2 sm:px-3 py-2 text-xs sm:text-sm">
                    <Hand className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                    <span className="truncate">Non-Pharm</span>
                  </TabsTrigger>
                  <TabsTrigger value="pharmacological" className="gap-1 sm:gap-2 px-2 sm:px-3 py-2 text-xs sm:text-sm">
                    <Pill className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                    <span className="truncate">Pharma</span>
                  </TabsTrigger>
                </TabsList>
                
                {/* Guidelines Tab */}
                <TabsContent value="guidelines">
                  <GuidelinesContent painLevel={painLevel} ageCategory={selectedAgeCategory} />
                </TabsContent>
                
                {/* Non-Pharmacological Tab */}
                <TabsContent value="non_pharmacological">
                  <Tabs defaultValue="physical">
                    <TabsList className="flex flex-wrap h-auto gap-1 mb-4">
                      {(['physical', 'psychological', 'environmental', 'pharmacological_adjunct'] as InterventionCategory[]).map((category) => {
                        const Icon = getCategoryIcon(category);
                        return (
                          <TabsTrigger key={category} value={category} className="gap-1 text-xs">
                            <Icon className="w-3 h-3" />
                            {getCategoryLabel(category)}
                          </TabsTrigger>
                        );
                      })}
                    </TabsList>
                    
                    {(['physical', 'psychological', 'environmental', 'pharmacological_adjunct'] as InterventionCategory[]).map((category) => (
                      <TabsContent key={category} value={category} className="mt-4">
                        <div className="space-y-3">
                          {interventionsByCategory[category]?.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-4">
                              No interventions available for this age category
                            </p>
                          ) : (
                            interventionsByCategory[category]?.map((intervention) => (
                              <InterventionCard key={intervention.id} intervention={intervention} />
                            ))
                          )}
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </TabsContent>
                
                {/* Pharmacological Tab */}
                <TabsContent value="pharmacological">
                  {/* Disclaimer */}
                  <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <div className="text-sm text-amber-800">
                        <p className="font-semibold mb-1">Clinical Decision Support Disclaimer</p>
                        <p>Medication dosing is for reference only. Always verify with current formulary, consider patient-specific factors (renal/hepatic function, allergies, drug interactions), and consult pharmacy or clinical guidelines before prescribing.</p>
                      </div>
                    </div>
                  </div>
                  
                  <Tabs defaultValue="non_opioid">
                    <TabsList className="flex flex-wrap h-auto gap-1 mb-4">
                      {medicationCategories.map(({ key }) => {
                        const Icon = getMedCategoryIcon(key);
                        return (
                          <TabsTrigger key={key} value={key} className="gap-1 text-xs">
                            <Icon className="w-3 h-3" />
                            {getMedicationCategoryLabel(key)}
                          </TabsTrigger>
                        );
                      })}
                    </TabsList>
                    
                    {medicationCategories.map(({ key, medications }) => {
                      const filtered = filterMedicationsByAge(medications);
                      return (
                        <TabsContent key={key} value={key} className="mt-4">
                          <div className="space-y-3">
                            {filtered.length === 0 ? (
                              <p className="text-sm text-muted-foreground text-center py-4">
                                No medications available for this age category
                              </p>
                            ) : (
                              filtered.map((medication) => (
                                <MedicationCard key={medication.id} medication={medication} />
                              ))
                            )}
                          </div>
                        </TabsContent>
                      );
                    })}
                  </Tabs>
                  
                  {/* Side Effect Management */}
                  <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Stethoscope className="w-4 h-4" />
                      Opioid Side Effect Management
                    </h4>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-muted-foreground mb-1">Nausea/Vomiting</p>
                        <p>{SIDE_EFFECT_MANAGEMENT.nausea.medication}</p>
                        <p className="text-muted-foreground">{SIDE_EFFECT_MANAGEMENT.nausea.dose}</p>
                      </div>
                      <div>
                        <p className="font-medium text-muted-foreground mb-1">Pruritus</p>
                        {SIDE_EFFECT_MANAGEMENT.pruritus.medications.map((med, idx) => (
                          <p key={idx}>{med.name}: {med.dose}</p>
                        ))}
                      </div>
                      <div>
                        <p className="font-medium text-muted-foreground mb-1">Constipation</p>
                        {SIDE_EFFECT_MANAGEMENT.constipation.medications.map((med, idx) => (
                          <p key={idx}>{med.name}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Naloxone Reversal */}
                  <div className="mt-4">
                    <h4 className="font-semibold mb-3 flex items-center gap-2 text-red-700">
                      <ShieldAlert className="w-4 h-4" />
                      Opioid Reversal (Emergency)
                    </h4>
                    {REVERSAL_MEDICATIONS.map((med) => (
                      <MedicationCard key={med.id} medication={med} />
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
        
        {/* Print-only content */}
        <div className="hidden print:block mt-8 text-sm text-muted-foreground">
          <p>Assessment Date: {new Date().toLocaleString()}</p>
          <p>Generated by PediPain360 - Pediatric Pain Assessment Tool</p>
          <p>Evidence sources: AAP 2024, Canadian Paediatric Society 2022, SickKids Comfort Promise, Stanford Pediatric Pain Reference, WHO Guidelines, Cochrane Reviews</p>
          <p className="mt-2 font-semibold">Disclaimer: Medication dosing is for reference only. Always verify with current formulary and consider patient-specific factors.</p>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-border bg-white py-6 print:hidden">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Heart className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">PediPain360</p>
                <p className="text-xs text-muted-foreground">All-in-One</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Developed by</span>
              <a 
                href="https://www.linkedin.com/in/saad-almodameg-%D8%B3%D8%B9%D8%AF-%D8%A7%D9%84%D9%85%D8%AF%D9%8A%D9%85%D9%8A%D8%BA-5a0a43308"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[#0A66C2] hover:text-[#004182] hover:underline transition-colors"
              >
                Dr. Saad Almodameg
              </a>
              <a 
                href="https://www.linkedin.com/in/saad-almodameg-%D8%B3%D8%B9%D8%AF-%D8%A7%D9%84%D9%85%D8%AF%D9%8A%D9%85%D9%8A%D8%BA-5a0a43308"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5 text-[#0A66C2] hover:text-[#004182] transition-colors"
                aria-label="LinkedIn Profile"
              >
                <span className="font-semibold">Linked</span>
                <span className="font-semibold bg-[#0A66C2] text-white px-1 rounded">in</span>
              </a>
            </div>

            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} PediPain360. For educational purposes.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
