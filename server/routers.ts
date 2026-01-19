import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import * as db from "./db";
import { 
  PAIN_SCALES, 
  INTERVENTIONS, 
  recommendScales, 
  getPainLevel, 
  getRecommendedInterventions,
  calculateAgeInDays,
  getAgeCategory,
  formatAge,
  type PainScaleType,
  type InterventionType,
  type PainLevel
} from "../shared/painScales";

// Zod schemas for validation
const patientSchema = z.object({
  patientIdentifier: z.string().min(1),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  dateOfBirth: z.string().transform(s => new Date(s)).optional(),
  gestationalAgeWeeks: z.number().min(22).max(44).optional(),
  unitType: z.enum(["nicu", "picu", "pediatric_ward", "emergency", "outpatient", "surgery", "other"]).optional(),
  notes: z.string().optional(),
});

const assessmentSchema = z.object({
  patientId: z.number(),
  scaleType: z.enum(["pipp_r", "flacc", "wong_baker", "cheops", "nips", "vas"]),
  scoreData: z.record(z.string(), z.number()),
  totalScore: z.number(),
  maxPossibleScore: z.number(),
  painLevel: z.enum(["none", "mild", "moderate", "severe"]),
  assessmentContext: z.enum([
    "routine", "pre_procedure", "during_procedure", "post_procedure",
    "post_operative", "medication_evaluation", "comfort_check", "other"
  ]).optional(),
  clinicalNotes: z.string().optional(),
  interventionsApplied: z.array(z.string()).optional(),
  patientAgeAtAssessment: z.string().optional(),
});

