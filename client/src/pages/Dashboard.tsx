import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { 
  Activity, 
  Baby, 
  Calendar, 
  ChevronRight, 
  ClipboardList, 
  Clock, 
  Plus, 
  TrendingUp, 
  Users 
} from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";

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

function DashboardContent() {
  const { user } = useAuth();
  const { data: patients, isLoading: patientsLoading } = trpc.patients.list.useQuery();
  const { data: recentAssessments, isLoading: assessmentsLoading } = trpc.assessments.listRecent.useQuery({ limit: 10 });

  const totalPatients = patients?.length || 0;
  const totalAssessments = recentAssessments?.length || 0;
  
  // Calculate stats
  const todayAssessments = recentAssessments?.filter(a => {
    const assessedDate = new Date(a.assessedAt);
    const today = new Date();
    return assessedDate.toDateString() === today.toDateString();
  }).length || 0;

  const painDistribution = recentAssessments?.reduce((acc, a) => {
    acc[a.painLevel] = (acc[a.painLevel] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome back, {user?.name || 'Provider'}
          </h1>
          <p className="text-muted-foreground">
            Here's an overview of your pain assessments
          </p>
        </div>
        <Link href="/assessment/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            New Assessment
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalPatients}</p>
                <p className="text-sm text-muted-foreground">Total Patients</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <ClipboardList className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalAssessments}</p>
                <p className="text-sm text-muted-foreground">Total Assessments</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{todayAssessments}</p>
                <p className="text-sm text-muted-foreground">Today's Assessments</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {painDistribution.severe || 0}
                </p>
                <p className="text-sm text-muted-foreground">Severe Pain Cases</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Assessments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Assessments</CardTitle>
              <CardDescription>Latest pain assessments performed</CardDescription>
            </div>
            <Link href="/history">
              <Button variant="ghost" size="sm" className="gap-1">
                View All
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {assessmentsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
            ) : recentAssessments && recentAssessments.length > 0 ? (
              <div className="space-y-3">
                {recentAssessments.slice(0, 5).map((assessment) => (
                  <div
                    key={assessment.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Activity className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          {assessment.scaleType.toUpperCase()} Assessment
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {format(new Date(assessment.assessedAt), 'MMM d, h:mm a')}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-semibold">
                          {Number(assessment.totalScore)}/{assessment.maxPossibleScore}
                        </p>
                      </div>
                      <PainLevelBadge level={assessment.painLevel} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ClipboardList className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No assessments yet</p>
                <Link href="/assessment/new">
                  <Button variant="link" className="mt-2">
                    Start your first assessment
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Patients */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Your Patients</CardTitle>
              <CardDescription>Patients you've assessed</CardDescription>
            </div>
            <Link href="/patients">
              <Button variant="ghost" size="sm" className="gap-1">
                View All
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {patientsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
            ) : patients && patients.length > 0 ? (
              <div className="space-y-3">
                {patients.slice(0, 5).map((patient) => (
                  <Link key={patient.id} href={`/assessment/new/${patient.id}`}>
                    <div className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                          <Baby className="w-5 h-5 text-secondary-foreground" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            {patient.firstName} {patient.lastName || patient.patientIdentifier}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            ID: {patient.patientIdentifier}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No patients yet</p>
                <Link href="/patients">
                  <Button variant="link" className="mt-2">
                    Add your first patient
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/assessment/new">
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                <ClipboardList className="w-6 h-6" />
                <span>New Assessment</span>
              </Button>
            </Link>
            <Link href="/patients">
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                <Users className="w-6 h-6" />
                <span>Manage Patients</span>
              </Button>
            </Link>
            <Link href="/history">
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                <Activity className="w-6 h-6" />
                <span>View History</span>
              </Button>
            </Link>
            <Link href="/resources">
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                <TrendingUp className="w-6 h-6" />
                <span>Resources</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Dashboard() {
  return (
    <DashboardLayout>
      <DashboardContent />
    </DashboardLayout>
  );
}
