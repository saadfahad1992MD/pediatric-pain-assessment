import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  PAIN_SCALES, 
  INTERVENTIONS,
  getPainLevel, 
  getRecommendedInterventions,
  type PainScaleType,
  type PainLevel
} from "@shared/painScales";
import { 
  Check, 
  Heart, 
  Info, 
  RotateCcw,
  Printer,
  ArrowLeft
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "wouter";

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

export default function QuickAssessment() {
  // Form state
  const [selectedScale, setSelectedScale] = useState<PainScaleType | null>(null);
  const [scoreData, setScoreData] = useState<Record<string, number>>({});
  
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
    return getRecommendedInterventions(painLevel, 'child');
  }, [painLevel]);
  
  // Handle score change
  const handleScoreChange = (componentId: string, value: number) => {
    setScoreData(prev => ({ ...prev, [componentId]: value }));
  };
  
  // Handle scale change - reset scores when scale changes
  const handleScaleChange = (scale: PainScaleType) => {
    setSelectedScale(scale);
    setScoreData({});
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
      
      <main className="container py-8 max-w-2xl">
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
            </CardContent>
          </Card>
        )}
        
        {/* Interventions - Show when there's pain */}
        {isAssessmentComplete && painLevel !== 'none' && recommendedInterventions.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary" />
                Recommended Interventions
              </CardTitle>
              <CardDescription>Non-pharmacological comfort measures</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {recommendedInterventions.slice(0, 5).map((interventionId) => {
                  const intervention = INTERVENTIONS[interventionId];
                  if (!intervention) return null;
                  
                  return (
                    <div
                      key={interventionId}
                      className="p-4 rounded-lg border bg-muted/30"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <span className="font-medium">{intervention.name}</span>
                          <p className="text-sm text-muted-foreground mt-0.5">{intervention.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Print-only content */}
        <div className="hidden print:block mt-8 text-sm text-muted-foreground">
          <p>Assessment Date: {new Date().toLocaleString()}</p>
          <p>Generated by PediPain - Pediatric Pain Assessment Tool</p>
        </div>
      </main>
    </div>
  );
}
