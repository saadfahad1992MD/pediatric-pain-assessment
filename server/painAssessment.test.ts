import { describe, expect, it, beforeEach, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { PAIN_SCALES, recommendScales, getPainLevel, calculateAgeInDays, getAgeCategory, formatAge, getRecommendedInterventions } from "../shared/painScales";

// Mock database functions
vi.mock("./db", () => ({
  getDb: vi.fn(),
  createPatient: vi.fn(),
  getPatientById: vi.fn(),
  getPatientsByUserId: vi.fn(),
  searchPatients: vi.fn(),
  updatePatient: vi.fn(),
  createAssessment: vi.fn(),
  getAssessmentById: vi.fn(),
  getAssessmentsByPatient: vi.fn(),
  getRecentAssessments: vi.fn(),
  getUserByOpenId: vi.fn(),
  upsertUser: vi.fn(),
}));

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user-123",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };

  return { ctx };
}

describe("Pain Scales Configuration", () => {
  it("should have all required pain scales defined", () => {
    const expectedScales = ["flacc", "wong_baker", "pipp_r", "cheops", "nips", "vas"];
    expectedScales.forEach(scale => {
      expect(PAIN_SCALES[scale as keyof typeof PAIN_SCALES]).toBeDefined();
    });
  });

  it("should have valid scoring components for each scale", () => {
    Object.values(PAIN_SCALES).forEach(scale => {
      expect(scale.components.length).toBeGreaterThan(0);
      scale.components.forEach(component => {
        expect(component.id).toBeDefined();
        expect(component.name).toBeDefined();
        expect(component.options.length).toBeGreaterThan(0);
      });
    });
  });

  it("should have valid scoring guides for each scale", () => {
    Object.values(PAIN_SCALES).forEach(scale => {
      expect(scale.scoringGuide.length).toBeGreaterThan(0);
      scale.scoringGuide.forEach(guide => {
        expect(guide.level).toBeDefined();
        expect(guide.minScore).toBeDefined();
        expect(guide.maxScore).toBeDefined();
        expect(guide.minScore).toBeLessThanOrEqual(guide.maxScore);
      });
    });
  });
});

describe("Age Calculation Functions", () => {
  it("should calculate age in days correctly", () => {
    const today = new Date();
    const tenDaysAgo = new Date(today);
    tenDaysAgo.setDate(today.getDate() - 10);
    
    const ageInDays = calculateAgeInDays(tenDaysAgo);
    expect(ageInDays).toBeGreaterThanOrEqual(10);
    expect(ageInDays).toBeLessThan(12); // Account for time differences
  });

  it("should adjust age for gestational weeks", () => {
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    // Without gestational adjustment
    const normalAge = calculateAgeInDays(thirtyDaysAgo);
    
    // With gestational adjustment (premature baby at 32 weeks)
    const adjustedAge = calculateAgeInDays(thirtyDaysAgo, 32);
    
    // Adjusted age should be less (baby is "younger" developmentally)
    expect(adjustedAge).toBeLessThan(normalAge);
  });

  it("should categorize ages correctly", () => {
    expect(getAgeCategory(10)).toBe("neonate"); // 10 days
    expect(getAgeCategory(100)).toBe("infant"); // ~3 months
    expect(getAgeCategory(500)).toBe("toddler"); // ~1.4 years
    expect(getAgeCategory(1500)).toBe("child"); // ~4 years
    expect(getAgeCategory(3000)).toBe("child"); // ~8 years
    expect(getAgeCategory(5000)).toBe("adolescent"); // ~13 years
  });

  it("should format age correctly", () => {
    const today = new Date();
    
    // 10 days old
    const tenDaysAgo = new Date(today);
    tenDaysAgo.setDate(today.getDate() - 10);
    expect(formatAge(tenDaysAgo)).toBe("10 days");
    
    // 2 months old (60 days)
    const twoMonthsAgo = new Date(today);
    twoMonthsAgo.setDate(today.getDate() - 60);
    const formattedTwoMonths = formatAge(twoMonthsAgo);
    expect(formattedTwoMonths).toMatch(/month/);
    
    // 2 years old (730 days)
    const twoYearsAgo = new Date(today);
    twoYearsAgo.setDate(today.getDate() - 730);
    const formattedTwoYears = formatAge(twoYearsAgo);
    expect(formattedTwoYears).toMatch(/year/);
  });
});

describe("Scale Recommendation", () => {
  it("should recommend PIPP-R for neonates under 48 weeks PMA", () => {
    const today = new Date();
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(today.getDate() - 7);
    
    // Premature baby at 32 weeks gestational age, now 1 week old = 33 weeks PMA
    const recommended = recommendScales(oneWeekAgo, 32);
    expect(recommended).toContain("pipp_r");
  });

  it("should recommend FLACC for infants 2 months to 7 years", () => {
    const today = new Date();
    const sixMonthsAgo = new Date(today);
    sixMonthsAgo.setMonth(today.getMonth() - 6);
    
    const recommended = recommendScales(sixMonthsAgo);
    expect(recommended).toContain("flacc");
  });

  it("should recommend Wong-Baker FACES for children 3+ years", () => {
    const today = new Date();
    const fiveYearsAgo = new Date(today);
    fiveYearsAgo.setFullYear(today.getFullYear() - 5);
    
    const recommended = recommendScales(fiveYearsAgo);
    expect(recommended).toContain("wong_baker");
  });

  it("should recommend NIPS for infants under 1 year", () => {
    const today = new Date();
    const threeMonthsAgo = new Date(today);
    threeMonthsAgo.setMonth(today.getMonth() - 3);
    
    const recommended = recommendScales(threeMonthsAgo);
    expect(recommended).toContain("nips");
  });

  it("should recommend VAS for older children 8+ years", () => {
    const today = new Date();
    const tenYearsAgo = new Date(today);
    tenYearsAgo.setFullYear(today.getFullYear() - 10);
    
    const recommended = recommendScales(tenYearsAgo);
    expect(recommended).toContain("vas");
  });
});

