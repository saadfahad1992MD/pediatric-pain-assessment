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
  recommendScales, 
  getPainLevel, 
  getRecommendedInterventions,
  calculateAgeInDays,
  getAgeCategory,
  formatAge,
  type PainScaleType,
  type PainScaleInfo,
  type PainLevel
} from "@shared/painScales";
import { 
  ArrowLeft, 
  ArrowRight, 
  Baby, 
  Check, 
  ChevronRight, 
  ClipboardCheck, 
  Heart, 
  Info, 
  Loader2, 
  Plus,
  Save,
  Sparkles
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useLocation } from "wouter";
import { toast } from "sonner";

// Wong-Baker FACES SVG components
const FaceSVG = ({ score, selected, onClick }: { score: number; selected: boolean; onClick: () => void }) => {
  const faces: Record<number, { color: string; expression: string }> = {
    0: { color: '#22c55e', expression: 'M 30 45 Q 50 60 70 45' }, // Happy smile
    2: { color: '#84cc16', expression: 'M 30 48 Q 50 55 70 48' }, // Slight smile
    4: { color: '#eab308', expression: 'M 30 50 L 70 50' }, // Neutral
    6: { color: '#f97316', expression: 'M 30 55 Q 50 48 70 55' }, // Slight frown
    8: { color: '#ef4444', expression: 'M 30 58 Q 50 45 70 58' }, // Frown
    10: { color: '#dc2626', expression: 'M 30 60 Q 50 42 70 60' }, // Crying
  };
  
  const face = faces[score] || faces[0];
  
  return (
    <button
      onClick={onClick}
      className={`face-option ${selected ? 'selected' : ''}`}
    >
      <svg viewBox="0 0 100 100" className="w-16 h-16 md:w-20 md:h-20">
        <circle cx="50" cy="50" r="45" fill={face.color} />
        {/* Eyes */}
        <circle cx="35" cy="35" r="5" fill="white" />
        <circle cx="65" cy="35" r="5" fill="white" />
        <circle cx="35" cy="35" r="2" fill="black" />
        <circle cx="65" cy="35" r="2" fill="black" />
        {/* Mouth */}
        <path d={face.expression} stroke="white" strokeWidth="4" fill="none" strokeLinecap="round" />
        {/* Tears for score 10 */}
        {score === 10 && (
          <>
            <ellipse cx="30" cy="45" rx="3" ry="6" fill="#60a5fa" />
            <ellipse cx="70" cy="45" rx="3" ry="6" fill="#60a5fa" />
          </>
        )}
      </svg>
      <span className="text-xs font-medium mt-1">{score}</span>
      <span className="text-[10px] text-muted-foreground">
        {score === 0 ? 'No Hurt' : score === 10 ? 'Worst' : ''}
      </span>
    </button>
  );
};

// Pain level color helper
function getPainLevelColor(level: PainLevel): string {
  const colors: Record<PainLevel, string> = {
    none: 'bg-green-500',
    mild: 'bg-yellow-500',
    moderate: 'bg-orange-500',
    severe: 'bg-red-500',
  };
  return colors[level];
}

function getPainLevelBgClass(level: PainLevel): string {
  const classes: Record<PainLevel, string> = {
    none: 'pain-badge-none',
    mild: 'pain-badge-mild',
    moderate: 'pain-badge-moderate',
    severe: 'pain-badge-severe',
  };
  return classes[level];
}

type Step = 'patient' | 'scale' | 'assessment' | 'interventions' | 'review';

