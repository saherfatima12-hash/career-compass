import careerGuidance from "../data/careerGuidance.json";

/* ============================================================
   SHARED HELPERS
   ============================================================ */

// Always work with arrays, even if the form ever sends a string/undefined.
const safeArray = (val) => (Array.isArray(val) ? val : val ? [val] : []);

// Case-insensitive, lenient substring match between two string lists.
// Returns the items from `targetList` that matched something in `selected`.
const matchKeywords = (selected = [], targetList = []) => {
  const norm = (s) => String(s).toLowerCase();
  const selectedNorm = selected.map(norm);
  return targetList.filter((target) => {
    const t = norm(target);
    return selectedNorm.some((s) => t.includes(s) || s.includes(t));
  });
};

// Both matric.fieldPerformance and intermediate.fieldPerformance in the
// current careerGuidance.json use the key "Need Improvement" (missing the
// trailing "s"), while the form now sends "Needs Improvement". This bridges
// that mismatch without touching the JSON file.
const PERFORMANCE_JSON_KEY_MAP = {
  Excellent: "Excellent",
  Good: "Good",
  Average: "Average",
  "Needs Improvement": "Need Improvement", // <-- JSON mismatch bridge
};
const toPerformanceJsonKey = (performance) =>
  PERFORMANCE_JSON_KEY_MAP[performance] || performance;

// Converts an Intermediate resultPercentage (number/string) into the same
// performance vocabulary Matric already uses, per the agreed thresholds.
const bucketPerformance = (resultPercentage) => {
  const pct = Number(resultPercentage);
  if (Number.isNaN(pct)) return null;
  if (pct >= 90) return "Excellent";
  if (pct >= 75) return "Good";
  if (pct >= 60) return "Average";
  return "Needs Improvement";
};

// Generic fallback so the results page never receives `undefined`.
const fallbackAdvice = (level) => ({
  isFallback: true,
  recommend: "More Information Needed",
  description:
    level === "matric"
      ? "We don't have enough matching information yet to generate a fully personalized recommendation. Try selecting at least one interest and a future goal so we can tailor your guidance."
      : level === "intermediate"
      ? "We don't have enough matching information yet to generate a fully personalized recommendation for your subject. Please make sure your subject and field preferences are selected."
      : "We don't have enough matching information yet to generate a fully personalized recommendation. Please make sure your subject and career goal are selected.",
  focusSubjects: [],
  skills: [],
  roadmap: [],
  nextStep: "",
  futureFields: [],
});

/* ============================================================
   MATRIC — interest option -> closest existing JSON key.
   careerGuidance.json currently only has entries for:
     "Technology & Computers", "Creativity & Design",
     "Biology & Healthcare", "Mathematics & Problem Solving", "Engineering"
   The form's current interest options are:
     "Technology & Computers", "Creativity & Design", "Science & Nature",
     "Sports & Physical Activities", "Communication & Social Work",
     "Business & Money"
   Only the first two match exactly. "Science & Nature" is bridged to the
   closest existing entry ("Biology & Healthcare"). The remaining three
   have no reasonable existing match and are left unmapped (null) so the
   fallback kicks in cleanly instead of returning wrong-domain advice.
   ============================================================ */
const MATRIC_INTEREST_JSON_MAP = {
  "Technology & Computers": "Technology & Computers",
  "Creativity & Design": "Creativity & Design",
  "Science & Nature": "Biology & Healthcare", // approximate bridge — see note above
  "Sports & Physical Activities": null,
  "Communication & Social Work": null,
  "Business & Money": null,
};

const LEARNING_STYLE_NOTES = {
  "Practical Work":
    "Since you learn best through hands-on practice, prioritize the practical or project-based steps in this roadmap first.",
  "Reading & Theory":
    "Since you learn best through reading and theory, focus on building strong conceptual understanding before jumping into hands-on work.",
  "Creativity & Designing":
    "Since you learn best through creativity and design, look for ways to explore these ideas visually or creatively as you go.",
  "Problem Solving":
    "Since you learn best by solving problems, seek out puzzles, practice questions, and small challenges as you work through this roadmap.",
};

/* ============================================================
   MATRIC
   ============================================================ */