describe("Pain Level Calculation", () => {
  it("should return 'none' for zero score", () => {
    expect(getPainLevel("flacc", 0)).toBe("none");
    expect(getPainLevel("wong_baker", 0)).toBe("none");
  });

  it("should return correct pain levels for FLACC scale", () => {
    expect(getPainLevel("flacc", 0)).toBe("none");
    expect(getPainLevel("flacc", 2)).toBe("mild");
    expect(getPainLevel("flacc", 5)).toBe("moderate");
    expect(getPainLevel("flacc", 8)).toBe("severe");
  });

  it("should return correct pain levels for Wong-Baker scale", () => {
    expect(getPainLevel("wong_baker", 0)).toBe("none");
    expect(getPainLevel("wong_baker", 2)).toBe("mild");
    expect(getPainLevel("wong_baker", 6)).toBe("moderate");
    expect(getPainLevel("wong_baker", 10)).toBe("severe");
  });

  it("should return correct pain levels for VAS scale", () => {
    expect(getPainLevel("vas", 0)).toBe("none");
    expect(getPainLevel("vas", 2)).toBe("mild");
    expect(getPainLevel("vas", 5)).toBe("moderate");
    expect(getPainLevel("vas", 9)).toBe("severe");
  });
});

describe("Intervention Recommendations", () => {
  it("should return empty array for no pain", () => {
    const interventions = getRecommendedInterventions("none", "infant");
    expect(interventions.length).toBe(0);
  });

  it("should recommend sucrose for neonates with mild pain", () => {
    const interventions = getRecommendedInterventions("mild", "neonate");
    expect(interventions).toContain("sucrose");
  });

  it("should recommend skin-to-skin for neonates", () => {
    const interventions = getRecommendedInterventions("mild", "neonate");
    expect(interventions).toContain("skin_to_skin");
  });

  it("should recommend distraction for children", () => {
    const interventions = getRecommendedInterventions("mild", "child");
    expect(interventions).toContain("distraction_visual");
  });

  it("should recommend more interventions for severe pain", () => {
    const mildInterventions = getRecommendedInterventions("mild", "infant");
    const severeInterventions = getRecommendedInterventions("severe", "infant");
    expect(severeInterventions.length).toBeGreaterThanOrEqual(mildInterventions.length);
  });
});

describe("Pain Scale Max Scores", () => {
  it("FLACC should have max score of 10", () => {
    expect(PAIN_SCALES.flacc.maxScore).toBe(10);
  });

  it("Wong-Baker should have max score of 10", () => {
    expect(PAIN_SCALES.wong_baker.maxScore).toBe(10);
  });

  it("PIPP-R should have max score of 21", () => {
    expect(PAIN_SCALES.pipp_r.maxScore).toBe(21);
  });

  it("CHEOPS should have max score of 13", () => {
    expect(PAIN_SCALES.cheops.maxScore).toBe(13);
  });

  it("NIPS should have max score of 7", () => {
    expect(PAIN_SCALES.nips.maxScore).toBe(7);
  });

  it("All scales should have valid max scores", () => {
    Object.values(PAIN_SCALES).forEach(scale => {
      expect(scale.maxScore).toBeGreaterThan(0);
    });
  });

  it("VAS should have max score of 10", () => {
    expect(PAIN_SCALES.vas.maxScore).toBe(10);
  });
});

describe("Scale Component Validation", () => {
  it("FLACC should have 5 components", () => {
    expect(PAIN_SCALES.flacc.components.length).toBe(5);
    const componentIds = PAIN_SCALES.flacc.components.map(c => c.id);
    expect(componentIds).toContain("face");
    expect(componentIds).toContain("legs");
    expect(componentIds).toContain("activity");
    expect(componentIds).toContain("cry");
    expect(componentIds).toContain("consolability");
  });

  it("Wong-Baker should have 1 component (self-report)", () => {
    expect(PAIN_SCALES.wong_baker.components.length).toBe(1);
    expect(PAIN_SCALES.wong_baker.components[0].id).toBe("pain_face");
  });

  it("Each component option should have value, label, and description", () => {
    Object.values(PAIN_SCALES).forEach(scale => {
      scale.components.forEach(component => {
        component.options.forEach(option => {
          expect(typeof option.value).toBe("number");
          expect(typeof option.label).toBe("string");
          expect(typeof option.description).toBe("string");
        });
      });
    });
  });
});

describe("Auth Router", () => {
  it("should return user info for authenticated user", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.me();

    expect(result).toBeDefined();
    expect(result?.openId).toBe("test-user-123");
    expect(result?.email).toBe("test@example.com");
  });

  it("should return null for unauthenticated user", async () => {
    const ctx: TrpcContext = {
      user: null,
      req: {
        protocol: "https",
        headers: {},
      } as TrpcContext["req"],
      res: {
        clearCookie: vi.fn(),
      } as unknown as TrpcContext["res"],
    };
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.me();

    expect(result).toBeNull();
  });
});