function NewAssessmentContent() {
  const params = useParams<{ patientId?: string }>();
  const [, setLocation] = useLocation();
  const utils = trpc.useUtils();
  
  // Step management
  const [currentStep, setCurrentStep] = useState<Step>('patient');
  
  // Patient selection/creation
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(
    params.patientId ? parseInt(params.patientId) : null
  );
  const [isCreatingPatient, setIsCreatingPatient] = useState(false);
  const [newPatient, setNewPatient] = useState({
    patientIdentifier: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gestationalAgeWeeks: '',
    unitType: '' as string,
    notes: '',
  });
  
  // Scale selection
  const [selectedScale, setSelectedScale] = useState<PainScaleType | null>(null);
  
  // Assessment data
  const [scoreData, setScoreData] = useState<Record<string, number>>({});
  const [assessmentContext, setAssessmentContext] = useState<string>('routine');
  const [clinicalNotes, setClinicalNotes] = useState('');
  
  // Interventions
  const [selectedInterventions, setSelectedInterventions] = useState<string[]>([]);
  
  // Queries
  const { data: patients, isLoading: patientsLoading } = trpc.patients.list.useQuery();
  const { data: selectedPatient } = trpc.patients.get.useQuery(
    { id: selectedPatientId! },
    { enabled: !!selectedPatientId }
  );
  
  // Mutations
  const createPatient = trpc.patients.create.useMutation({
    onSuccess: (patient) => {
      setSelectedPatientId(patient.id);
      setIsCreatingPatient(false);
      utils.patients.list.invalidate();
      toast.success('Patient created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create patient: ' + error.message);
    }
  });
  
  const createAssessment = trpc.assessments.create.useMutation({
    onSuccess: () => {
      toast.success('Assessment saved successfully');
      setLocation('/history');
    },
    onError: (error) => {
      toast.error('Failed to save assessment: ' + error.message);
    }
  });
  
  // Calculate recommended scales based on patient age
  const recommendedScales = useMemo(() => {
    if (!selectedPatient?.dateOfBirth) return Object.values(PAIN_SCALES);
    
    const dob = new Date(selectedPatient.dateOfBirth);
    const gestationalWeeks = selectedPatient.gestationalAgeWeeks || undefined;
    const recommended = recommendScales(dob, gestationalWeeks);
    
    return recommended.map(id => PAIN_SCALES[id]);
  }, [selectedPatient]);
  
  // Calculate total score
  const totalScore = useMemo(() => {
    return Object.values(scoreData).reduce((sum, val) => sum + val, 0);
  }, [scoreData]);
  
  // Get pain level
  const painLevel = useMemo(() => {
    if (!selectedScale) return 'none' as PainLevel;
    return getPainLevel(selectedScale, totalScore);
  }, [selectedScale, totalScore]);
  
  // Get recommended interventions
  const recommendedInterventions = useMemo(() => {
    if (!selectedPatient?.dateOfBirth) return [];
    
    const dob = new Date(selectedPatient.dateOfBirth);
    const ageInDays = calculateAgeInDays(dob, selectedPatient.gestationalAgeWeeks || undefined);
    const ageCategory = getAgeCategory(ageInDays);
    
    return getRecommendedInterventions(painLevel, ageCategory);
  }, [selectedPatient, painLevel]);
  
  // Get patient age string
  const patientAge = useMemo(() => {
    if (!selectedPatient?.dateOfBirth) return '';
    return formatAge(
      new Date(selectedPatient.dateOfBirth),
      selectedPatient.gestationalAgeWeeks || undefined
    );
  }, [selectedPatient]);
  
  // Get scale info
  const scaleInfo = selectedScale ? PAIN_SCALES[selectedScale] : null;
  
  // Handle patient creation
  const handleCreatePatient = () => {
    if (!newPatient.patientIdentifier) {
      toast.error('Patient identifier is required');
      return;
    }
    
    createPatient.mutate({
      patientIdentifier: newPatient.patientIdentifier,
      firstName: newPatient.firstName || undefined,
      lastName: newPatient.lastName || undefined,
      dateOfBirth: newPatient.dateOfBirth || undefined,
      gestationalAgeWeeks: newPatient.gestationalAgeWeeks ? parseInt(newPatient.gestationalAgeWeeks) : undefined,
      unitType: newPatient.unitType as any || undefined,
      notes: newPatient.notes || undefined,
    });
  };
  
  // Handle score change
  const handleScoreChange = (componentId: string, value: number) => {
    setScoreData(prev => ({ ...prev, [componentId]: value }));
  };
  
  // Handle submit
  const handleSubmit = () => {
    if (!selectedPatientId || !selectedScale || !scaleInfo) return;
    
    createAssessment.mutate({
      patientId: selectedPatientId,
      scaleType: selectedScale,
      scoreData,
      totalScore,
      maxPossibleScore: scaleInfo.maxScore,
      painLevel,
      assessmentContext: assessmentContext as any,
      clinicalNotes: clinicalNotes || undefined,
      interventionsApplied: selectedInterventions,
      patientAgeAtAssessment: patientAge,
    });
  };
  
  // Step navigation
  const canProceed = () => {
    switch (currentStep) {
      case 'patient':
        return !!selectedPatientId;
      case 'scale':
        return !!selectedScale;
      case 'assessment':
        return scaleInfo && Object.keys(scoreData).length === scaleInfo.components.length;
      case 'interventions':
        return true;
      case 'review':
        return true;
      default:
        return false;
    }
  };
  
  const nextStep = () => {
    const steps: Step[] = ['patient', 'scale', 'assessment', 'interventions', 'review'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };
  
  const prevStep = () => {
    const steps: Step[] = ['patient', 'scale', 'assessment', 'interventions', 'review'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };
  
  // Step indicator
  const steps: { id: Step; label: string }[] = [
    { id: 'patient', label: 'Patient' },
    { id: 'scale', label: 'Scale' },
    { id: 'assessment', label: 'Assessment' },
    { id: 'interventions', label: 'Interventions' },
    { id: 'review', label: 'Review' },
  ];
  
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">New Pain Assessment</h1>
          <p className="text-muted-foreground">Follow the steps to complete a pain assessment</p>
        </div>
      </div>
      
      {/* Step Indicator */}
      <div className="flex items-center justify-between bg-card rounded-lg p-4 border border-border">
        {steps.map((step, index) => {
          const isActive = step.id === currentStep;
          const isPast = steps.findIndex(s => s.id === currentStep) > index;
          
          return (
            <div key={step.id} className="flex items-center">
              <div className="flex items-center gap-2">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${isActive ? 'bg-primary text-primary-foreground' : ''}
                  ${isPast ? 'bg-green-500 text-white' : ''}
                  ${!isActive && !isPast ? 'bg-muted text-muted-foreground' : ''}
                `}>
                  {isPast ? <Check className="w-4 h-4" /> : index + 1}
                </div>
                <span className={`text-sm hidden sm:inline ${isActive ? 'font-medium' : 'text-muted-foreground'}`}>
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <ChevronRight className="w-4 h-4 mx-2 text-muted-foreground" />
              )}
            </div>
          );
        })}
      </div>
      
      {/* Step Content */}
      <Card>
        <CardContent className="pt-6">
          {/* Step 1: Patient Selection */}
          {currentStep === 'patient' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-2">Select or Create Patient</h2>
                <p className="text-sm text-muted-foreground">
                  Choose an existing patient or create a new one for this assessment
                </p>
              </div>
              
              {!isCreatingPatient ? (
                <>
                  {/* Existing Patients */}
                  <div className="space-y-3">
                    {patientsLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                      </div>
                    ) : patients && patients.length > 0 ? (
                      patients.map((patient) => (
                        <button
                          key={patient.id}
                          onClick={() => setSelectedPatientId(patient.id)}
                          className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                            selectedPatientId === patient.id
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/30'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                              <Baby className="w-5 h-5 text-secondary-foreground" />
                            </div>
                            <div>
                              <p className="font-medium">
                                {patient.firstName} {patient.lastName || patient.patientIdentifier}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                ID: {patient.patientIdentifier}
                                {patient.dateOfBirth && ` • ${formatAge(new Date(patient.dateOfBirth), patient.gestationalAgeWeeks || undefined)}`}
                              </p>
                            </div>
                            {selectedPatientId === patient.id && (
                              <Check className="w-5 h-5 text-primary ml-auto" />
                            )}
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No patients found. Create a new patient to continue.
                      </div>
                    )}
                  </div>
                  
                  <Button
                    variant="outline"
                    className="w-full gap-2"
                    onClick={() => setIsCreatingPatient(true)}
                  >
                    <Plus className="w-4 h-4" />
                    Create New Patient
                  </Button>
                </>
              ) : (
                /* New Patient Form */
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="patientId">Patient Identifier *</Label>
                      <Input
                        id="patientId"
                        placeholder="MRN or ID"
                        value={newPatient.patientIdentifier}
                        onChange={(e) => setNewPatient(p => ({ ...p, patientIdentifier: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dob">Date of Birth</Label>
                      <Input
                        id="dob"
                        type="date"
                        value={newPatient.dateOfBirth}
                        onChange={(e) => setNewPatient(p => ({ ...p, dateOfBirth: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        placeholder="First name"
                        value={newPatient.firstName}
                        onChange={(e) => setNewPatient(p => ({ ...p, firstName: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        placeholder="Last name"
                        value={newPatient.lastName}
                        onChange={(e) => setNewPatient(p => ({ ...p, lastName: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gestationalAge">Gestational Age (weeks)</Label>
                      <Input
                        id="gestationalAge"
                        type="number"
                        min="22"
                        max="44"
                        placeholder="For premature infants"
                        value={newPatient.gestationalAgeWeeks}
                        onChange={(e) => setNewPatient(p => ({ ...p, gestationalAgeWeeks: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="unitType">Unit Type</Label>
                      <Select
                        value={newPatient.unitType}
                        onValueChange={(value) => setNewPatient(p => ({ ...p, unitType: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="nicu">NICU</SelectItem>
                          <SelectItem value="picu">PICU</SelectItem>
                          <SelectItem value="pediatric_ward">Pediatric Ward</SelectItem>
                          <SelectItem value="emergency">Emergency</SelectItem>
                          <SelectItem value="outpatient">Outpatient</SelectItem>
                          <SelectItem value="surgery">Surgery</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Additional notes about the patient"
                      value={newPatient.notes}
                      onChange={(e) => setNewPatient(p => ({ ...p, notes: e.target.value }))}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsCreatingPatient(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreatePatient}
                      disabled={createPatient.isPending}
                    >
                      {createPatient.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      Create Patient
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Step 2: Scale Selection */}
          {currentStep === 'scale' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-2">Select Pain Assessment Scale</h2>
                <p className="text-sm text-muted-foreground">
                  {patientAge && `Patient age: ${patientAge}. `}
                  Recommended scales are highlighted based on the patient's age.
                </p>
              </div>
              
              {/* Recommended Scales */}
              {recommendedScales.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-primary">
                    <Sparkles className="w-4 h-4" />
                    Recommended for this patient
                  </div>
                  <div className="grid gap-3">
                    {recommendedScales.map((scale) => (
                      <button
                        key={scale.id}
                        onClick={() => setSelectedScale(scale.id)}
                        className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                          selectedScale === scale.id
                            ? 'border-primary bg-primary/5'
                            : 'border-primary/30 hover:border-primary/50 bg-primary/5'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{scale.name}</h3>
                              <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                                {scale.type === 'self_report' ? 'Self-Report' : 'Behavioral'}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{scale.fullName}</p>
                            <p className="text-sm text-muted-foreground">Age: {scale.ageRange}</p>
                          </div>
                          {selectedScale === scale.id && (
                            <Check className="w-5 h-5 text-primary" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* All Scales */}
              <div className="space-y-3">
                <div className="text-sm font-medium text-muted-foreground">All available scales</div>
                <div className="grid gap-3">
                  {Object.values(PAIN_SCALES)
                    .filter(scale => !recommendedScales.find(r => r.id === scale.id))
                    .map((scale) => (
                      <button
                        key={scale.id}
                        onClick={() => setSelectedScale(scale.id)}
                        className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                          selectedScale === scale.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/30'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{scale.name}</h3>
                              <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                                {scale.type === 'self_report' ? 'Self-Report' : 'Behavioral'}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{scale.fullName}</p>
                            <p className="text-sm text-muted-foreground">Age: {scale.ageRange}</p>
                          </div>
                          {selectedScale === scale.id && (
                            <Check className="w-5 h-5 text-primary" />
                          )}
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Step 3: Assessment */}
          {currentStep === 'assessment' && scaleInfo && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-2">{scaleInfo.name} Assessment</h2>
                <p className="text-sm text-muted-foreground">{scaleInfo.description}</p>
              </div>
              
              {/* Assessment Context */}
              <div className="space-y-2">
                <Label>Assessment Context</Label>
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
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Wong-Baker FACES special rendering */}
              {selectedScale === 'wong_baker' ? (
                <div className="space-y-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm font-medium mb-4">
                      Ask the child: "Point to the face that shows how much you hurt right now."
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
                  </div>
                </div>
              ) : selectedScale === 'vas' ? (
                /* VAS special rendering */
                <div className="space-y-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm font-medium mb-4">
                      Ask the patient to mark their pain level on the scale from 0 (no pain) to 10 (worst pain).
                    </p>
                    <div className="space-y-4">
                      <input
                        type="range"
                        min="0"
                        max="10"
                        step="1"
                        value={scoreData['pain_level'] || 0}
                        onChange={(e) => handleScoreChange('pain_level', parseInt(e.target.value))}
                        className="w-full h-3 rounded-lg appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, #22c55e 0%, #eab308 50%, #ef4444 100%)`
                        }}
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>0 - No Pain</span>
                        <span className="font-bold text-lg text-foreground">
                          {scoreData['pain_level'] || 0}
                        </span>
                        <span>10 - Worst Pain</span>
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
                        <h3 className="font-medium">{component.name}</h3>
                        <p className="text-sm text-muted-foreground">{component.description}</p>
                      </div>
                      <div className="grid gap-2">
                        {component.options.map((option, idx) => (
                          <button
                            key={`${component.id}-${idx}`}
                            onClick={() => handleScoreChange(component.id, option.value)}
                            className={`scale-option text-left ${
                              scoreData[component.id] === option.value ? 'selected' : ''
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="font-medium">{option.label}</span>
                                <p className="text-sm text-muted-foreground">{option.description}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold px-2 py-1 bg-muted rounded">
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
              <div className={`p-4 rounded-lg ${getPainLevelBgClass(painLevel)}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Current Score</p>
                    <p className="text-2xl font-bold">{totalScore} / {scaleInfo.maxScore}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">Pain Level</p>
                    <p className="text-xl font-bold capitalize">{painLevel}</p>
                  </div>
                </div>
              </div>
              
              {/* Clinical Notes */}
              <div className="space-y-2">
                <Label htmlFor="clinicalNotes">Clinical Notes (Optional)</Label>
                <Textarea
                  id="clinicalNotes"
                  placeholder="Add any relevant clinical observations..."
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}
          
          {/* Step 4: Interventions */}
          {currentStep === 'interventions' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-2">Non-Pharmacological Interventions</h2>
                <p className="text-sm text-muted-foreground">
                  Select interventions applied or recommended based on the assessment results.
                </p>
              </div>
              
              {painLevel !== 'none' && recommendedInterventions.length > 0 && (
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-primary font-medium mb-3">
                    <Sparkles className="w-4 h-4" />
                    Recommended Interventions
                  </div>
                  <div className="grid gap-2">
                    {recommendedInterventions.map((interventionId) => {
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
                              ? 'border-primary bg-primary/10'
                              : 'border-border hover:border-primary/30'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{intervention.name}</span>
                                <span className={`text-xs px-1.5 py-0.5 rounded ${
                                  intervention.evidenceLevel === 'A' ? 'bg-green-100 text-green-700' :
                                  intervention.evidenceLevel === 'B' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-gray-100 text-gray-700'
                                }`}>
                                  Level {intervention.evidenceLevel}
                                </span>
                              </div>
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
                </div>
              )}
              
              <div className="space-y-3">
                <div className="text-sm font-medium text-muted-foreground">All Interventions</div>
                <div className="grid gap-2">
                  {Object.values(INTERVENTIONS)
                    .filter(i => !recommendedInterventions.includes(i.id))
                    .map((intervention) => (
                      <button
                        key={intervention.id}
                        onClick={() => {
                          setSelectedInterventions(prev =>
                            prev.includes(intervention.id)
                              ? prev.filter(i => i !== intervention.id)
                              : [...prev, intervention.id]
                          );
                        }}
                        className={`p-3 rounded-lg border-2 text-left transition-all ${
                          selectedInterventions.includes(intervention.id)
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/30'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-medium">{intervention.name}</span>
                            <p className="text-sm text-muted-foreground">{intervention.description}</p>
                          </div>
                          {selectedInterventions.includes(intervention.id) && (
                            <Check className="w-5 h-5 text-primary" />
                          )}
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Step 5: Review */}
          {currentStep === 'review' && scaleInfo && selectedPatient && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-2">Review Assessment</h2>
                <p className="text-sm text-muted-foreground">
                  Review the assessment details before saving.
                </p>
              </div>
              
              {/* Patient Info */}
              <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="font-medium mb-2">Patient Information</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Name:</span>{' '}
                    <span className="font-medium">
                      {selectedPatient.firstName} {selectedPatient.lastName || selectedPatient.patientIdentifier}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">ID:</span>{' '}
                    <span className="font-medium">{selectedPatient.patientIdentifier}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Age:</span>{' '}
                    <span className="font-medium">{patientAge}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Unit:</span>{' '}
                    <span className="font-medium capitalize">{selectedPatient.unitType?.replace('_', ' ') || 'N/A'}</span>
                  </div>
                </div>
              </div>
              
              {/* Assessment Summary */}
              <div className={`rounded-lg p-4 ${getPainLevelBgClass(painLevel)}`}>
                <h3 className="font-medium mb-3">Assessment Results</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm opacity-80">Scale Used</p>
                    <p className="font-semibold">{scaleInfo.name}</p>
                  </div>
                  <div>
                    <p className="text-sm opacity-80">Context</p>
                    <p className="font-semibold capitalize">{assessmentContext.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <p className="text-sm opacity-80">Total Score</p>
                    <p className="text-2xl font-bold">{totalScore} / {scaleInfo.maxScore}</p>
                  </div>
                  <div>
                    <p className="text-sm opacity-80">Pain Level</p>
                    <p className="text-2xl font-bold capitalize">{painLevel}</p>
                  </div>
                </div>
              </div>
              
              {/* Score Breakdown */}
              <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="font-medium mb-3">Score Breakdown</h3>
                <div className="space-y-2">
                  {scaleInfo.components.map((component) => {
                    const score = scoreData[component.id];
                    const option = component.options.find(o => o.value === score);
                    return (
                      <div key={component.id} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{component.name}:</span>
                        <span className="font-medium">{option?.label || 'N/A'} ({score})</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Interventions */}
              {selectedInterventions.length > 0 && (
                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="font-medium mb-3">Selected Interventions</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedInterventions.map((id) => {
                      const intervention = INTERVENTIONS[id as keyof typeof INTERVENTIONS];
                      return (
                        <span key={id} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                          {intervention?.name || id}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
              
              {/* Clinical Notes */}
              {clinicalNotes && (
                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="font-medium mb-2">Clinical Notes</h3>
                  <p className="text-sm text-muted-foreground">{clinicalNotes}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 'patient'}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </Button>
        
        {currentStep === 'review' ? (
          <Button
            onClick={handleSubmit}
            disabled={createAssessment.isPending}
            className="gap-2"
          >
            {createAssessment.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Assessment
          </Button>
        ) : (
          <Button
            onClick={nextStep}
            disabled={!canProceed()}
            className="gap-2"
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

export default function NewAssessment() {
  return (
    <DashboardLayout>
      <NewAssessmentContent />
    </DashboardLayout>
  );
}
