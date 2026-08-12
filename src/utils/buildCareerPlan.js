/**
 * buildCareerPlan.js
 * ---------------------------------------------------------------------------
 * Final integration/orchestration layer between the existing guidance
 * utilities and Career.jsx.
 *
 * This file does NOT contain JSX, UI code, or CSS. It does NOT call fetch,
 * Groq, or Gemini directly, and does NOT duplicate any logic from
 * generateGuidance.js, bachelorGuidance.js, careerActionGuidance.js, or
 * careerResources.js — it only calls those functions and combines their
 * results into one object for the results page.
 * ---------------------------------------------------------------------------
 */

import { generateGuidance } from "./generateGuidance";
import { generateBachelorGuidance } from "./bachelorGuidance";
import { generateCareerActionGuidance } from "./careerActionGuidance";

// Minimal, safe shape used only if generateGuidance itself fails. This
// intentionally does NOT reimplement generateGuidance.js's fallbackAdvice()
// logic — that stays owned by generateGuidance.js.
const emptyGuidanceResult = () => ({
  performanceAdvice: undefined,
  futureAdvice: null,
  studentProfile: null,
  guidance: null,
});

/**
 * buildCareerPlan(student)
 * Calls the three existing guidance utilities, each isolated so a failure
 * in one does not prevent the others from returning. Async because
 * generateGuidance may call the backend AI endpoint.
 */
export const buildCareerPlan = async (student) => {
  /* ---------------- 1. Main guidance (generateGuidance.js) ---------------- */
  let guidanceResult;
  try {
    guidanceResult = await generateGuidance(student);
  } catch (error) {
    console.log("buildCareerPlan: generateGuidance failed, using safe fallback:", error);
    guidanceResult = null;
  }

  if (!guidanceResult || typeof guidanceResult !== "object") {
    guidanceResult = emptyGuidanceResult();
  }

  /* ---------------- 2. Bachelor guidance (bachelorGuidance.js) ---------------- */
  let bachelorGuidanceResult = null;
  if (student?.education === "Bachelor") {
    try {
      bachelorGuidanceResult = generateBachelorGuidance(student);
    } catch (error) {
      console.log("buildCareerPlan: generateBachelorGuidance failed, continuing without it:", error);
      bachelorGuidanceResult = null;
    }
  }

  /* ---------------- 3. Action guidance (careerActionGuidance.js) ---------------- */
  let actionGuidanceResult = null;
  try {
    actionGuidanceResult = generateCareerActionGuidance(student, guidanceResult);
  } catch (error) {
    console.log("buildCareerPlan: generateCareerActionGuidance failed, continuing without it:", error);
    actionGuidanceResult = null;
  }

  /* ---------------- Final combined object ---------------- */
  return {
    student,

    // Preserved exactly as-is for backward compatibility with the
    // current Career.jsx (which reads location.state.guidance).
    guidance: guidanceResult,

    // Same data, surfaced as top-level fields for the next iteration
    // of Career.jsx, without renaming or removing anything.
    performanceAdvice: guidanceResult?.performanceAdvice,
    futureAdvice: guidanceResult?.futureAdvice,
    studentProfile: guidanceResult?.studentProfile,
    aiGuidance: guidanceResult?.guidance || null,

    bachelorGuidance: bachelorGuidanceResult,
    actionGuidance: actionGuidanceResult,
  };
};

export default buildCareerPlan;