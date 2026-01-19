import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { 
  PAIN_SCALES, 
  INTERVENTIONS,
  getPainLevel, 
  getRecommendedInterventions,
  getAgeCategory,
  type PainScaleType,
  type PainLevel
} from "@shared/painScales";
import { 
  Check, 
  Heart, 
  Info, 
  Loader2, 
  RotateCcw,
  Save,
  Sparkles
} from "lucide-react";
import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

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
      <svg viewBox="0 0 100 100" className="w-12 h-12 md:w-16 md:h-16">
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
      <span className="text-xs font-medium mt-1">{score}</span>
    </button>
  );
};

function getPainLevelBgClass(level: PainLevel): string {
  const classes: Record<PainLevel, string> = {
    none: 'bg-green-100 text-green-800 border-green-200',
    mild: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    moderate: 'bg-orange-100 text-orange-800 border-orange-200',
    severe: 'bg-red-100 text-red-800 border-red-200',
  };
  return classes[level];
}

function QuickAssessmentContent() {
  const [, setLocation] = useLocation();
  const utils = trpc.useUtils();
  
  // Form state
  const [patientId, setPatientId] = useState('');
  const [selectedScale, setSelectedScale] = useState<PainScaleType | null>(null);
  const [scoreData, setScoreData] = useState<Record<string, number>>({});
  const [assessmentContext, setAssessmentContext] = useState<string>('routine');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [selectedInterventions, setSelectedInterventions] = useState<string[]>([]);
  
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
    return Object.keys(scoreData).length === scaleInfo.components.length;
  }, [scaleInfo, scoreData]);
  
  // Get recommended interventions
  const recommendedInterventions = useMemo(() => {
    if (painLevel === 'none') return [];
    // Default to child category for quick assessment
    return getRecommendedInterventions(painLevel, 'child');
  }, [painLevel]);
  
  // Mutations
  const createPatient = trpc.patients.create.useMutation();
  const createAssessment = trpc.assessments.create.useMutation({
    onSuccess: () => {
      toast.success('Assessment saved successfully!');
      handleReset();
    },
    onError: (error) => {
      toast.error('Failed to save: ' + error.message);
    }
  });
  
  // Handle score change
  const handleScoreChange = (componentId: string, value: number) => {
    setScoreData(prev => ({ ...prev, [componentId]: value }));
  };
  
  // Handle scale change - reset scores when scale changes
  const handleScaleChange = (scale: PainScaleType) => {
    setSelectedScale(scale);
    setScoreData({});
    setSelectedInterventions([]);
  };
  
  // Handle reset
  const handleReset = () => {
    setPatientId('');
    setSelectedScale(null);
    setScoreData({});
    setAssessmentContext('routine');
    setClinicalNotes('');
    setSelectedInterventions([]);
  };
  
  // Handle save
  const handleSave = async () => {
    if (!selectedScale || !scaleInfo || !patientId) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      // Create or find patient
      const patient = await createPatient.mutateAsync({
        patientIdentifier: patientId,
      });
      
      // Create assessment
      await createAssessment.mutateAsync({
        patientId: patient.id,
        scaleType: selectedScale,
        scoreData,
        totalScore,
        maxPossibleScore: scaleInfo.maxScore,
        painLevel,
        assessmentContext: assessmentContext as any,
        clinicalNotes: clinicalNotes || undefined,
        interventionsApplied: selectedInterventions,
      });
      
      utils.patients.list.invalidate();
      utils.assessments.listRecent.invalidate();
    } catch (error: any) {
      // If patient already exists, try to find and use it
      if (error.message?.includes('duplicate') || error.message?.includes('exists')) {
        toast.error('Patient ID already exists. Please use a different ID or go to Patient Management.');
      }
    }
  };
  
  // Scale options with age recommendations
  const scaleOptions = Object.values(PAIN_SCALES).map(scale => ({
    value: scale.id,
    label: `${scale.name} (${scale.ageRange})`,
    description: scale.fullName,
  }));
  
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Quick Pain Assessment</h1>
          <p className="text-muted-foreground">Select a pain scale and complete the assessment</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleReset} className="gap-2">
          <RotateCcw className="w-4 h-4" />
          Reset
        </Button>
      </div>
      
      {/* Patient & Scale Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Assessment Setup</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="patientId">Patient ID / MRN *</Label>
              <Input
                id="patientId"
                placeholder="Enter patient identifier"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="context">Assessment Context</Label>
              <Select value={assessmentContext} onValueChange={setAssessmentContext}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="routine">Routine Assessment</SelectItem>
                  <SelectItem value="pre_procedure">Pre-Procedure</SelectItem>
                  <SelectItem value="during_procedure">During Procedure</SelectItem>
                  <SelectItem value="post_procedure">Post-Procedure</SelectItem>
                  <SelectItem value="post_operative">Post-Operative</SelectItem>
                  <SelectItem value="medication_evaluation">Medication Evaluation</SelectItem>
                  <SelectItem value="comfort_check">Comfort Check</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="scale">Pain Assessment Scale *</Label>
            <Select 
              value={selectedScale || ''} 
              onValueChange={(value) => handleScaleChange(value as PainScaleType)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a pain scale..." />
              </SelectTrigger>
              <SelectContent>
                {scaleOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex flex-col">
                      <span className="font-medium">{option.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {scaleInfo && (
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Info className="w-3 h-3" />
                {scaleInfo.description}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Assessment Interface */}
      {scaleInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{scaleInfo.name} Assessment</CardTitle>
            <CardDescription>{scaleInfo.fullName}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Wong-Baker FACES special rendering */}
            {selectedScale === 'wong_baker' ? (
              <div className="space-y-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm font-medium mb-4 text-center">
                    "Point to the face that shows how much you hurt right now."
                  </p>
                  <div className="flex flex-wrap justify-center gap-1 md:gap-2">
                    {[0, 2, 4, 6, 8, 10].map((score) => (
                      <FaceSVG
                        key={score}
                        score={score}
                        selected={scoreData['pain_face'] === score}
                        onClick={() => handleScoreChange('pain_face', score)}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-2 px-4">
                    <span>No Hurt</span>
                    <span>Hurts Worst</span>
                  </div>
                </div>
              </div>
            ) : selectedScale === 'vas' ? (
              /* VAS special rendering */
              <div className="space-y-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm font-medium mb-4 text-center">
                    Mark pain level from 0 (no pain) to 10 (worst pain imaginable)
                  </p>
                  <div className="space-y-4 px-4">
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="1"
                      value={scoreData['pain_level'] ?? 0}
                      onChange={(e) => handleScoreChange('pain_level', parseInt(e.target.value))}
                      className="w-full h-4 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #22c55e 0%, #eab308 50%, #ef4444 100%)`
                      }}
                    />
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">0 - No Pain</span>
                      <span className="font-bold text-2xl">{scoreData['pain_level'] ?? 0}</span>
                      <span className="text-muted-foreground">10 - Worst Pain</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Standard behavioral scale rendering */
              <div className="space-y-6">
                {scaleInfo.components.map((component) => (
                  <div key={component.id} className="space-y-2">
                    <Label className="text-base font-medium">{component.name}</Label>
                    <p className="text-sm text-muted-foreground mb-2">{component.description}</p>
                    <div className="grid gap-2">
                      {component.options.map((option, idx) => (
                        <button
                          key={`${component.id}-${idx}`}
                          onClick={() => handleScoreChange(component.id, option.value)}
                          className={`p-3 rounded-lg border-2 text-left transition-all ${
                            scoreData[component.id] === option.value
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/30'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <span className="font-medium">{option.label}</span>
                              <p className="text-sm text-muted-foreground">{option.description}</p>
                            </div>
                            <div className="flex items-center gap-2 ml-3">
                              <span className="text-sm font-bold w-6 h-6 rounded bg-muted flex items-center justify-center">
                                {option.value}
                              </span>
                              {scoreData[component.id] === option.value && (
                                <Check className="w-4 h-4 text-primary" />
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
            
            {/* Score Summary */}
            {isAssessmentComplete && (
              <div className={`p-4 rounded-lg border-2 ${getPainLevelBgClass(painLevel)}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium opacity-80">Total Score</p>
                    <p className="text-3xl font-bold">{totalScore} <span className="text-lg opacity-70">/ {scaleInfo.maxScore}</span></p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium opacity-80">Pain Level</p>
                    <p className="text-2xl font-bold capitalize">{painLevel}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
      
      {/* Interventions - Show when there's pain */}
      {isAssessmentComplete && painLevel !== 'none' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary" />
              Recommended Interventions
            </CardTitle>
            <CardDescription>Non-pharmacological comfort measures</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              {recommendedInterventions.slice(0, 5).map((interventionId) => {
                const intervention = INTERVENTIONS[interventionId];
                if (!intervention) return null;
                
                return (
                  <button
                    key={interventionId}
                    onClick={() => {
                      setSelectedInterventions(prev =>
                        prev.includes(interventionId)
                          ? prev.filter(i => i !== interventionId)
                          : [...prev, interventionId]
                      );
                    }}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${
                      selectedInterventions.includes(interventionId)
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">{intervention.name}</span>
                        <p className="text-sm text-muted-foreground">{intervention.description}</p>
                      </div>
                      {selectedInterventions.includes(interventionId) && (
                        <Check className="w-5 h-5 text-primary" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Clinical Notes */}
      {selectedScale && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Clinical Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Add any relevant clinical observations..."
              value={clinicalNotes}
              onChange={(e) => setClinicalNotes(e.target.value)}
              rows={3}
            />
          </CardContent>
        </Card>
      )}
      
      {/* Save Button */}
      {isAssessmentComplete && (
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={handleReset}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!patientId || createAssessment.isPending}
            className="gap-2"
          >
            {createAssessment.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Assessment
          </Button>
        </div>
      )}
    </div>
  );
}

export default function QuickAssessment() {
  return (
    <DashboardLayout>
      <QuickAssessmentContent />
    </DashboardLayout>
  );
}
