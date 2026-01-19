import { eq, desc, and, gte, lte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users, 
  patients, InsertPatient, Patient,
  painAssessments, InsertPainAssessment, PainAssessment,
  interventions, InsertIntervention, Intervention
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============ USER QUERIES ============

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ============ PATIENT QUERIES ============

export async function createPatient(patient: InsertPatient): Promise<Patient> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(patients).values(patient);
  const insertId = result[0].insertId;
  
  const created = await db.select().from(patients).where(eq(patients.id, insertId)).limit(1);
  return created[0];
}

export async function getPatientById(id: number): Promise<Patient | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(patients).where(eq(patients.id, id)).limit(1);
  return result[0];
}

export async function getPatientsByUser(userId: number): Promise<Patient[]> {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(patients)
    .where(eq(patients.createdBy, userId))
    .orderBy(desc(patients.updatedAt));
}

export async function updatePatient(id: number, data: Partial<InsertPatient>): Promise<Patient | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  await db.update(patients).set(data).where(eq(patients.id, id));
  return getPatientById(id);
}

export async function searchPatients(userId: number, query: string): Promise<Patient[]> {
  const db = await getDb();
  if (!db) return [];
  
  // Simple search by identifier, first name, or last name
  const allPatients = await getPatientsByUser(userId);
  const lowerQuery = query.toLowerCase();
  
  return allPatients.filter(p => 
    p.patientIdentifier.toLowerCase().includes(lowerQuery) ||
    p.firstName?.toLowerCase().includes(lowerQuery) ||
    p.lastName?.toLowerCase().includes(lowerQuery)
  );
}

// ============ PAIN ASSESSMENT QUERIES ============

export async function createAssessment(assessment: InsertPainAssessment): Promise<PainAssessment> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(painAssessments).values(assessment);
  const insertId = result[0].insertId;
  
  const created = await db.select().from(painAssessments).where(eq(painAssessments.id, insertId)).limit(1);
  return created[0];
}

export async function getAssessmentById(id: number): Promise<PainAssessment | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(painAssessments).where(eq(painAssessments.id, id)).limit(1);
  return result[0];
}

export async function getAssessmentsByPatient(patientId: number): Promise<PainAssessment[]> {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(painAssessments)
    .where(eq(painAssessments.patientId, patientId))
    .orderBy(desc(painAssessments.assessedAt));
}

export async function getAssessmentsByUser(userId: number, limit = 50): Promise<PainAssessment[]> {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(painAssessments)
    .where(eq(painAssessments.assessorId, userId))
    .orderBy(desc(painAssessments.assessedAt))
    .limit(limit);
}

export async function getAssessmentsInDateRange(
  patientId: number, 
  startDate: Date, 
  endDate: Date
): Promise<PainAssessment[]> {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(painAssessments)
    .where(and(
      eq(painAssessments.patientId, patientId),
      gte(painAssessments.assessedAt, startDate),
      lte(painAssessments.assessedAt, endDate)
    ))
    .orderBy(desc(painAssessments.assessedAt));
}

export async function getAssessmentWithPatient(assessmentId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select({
    assessment: painAssessments,
    patient: patients
  })
    .from(painAssessments)
    .innerJoin(patients, eq(painAssessments.patientId, patients.id))
    .where(eq(painAssessments.id, assessmentId))
    .limit(1);
  
  return result[0];
}

// ============ INTERVENTION QUERIES ============

export async function createIntervention(intervention: InsertIntervention): Promise<Intervention> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(interventions).values(intervention);
  const insertId = result[0].insertId;
  
  const created = await db.select().from(interventions).where(eq(interventions.id, insertId)).limit(1);
  return created[0];
}

export async function getInterventionsByAssessment(assessmentId: number): Promise<Intervention[]> {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(interventions)
    .where(eq(interventions.assessmentId, assessmentId))
    .orderBy(desc(interventions.appliedAt));
}

export async function updateInterventionEffectiveness(
  id: number, 
  effectivenessRating: Intervention["effectivenessRating"],
  notes?: string
): Promise<Intervention | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  await db.update(interventions)
    .set({ effectivenessRating, notes })
    .where(eq(interventions.id, id));
  
  const result = await db.select().from(interventions).where(eq(interventions.id, id)).limit(1);
  return result[0];
}

// ============ STATISTICS QUERIES ============

export async function getPatientAssessmentStats(patientId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const assessments = await getAssessmentsByPatient(patientId);
  
  if (assessments.length === 0) {
    return { totalAssessments: 0, averageScore: 0, lastAssessment: null };
  }
  
  const totalScore = assessments.reduce((sum, a) => sum + Number(a.totalScore), 0);
  const averageScore = totalScore / assessments.length;
  
  return {
    totalAssessments: assessments.length,
    averageScore: Math.round(averageScore * 100) / 100,
    lastAssessment: assessments[0],
    painLevelDistribution: {
      none: assessments.filter(a => a.painLevel === 'none').length,
      mild: assessments.filter(a => a.painLevel === 'mild').length,
      moderate: assessments.filter(a => a.painLevel === 'moderate').length,
      severe: assessments.filter(a => a.painLevel === 'severe').length,
    }
  };
}