const handleMatric = (student) => {
  const result = {};

  const subject = student.subject || "";
  const performance = student.performance || "";
  const interests = safeArray(student.interests);
  const favoriteSubjects = safeArray(student.favoriteSubjects);
  const strengths = safeArray(student.strengths);
  const learningStyle = student.learningStyle || "";
  const matricFutureGoal = student.matricFutureGoal || "";

  /* ---------------- Performance advice ---------------- */
  if (performance === "Average" || performance === "Needs Improvement") {
    const jsonPerfKey = toPerformanceJsonKey(performance);
    const message = careerGuidance.matric?.fieldPerformance?.[subject]?.[jsonPerfKey];

    if (message) {
      result.performanceAdvice = {
        title: "Improve Your Academic Foundation",
        message,
        focusAreas: [],
        learningPlan: [],
      };

      if (subject === "Computer Science") {
        result.performanceAdvice.focusAreas = [
          "Computer Science Fundamentals",
          "Programming Concepts",
          "Mathematics",
          "Logical Thinking",
          "Problem Solving",
        ];
        result.performanceAdvice.learningPlan = [
          "Revise basic programming concepts regularly",
          "Practice coding problems",
          "Improve Mathematics and analytical skills",
          "Build small beginner projects",
          "Learn computer fundamentals",
        ];
      } else if (subject === "Biology") {
        result.performanceAdvice.focusAreas = [
          "Biology Concepts",
          "Diagrams",
          "Scientific Understanding",
          "Chemistry Basics",
        ];
        result.performanceAdvice.learningPlan = [
          "Revise important Biology topics",
          "Practice diagrams",
          "Solve Biology questions",
          "Improve conceptual understanding",
        ];
      } else if (subject === "Arts") {
        result.performanceAdvice.focusAreas = [
          "Basic Concepts",
          "Writing Skills",
          "Creative Thinking",
        ];
        result.performanceAdvice.learningPlan = [
          "Read regularly",
          "Practice writing",
          "Improve creative skills",
        ];
      }
    }
  }

  /* ---------------- Future guidance (multi-interest scoring) ---------------- */
  if (interests.length === 0 || !matricFutureGoal) {
    result.futureAdvice = fallbackAdvice("matric");
  } else {
    // Build candidate list: each selected interest mapped to its JSON key
    // (if any), then checked for a real entry at [jsonKey][matricFutureGoal].
    const candidates = interests
      .map((original) => {
        const jsonKey =
          original in MATRIC_INTEREST_JSON_MAP
            ? MATRIC_INTEREST_JSON_MAP[original]
            : original; // unknown option: try it as-is, harmless if it misses
        const entry = jsonKey
          ? careerGuidance.matric?.futureGuidance?.[jsonKey]?.[matricFutureGoal]
          : undefined;
        return entry ? { original, jsonKey, entry } : null;
      })
      .filter(Boolean);

    if (candidates.length === 0) {
      result.futureAdvice = fallbackAdvice("matric");
    } else {
      // Score each candidate by how well the entry's focusSubjects/skills
      // overlap with what the student actually said about themselves.
      const scored = candidates.map((c) => {
        const matchedSubjects = matchKeywords(favoriteSubjects, c.entry.focusSubjects || []);
        const matchedStrengths = matchKeywords(strengths, c.entry.skills || []);
        return {
          ...c,
          score: matchedSubjects.length + matchedStrengths.length,
          matchedSubjects,
          matchedStrengths,
        };
      });

      // Highest score wins; ties keep the student's original selection order.
      const best = scored.reduce((top, current) => (current.score > top.score ? current : top));

      // Clone so we never mutate the imported JSON.
      const roadmap = [...(best.entry.roadmap || [])];
      if (learningStyle && LEARNING_STYLE_NOTES[learningStyle]) {
        roadmap.push(LEARNING_STYLE_NOTES[learningStyle]);
      }

      const personalizedNote =
        best.matchedSubjects.length || best.matchedStrengths.length
          ? `This path was highlighted because it lines up with your favorite subjects (${
              best.matchedSubjects.join(", ") || "—"
            }) and strengths (${best.matchedStrengths.join(", ") || "—"}).`
          : `This path matches your selected interest in ${best.original}.`;

      const otherPaths = scored
        .filter((c) => c !== best)
        .map((c) => ({
          interest: c.original,
          recommend: c.entry.recommend,
          futureFields: c.entry.futureFields,
        }));

      result.futureAdvice = {
        ...best.entry,
        roadmap,
        selectedInterest: best.original,
        personalizedNote,
        otherPathsConsidered: otherPaths,
      };
    }
  }

  result.studentProfile = {
    name: student.name,
    age: student.age,
    education: student.education,
    subject,
    performance,
    favoriteSubjects,
    interests,
    strengths,
    learningStyle,
    futureGoal: matricFutureGoal,
  };

  return result;
};

