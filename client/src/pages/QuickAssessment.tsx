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
  Activity
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "wouter";
import { DoseCalculatorPanel } from "@/components/DoseCalculator";

// Wong-Baker FACES SVG components
const FaceSVG = ({ score, selected, onClick }: { score: number; selected: boolean; onClick: () => void }) => {
  const faces: Record<number, { color: string; expression: string }> = {
    0: { color: '#22c55e', expression: 'M 30 45 Q 50 60 70 45' },
    2: { color: '#84cc16', expression: 'M 30 48 Q 50 55 70 48' },
    4: { color: '#eab308', expression: 'M 30 50 L 70 50' },
    6: { color: '#f97316', expression: 'M 30 55 Q 50 48 70 55' },
    8: { color: '#ef4444', expression: 'M 30 58 Q 50 45 70 58' },
    10: { color: '#dc2626', expression: 'M 30 60 Q 50 42 70 60' },
  };
  
  const face = faces[score] || faces[0];
  
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center p-2 rounded-lg border-2 transition-all ${
        selected 
          ? 'border-primary bg-primary/10 scale-105' 
          : 'border-transparent hover:border-primary/30 hover:bg-muted/50'
      }`}
    >
      <svg viewBox="0 0 100 100" className="w-14 h-14 md:w-20 md:h-20">
        <circle cx="50" cy="50" r="45" fill={face.color} />
        <circle cx="35" cy="35" r="5" fill="white" />
        <circle cx="65" cy="35" r="5" fill="white" />
        <circle cx="35" cy="35" r="2" fill="black" />
        <circle cx="65" cy="35" r="2" fill="black" />
        <path d={face.expression} stroke="white" strokeWidth="4" fill="none" strokeLinecap="round" />
        {score === 10 && (
          <>
            <ellipse cx="30" cy="45" rx="3" ry="6" fill="#60a5fa" />
            <ellipse cx="70" cy="45" rx="3" ry="6" fill="#60a5fa" />
          </>
        )}
      </svg>
      <span className="text-sm font-bold mt-1">{score}</span>
    </button>
  );
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
          
          {/* Black Box Warning */}
          {medication.blackBoxWarning && (
            <div className="bg-red-100 border border-red-300 p-3 rounded-lg">
              <p className="text-sm text-red-800 font-medium">{medication.blackBoxWarning}</p>
            </div>
          )}
          
          {/* Dosing Table */}
          <div>
            <h4 className="text-sm font-semibold flex items-center gap-2 mb-2">
              <Syringe className="w-4 h-4 text-primary" />
              Dosing
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left p-2 border">Route</th>
                    <th className="text-left p-2 border">Dose</th>
                    <th className="text-left p-2 border">Frequency</th>
                    <th className="text-left p-2 border">Max/Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {medication.dosing.map((dose, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="p-2 border font-medium">{dose.route}</td>
                      <td className="p-2 border">{dose.dose}</td>
                      <td className="p-2 border">{dose.frequency}</td>
                      <td className="p-2 border text-muted-foreground">
                        {dose.maxDose && <span className="block">{dose.maxDose}</span>}
                        {dose.notes && <span className="text-xs">{dose.notes}</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Indications */}
          {medication.indications.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold flex items-center gap-2 mb-2">
                <Check className="w-4 h-4 text-green-600" />
                Indications
              </h4>
              <div className="flex flex-wrap gap-1">
                {medication.indications.map((indication, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs bg-green-50 text-green-800 border-green-200">
                    {indication}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {/* Contraindications */}
          {medication.contraindications.length > 0 && (
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
          {medication.sideEffects.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold flex items-center gap-2 mb-2">
                <Info className="w-4 h-4 text-amber-500" />
                Side Effects
              </h4>
              <div className="flex flex-wrap gap-1">
                {medication.sideEffects.map((effect, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs bg-amber-50 text-amber-800 border-amber-200">
                    {effect}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {/* Precautions */}
          {medication.precautions.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold flex items-center gap-2 mb-2">
                <Lightbulb className="w-4 h-4 text-blue-500" />
                Precautions
              </h4>
              <ul className="text-sm space-y-1">
                {medication.precautions.map((precaution, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>{precaution}</span>
                  </li>
                ))}
              </ul>
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

export default function QuickAssessment() {
  // Form state
  const [selectedScale, setSelectedScale] = useState<PainScaleType | null>(null);
  const [scoreData, setScoreData] = useState<Record<string, number>>({});
  const [selectedAgeCategory, setSelectedAgeCategory] = useState<'neonate' | 'infant' | 'toddler' | 'child' | 'adolescent'>('child');
  const [interventionTab, setInterventionTab] = useState<'non_pharmacological' | 'pharmacological'>('non_pharmacological');
  
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
        // Codeine and tramadol - not for <12
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
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-border/50 sticky top-0 z-10 print:hidden">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
              </Link>
              <div className="h-6 w-px bg-border" />
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary" />
                <span className="font-semibold text-lg">Pain Assessment</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isAssessmentComplete && (
                <Button variant="outline" size="sm" onClick={handlePrint} className="gap-2">
                  <Printer className="w-4 h-4" />
                  Print
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={handleReset} className="gap-2">
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container py-8 max-w-4xl">
        {/* Scale Selection */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Select Pain Scale</CardTitle>
            <CardDescription>Choose the appropriate scale based on patient age</CardDescription>
          </CardHeader>
          <CardContent>
            <Select 
              value={selectedScale || ''} 
              onValueChange={(value) => handleScaleChange(value as PainScaleType)}
            >
              <SelectTrigger className="w-full text-base">
                <SelectValue placeholder="Select a pain scale..." />
              </SelectTrigger>
              <SelectContent>
                {scaleOptions.map(option => (
                  <SelectItem key={option.value} value={option.value} className="text-base py-3">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {scaleInfo && (
              <p className="text-sm text-muted-foreground mt-3 flex items-start gap-2">
                <Info className="w-4 h-4 mt-0.5 shrink-0" />
                {scaleInfo.description}
              </p>
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
              {/* Wong-Baker FACES special rendering */}
              {selectedScale === 'wong_baker' ? (
                <div className="space-y-4">
                  <div className="bg-muted/50 p-6 rounded-xl">
                    <p className="text-base font-medium mb-6 text-center">
                      "Point to the face that shows how much you hurt right now."
                    </p>
                    <div className="flex flex-wrap justify-center gap-2 md:gap-4">
                      {[0, 2, 4, 6, 8, 10].map((score) => (
                        <FaceSVG
                          key={score}
                          score={score}
                          selected={scoreData['pain_face'] === score}
                          onClick={() => handleScoreChange('pain_face', score)}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground mt-4 px-4">
                      <span>No Hurt</span>
                      <span>Hurts Worst</span>
                    </div>
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
                    <strong>WHO Analgesic Ladder:</strong> {recommendedMedications.step.name} — {recommendedMedications.step.description}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
        
        {/* Interventions Section - Combined Non-Pharmacological and Pharmacological */}
        {isAssessmentComplete && painLevel !== 'none' && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary" />
                Treatment Recommendations
              </CardTitle>
              <CardDescription>
                Evidence-based interventions from AAP, CPS, SickKids, Stanford, and WHO Guidelines
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
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ageCategoryOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Main Tabs: Non-Pharmacological vs Pharmacological */}
              <Tabs value={interventionTab} onValueChange={(v) => setInterventionTab(v as typeof interventionTab)} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="non_pharmacological" className="gap-2">
                    <Hand className="w-4 h-4" />
                    Non-Pharmacological
                  </TabsTrigger>
                  <TabsTrigger value="pharmacological" className="gap-2">
                    <Pill className="w-4 h-4" />
                    Pharmacological
                  </TabsTrigger>
                </TabsList>
                
                {/* Non-Pharmacological Tab */}
                <TabsContent value="non_pharmacological">
                  {/* Evidence Level Legend */}
                  <div className="flex flex-wrap gap-3 mb-4 p-3 bg-muted/30 rounded-lg">
                    <span className="text-sm font-medium">Evidence Levels:</span>
                    <Badge variant="outline" className={`text-xs ${getEvidenceBadgeStyle('A')}`}>
                      A - Strong (Cochrane/Meta-analysis)
                    </Badge>
                    <Badge variant="outline" className={`text-xs ${getEvidenceBadgeStyle('B')}`}>
                      B - Good (RCTs/Guidelines)
                    </Badge>
                    <Badge variant="outline" className={`text-xs ${getEvidenceBadgeStyle('C')}`}>
                      C - Limited (Clinical Practice)
                    </Badge>
                  </div>
                  
                  {/* Tabbed Interventions by Category */}
                  <Tabs defaultValue="physical" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
                      {(['physical', 'psychological', 'environmental', 'pharmacological_adjunct'] as InterventionCategory[]).map((category) => {
                        const Icon = getCategoryIcon(category);
                        const count = interventionsByCategory[category].length;
                        return (
                          <TabsTrigger 
                            key={category} 
                            value={category}
                            className="flex flex-col gap-1 py-2 px-2 text-xs"
                          >
                            <Icon className="w-4 h-4" />
                            <span className="hidden md:inline">{getCategoryLabel(category)}</span>
                            <span className="md:hidden">{category === 'pharmacological_adjunct' ? 'Adjuncts' : getCategoryLabel(category).split(' ')[0]}</span>
                            <span className="text-muted-foreground">({count})</span>
                          </TabsTrigger>
                        );
                      })}
                    </TabsList>
                    
                    {(['physical', 'psychological', 'environmental', 'pharmacological_adjunct'] as InterventionCategory[]).map((category) => (
                      <TabsContent key={category} value={category} className="mt-4">
                        <div className="space-y-3">
                          {interventionsByCategory[category].length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-4">
                              No interventions available for this age category
                            </p>
                          ) : (
                            interventionsByCategory[category].map((intervention) => (
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
                  {/* Important Notice */}
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg mb-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <div className="text-sm text-amber-800">
                        <p className="font-semibold mb-1">Clinical Decision Support</p>
                        <p>Dosing information is for reference only. Always verify with current formulary, consider patient-specific factors (weight, renal/hepatic function, allergies), and follow institutional protocols. Consult pharmacy for complex cases.</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Weight-Based Dose Calculator */}
                  <div className="mb-6">
                    <DoseCalculatorPanel 
                      medications={[
                        ...filterMedicationsByAge(NON_OPIOID_MEDICATIONS),
                        ...filterMedicationsByAge(OPIOID_MEDICATIONS),
                        ...filterMedicationsByAge(INTRANASAL_MEDICATIONS)
                      ]}
                      ageCategory={selectedAgeCategory}
                    />
                  </div>
                  
                  {/* Medication Categories */}
                  <Tabs defaultValue="non_opioid" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 md:grid-cols-5 h-auto mb-4">
                      {medicationCategories.map(({ key, medications }) => {
                        const Icon = getMedCategoryIcon(key);
                        const filtered = filterMedicationsByAge(medications);
                        return (
                          <TabsTrigger 
                            key={key} 
                            value={key}
                            className="flex flex-col gap-1 py-2 px-1 text-xs"
                          >
                            <Icon className="w-4 h-4" />
                            <span className="hidden md:inline text-xs">{getMedicationCategoryLabel(key)}</span>
                            <span className="md:hidden text-xs">
                              {key === 'non_opioid' ? 'Non-Opioid' : 
                               key === 'topical_local' ? 'Topical' :
                               key === 'intranasal' ? 'IN' :
                               getMedicationCategoryLabel(key).split(' ')[0]}
                            </span>
                            <span className="text-muted-foreground">({filtered.length})</span>
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
          <p>Generated by PediPain - Pediatric Pain Assessment Tool</p>
          <p>Evidence sources: AAP 2024, Canadian Paediatric Society 2022, SickKids Comfort Promise, Stanford Pediatric Pain Reference, WHO Guidelines, Cochrane Reviews</p>
          <p className="mt-2 font-semibold">Disclaimer: Medication dosing is for reference only. Always verify with current formulary and consider patient-specific factors.</p>
        </div>
      </main>
    </div>
  );
}
