import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { formatAge } from "@shared/painScales";
import { 
  Baby, 
  Calendar, 
  ChevronRight, 
  ClipboardList, 
  Edit, 
  Loader2, 
  Plus, 
  Search, 
  User 
} from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { toast } from "sonner";
import { format } from "date-fns";

function PatientManagementContent() {
  const utils = trpc.useUtils();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    patientIdentifier: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gestationalAgeWeeks: '',
    unitType: '',
    notes: '',
  });
  
  // Queries
  const { data: patients, isLoading } = trpc.patients.list.useQuery();
  const { data: searchResults } = trpc.patients.search.useQuery(
    { query: searchQuery },
    { enabled: searchQuery.length > 0 }
  );
  
  // Mutations
  const createPatient = trpc.patients.create.useMutation({
    onSuccess: () => {
      utils.patients.list.invalidate();
      setIsCreateDialogOpen(false);
      resetForm();
      toast.success('Patient created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create patient: ' + error.message);
    }
  });
  
  const updatePatient = trpc.patients.update.useMutation({
    onSuccess: () => {
      utils.patients.list.invalidate();
      setEditingPatient(null);
      resetForm();
      toast.success('Patient updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update patient: ' + error.message);
    }
  });
  
  const resetForm = () => {
    setFormData({
      patientIdentifier: '',
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gestationalAgeWeeks: '',
      unitType: '',
      notes: '',
    });
  };
  
  const handleSubmit = () => {
    if (!formData.patientIdentifier) {
      toast.error('Patient identifier is required');
      return;
    }
    
    const data = {
      patientIdentifier: formData.patientIdentifier,
      firstName: formData.firstName || undefined,
      lastName: formData.lastName || undefined,
      dateOfBirth: formData.dateOfBirth || undefined,
      gestationalAgeWeeks: formData.gestationalAgeWeeks ? parseInt(formData.gestationalAgeWeeks) : undefined,
      unitType: formData.unitType as any || undefined,
      notes: formData.notes || undefined,
    };
    
    if (editingPatient) {
      updatePatient.mutate({ id: editingPatient, data });
    } else {
      createPatient.mutate(data);
    }
  };
  
  const handleEdit = (patient: any) => {
    setFormData({
      patientIdentifier: patient.patientIdentifier,
      firstName: patient.firstName || '',
      lastName: patient.lastName || '',
      dateOfBirth: patient.dateOfBirth ? format(new Date(patient.dateOfBirth), 'yyyy-MM-dd') : '',
      gestationalAgeWeeks: patient.gestationalAgeWeeks?.toString() || '',
      unitType: patient.unitType || '',
      notes: patient.notes || '',
    });
    setEditingPatient(patient.id);
  };
  
  const displayPatients = searchQuery.length > 0 ? searchResults : patients;
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Patient Management</h1>
          <p className="text-muted-foreground">Manage and view patient records</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={() => { resetForm(); setEditingPatient(null); }}>
              <Plus className="w-4 h-4" />
              Add Patient
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Patient</DialogTitle>
              <DialogDescription>
                Enter patient information to create a new record.
              </DialogDescription>
            </DialogHeader>
            <PatientForm formData={formData} setFormData={setFormData} />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={createPatient.isPending}>
                {createPatient.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Create Patient
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search patients by name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Patient List */}
      <Card>
        <CardHeader>
          <CardTitle>Patients</CardTitle>
          <CardDescription>
            {displayPatients?.length || 0} patient{(displayPatients?.length || 0) !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : displayPatients && displayPatients.length > 0 ? (
            <div className="space-y-3">
              {displayPatients.map((patient) => (
                <div
                  key={patient.id}
                  className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center shrink-0">
                        <Baby className="w-6 h-6 text-secondary-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold">
                          {patient.firstName} {patient.lastName || patient.patientIdentifier}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          ID: {patient.patientIdentifier}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-muted-foreground">
                          {patient.dateOfBirth && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatAge(new Date(patient.dateOfBirth), patient.gestationalAgeWeeks || undefined)}
                            </span>
                          )}
                          {patient.unitType && (
                            <span className="px-2 py-0.5 bg-muted rounded-full text-xs capitalize">
                              {patient.unitType.replace('_', ' ')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:ml-auto">
                      <Dialog open={editingPatient === patient.id} onOpenChange={(open) => !open && setEditingPatient(null)}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => handleEdit(patient)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg">
                          <DialogHeader>
                            <DialogTitle>Edit Patient</DialogTitle>
                            <DialogDescription>
                              Update patient information.
                            </DialogDescription>
                          </DialogHeader>
                          <PatientForm formData={formData} setFormData={setFormData} />
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setEditingPatient(null)}>
                              Cancel
                            </Button>
                            <Button onClick={handleSubmit} disabled={updatePatient.isPending}>
                              {updatePatient.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                              Save Changes
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Link href={`/history/${patient.id}`}>
                        <Button variant="outline" size="sm" className="gap-1">
                          History
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Link href={`/assessment/new/${patient.id}`}>
                        <Button size="sm" className="gap-1">
                          <ClipboardList className="w-4 h-4" />
                          Assess
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <User className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">
                {searchQuery ? 'No patients found matching your search' : 'No patients yet'}
              </p>
              {!searchQuery && (
                <Button 
                  variant="link" 
                  className="mt-2"
                  onClick={() => setIsCreateDialogOpen(true)}
                >
                  Add your first patient
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function PatientForm({ 
  formData, 
  setFormData 
}: { 
  formData: any; 
  setFormData: (data: any) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="patientId">Patient Identifier *</Label>
          <Input
            id="patientId"
            placeholder="MRN or ID"
            value={formData.patientIdentifier}
            onChange={(e) => setFormData({ ...formData, patientIdentifier: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dob">Date of Birth</Label>
          <Input
            id="dob"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            placeholder="First name"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            placeholder="Last name"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="gestationalAge">Gestational Age (weeks)</Label>
          <Input
            id="gestationalAge"
            type="number"
            min="22"
            max="44"
            placeholder="For premature infants"
            value={formData.gestationalAgeWeeks}
            onChange={(e) => setFormData({ ...formData, gestationalAgeWeeks: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="unitType">Unit Type</Label>
          <Select
            value={formData.unitType}
            onValueChange={(value) => setFormData({ ...formData, unitType: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nicu">NICU</SelectItem>
              <SelectItem value="picu">PICU</SelectItem>
              <SelectItem value="pediatric_ward">Pediatric Ward</SelectItem>
              <SelectItem value="emergency">Emergency</SelectItem>
              <SelectItem value="outpatient">Outpatient</SelectItem>
              <SelectItem value="surgery">Surgery</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          placeholder="Additional notes about the patient"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        />
      </div>
    </div>
  );
}

export default function PatientManagement() {
  return (
    <DashboardLayout>
      <PatientManagementContent />
    </DashboardLayout>
  );
}
