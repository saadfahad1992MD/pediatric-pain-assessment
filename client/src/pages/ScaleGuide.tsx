import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PAIN_SCALES, type PainScaleType } from "@shared/painScales";
import { 
  ArrowLeft, 
  Baby, 
  BookOpen, 
  CheckCircle, 
  ClipboardList, 
  FileText, 
  Info, 
  Scale 
} from "lucide-react";
import { Link, useParams, Redirect } from "wouter";

function ScaleGuideContent() {
  const params = useParams<{ scaleId: string }>();
  const scaleId = params.scaleId as PainScaleType;
  
  const scale = PAIN_SCALES[scaleId];
  
  if (!scale) {
    return <Redirect to="/resources" />;
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link href="/resources">
            <Button variant="ghost" size="sm" className="gap-1 mb-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Resources
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">{scale.name}</h1>
          <p className="text-lg text-muted-foreground">{scale.fullName}</p>
        </div>
        <Link href="/assessment/new">
          <Button className="gap-2">
            <ClipboardList className="w-4 h-4" />
            Use This Scale
          </Button>
        </Link>
      </div>
      
      {/* Overview */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Baby className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Age Range</p>
                <p className="font-semibold">{scale.ageRange}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Scale className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Scale Type</p>
                <p className="font-semibold capitalize">
                  {scale.type === 'self_report' ? 'Self-Report' : 'Behavioral Observation'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Score Range</p>
                <p className="font-semibold">0 - {scale.maxScore}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            About This Scale
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{scale.description}</p>
          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
            <p className="font-medium text-primary mb-1">Best Used For:</p>
            <p className="text-sm text-muted-foreground">{scale.useCase}</p>
          </div>
          <p className="text-sm text-muted-foreground">{scale.ageRangeDescription}</p>
        </CardContent>
      </Card>
      
      {/* Scoring Components */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Scoring Components
          </CardTitle>
          <CardDescription>
            Each component is scored and summed for the total pain score
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {scale.components.map((component, index) => (
              <div key={component.id} className="border-b border-border pb-6 last:border-0 last:pb-0">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold">{component.name}</h3>
                    <p className="text-sm text-muted-foreground">{component.description}</p>
                  </div>
                </div>
                
                <div className="ml-11 space-y-2">
                  {component.options.map((option, optIdx) => (
                    <div 
                      key={`${component.id}-${optIdx}`}
                      className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                    >
                      <span className="w-8 h-8 rounded-lg bg-background border border-border flex items-center justify-center font-semibold text-sm shrink-0">
                        {option.value}
                      </span>
                      <div>
                        <p className="font-medium">{option.label}</p>
                        <p className="text-sm text-muted-foreground">{option.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Scoring Interpretation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Score Interpretation
          </CardTitle>
          <CardDescription>
            How to interpret the total score
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {scale.scoringGuide.map((threshold) => (
              <div 
                key={threshold.level}
                className="flex items-center gap-4 p-4 rounded-lg"
                style={{ backgroundColor: `${threshold.color}15` }}
              >
                <div 
                  className="w-4 h-full min-h-[3rem] rounded-full"
                  style={{ backgroundColor: threshold.color }}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-semibold capitalize">{threshold.level} Pain</span>
                    <span className="text-sm px-2 py-0.5 rounded-full bg-background border border-border">
                      Score: {threshold.minScore} - {threshold.maxScore}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{threshold.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Usage Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {scale.type === 'behavioral' ? (
              <>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                    <span className="text-green-600 text-xs font-bold">1</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Observe the patient for at least 30 seconds before scoring each component.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                    <span className="text-green-600 text-xs font-bold">2</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Score based on the most consistent behavior observed during the assessment period.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                    <span className="text-green-600 text-xs font-bold">3</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Consider the patient's baseline behavior and any factors that may affect expression.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                    <span className="text-green-600 text-xs font-bold">4</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Document the context (e.g., post-procedure, at rest) for accurate interpretation.
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <span className="text-blue-600 text-xs font-bold">1</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Explain the scale to the patient in age-appropriate language before assessment.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <span className="text-blue-600 text-xs font-bold">2</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Allow the patient time to understand and respond without rushing.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <span className="text-blue-600 text-xs font-bold">3</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Accept the patient's self-report as the primary indicator of pain.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <span className="text-blue-600 text-xs font-bold">4</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    If the patient cannot self-report, consider using a behavioral scale instead.
                  </p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ScaleGuide() {
  return (
    <DashboardLayout>
      <ScaleGuideContent />
    </DashboardLayout>
  );
}
