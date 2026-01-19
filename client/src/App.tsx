import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import NewAssessment from "./pages/NewAssessment";
import AssessmentHistory from "./pages/AssessmentHistory";
import PatientManagement from "./pages/PatientManagement";
import Resources from "./pages/Resources";
import ScaleGuide from "./pages/ScaleGuide";
import QuickAssessment from "./pages/QuickAssessment";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/assessment/new" component={QuickAssessment} />
      <Route path="/assessment/wizard" component={NewAssessment} />
      <Route path="/assessment/new/:patientId" component={NewAssessment} />
      <Route path="/history" component={AssessmentHistory} />
      <Route path="/history/:patientId" component={AssessmentHistory} />
      <Route path="/patients" component={PatientManagement} />
      <Route path="/resources" component={Resources} />
      <Route path="/resources/:scaleId" component={ScaleGuide} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