/* ============================================================
   INTERMEDIATE
   ============================================================ */

// The current careerGuidance.json groups Intermediate subjects:
//   "ICS Physics" / "ICS Statistics"  -> stored under "ICS"
//   "I.Com" / "FA"                    -> stored under "I.Com / FA"
// This bridges the exact form subject to the grouped JSON key.
// NOTE: this is a JSON-key mismatch — see the summary after the code.
const toIntermediateJsonSubjectKey = (subject) => {
  if (!subject) return subject;
  if (subject.startsWith("ICS")) return "ICS";
  if (subject === "I.Com" || subject === "FA") return "I.Com / FA";
  return subject; // FSc Pre Medical / FSc Pre Engineering unchanged
};

// Used only for code-level personalization (direction-alignment check),
// not for any JSON lookup — safe to keep exact per-subject.
const INTERMEDIATE_NATURAL_DIRECTION = {
  "FSc Pre Medical": "Healthcare",
  "FSc Pre Engineering": "Engineering",
  "ICS Physics": "Technology",
  "ICS Statistics": "Technology",
  "I.Com": "Business",
  FA: "Research", // approximate — FA doesn't map cleanly to any single careerDirection option
};

const WORK_TYPE_NOTES = {
  "Hands-on / Practical Work":
    "Look for programs or roles with strong practical or lab components rather than fully theoretical tracks.",
  "Research & Theory":
    "Consider research-oriented programs or getting involved with a professor's work early to explore this strength.",
  "Creative / Design Work":
    "Seek out design-oriented electives or projects within your field wherever possible.",
  "Helping & Working With People":
    "Prioritize programs or specializations with direct people-facing or service components.",
  "Business & Leadership":
    "Look for leadership opportunities in student societies or business-adjacent electives.",
};

