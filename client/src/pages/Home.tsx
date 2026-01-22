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
              <h3 className="text-lg font-semibold text-gray-900">Share PediPain360</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowQRCode(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex justify-center p-4 bg-gray-50 rounded-lg border">
              <QRCodeSVG 
                value="https://pedipain360.com" 
                size={180}
                level="H"
                includeMargin={true}
              />
            </div>
            <p className="text-center text-sm text-gray-500 mt-3">
              Scan the QR code to share the website
            </p>
            
            {/* WhatsApp Share Button */}
            <a 
              href={`https://wa.me/?text=${encodeURIComponent('Check out PediPain360 - All-in-One Pediatric Pain Assessment Hub: https://pedipain360.com')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Share via WhatsApp
            </a>
            
            {/* Twitter/X Share Button */}
            <a 
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent('Check out PediPain360 - All-in-One Pediatric Pain Assessment Hub')}&url=${encodeURIComponent('https://pedipain360.com')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 w-full flex items-center justify-center gap-2 bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              Share via X (Twitter)
            </a>
            
            {/* Copy Link Button */}
            <button 
              onClick={() => {
                navigator.clipboard.writeText('https://pedipain360.com').then(() => {
                  alert('Link copied to clipboard!');
                });
              }}
              className="mt-2 w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg border border-gray-300 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy Link
            </button>
            
            {/* Website URL Display */}
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">Website:</p>
              <p className="text-primary font-semibold text-lg">pedipain360.com</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
