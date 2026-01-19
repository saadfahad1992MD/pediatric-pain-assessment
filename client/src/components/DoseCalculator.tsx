import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calculator, 
  AlertTriangle, 
  Info,
  Scale,
  Pill,
  Syringe,
  Check,
  X
} from "lucide-react";
import { type MedicationInfo, type DosingInfo } from "@shared/pharmacologicalInterventions";

interface ParsedDose {
  minDose: number;
  maxDose: number;
  unit: string;
  perKg: boolean;
  route: string;
  frequency: string;
  maxDoseLimit?: number;
  maxDoseUnit?: string;
  notes?: string;
}

// Parse dose string like "0.05-0.1 mg/kg/dose" or "10-15 mg/kg/dose"
function parseDoseString(doseStr: string): { min: number; max: number; unit: string } | null {
  // Handle "NOT RECOMMENDED" or similar
  if (doseStr.includes('NOT') || doseStr.includes('N/A')) {
    return null;
  }
  
  // Match patterns like "0.05-0.1 mg/kg/dose" or "10-15 mg/kg/dose" or "5 mg/kg/dose"
  const rangeMatch = doseStr.match(/(\d+\.?\d*)\s*-\s*(\d+\.?\d*)\s*(mg|mcg|g|mL)\/kg/i);
  if (rangeMatch) {
    return {
      min: parseFloat(rangeMatch[1]),
      max: parseFloat(rangeMatch[2]),
      unit: rangeMatch[3]
    };
  }
  
  // Match single dose like "5 mg/kg/dose"
  const singleMatch = doseStr.match(/(\d+\.?\d*)\s*(mg|mcg|g|mL)\/kg/i);
  if (singleMatch) {
    return {
      min: parseFloat(singleMatch[1]),
      max: parseFloat(singleMatch[1]),
      unit: singleMatch[2]
    };
  }
  
  return null;
}

// Parse max dose string like "75 mg/kg/day (max 4g/day)" or "30 mg/dose"
function parseMaxDose(maxDoseStr?: string): { perKgDay?: number; absoluteMax?: number; absoluteUnit?: string } | null {
  if (!maxDoseStr) return null;
  
  const result: { perKgDay?: number; absoluteMax?: number; absoluteUnit?: string } = {};
  
  // Match per kg per day like "75 mg/kg/day"
  const perKgMatch = maxDoseStr.match(/(\d+\.?\d*)\s*(mg|mcg|g)\/kg\/day/i);
  if (perKgMatch) {
    result.perKgDay = parseFloat(perKgMatch[1]);
  }
  
  // Match absolute max like "max 4g/day" or "(max 4g/day)"
  const absoluteMatch = maxDoseStr.match(/max\s*(\d+\.?\d*)\s*(mg|mcg|g)\/day/i);
  if (absoluteMatch) {
    result.absoluteMax = parseFloat(absoluteMatch[1]);
    result.absoluteUnit = absoluteMatch[2];
    // Convert g to mg for comparison
    if (result.absoluteUnit === 'g') {
      result.absoluteMax *= 1000;
      result.absoluteUnit = 'mg';
    }
  }
  
  // Match single dose max like "30 mg/dose"
  const singleMaxMatch = maxDoseStr.match(/(\d+\.?\d*)\s*(mg|mcg|g)\/dose/i);
  if (singleMaxMatch && !result.absoluteMax) {
    result.absoluteMax = parseFloat(singleMaxMatch[1]);
    result.absoluteUnit = singleMaxMatch[2];
  }
  
  return Object.keys(result).length > 0 ? result : null;
}

// Round dose to practical value
function roundDose(dose: number, unit: string): number {
  if (unit === 'mcg') {
    // Round mcg to nearest 5 or 10
    if (dose < 50) return Math.round(dose / 5) * 5;
    return Math.round(dose / 10) * 10;
  }
  if (unit === 'mg') {
    // Round mg based on size
    if (dose < 1) return Math.round(dose * 100) / 100; // 2 decimal places
    if (dose < 10) return Math.round(dose * 10) / 10; // 1 decimal place
    if (dose < 100) return Math.round(dose);
    return Math.round(dose / 5) * 5; // Round to nearest 5
  }
  return Math.round(dose * 100) / 100;
}