const handleIntermediate = (student) => {
  const result = {};

  const subject = student.subject || "";
  const year = student.year || "";
  const favoriteSubjects = safeArray(student.favoriteSubjects);
  const fieldPreferences = safeArray(student.fieldPreferences);
  const workType = student.workType || "";
  const skills = safeArray(student.skills);
  const resultPercentage = student.resultPercentage;
  const careerDirection = student.careerDirection || "";
  const futureStudyPlan = student.futureStudyPlan || "";

  const jsonSubjectKey = toIntermediateJsonSubjectKey(subject);
  const bucketedPerformance = bucketPerformance(resultPercentage);

  /* ---------------- Performance advice (revived via resultPercentage) ---------------- */
  if (bucketedPerformance === "Average" || bucketedPerformance === "Needs Improvement") {
    const jsonPerfKey = toPerformanceJsonKey(bucketedPerformance);
    const message = careerGuidance.intermediate?.fieldPerformance?.[jsonSubjectKey]?.[jsonPerfKey];

    if (message) {
      result.performanceAdvice = {
        title: "Strengthen Your Intermediate Foundation",
        message,
        focusAreas: [],
        learningPlan: [],
      };

      if (subject === "FSc Pre Medical") {
        result.performanceAdvice.focusAreas = ["Biology", "Chemistry", "Physics", "Entry Test Concepts"];
        result.performanceAdvice.learningPlan = [
          "Revise Biology and Chemistry concepts daily",
          "Practice past entry test papers",
          "Strengthen numerical problems in Physics",
          "Take regular topic-wise tests",
        ];
      } else if (subject === "FSc Pre Engineering") {
        result.performanceAdvice.focusAreas = ["Mathematics", "Physics", "Problem Solving"];
        result.performanceAdvice.learningPlan = [
          "Practice Mathematics problems daily",
          "Strengthen core Physics concepts",
          "Solve entry test style numericals",
          "Review mistakes after every practice test",
        ];
      } else if (subject === "ICS Physics" || subject === "ICS Statistics") {
        result.performanceAdvice.focusAreas = ["Mathematics", "Programming Logic", "Physics/Statistics"];
        result.performanceAdvice.learningPlan = [
          "Practice basic programming exercises",
          "Strengthen Mathematics fundamentals",
          subject === "ICS Physics" ? "Revise core Physics concepts" : "Revise core Statistics concepts",
          "Build small logic-based exercises",
        ];
      } else if (subject === "I.Com" || subject === "FA") {
        result.performanceAdvice.focusAreas =
          subject === "I.Com"
            ? ["Accounting", "Economics", "Business Concepts"]
            : ["Literature", "Social Studies", "Writing Skills"];
        result.performanceAdvice.learningPlan =
          subject === "I.Com"
            ? [
                "Revise accounting fundamentals regularly",
                "Practice numerical accounting problems",
                "Strengthen understanding of economics concepts",
                "Read business case studies",
              ]
            : [
                "Read regularly to build vocabulary and comprehension",
                "Practice structured essay writing",
                "Revise key social studies concepts",
                "Discuss topics aloud to build clarity of thought",
              ];
      }
    }
  }

  /* ---------------- Future guidance ---------------- */
  const subjectPlan = careerGuidance.intermediate?.subjectGuidance?.[jsonSubjectKey];

  if (!subjectPlan) {
    result.futureAdvice = fallbackAdvice("intermediate");
  } else {
    // Skill gap: what the student already has vs. what this path expects.
    const alreadyStrong = matchKeywords(skills, subjectPlan.skills || []);
    const toBuild = (subjectPlan.skills || []).filter((s) => !alreadyStrong.includes(s));

    // Field preferences vs. this path's futureFields — matched ones first.
    const matchedFields = matchKeywords(fieldPreferences, subjectPlan.futureFields || []);
    const otherFields = (subjectPlan.futureFields || []).filter((f) => !matchedFields.includes(f));

    // Career direction alignment (informational note only).
    const naturalDirection = INTERMEDIATE_NATURAL_DIRECTION[subject];
    let directionNote = "";
    if (careerDirection && naturalDirection) {
      directionNote =
        careerDirection === naturalDirection
          ? `Your stated direction (${careerDirection}) lines up well with ${subject}.`
          : `You selected ${careerDirection} as your direction, which is a bit different from where ${subject} naturally leads (${naturalDirection}) — that's not a problem, just worth exploring both as you research degree options.`;
    }

    const roadmap = [...(subjectPlan.roadmap || [])];
    if (workType && WORK_TYPE_NOTES[workType]) {
      roadmap.push(WORK_TYPE_NOTES[workType]);
    }

    result.futureAdvice = {
      ...subjectPlan,
      roadmap,
      skillGapAnalysis: { alreadyStrong, toBuild },
      matchedFieldPreferences: matchedFields,
      otherFieldsToExplore: otherFields,
      directionNote,
      personalizedNote: `Your current field is ${subject}${
        favoriteSubjects.length ? `, with a focus on ${favoriteSubjects.join(", ")}` : ""
      }. This guidance reflects your subject, skills, and stated interests together.`,
    };
  }

  result.studentProfile = {
    name: student.name,
    age: student.age,
    education: student.education,
    subject,
    year,
    favoriteSubjects,
    fieldPreferences,
    workType,
    skills,
    resultPercentage,
    performance: bucketedPerformance,
    careerDirection,
    futureGoal: futureStudyPlan,
  };

  return result;
};

/* ============================================================
   BACHELOR
   ============================================================ */

const READINESS_MATRIX = {
  "No projects yet|No experience yet":
    "You're at the starting line — focus on learning fundamentals and completing your first small project.",
  "No projects yet|Currently interning":
    "You're gaining real-world exposure through your internship — use it to build your first project too.",
  "No projects yet|Completed an internship":
    "You have practical experience but no personal projects yet — build 1–2 to round out your portfolio.",
  "1–2 projects|No experience yet":
    "You're developing a project base — now start seeking internships or practical exposure.",
  "1–2 projects|Currently interning":
    "You're on track — you're building both practical experience and personal projects in parallel.",
  "1–2 projects|Completed an internship":
    "You're well-positioned, with both practical exposure and a growing project base.",
  "3 or more projects|No experience yet":
    "You have a strong project portfolio — prioritize seeking an internship before you graduate.",
  "3 or more projects|Currently interning":
    "You're nearly ready — a strong project base combined with real, current experience.",
  "3 or more projects|Completed an internship":
    "You're in a strong, job-ready position with both project and practical experience.",
};

