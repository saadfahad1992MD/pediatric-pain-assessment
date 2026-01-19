import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PAIN_SCALES, INTERVENTIONS } from "@shared/painScales";
import { 
  Baby, 
  BookOpen, 
  ChevronRight, 
  ExternalLink, 
  FileText, 
  GraduationCap, 
  Heart, 
  Info, 
  Lightbulb, 
  Scale, 
  Stethoscope 
} from "lucide-react";
import { Link } from "wouter";

function ResourcesContent() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Educational Resources</h1>
        <p className="text-muted-foreground">
          Learn about pediatric pain assessment scales, best practices, and intervention strategies
        </p>
      </div>
      
      <Tabs defaultValue="scales" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="scales">Pain Scales</TabsTrigger>
          <TabsTrigger value="interventions">Interventions</TabsTrigger>
          <TabsTrigger value="guidelines">Guidelines</TabsTrigger>
        </TabsList>
        
        {/* Pain Scales Tab */}
        <TabsContent value="scales" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="w-5 h-5" />
                Pain Assessment Scales
              </CardTitle>
              <CardDescription>
                Validated tools for measuring pain in pediatric patients across different age groups
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {Object.values(PAIN_SCALES).map((scale) => (
                  <Link key={scale.id} href={`/resources/${scale.id}`}>
                    <div className="p-4 rounded-lg border border-border hover:bg-muted/50 hover:border-primary/30 transition-all cursor-pointer">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg">{scale.name}</h3>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              scale.type === 'self_report' 
                                ? 'bg-blue-100 text-blue-700' 
                                : 'bg-green-100 text-green-700'
                            }`}>
                              {scale.type === 'self_report' ? 'Self-Report' : 'Behavioral'}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{scale.fullName}</p>
                          <div className="flex flex-wrap gap-4 text-sm">
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <Baby className="w-4 h-4" />
                              {scale.ageRange}
                            </span>
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <FileText className="w-4 h-4" />
                              Max Score: {scale.maxScore}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                            {scale.description}
                          </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0 ml-4" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Scale Selection Guide */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Scale Selection Guide
              </CardTitle>
              <CardDescription>
                How to choose the appropriate pain assessment scale
              </CardDescription>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">For Neonates (≤48 weeks PMA)</h4>
                  <p className="text-sm text-blue-800">
                    Use <strong>PIPP-R</strong> for procedural pain assessment. It accounts for gestational age 
                    and behavioral state, making it ideal for premature infants in the NICU.
                  </p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-900 mb-2">For Infants (0-12 months)</h4>
                  <p className="text-sm text-green-800">
                    Use <strong>NIPS</strong> for general pain assessment or <strong>FLACC</strong> for 
                    post-operative pain. Both rely on behavioral observation.
                  </p>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-900 mb-2">For Toddlers & Young Children (1-7 years)</h4>
                  <p className="text-sm text-purple-800">
                    Use <strong>FLACC</strong> for non-verbal children or <strong>CHEOPS</strong> for 
                    post-operative settings. For children 3+ who can self-report, consider <strong>Wong-Baker FACES</strong>.
                  </p>
                </div>
                
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <h4 className="font-semibold text-orange-900 mb-2">For Older Children & Adolescents (8+ years)</h4>
                  <p className="text-sm text-orange-800">
                    Use <strong>VAS</strong> or <strong>Wong-Baker FACES</strong> for self-report. 
                    These scales allow patients to directly communicate their pain level.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Interventions Tab */}
        <TabsContent value="interventions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Non-Pharmacological Interventions
              </CardTitle>
              <CardDescription>
                Evidence-based comfort measures for pediatric pain management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {Object.values(INTERVENTIONS).filter(i => i.id !== 'other').map((intervention) => (
                  <div 
                    key={intervention.id}
                    className="p-4 rounded-lg border border-border"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold">{intervention.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        intervention.evidenceLevel === 'A' ? 'bg-green-100 text-green-700' :
                        intervention.evidenceLevel === 'B' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        Evidence Level {intervention.evidenceLevel}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{intervention.description}</p>
                    
                    <div className="space-y-2">
                      <div>
                        <span className="text-xs font-medium text-muted-foreground">Age Appropriate:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {intervention.ageAppropriate.map(age => (
                            <span key={age} className="text-xs px-2 py-0.5 bg-muted rounded-full capitalize">
                              {age}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-xs font-medium text-muted-foreground">Instructions:</span>
                        <ul className="mt-1 space-y-1">
                          {intervention.instructions.map((instruction, idx) => (
                            <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                              {instruction}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {intervention.contraindications && (
                        <div>
                          <span className="text-xs font-medium text-destructive">Contraindications:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {intervention.contraindications.map(c => (
                              <span key={c} className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full">
                                {c}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Evidence Levels */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                Evidence Level Definitions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-sm font-medium">A</span>
                  <div>
                    <p className="font-medium">Strong Evidence</p>
                    <p className="text-sm text-muted-foreground">
                      Supported by multiple high-quality randomized controlled trials with consistent results
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">B</span>
                  <div>
                    <p className="font-medium">Moderate Evidence</p>
                    <p className="text-sm text-muted-foreground">
                      Supported by limited randomized trials or well-designed observational studies
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">C</span>
                  <div>
                    <p className="font-medium">Expert Opinion</p>
                    <p className="text-sm text-muted-foreground">
                      Based on clinical experience, expert consensus, or case studies
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Guidelines Tab */}
        <TabsContent value="guidelines" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Clinical Guidelines
              </CardTitle>
              <CardDescription>
                Best practices for pediatric pain assessment and management
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Assessment Frequency */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Stethoscope className="w-4 h-4" />
                  Assessment Frequency
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-3 font-medium">Clinical Context</th>
                        <th className="text-left py-2 px-3 font-medium">Recommended Frequency</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2 px-3">Routine Assessment</td>
                        <td className="py-2 px-3">Every 4-8 hours</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 px-3">Post-Operative</td>
                        <td className="py-2 px-3">Every 1-2 hours initially, then every 4 hours</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 px-3">During Procedure</td>
                        <td className="py-2 px-3">Continuous monitoring</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 px-3">After Pain Intervention</td>
                        <td className="py-2 px-3">30-60 minutes post-intervention</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3">NICU Patients</td>
                        <td className="py-2 px-3">Before and after all procedures</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Key Principles */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Key Principles of Pediatric Pain Assessment
                </h3>
                <div className="space-y-3">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-medium mb-1">1. Pain is Subjective</p>
                    <p className="text-sm text-muted-foreground">
                      When possible, the child's self-report should be the primary source of pain assessment. 
                      For non-verbal patients, behavioral observation is essential.
                    </p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-medium mb-1">2. Use Age-Appropriate Tools</p>
                    <p className="text-sm text-muted-foreground">
                      Select assessment scales validated for the patient's developmental stage. 
                      Consider gestational age for premature infants.
                    </p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-medium mb-1">3. Document Consistently</p>
                    <p className="text-sm text-muted-foreground">
                      Use the same scale for serial assessments to track trends. 
                      Document the context, interventions, and effectiveness.
                    </p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-medium mb-1">4. Treat Pain Promptly</p>
                    <p className="text-sm text-muted-foreground">
                      Pain scores should trigger appropriate interventions. 
                      Combine pharmacological and non-pharmacological approaches.
                    </p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-medium mb-1">5. Involve Families</p>
                    <p className="text-sm text-muted-foreground">
                      Parents and caregivers can provide valuable insights into the child's pain behaviors 
                      and participate in comfort measures.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* External Resources */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  External Resources
                </h3>
                <div className="space-y-2">
                  <a 
                    href="https://childkindinternational.org" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <span className="font-medium">ChildKind International</span>
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </a>
                  <a 
                    href="https://wongbakerfaces.org" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <span className="font-medium">Wong-Baker FACES Foundation</span>
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </a>
                  <a 
                    href="https://www.iasp-pain.org" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <span className="font-medium">International Association for the Study of Pain</span>
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function Resources() {
  return (
    <DashboardLayout>
      <ResourcesContent />
    </DashboardLayout>
  );
}
