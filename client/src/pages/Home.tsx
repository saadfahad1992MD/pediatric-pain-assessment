import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { 
  Activity, 
  Baby, 
  BookOpen, 
  ChevronRight, 
  ClipboardList, 
  Heart, 
  LineChart, 
  Shield,
  Stethoscope,
  Users
} from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Heart className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="font-semibold text-lg text-foreground">PediPain</h1>
              <p className="text-xs text-muted-foreground">Pediatric Pain Assessment</p>
            </div>
          </div>
          <nav className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
                <Link href="/resources">
                  <Button variant="ghost">Resources</Button>
                </Link>
                <span className="text-sm text-muted-foreground">
                  Welcome, {user?.name || 'Provider'}
                </span>
              </>
            ) : (
              <a href={getLoginUrl()}>
                <Button>Sign In</Button>
              </a>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-primary/5 to-background">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              Evidence-Based Pain Assessment
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
              Accurate Pain Assessment for Every Child
            </h1>
            <p className="text-xl text-muted-foreground mb-8 text-balance">
              A comprehensive AI-powered tool that helps healthcare providers select and use 
              age-appropriate pain measurement scales for pediatric patients from neonates to adolescents.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <>
                  <Link href="/assessment/new">
                    <Button size="lg" className="gap-2">
                      <ClipboardList className="w-5 h-5" />
                      Start Assessment
                    </Button>
                  </Link>
                  <Link href="/dashboard">
                    <Button size="lg" variant="outline" className="gap-2">
                      <Activity className="w-5 h-5" />
                      View Dashboard
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <a href={getLoginUrl()}>
                    <Button size="lg" className="gap-2">
                      Get Started
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </a>
                  <Link href="/resources">
                    <Button size="lg" variant="outline" className="gap-2">
                      <BookOpen className="w-5 h-5" />
                      Learn More
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Comprehensive Pain Assessment Tools
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Access validated pain scales designed for different age groups and clinical contexts
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="clinical-card">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                  <Baby className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Age-Based Scale Selection</CardTitle>
                <CardDescription>
                  Automatic recommendation of appropriate pain scales based on patient age and gestational status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    PIPP-R for neonates ≤48 weeks PMA
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    FLACC for 2 months - 7 years
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Wong-Baker FACES for 3+ years
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="clinical-card">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mb-4">
                  <Stethoscope className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Interactive Assessment</CardTitle>
                <CardDescription>
                  Visual scale representations with real-time scoring calculation and pain level interpretation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
                    Visual faces for self-report scales
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
                    Behavioral indicators for observation
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
                    Instant score calculation
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="clinical-card">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                  <LineChart className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>History Tracking</CardTitle>
                <CardDescription>
                  Longitudinal monitoring with timestamps, scores, and contextual notes for trend analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                    Assessment history timeline
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                    Pain trend visualization
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                    Clinical notes documentation
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="clinical-card">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle>Intervention Recommendations</CardTitle>
                <CardDescription>
                  Evidence-based non-pharmacological interventions tailored to age and pain level
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-600" />
                    Sucrose and skin-to-skin for neonates
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-600" />
                    Distraction techniques for children
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-600" />
                    Effectiveness tracking
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="clinical-card">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-teal-100 flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-teal-600" />
                </div>
                <CardTitle>Educational Resources</CardTitle>
                <CardDescription>
                  Comprehensive guides on each pain scale with usage instructions and interpretation guidelines
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-teal-600" />
                    Scale-specific instructions
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-teal-600" />
                    Scoring interpretation guides
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-teal-600" />
                    Clinical best practices
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="clinical-card">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-pink-100 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-pink-600" />
                </div>
                <CardTitle>Patient Management</CardTitle>
                <CardDescription>
                  Organize assessments by patient with export and print functionality for care coordination
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-pink-600" />
                    Patient profiles and history
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-pink-600" />
                    Export assessment reports
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-pink-600" />
                    Print-friendly formats
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pain Scales Overview */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Validated Pain Assessment Scales
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our tool incorporates internationally recognized, evidence-based pain scales
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {[
              { name: 'PIPP-R', age: '≤48 weeks PMA', type: 'Behavioral', color: 'bg-blue-500' },
              { name: 'NIPS', age: '0-12 months', type: 'Behavioral', color: 'bg-green-500' },
              { name: 'FLACC', age: '2mo - 7 years', type: 'Behavioral', color: 'bg-purple-500' },
              { name: 'CHEOPS', age: '1-7 years', type: 'Behavioral', color: 'bg-orange-500' },
              { name: 'Wong-Baker', age: '3+ years', type: 'Self-Report', color: 'bg-pink-500' },
              { name: 'VAS', age: '8+ years', type: 'Self-Report', color: 'bg-teal-500' },
            ].map((scale) => (
              <div key={scale.name} className="flex items-center gap-4 p-4 bg-card rounded-lg border border-border">
                <div className={`w-3 h-12 rounded-full ${scale.color}`} />
                <div>
                  <h3 className="font-semibold text-foreground">{scale.name}</h3>
                  <p className="text-sm text-muted-foreground">{scale.age}</p>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                    {scale.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary/5">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Ready to Improve Pain Assessment?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join healthcare providers using evidence-based tools for accurate pediatric pain assessment.
            </p>
            {isAuthenticated ? (
              <Link href="/assessment/new">
                <Button size="lg" className="gap-2">
                  <ClipboardList className="w-5 h-5" />
                  Start Your First Assessment
                </Button>
              </Link>
            ) : (
              <a href={getLoginUrl()}>
                <Button size="lg" className="gap-2">
                  Get Started Free
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border bg-card">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary" />
              <span className="font-semibold">PediPain</span>
              <span className="text-muted-foreground text-sm">
                © {new Date().getFullYear()} All rights reserved
              </span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Based on validated scales from ChildKind International and clinical best practices
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