const CAREER_PRIORITY_NOTES = {
  Job: "Prioritize internships, a strong resume, and applying to entry-level roles as your final year approaches.",
  "Higher Studies": "Focus on building a strong academic record, research exposure, and entrance exam preparation.",
  Freelancing: "Prioritize a public portfolio and a freelance-platform presence over traditional job applications.",
  Startup: "Focus on validating a real idea and building a minimum viable product before graduation.",
  Research: "Seek research assistantships or lab involvement to build a foundation for postgraduate research.",
};

const CAREER_ENVIRONMENT_NOTES = {
  "Corporate / Structured Environment": "Look for structured graduate programs at established companies.",
  "Startup / Fast-Paced": "Look for smaller, high-ownership teams rather than large structured graduate programs.",
  "Remote / Freelance": "Build a strong online portfolio and a presence on remote-friendly platforms.",
  "Research / Academia": "Look for research assistantships, labs, or academic mentorship opportunities.",
  "Not Sure Yet": "Keep your options open by exploring a mix of internships, small projects, and informational interviews.",
};

const handleBachelor = (student) => {
  const result = {};

  const subject = student.subject || "";
  const semester = student.semester || "";
  const favoriteAreas = safeArray(student.favoriteAreas);
  const weakAreas = safeArray(student.weakAreas);
  const skills = safeArray(student.skills);
  const projects = student.projects || "";
  const internship = student.internship || "";
  const careerPriority = student.careerPriority || "";
  const careerGoal = student.careerGoal || "";
  const careerEnvironment = student.careerEnvironment || "";

  /* ---------------- Growth / weak-area advice ---------------- */
  if (weakAreas.length > 0) {
    result.performanceAdvice = {
      title: "Areas to Strengthen",
      message: `Focus on improving ${weakAreas.join(", ")} to build a stronger, industry-ready foundation in ${subject}.`,
      focusAreas: weakAreas,
      learningPlan: [],
    };

    if (subject === "Computer Science") {
      result.performanceAdvice.learningPlan = [
        "Work through structured tutorials for each weak area",
        "Practice with small hands-on coding exercises",
        "Rebuild a mini project using the improved concept",
        "Track progress with weekly self-assessment",
      ];
    } else if (subject === "Engineering") {
      result.performanceAdvice.learningPlan = [
        "Revisit fundamentals through guided coursework",
        "Practice with relevant tools/software",
        "Apply the concept in a small technical project",
        "Seek feedback from seniors or mentors",
      ];
    } else if (subject === "Business") {
      result.performanceAdvice.learningPlan = [
        "Study real business case studies related to the weak area",
        "Practice with mock business scenarios",
        "Follow industry blogs and reports",
        "Apply concepts in a small business plan or pitch",
      ];
    } else if (subject === "Medical") {
      result.performanceAdvice.learningPlan = [
        "Revise core concepts through structured study",
        "Practice clinical scenarios and case discussions",
        "Seek guidance from professors or seniors",
        "Take regular self-assessment quizzes",
      ];
    }
  }

  /* ---------------- Readiness note (projects x internship) ---------------- */
  const readinessKey = `${projects}|${internship}`;
  const readinessNote = READINESS_MATRIX[readinessKey] || "";

  /* ---------------- Future guidance ---------------- */
  const subjectGoals = careerGuidance.bachelor?.careerGuidance?.[subject];

  if (!subjectGoals) {
    result.futureAdvice = fallbackAdvice("bachelor");
  } else if (careerPriority === "Confused — need guidance") {
    // Score every career goal available for this subject against the
    // student's favoriteAreas/skills, and surface the top 2 as options.
    const scored = Object.entries(subjectGoals).map(([goalName, entry]) => {
      const matchedAreas = matchKeywords(favoriteAreas, entry.futureFields || []);
      const matchedSkills = matchKeywords(skills, entry.skills || []);
      return {
        goalName,
        entry,
        score: matchedAreas.length + matchedSkills.length,
        matchedAreas,
        matchedSkills,
      };
    });

    const top2 = scored.sort((a, b) => b.score - a.score).slice(0, 2);

    result.futureAdvice = {
      isConfusedGuidance: true,
      message:
        "Since you're still exploring, here are the two career directions within your field that best match your favorite areas and current skills.",
      topMatches: top2.map((c) => ({
        recommend: c.entry.recommend,
        careerGoal: c.goalName,
        description: c.entry.description,
        matchedAreas: c.matchedAreas,
        matchedSkills: c.matchedSkills,
        futureFields: c.entry.futureFields,
      })),
      readinessNote,
      environmentNote: CAREER_ENVIRONMENT_NOTES[careerEnvironment] || "",
    };
  } else {
    const entry = subjectGoals[careerGoal];

    if (!entry) {
      result.futureAdvice = fallbackAdvice("bachelor");
    } else {
      const alreadyStrong = matchKeywords(skills, entry.skills || []);
      const toBuild = (entry.skills || []).filter((s) => !alreadyStrong.includes(s));
      const matchedAreas = matchKeywords(favoriteAreas, entry.futureFields || []);
      const otherAreas = (entry.futureFields || []).filter((f) => !matchedAreas.includes(f));

      const nextStepParts = [entry.nextStep];
      if (careerPriority && CAREER_PRIORITY_NOTES[careerPriority]) {
        nextStepParts.push(CAREER_PRIORITY_NOTES[careerPriority]);
      }

      result.futureAdvice = {
        ...entry,
        nextStep: nextStepParts.filter(Boolean).join(" "),
        skillGapAnalysis: { alreadyStrong, toBuild },
        matchedFavoriteAreas: matchedAreas,
        otherAreasToExplore: otherAreas,
        readinessNote,
        environmentNote: CAREER_ENVIRONMENT_NOTES[careerEnvironment] || "",
      };
    }
  }

  result.studentProfile = {
    name: student.name,
    age: student.age,
    education: student.education,
    subject,
    semester,
    favoriteAreas,
    weakAreas,
    skills,
    projects,
    internship,
    careerPriority,
    careerEnvironment,
    futureGoal: careerGoal,
  };

  return result;
};

