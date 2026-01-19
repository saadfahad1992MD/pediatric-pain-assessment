import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { PAIN_SCALES, type PainLevel } from "@shared/painScales";
import { 
  Activity, 
  Calendar, 
  ChevronRight, 
  Clock, 
  Download, 
  FileText, 
  Filter, 
  Loader2, 
  Printer, 
  Search,
  TrendingDown,
  TrendingUp
} from "lucide-react";
import { useMemo, useState, useRef } from "react";
import { Link, useParams } from "wouter";
import { format } from "date-fns";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

function PainLevelBadge({ level }: { level: string }) {
  const styles: Record<string, string> = {
    none: "pain-badge-none",
    mild: "pain-badge-mild",
    moderate: "pain-badge-moderate",
    severe: "pain-badge-severe",
  };
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[level] || styles.none}`}>
      {level.charAt(0).toUpperCase() + level.slice(1)}
    </span>
  );
}

function AssessmentHistoryContent() {
  const params = useParams<{ patientId?: string }>();
  const patientId = params.patientId ? parseInt(params.patientId) : null;
  
  const [searchQuery, setSearchQuery] = useState('');
  const [scaleFilter, setScaleFilter] = useState<string>('all');
  const [painLevelFilter, setPainLevelFilter] = useState<string>('all');
  const printRef = useRef<HTMLDivElement>(null);
  
  // Queries
  const { data: assessments, isLoading } = patientId
    ? trpc.assessments.listByPatient.useQuery({ patientId })
    : trpc.assessments.listRecent.useQuery({ limit: 100 });
  
  const { data: patient } = trpc.patients.get.useQuery(
    { id: patientId! },
    { enabled: !!patientId }
  );
  
  const { data: patients } = trpc.patients.list.useQuery();
  
  // Filter assessments
  const filteredAssessments = useMemo(() => {
    if (!assessments) return [];
    
    return assessments.filter(assessment => {
      // Scale filter
      if (scaleFilter !== 'all' && assessment.scaleType !== scaleFilter) {
        return false;
      }
      
      // Pain level filter
      if (painLevelFilter !== 'all' && assessment.painLevel !== painLevelFilter) {
        return false;
      }
      
      return true;
    });
  }, [assessments, scaleFilter, painLevelFilter]);
  
  // Chart data
  const chartData = useMemo(() => {
    if (!filteredAssessments || filteredAssessments.length === 0) return [];
    
    return [...filteredAssessments]
      .reverse()
      .slice(-20)
      .map(assessment => ({
        date: format(new Date(assessment.assessedAt), 'MMM d HH:mm'),
        score: Number(assessment.totalScore),
        maxScore: assessment.maxPossibleScore,
        percentage: Math.round((Number(assessment.totalScore) / assessment.maxPossibleScore) * 100),
        painLevel: assessment.painLevel,
        scale: assessment.scaleType.toUpperCase(),
      }));
  }, [filteredAssessments]);
  
  // Statistics
  const stats = useMemo(() => {
    if (!filteredAssessments || filteredAssessments.length === 0) {
      return { total: 0, avgScore: 0, trend: 'stable' as const, distribution: {} };
    }
    
    const total = filteredAssessments.length;
    const avgPercentage = filteredAssessments.reduce((sum, a) => 
      sum + (Number(a.totalScore) / a.maxPossibleScore) * 100, 0
    ) / total;
    
    // Calculate trend (compare last 5 to previous 5)
    let trend: 'improving' | 'worsening' | 'stable' = 'stable';
    if (filteredAssessments.length >= 6) {
      const recent = filteredAssessments.slice(0, 3);
      const previous = filteredAssessments.slice(3, 6);
      
      const recentAvg = recent.reduce((sum, a) => sum + Number(a.totalScore), 0) / recent.length;
      const previousAvg = previous.reduce((sum, a) => sum + Number(a.totalScore), 0) / previous.length;
      
      if (recentAvg < previousAvg - 0.5) trend = 'improving';
      else if (recentAvg > previousAvg + 0.5) trend = 'worsening';
    }
    
    const distribution = filteredAssessments.reduce((acc, a) => {
      acc[a.painLevel] = (acc[a.painLevel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return { total, avgScore: Math.round(avgPercentage), trend, distribution };
  }, [filteredAssessments]);
  
  // Print function
  const handlePrint = () => {
    window.print();
  };
  
  // Export to CSV
  const handleExport = () => {
    if (!filteredAssessments || filteredAssessments.length === 0) return;
    
    const headers = ['Date', 'Time', 'Scale', 'Score', 'Max Score', 'Pain Level', 'Context', 'Notes'];
    const rows = filteredAssessments.map(a => [
      format(new Date(a.assessedAt), 'yyyy-MM-dd'),
      format(new Date(a.assessedAt), 'HH:mm'),
      a.scaleType.toUpperCase(),
      a.totalScore,
      a.maxPossibleScore,
      a.painLevel,
      a.assessmentContext || '',
      a.clinicalNotes || ''
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pain-assessments-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  return (
    <div className="space-y-6" ref={printRef}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {patient ? `${patient.firstName || ''} ${patient.lastName || patient.patientIdentifier}` : 'Assessment History'}
          </h1>
          <p className="text-muted-foreground">
            {patient ? `Patient ID: ${patient.patientIdentifier}` : 'View and analyze pain assessment records'}
          </p>
        </div>
        <div className="flex gap-2 no-print">
          <Button variant="outline" size="sm" className="gap-2" onClick={handleExport}>
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
          <Button variant="outline" size="sm" className="gap-2" onClick={handlePrint}>
            <Printer className="w-4 h-4" />
            Print
          </Button>
        </div>
      </div>
      
      {/* Filters */}
      <Card className="no-print">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Select value={scaleFilter} onValueChange={setScaleFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by scale" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Scales</SelectItem>
                  {Object.values(PAIN_SCALES).map(scale => (
                    <SelectItem key={scale.id} value={scale.id}>
                      {scale.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Select value={painLevelFilter} onValueChange={setPainLevelFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by pain level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Pain Levels</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="mild">Mild</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="severe">Severe</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Assessments</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Activity className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.avgScore}%</p>
                <p className="text-sm text-muted-foreground">Avg Pain Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                stats.trend === 'improving' ? 'bg-green-100' :
                stats.trend === 'worsening' ? 'bg-red-100' : 'bg-gray-100'
              }`}>
                {stats.trend === 'improving' ? (
                  <TrendingDown className="w-5 h-5 text-green-600" />
                ) : stats.trend === 'worsening' ? (
                  <TrendingUp className="w-5 h-5 text-red-600" />
                ) : (
                  <Activity className="w-5 h-5 text-gray-600" />
                )}
              </div>
              <div>
                <p className="text-2xl font-bold capitalize">{stats.trend}</p>
                <p className="text-sm text-muted-foreground">Pain Trend</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                <Activity className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.distribution.severe || 0}</p>
                <p className="text-sm text-muted-foreground">Severe Episodes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Chart */}
      {chartData.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Pain Score Trend</CardTitle>
            <CardDescription>Pain scores over time (as percentage of max score)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="date" 
                    className="text-xs"
                    tick={{ fill: 'currentColor' }}
                  />
                  <YAxis 
                    domain={[0, 100]}
                    className="text-xs"
                    tick={{ fill: 'currentColor' }}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
                            <p className="font-medium">{data.date}</p>
                            <p className="text-sm">Scale: {data.scale}</p>
                            <p className="text-sm">Score: {data.score}/{data.maxScore}</p>
                            <p className="text-sm">Level: <span className="capitalize">{data.painLevel}</span></p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="percentage" 
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Assessment List */}
      <Card>
        <CardHeader>
          <CardTitle>Assessment Records</CardTitle>
          <CardDescription>
            {filteredAssessments.length} assessment{filteredAssessments.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredAssessments.length > 0 ? (
            <div className="space-y-3">
              {filteredAssessments.map((assessment) => {
                const scale = PAIN_SCALES[assessment.scaleType as keyof typeof PAIN_SCALES];
                
                return (
                  <div
                    key={assessment.id}
                    className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Activity className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium">{scale?.name || assessment.scaleType.toUpperCase()}</span>
                            <PainLevelBadge level={assessment.painLevel} />
                          </div>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {format(new Date(assessment.assessedAt), 'MMM d, yyyy')}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {format(new Date(assessment.assessedAt), 'h:mm a')}
                            </span>
                          </div>
                          {assessment.clinicalNotes && (
                            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                              {assessment.clinicalNotes}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 sm:ml-auto">
                        <div className="text-right">
                          <p className="text-2xl font-bold">
                            {Number(assessment.totalScore)}<span className="text-sm text-muted-foreground">/{assessment.maxPossibleScore}</span>
                          </p>
                          <p className="text-xs text-muted-foreground capitalize">
                            {assessment.assessmentContext?.replace('_', ' ') || 'Routine'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No assessments found</p>
              <Link href="/assessment/new">
                <Button variant="link" className="mt-2">
                  Create your first assessment
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function AssessmentHistory() {
  return (
    <DashboardLayout>
      <AssessmentHistoryContent />
    </DashboardLayout>
  );
}