interface CalculatedDose {
  route: string;
  frequency: string;
  minDose: number;
  maxDose: number;
  unit: string;
  exceedsMax: boolean;
  maxWarning?: string;
  notes?: string;
}

interface DoseCalculatorProps {
  medication: MedicationInfo;
  weight: number;
}

function DoseCalculatorCard({ medication, weight }: DoseCalculatorProps) {
  const calculatedDoses = useMemo(() => {
    if (!weight || weight <= 0) return [];
    
    const results: CalculatedDose[] = [];
    
    medication.dosing.forEach((dose) => {
      const parsed = parseDoseString(dose.dose);
      if (!parsed) return;
      
      const minCalc = roundDose(parsed.min * weight, parsed.unit);
      const maxCalc = roundDose(parsed.max * weight, parsed.unit);
      
      const maxDoseInfo = parseMaxDose(dose.maxDose);
      
      let exceedsMax = false;
      let maxWarning: string | undefined;
      
      if (maxDoseInfo) {
        if (maxDoseInfo.absoluteMax) {
          if (maxCalc > maxDoseInfo.absoluteMax) {
            exceedsMax = true;
            maxWarning = `Calculated dose exceeds maximum of ${maxDoseInfo.absoluteMax} ${maxDoseInfo.absoluteUnit}/dose`;
          }
        }
      }
      
      results.push({
        route: dose.route,
        frequency: dose.frequency,
        minDose: minCalc,
        maxDose: maxCalc,
        unit: parsed.unit,
        exceedsMax,
        maxWarning,
        notes: dose.notes
      });
    });
    
    return results;
  }, [medication, weight]);
  
  if (calculatedDoses.length === 0) {
    return (
      <div className="text-sm text-muted-foreground p-3 bg-muted/30 rounded-lg">
        <Info className="w-4 h-4 inline mr-2" />
        Weight-based dosing not available for this medication
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Scale className="w-4 h-4" />
        Calculated for <strong className="text-foreground">{weight} kg</strong>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-primary/10">
              <th className="text-left p-2 border font-medium">Route</th>
              <th className="text-left p-2 border font-medium">Calculated Dose</th>
              <th className="text-left p-2 border font-medium">Frequency</th>
              <th className="text-left p-2 border font-medium">Notes</th>
            </tr>
          </thead>
          <tbody>
            {calculatedDoses.map((dose, idx) => (
              <tr key={idx} className={`border-b ${dose.exceedsMax ? 'bg-red-50' : ''}`}>
                <td className="p-2 border font-medium">{dose.route}</td>
                <td className="p-2 border">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-primary">
                      {dose.minDose === dose.maxDose 
                        ? `${dose.minDose} ${dose.unit}`
                        : `${dose.minDose}-${dose.maxDose} ${dose.unit}`
                      }
                    </span>
                    {dose.exceedsMax && (
                      <Badge variant="destructive" className="text-xs">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Exceeds Max
                      </Badge>
                    )}
                  </div>
                  {dose.maxWarning && (
                    <p className="text-xs text-red-600 mt-1">{dose.maxWarning}</p>
                  )}
                </td>
                <td className="p-2 border">{dose.frequency}</td>
                <td className="p-2 border text-muted-foreground text-xs">{dose.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface DoseCalculatorPanelProps {
  medications: MedicationInfo[];
  ageCategory: string;
}

export function DoseCalculatorPanel({ medications, ageCategory }: DoseCalculatorPanelProps) {
  const [weight, setWeight] = useState<string>('');
  const [selectedMed, setSelectedMed] = useState<string | null>(null);
  
  const weightNum = parseFloat(weight) || 0;
  
  // Weight validation based on age category
  const weightValidation = useMemo(() => {
    if (!weight) return { valid: true, message: '' };
    
    const w = parseFloat(weight);
    if (isNaN(w) || w <= 0) {
      return { valid: false, message: 'Please enter a valid weight' };
    }
    
    // Reasonable weight ranges by age
    const ranges: Record<string, { min: number; max: number; typical: string }> = {
      neonate: { min: 0.5, max: 6, typical: '2-4 kg' },
      infant: { min: 3, max: 12, typical: '5-10 kg' },
      toddler: { min: 8, max: 20, typical: '10-15 kg' },
      child: { min: 15, max: 50, typical: '20-35 kg' },
      adolescent: { min: 30, max: 120, typical: '40-70 kg' },
    };
    
    const range = ranges[ageCategory] || ranges.child;
    
    if (w < range.min) {
      return { valid: false, message: `Weight seems low for ${ageCategory}. Typical range: ${range.typical}` };
    }
    if (w > range.max) {
      return { valid: false, message: `Weight seems high for ${ageCategory}. Typical range: ${range.typical}` };
    }
    
    return { valid: true, message: '' };
  }, [weight, ageCategory]);
  
  // Filter medications that have weight-based dosing
  const medicationsWithDosing = medications.filter(med => 
    med.dosing.some(d => d.dose.includes('/kg'))
  );
  
  return (
    <Card className="border-primary/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Calculator className="w-5 h-5 text-primary" />
          Weight-Based Dose Calculator
        </CardTitle>
        <CardDescription>
          Enter patient weight to calculate exact medication doses
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Weight Input */}
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <Label htmlFor="weight" className="text-sm font-medium">
              Patient Weight
            </Label>
            <div className="flex items-center gap-2 mt-1">
              <Input
                id="weight"
                type="number"
                step="0.1"
                min="0.5"
                max="150"
                placeholder="Enter weight"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className={`w-32 ${!weightValidation.valid ? 'border-amber-500' : ''}`}
              />
              <span className="text-sm text-muted-foreground">kg</span>
            </div>
            {!weightValidation.valid && weightValidation.message && (
              <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                {weightValidation.message}
              </p>
            )}
          </div>
          
          {weight && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setWeight('')}
              className="mb-0.5"
            >
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
        
        {/* Medication Selection */}
        {weightNum > 0 && (
          <div className="space-y-3">
            <Label className="text-sm font-medium">Select Medication</Label>
            <div className="flex flex-wrap gap-2">
              {medicationsWithDosing.map((med) => (
                <Button
                  key={med.id}
                  variant={selectedMed === med.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedMed(selectedMed === med.id ? null : med.id)}
                  className="text-xs"
                >
                  {selectedMed === med.id && <Check className="w-3 h-3 mr-1" />}
                  {med.name.split(' ')[0]}
                </Button>
              ))}
            </div>
            
            {/* Show all or selected medication doses */}
            <div className="space-y-4 mt-4">
              {selectedMed ? (
                // Show selected medication
                medicationsWithDosing
                  .filter(med => med.id === selectedMed)
                  .map(med => (
                    <div key={med.id} className="border rounded-lg p-4 bg-white">
                      <div className="flex items-center gap-2 mb-3">
                        <Pill className="w-4 h-4 text-primary" />
                        <span className="font-semibold">{med.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {med.genericName}
                        </Badge>
                      </div>
                      <DoseCalculatorCard medication={med} weight={weightNum} />
                    </div>
                  ))
              ) : (
                // Show all medications
                <div className="text-sm text-muted-foreground text-center py-4 bg-muted/30 rounded-lg">
                  <Syringe className="w-5 h-5 mx-auto mb-2 opacity-50" />
                  Select a medication above to see calculated doses
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Instructions when no weight */}
        {!weightNum && (
          <div className="text-sm text-muted-foreground text-center py-6 bg-muted/30 rounded-lg">
            <Scale className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Enter patient weight to calculate doses</p>
            <p className="text-xs mt-1">Doses will be automatically calculated based on weight</p>
          </div>
        )}
        
        {/* Disclaimer */}
        <div className="text-xs text-muted-foreground bg-amber-50 border border-amber-200 p-3 rounded-lg">
          <AlertTriangle className="w-4 h-4 inline mr-1 text-amber-600" />
          <strong>Important:</strong> Calculated doses are for reference only. Always verify with current formulary, 
          consider patient-specific factors (renal/hepatic function, allergies, drug interactions), 
          and follow institutional protocols. Round doses appropriately for practical administration.
        </div>
      </CardContent>
    </Card>
  );
}

export default DoseCalculatorPanel;
