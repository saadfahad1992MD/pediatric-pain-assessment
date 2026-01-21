import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Resources from "./pages/Resources";
import ScaleGuide from "./pages/ScaleGuide";
import QuickAssessment from "./pages/QuickAssessment";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/assessment/new" component={QuickAssessment} />
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
