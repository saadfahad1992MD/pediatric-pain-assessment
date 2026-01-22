import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BookOpen, 
  ClipboardList, 
  Heart, 
  Shield,
  AlertTriangle,
  Layers,
  Pill,
  Zap,
  Share2,
  X,
  QrCode
} from "lucide-react";
import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Link } from "wouter";

export default function Home() {
  const [showQRCode, setShowQRCode] = useState(false);

  // Handle share
  const handleShare = async () => {
    const shareData = {
      title: 'PediPain360 - Pediatric Pain Assessment',
      text: 'All-in-One Pediatric Pain Assessment and Management Hub for healthcare providers',
      url: window.location.origin,
    };
    
    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled or error - fallback to copy
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  // Copy URL to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.origin).then(() => {
      alert('Link copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy link');
    });
  };

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
        <div className="container flex items-center justify-between h-14 sm:h-16 px-3 sm:px-4">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
            <div className="min-w-0">
              <h1 className="font-semibold text-base sm:text-lg text-foreground truncate">PediPain360</h1>
              <p className="text-xs text-muted-foreground">All-in-One</p>
              <p className="text-xs text-muted-foreground pl-[1.1rem]">Hub</p>
            </div>
          </div>
          <nav className="flex items-center gap-1 sm:gap-2 shrink-0">
            <Button variant="outline" size="sm" onClick={() => setShowQRCode(true)} className="gap-1 px-2 sm:px-3">
              <QrCode className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </Button>
            <Link href="/resources">
              <Button variant="outline" size="sm" className="text-sm px-3 sm:px-4">Resources</Button>
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
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
              PediPain360
            </h1>
            <p className="text-xl text-primary font-medium mb-6">
              All-in-One Pediatric Pain Assessment and Management Hub
            </p>
            <p className="text-lg text-muted-foreground mb-8 text-balance">
              A comprehensive website that helps healthcare providers to get the <span className="font-semibold text-foreground">Right Assessment</span>, the <span className="font-semibold text-foreground">Right Treatment</span>, the <span className="font-semibold text-foreground">Right Recommendations</span>.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/assessment/new">
                <Button size="lg" className="gap-2">
                  <ClipboardList className="w-5 h-5" />
                  Start Assessment
                </Button>
              </Link>
              <Link href="/resources">
                <Button size="lg" variant="outline" className="gap-2 border-green-600 text-green-700 hover:bg-green-50 hover:text-green-800">
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
                  <Layers className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>All Assessment Tools in One Place</CardTitle>
                <CardDescription>
                  Access 6 validated pain scales designed for all pediatric age groups - from premature neonates to adolescents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    PIPP-R, NIPS, FLACC, CHEOPS
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Wong-Baker FACES, VAS
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Behavioral & self-report scales
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="clinical-card">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mb-4">
                  <Pill className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>All Treatment & Recommendations in One Place</CardTitle>
                <CardDescription>
                  Evidence-based pharmacological and non-pharmacological interventions with clinical guidelines
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
                    WHO analgesic ladder guidance
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
                    Age-specific medication dosing
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
                    Non-pharmacological strategies
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="clinical-card">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle>Instant Calculation in One Place</CardTitle>
                <CardDescription>
                  Real-time pain score calculation with automatic severity classification and treatment recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-600" />
                    Automatic score computation
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-600" />
                    Pain level classification
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-600" />
                    Printable assessment reports
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
                <p className="text-xs text-muted-foreground">All-in-One</p>
                <p className="text-xs text-muted-foreground pl-[1.1rem]">Hub</p>
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

      {/* QR Code Modal */}
      {showQRCode && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowQRCode(false)}>
          <div className="bg-white rounded-lg p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Scan to Share</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowQRCode(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex justify-center p-4 bg-white rounded-lg">
              <QRCodeSVG 
                value={window.location.origin} 
                size={200}
                level="H"
                includeMargin={true}
              />
            </div>
            <p className="text-center text-sm text-muted-foreground mt-4">
              Scan this QR code to open PediPain360 on another device
            </p>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" className="flex-1" onClick={copyToClipboard}>
                Copy Link
              </Button>
              <Button className="flex-1" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
