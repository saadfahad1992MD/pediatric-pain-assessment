import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Baby, 
  BookOpen, 
  ClipboardList, 
  Heart, 
  Shield,
  Stethoscope,
  AlertTriangle,
  Linkedin
} from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Disclaimer Banner */}
      <div className="bg-amber-50 border-b border-amber-200 px-4 py-2">
        <div className="container flex items-center justify-center gap-2 text-amber-800 text-sm">
          <AlertTriangle className="w-4 h-4" />
          <span><strong>Disclaimer:</strong> This site is currently under review. This is a test version for evaluation purposes only.</span>
        </div>
      </div>

      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Heart className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="font-semibold text-lg text-foreground">PediPain360</h1>
              <p className="text-xs text-muted-foreground">Pediatric Pain Assessment</p>
            </div>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/assessment/new">
              <Button variant="ghost">New Assessment</Button>
            </Link>
            <Link href="/resources">
              <Button variant="ghost">Resources</Button>
            </Link>
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
              A comprehensive tool that helps healthcare providers select and use 
              age-appropriate pain measurement scales for pediatric patients from neonates to adolescents.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/assessment/new">
                <Button size="lg" className="gap-2">
                  <ClipboardList className="w-5 h-5" />
                  Start Assessment
                </Button>
              </Link>
              <Link href="/resources">
                <Button size="lg" variant="outline" className="gap-2">
                  <BookOpen className="w-5 h-5" />
                  Resources
                </Button>
              </Link>
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
                <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle>Intervention Recommendations</CardTitle>
                <CardDescription>
                  Evidence-based pharmacological and non-pharmacological interventions tailored to age and pain level
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-600" />
                    Medication dosing guidance
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-600" />
                    Non-pharmacological strategies
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-600" />
                    WHO analgesic ladder
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Supported Scales Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container">
          <h2 className="text-2xl font-bold text-center mb-8">Validated Pain Scales</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: "PIPP-R", age: "Neonates", gradient: "from-pink-500 to-rose-500" },
              { name: "NIPS", age: "Infants <1yr", gradient: "from-purple-500 to-violet-500" },
              { name: "FLACC", age: "2mo - 7yr", gradient: "from-blue-500 to-cyan-500" },
              { name: "CHEOPS", age: "1-7yr Post-op", gradient: "from-teal-500 to-emerald-500" },
              { name: "Wong-Baker", age: "3+ years", gradient: "from-amber-500 to-orange-500" },
              { name: "VAS", age: "8+ years", gradient: "from-red-500 to-pink-500" },
            ].map((scale) => (
              <div 
                key={scale.name} 
                className={`bg-gradient-to-br ${scale.gradient} rounded-xl p-5 text-center shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer`}
              >
                <p className="font-bold text-white text-lg">{scale.name}</p>
                <p className="text-sm text-white/90">{scale.age}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-border bg-card py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Heart className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">PediPain360</p>
                <p className="text-xs text-muted-foreground">Pediatric Pain Assessment Tool</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Developed by</span>
              <span className="font-medium text-foreground">Dr. Saad Almodameg</span>
              <a 
                href="https://www.linkedin.com/in/saad-almodameg-%D8%B3%D8%B9%D8%AF-%D8%A7%D9%84%D9%85%D8%AF%D9%8A%D9%85%D9%8A%D8%BA-5a0a43308"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#0A66C2] text-white hover:bg-[#004182] transition-colors"
                aria-label="LinkedIn Profile"
              >
                <Linkedin className="w-4 h-4" />
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
