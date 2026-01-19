import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, json, decimal } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Patients table for tracking pediatric patients
 */
export const patients = mysqlTable("patients", {
  id: int("id").autoincrement().primaryKey(),
  
  // Patient identification
  patientIdentifier: varchar("patientIdentifier", { length: 100 }).notNull(),
  firstName: varchar("firstName", { length: 100 }),
  lastName: varchar("lastName", { length: 100 }),
  
  // Age information - stored for accurate scale selection
  dateOfBirth: timestamp("dateOfBirth"),
  gestationalAgeWeeks: int("gestationalAgeWeeks"), // For premature infants
  
  // Clinical context
  unitType: mysqlEnum("unitType", ["nicu", "picu", "pediatric_ward", "emergency", "outpatient", "surgery", "other"]),
  notes: text("notes"),
  
  // Ownership
  createdBy: int("createdBy").references(() => users.id),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Patient = typeof patients.$inferSelect;
export type InsertPatient = typeof patients.$inferInsert;

/**
 * Pain assessments table - stores all assessment records
 */
export const painAssessments = mysqlTable("painAssessments", {
  id: int("id").autoincrement().primaryKey(),
  
  // Links
  patientId: int("patientId").references(() => patients.id).notNull(),
  assessorId: int("assessorId").references(() => users.id).notNull(),
  
  // Assessment details
  scaleType: mysqlEnum("scaleType", ["pipp_r", "flacc", "wong_baker", "cheops", "nips", "vas"]).notNull(),
  
  // Score data - stored as JSON for flexibility across different scales
  scoreData: json("scoreData").notNull(), // Contains individual component scores
  totalScore: decimal("totalScore", { precision: 5, scale: 2 }).notNull(),
  maxPossibleScore: int("maxPossibleScore").notNull(),
  
  // Pain level interpretation
  painLevel: mysqlEnum("painLevel", ["none", "mild", "moderate", "severe"]).notNull(),
  
  // Context
  assessmentContext: mysqlEnum("assessmentContext", [
    "routine", "pre_procedure", "during_procedure", "post_procedure", 
    "post_operative", "medication_evaluation", "comfort_check", "other"
  ]).default("routine"),
  
  // Clinical notes
  clinicalNotes: text("clinicalNotes"),
  interventionsApplied: json("interventionsApplied"), // Array of intervention codes
  
  // Patient state at assessment
  patientAgeAtAssessment: varchar("patientAgeAtAssessment", { length: 50 }), // e.g., "32 weeks PMA", "6 months"
  
  // Timestamps
  assessedAt: timestamp("assessedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PainAssessment = typeof painAssessments.$inferSelect;
export type InsertPainAssessment = typeof painAssessments.$inferInsert;

/**
 * Intervention tracking - records interventions applied and their effectiveness
 */
export const interventions = mysqlTable("interventions", {
  id: int("id").autoincrement().primaryKey(),
  
  assessmentId: int("assessmentId").references(() => painAssessments.id).notNull(),
  
  // Intervention details
  interventionType: mysqlEnum("interventionType", [
    "sucrose", "skin_to_skin", "breastfeeding", "non_nutritive_sucking",
    "swaddling", "positioning", "distraction_visual", "distraction_auditory",
    "comfort_holding", "reduced_stimulation", "topical_anesthetic", "other"
  ]).notNull(),
  
  // Effectiveness tracking
  effectivenessRating: mysqlEnum("effectivenessRating", ["not_effective", "partially_effective", "effective", "very_effective"]),
  
  notes: text("notes"),
  
  appliedAt: timestamp("appliedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Intervention = typeof interventions.$inferSelect;
export type InsertIntervention = typeof interventions.$inferInsert;