const interventionSchema = z.object({
  assessmentId: z.number(),
  interventionType: z.enum([
    "sucrose", "skin_to_skin", "breastfeeding", "non_nutritive_sucking",
    "swaddling", "positioning", "distraction_visual", "distraction_auditory",
    "comfort_holding", "reduced_stimulation", "topical_anesthetic", "other"
  ]),
  effectivenessRating: z.enum(["not_effective", "partially_effective", "effective", "very_effective"]).optional(),
  notes: z.string().optional(),
});

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // Pain scales reference data
  scales: router({
    list: publicProcedure.query(() => {
      return Object.values(PAIN_SCALES);
    }),
    
    get: publicProcedure
      .input(z.object({ scaleType: z.enum(["pipp_r", "flacc", "wong_baker", "cheops", "nips", "vas"]) }))
      .query(({ input }) => {
        return PAIN_SCALES[input.scaleType];
      }),
    
    recommend: publicProcedure
      .input(z.object({
        dateOfBirth: z.string().transform(s => new Date(s)),
        gestationalWeeks: z.number().optional(),
      }))
      .query(({ input }) => {
        const recommended = recommendScales(input.dateOfBirth, input.gestationalWeeks);
        return recommended.map(id => PAIN_SCALES[id]);
      }),
  }),

  // Interventions reference data
  interventions: router({
    list: publicProcedure.query(() => {
      return Object.values(INTERVENTIONS);
    }),
    
    get: publicProcedure
      .input(z.object({ interventionType: z.string() }))
      .query(({ input }) => {
        return INTERVENTIONS[input.interventionType as InterventionType];
      }),
    
    recommend: publicProcedure
      .input(z.object({
        painLevel: z.enum(["none", "mild", "moderate", "severe"]),
        ageInDays: z.number(),
      }))
      .query(({ input }) => {
        const ageCategory = getAgeCategory(input.ageInDays);
        const recommended = getRecommendedInterventions(input.painLevel, ageCategory);
        return recommended.map(id => INTERVENTIONS[id]);
      }),
  }),

  // Patient management
  patients: router({
    create: protectedProcedure
      .input(patientSchema)
      .mutation(async ({ ctx, input }) => {
        const patient = await db.createPatient({
          ...input,
          createdBy: ctx.user.id,
        });
        return patient;
      }),
    
    list: protectedProcedure.query(async ({ ctx }) => {
      return db.getPatientsByUser(ctx.user.id);
    }),
    
    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        const patient = await db.getPatientById(input.id);
        if (!patient) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Patient not found" });
        }
        // Verify ownership
        if (patient.createdBy !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Access denied" });
        }
        return patient;
      }),
    
    update: protectedProcedure
      .input(z.object({ id: z.number(), data: patientSchema.partial() }))
      .mutation(async ({ ctx, input }) => {
        const patient = await db.getPatientById(input.id);
        if (!patient || patient.createdBy !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Access denied" });
        }
        return db.updatePatient(input.id, input.data);
      }),
    
    search: protectedProcedure
      .input(z.object({ query: z.string() }))
      .query(async ({ ctx, input }) => {
        return db.searchPatients(ctx.user.id, input.query);
      }),
    
    getStats: protectedProcedure
      .input(z.object({ patientId: z.number() }))
      .query(async ({ ctx, input }) => {
        const patient = await db.getPatientById(input.patientId);
        if (!patient || patient.createdBy !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Access denied" });
        }
        return db.getPatientAssessmentStats(input.patientId);
      }),
  }),

  // Pain assessments
  assessments: router({
    create: protectedProcedure
      .input(assessmentSchema)
      .mutation(async ({ ctx, input }) => {
        // Verify patient ownership
        const patient = await db.getPatientById(input.patientId);
        if (!patient || patient.createdBy !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Access denied" });
        }
        
        const assessment = await db.createAssessment({
          ...input,
          assessorId: ctx.user.id,
          scoreData: input.scoreData,
          totalScore: String(input.totalScore),
          interventionsApplied: input.interventionsApplied || [],
        });
        
        return assessment;
      }),
    
    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        const result = await db.getAssessmentWithPatient(input.id);
        if (!result) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Assessment not found" });
        }
        if (result.assessment.assessorId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Access denied" });
        }
        return result;
      }),
    
    listByPatient: protectedProcedure
      .input(z.object({ patientId: z.number() }))
      .query(async ({ ctx, input }) => {
        const patient = await db.getPatientById(input.patientId);
        if (!patient || patient.createdBy !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Access denied" });
        }
        return db.getAssessmentsByPatient(input.patientId);
      }),
    
    listRecent: protectedProcedure
      .input(z.object({ limit: z.number().optional() }))
      .query(async ({ ctx, input }) => {
        return db.getAssessmentsByUser(ctx.user.id, input.limit || 50);
      }),
    
    getByDateRange: protectedProcedure
      .input(z.object({
        patientId: z.number(),
        startDate: z.string().transform(s => new Date(s)),
        endDate: z.string().transform(s => new Date(s)),
      }))
      .query(async ({ ctx, input }) => {
        const patient = await db.getPatientById(input.patientId);
        if (!patient || patient.createdBy !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Access denied" });
        }
        return db.getAssessmentsInDateRange(input.patientId, input.startDate, input.endDate);
      }),
  }),

  // Intervention tracking
  interventionRecords: router({
    create: protectedProcedure
      .input(interventionSchema)
      .mutation(async ({ ctx, input }) => {
        // Verify assessment ownership
        const assessment = await db.getAssessmentById(input.assessmentId);
        if (!assessment || assessment.assessorId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Access denied" });
        }
        
        return db.createIntervention(input);
      }),
    
    listByAssessment: protectedProcedure
      .input(z.object({ assessmentId: z.number() }))
      .query(async ({ ctx, input }) => {
        const assessment = await db.getAssessmentById(input.assessmentId);
        if (!assessment || assessment.assessorId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Access denied" });
        }
        return db.getInterventionsByAssessment(input.assessmentId);
      }),
    
    updateEffectiveness: protectedProcedure
      .input(z.object({
        id: z.number(),
        effectivenessRating: z.enum(["not_effective", "partially_effective", "effective", "very_effective"]),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return db.updateInterventionEffectiveness(input.id, input.effectivenessRating, input.notes);
      }),
  }),

  // Utility procedures
  utils: router({
    calculatePainLevel: publicProcedure
      .input(z.object({
        scaleType: z.enum(["pipp_r", "flacc", "wong_baker", "cheops", "nips", "vas"]),
        score: z.number(),
      }))
      .query(({ input }) => {
        return getPainLevel(input.scaleType, input.score);
      }),
    
    formatPatientAge: publicProcedure
      .input(z.object({
        dateOfBirth: z.string().transform(s => new Date(s)),
        gestationalWeeks: z.number().optional(),
      }))
      .query(({ input }) => {
        return formatAge(input.dateOfBirth, input.gestationalWeeks);
      }),
    
    getAgeCategory: publicProcedure
      .input(z.object({ ageInDays: z.number() }))
      .query(({ input }) => {
        return getAgeCategory(input.ageInDays);
      }),
  }),
});

export type AppRouter = typeof appRouter;