/* ============================================================
   AI MERGE LAYER
   Combines the AI-personalized response (from the existing backend
   endpoint) with the rule-based futureAdvice. AI fields are preferred
   when present and non-empty; every field always has a rule-based
   fallback so this object is never missing data, even if the AI
   response is null, partial, or the request failed entirely.
   ============================================================ */
const buildMergedGuidance = (aiGuidance, futureAdvice) => ({
  recommendation: aiGuidance?.recommendation || futureAdvice?.recommend || "",
  reason: aiGuidance?.reason || futureAdvice?.description || "",
  skills: aiGuidance?.skills?.length ? aiGuidance.skills : futureAdvice?.skills || [],
  roadmap: aiGuidance?.roadmap?.length ? aiGuidance.roadmap : futureAdvice?.roadmap || [],
  futureFields: aiGuidance?.futureFields?.length
    ? aiGuidance.futureFields
    : futureAdvice?.futureFields || [],
  // The AI response schema doesn't include these — always rule-based.
  focusSubjects: futureAdvice?.focusSubjects || [],
  nextStep: futureAdvice?.nextStep || "",
});

/* ============================================================
   ENTRY POINT
   Runs the rule-based logic (source of truth for the deterministic
   recommendation) and calls the existing AI backend endpoint exactly
   once to get the personalized layer. If the AI call fails or returns
   something unexpected, the rule-based result is still returned in
   full — the page never breaks.
   ============================================================ */
export const generateGuidance = async (student) => {
  if (!student || !student.education) {
    const futureAdvice = fallbackAdvice("matric");
    return {
      performanceAdvice: undefined,
      futureAdvice,
      studentProfile: {},
      guidance: buildMergedGuidance(null, futureAdvice),
    };
  }

  let ruleBasedResult;
  if (student.education === "Matric") {
    ruleBasedResult = handleMatric(student);
  } else if (student.education === "Intermediate") {
    ruleBasedResult = handleIntermediate(student);
  } else if (student.education === "Bachelor") {
    ruleBasedResult = handleBachelor(student);
  } else {
    ruleBasedResult = { futureAdvice: fallbackAdvice("matric"), studentProfile: {} };
  }

  let aiGuidance = null;
  try {
    const response = await fetch(
      "http://localhost:5000/api/gemini/generate-guidance",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(student),
      }
    );

    const data = await response.json();

    if (data?.success && data?.guidance) {
      aiGuidance = data.guidance;
    }
  } catch (error) {
    console.log("AI guidance request failed — falling back to rule-based guidance only:", error);
    aiGuidance = null;
  }

  return {
    performanceAdvice: ruleBasedResult.performanceAdvice,
    futureAdvice: ruleBasedResult.futureAdvice,
    studentProfile: ruleBasedResult.studentProfile,
    guidance: buildMergedGuidance(aiGuidance, ruleBasedResult.futureAdvice),
  };
};