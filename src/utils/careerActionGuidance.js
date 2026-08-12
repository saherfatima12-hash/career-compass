/**
 * careerActionGuidance.js
 * ---------------------------------------------------------------------------
 * ADDITIONAL goal-based guidance layer.
 *
 * This file does NOT replace generateGuidance.js (the main rule-based
 * career recommendation remains the source of truth) and does NOT
 * duplicate bachelorGuidance.js or careerResources.js — it composes them.
 *
 * NO fetch, NO AI (Groq/Gemini/etc), NO external API calls.
 * ---------------------------------------------------------------------------
 */

import careerResources, { EDUCATION_LEVELS, GOALS, FIELD_GROUPS } from "../data/careerResources";
import { generateBachelorGuidance } from "./bachelorGuidance";

/* ============================================================
   SHARED HELPERS
   ============================================================ */

const safeArray = (val) => (Array.isArray(val) ? val : val ? [val] : []);
const safeString = (val) => (typeof val === "string" ? val.trim() : "");

/* ============================================================
   1. GOAL RESOLUTION
   Maps CareerForm.jsx's per-level fields into the 5 canonical goals
   from careerResources.js (GOALS). Ambiguous/undeterminable values
   (e.g. "Not Sure Yet", "Confused — need guidance", or a field-like
   value such as careerDirection) do NOT stop the chain — they simply
   yield no signal, and the next field in priority order is checked.
   ============================================================ */

const MATRIC_FUTURE_GOAL_MAP = {
  "Continue Studies": "Continue Studies",
  "Professional Course": "Job",
  "Start Earning": "Job",
};

const FUTURE_STUDY_PLAN_MAP = {
  "University Degree": "Continue Studies",
  "Professional Course": "Job",
  Job: "Job",
  Freelancing: "Freelancing",
  "Not Sure Yet": null,
};

// careerDirection is a FIELD signal, not a goal — only "Research" has any
// reasonable goal implication (academic direction). Everything else is
// intentionally left unmapped so it doesn't get misread as a goal.
const CAREER_DIRECTION_MAP = {
  Research: "Continue Studies",
};

const CAREER_PRIORITY_MAP = {
  Job: "Job",
  "Higher Studies": "Continue Studies",
  Freelancing: "Freelancing",
  Startup: "Business",
  Research: "Continue Studies",
  "Confused — need guidance": null,
};

// careerGoal is a specific role name (e.g. "Software Developer",
// "Freelancer", "Startup Founder") rather than a canonical goal string,
// so it's resolved via keywords instead of an exact-match table.
const resolveGoalFromRoleName = (value) => {
  const v = safeString(value).toLowerCase();
  if (!v) return null;
  if (/freelanc/.test(v)) return "Freelancing";
  if (/founder|entrepreneur/.test(v)) return "Business";
  if (/research|higher studies/.test(v)) return "Continue Studies";
  return "Job"; // any other named professional role defaults to Job
};

const resolveGoal = (student) => {
  const education = student.education;
  let chain = [];

  if (education === "Matric") {
    chain = [{ field: "matricFutureGoal", map: MATRIC_FUTURE_GOAL_MAP }];
  } else if (education === "Intermediate") {
    chain = [
      { field: "futureStudyPlan", map: FUTURE_STUDY_PLAN_MAP },
      { field: "careerDirection", map: CAREER_DIRECTION_MAP },
      { field: "futureGoal", map: FUTURE_STUDY_PLAN_MAP },
    ];
  } else if (education === "Bachelor") {
    chain = [
      { field: "careerPriority", map: CAREER_PRIORITY_MAP },
      { field: "careerGoal", resolver: resolveGoalFromRoleName },
      { field: "futureGoal", map: CAREER_PRIORITY_MAP },
    ];
  }

  for (const step of chain) {
    const raw = student[step.field];
    if (!safeString(raw) && !Array.isArray(raw)) continue;

    const resolved = step.resolver ? step.resolver(raw) : step.map[safeString(raw)];
    if (resolved && GOALS.includes(resolved)) {
      return resolved;
    }
  }

  return "";
};

/* ============================================================
   2. FIELD GROUP RESOLUTION
   Maps the student's subject/interest signals to the existing
   FIELD_GROUPS vocabulary imported from careerResources.js.
   Kept small and keyword-based rather than redefining field groups.
   ============================================================ */

// Ordered: more specific groups are checked before broader ones.
const KEYWORD_TO_FIELD_GROUP = [
  [/cyber|security/i, "Cyber Security"],
  [/artificial intelligence|\bai\b|machine learning|data science|data analysis|statistics|actuarial/i, "AI / Data Science"],
  [/web develop|app develop|frontend|backend|full-?stack/i, "Web Development"],
  [/ui\/ux|design & arts|graphic design|visual|creative/i, "Design / Creative"],
  [/computer science|software|programming|ics/i, "Computer Science / Software Engineering"],
  [/engineering|electronics|mechanical|civil|automation|architecture/i, "Engineering"],
  [/medical|healthcare|biology|clinical|pharma|dentistry|patient/i, "Medical / Healthcare"],
  [/business|finance|accounting|marketing|entrepreneur|commerce|management/i, "Business / Entrepreneurship"],
];

const SUBJECT_DEFAULT_FIELD_GROUP = {
  // Matric
  "Computer Science": "Computer Science / Software Engineering",
  Biology: "Medical / Healthcare",
  Arts: "Design / Creative",
  // Intermediate
  "FSc Pre Medical": "Medical / Healthcare",
  "FSc Pre Engineering": "Engineering",
  "ICS Physics": "Computer Science / Software Engineering",
  "ICS Statistics": "AI / Data Science",
  "I.Com": "Business / Entrepreneurship",
  FA: "General",
  // Bachelor
  Engineering: "Engineering",
  Business: "Business / Entrepreneurship",
  Medical: "Medical / Healthcare",
};

const resolveFieldGroup = (student) => {
  const education = student.education;

  // Gather every text signal relevant to this education level, in order
  // of specificity (most specific/interest-driven signals first).
  let signals = [];
  if (education === "Matric") {
    signals = [...safeArray(student.interests), ...safeArray(student.favoriteSubjects)];
  } else if (education === "Intermediate") {
    signals = [...safeArray(student.fieldPreferences), student.workType];
  } else if (education === "Bachelor") {
    signals = [...safeArray(student.favoriteAreas), student.careerGoal];
  }

  for (const signal of signals) {
    const text = safeString(signal);
    if (!text) continue;
    const match = KEYWORD_TO_FIELD_GROUP.find(([pattern]) => pattern.test(text));
    if (match) return match[1];
  }

  // Fall back to the subject's default group.
  const bySubject = SUBJECT_DEFAULT_FIELD_GROUP[safeString(student.subject)];
  if (bySubject && FIELD_GROUPS.includes(bySubject)) return bySubject;

  return "General";
};

/* ============================================================
   3. RESOURCE FILTERING
   Small, reusable filter matching the exact AND condition specified.
   ============================================================ */

const isResourceRelevant = (resource, { goal, educationLevel, fieldGroup }) => {
  const goalsOk = safeArray(resource.goals).includes(goal);
  const educationOk = safeArray(resource.educationLevels).includes(educationLevel);
  const fieldsOk = safeArray(resource.fields).includes(fieldGroup) || safeArray(resource.fields).includes("General");
  return goalsOk && educationOk && fieldsOk;
};

const getRecommendedPlatforms = (goal, educationLevel, fieldGroup, limit = 6) => {
  if (!goal || !EDUCATION_LEVELS.includes(educationLevel)) return [];

  const matches = careerResources.filter((resource) =>
    isResourceRelevant(resource, { goal, educationLevel, fieldGroup })
  );

  // Field-specific matches ranked above General-only matches.
  const scored = matches.map((resource) => ({
    resource,
    specific: safeArray(resource.fields).includes(fieldGroup) ? 1 : 0,
  }));
  scored.sort((a, b) => b.specific - a.specific);

  return scored.slice(0, limit).map((s) => s.resource);
};

/* ============================================================
   4. GOAL-SPECIFIC PLAN BUILDERS
   Each returns { title, summary, actionPlan, learningPlan,
   profilePreparation, nextSteps }.
   ============================================================ */

const subjectLabel = (student) => safeString(student.subject) || "your field";

const buildContinueStudiesPlan = (student, fieldGroup, guidance, bachelorPlan) => {
  const subject = subjectLabel(student);

  const actionPlan = [
    `Identify 3–5 degree/program options that build directly on ${subject}.`,
    "Compare shortlisted universities on program content, faculty, and admission requirements.",
    "Check the specific admission requirements (required subjects, entry tests, minimum grades) for each option.",
    `Strengthen the subjects most relevant to ${subject} well before applications open.`,
    "Prepare required documents (transcripts, certificates, recommendation letters) ahead of deadlines.",
  ];

  if (student.education !== "Matric") {
    actionPlan.push("Research scholarships or financial aid options relevant to your shortlisted programs.");
  }

  const learningPlan = [
    `Review core concepts in ${subject} regularly rather than only before exams.`,
    "Practice past admission-test or entry-test style questions if your target programs require one.",
  ];

  const profilePreparation = [
    "Keep an updated record of your academic results and certificates in one place.",
    "Draft a short personal statement explaining why you want to continue in this direction.",
  ];

  const nextSteps = [
    "Shortlist your top 2–3 program choices within the next few weeks.",
    "Set a personal deadline to have all required documents ready before applications open.",
  ];

  // Bachelor + research-leaning: pull in a couple of bachelorGuidance's
  // already-computed recommendations rather than recalculating anything.
  if (student.education === "Bachelor" && bachelorPlan?.applicable) {
    bachelorPlan.jobReadiness?.recommendations?.slice(0, 1).forEach((r) => nextSteps.push(r));
  }

  return {
    title: "Continuing Your Studies",
    summary: `A plan to help you move confidently from ${subject} into your next stage of education.`,
    actionPlan,
    learningPlan,
    profilePreparation,
    nextSteps,
  };
};

const buildJobPlan = (student, fieldGroup, guidance, bachelorPlan) => {
  const subject = subjectLabel(student);
  const targetRole = safeString(guidance?.futureAdvice?.recommend) || safeString(student.careerGoal) || `a role related to ${subject}`;

  const actionPlan = [
    `Identify your target role clearly — currently pointing toward ${targetRole}.`,
    "List the specific skills that role requires and compare them against what you already have.",
    "Prepare a one-page CV focused on your target role, not a generic list of everything you've done.",
    "Create or update a LinkedIn profile with your education, skills, and any projects.",
  ];

  if (["Computer Science / Software Engineering", "Web Development", "AI / Data Science", "Cyber Security", "Design / Creative"].includes(fieldGroup)) {
    actionPlan.push("Build a small portfolio (e.g. GitHub or a design portfolio) showcasing 2–3 relevant projects.");
  }

  actionPlan.push("Complete at least one project directly relevant to your target role.");
  actionPlan.push("Gain internship or practical experience, even informally, before applying widely.");
  actionPlan.push("Practice common interview questions for your target role out loud, not just in your head.");
  actionPlan.push("Start applying to relevant job openings on a consistent, weekly basis.");

  const skillGap = safeArray(guidance?.futureAdvice?.skillGapAnalysis?.toBuild);
  const learningPlan =
    skillGap.length > 0
      ? [`Focus your learning on the specific gaps already identified: ${skillGap.slice(0, 4).join(", ")}.`]
      : [`Build up the core skills expected for ${targetRole} through short courses or guided practice.`];

  const profilePreparation = [
    "Keep your CV to one page and tailor it slightly for each application.",
    "Make sure your LinkedIn headline and summary clearly state your target role.",
  ];

  const nextSteps = [
    "Apply to 3–5 relevant openings this week.",
    "Ask one person already working in this field for a short conversation about their path.",
  ];

  return {
    title: "Preparing for a Job",
    summary: `A practical progression to move from ${subject} toward being job-ready for ${targetRole}.`,
    actionPlan,
    learningPlan,
    profilePreparation,
    nextSteps,
  };
};

const buildInternshipPlan = (student, fieldGroup, guidance, bachelorPlan) => {
  const subject = subjectLabel(student);

  const actionPlan = [
    "Prepare a clear, well-formatted CV highlighting your education, skills, and any projects.",
    "Create or update your LinkedIn profile so you're easy to find and reach out to.",
    "Visit your university or college's career office to ask about internship opportunities.",
    "Talk to professors, seniors, or people in your network — many internships come through referrals.",
    `Research local companies or organizations relevant to ${subject} that may take on interns.`,
  ];

  if (["Computer Science / Software Engineering", "Web Development", "AI / Data Science", "Cyber Security", "Design / Creative", "Engineering"].includes(fieldGroup)) {
    actionPlan.push("Prepare a small portfolio or sample project you can share when reaching out.");
  }

  // Bachelor: fold in bachelorGuidance's already-computed internship
  // recommendations instead of recalculating them here.
  if (student.education === "Bachelor" && bachelorPlan?.applicable) {
    safeArray(bachelorPlan.internshipGuidance?.recommendations)
      .slice(0, 3)
      .forEach((r) => {
        if (!actionPlan.includes(r)) actionPlan.push(r);
      });
  }

  const learningPlan = [
    `Brush up on the fundamentals most relevant to ${subject} before you start reaching out.`,
  ];

  const profilePreparation = [
    "Keep your CV honest and specific — even coursework or small personal projects count.",
    "Prepare a short, clear message you can send when reaching out about opportunities.",
  ];

  const nextSteps = [
    "Reach out to 3–5 relevant contacts or organizations this week.",
    "Follow up on any pending conversations within 5–7 days if you haven't heard back.",
  ];

  return {
    title: "Finding an Internship",
    summary: `Steps to actively pursue internship experience relevant to ${subject}.`,
    actionPlan,
    learningPlan,
    profilePreparation,
    nextSteps,
  };
};

// Fields where a coding/GitHub-style portfolio genuinely applies.
const TECH_PORTFOLIO_FIELDS = ["Computer Science / Software Engineering", "Web Development", "AI / Data Science", "Cyber Security"];

const buildFreelancingPlan = (student, fieldGroup, guidance, bachelorPlan) => {
  const subject = subjectLabel(student);
  const isTechFreelancer = TECH_PORTFOLIO_FIELDS.includes(fieldGroup);
  const isDesignFreelancer = fieldGroup === "Design / Creative";

  const actionPlan = [
    `Choose a specific service or niche within ${subject} rather than offering everything broadly.`,
    "Build the specific skills that niche requires through focused practice.",
    "Create 2–4 strong sample projects that clearly demonstrate that niche.",
  ];

  if (isTechFreelancer) {
    actionPlan.push("Build a simple portfolio (e.g. GitHub plus a small personal site) showcasing your sample projects.");
  } else if (isDesignFreelancer) {
    actionPlan.push("Build a visual portfolio (e.g. on a design-focused platform) showcasing your sample work.");
  } else {
    actionPlan.push("Put together a simple portfolio or set of case studies that showcase your sample work — this doesn't need to involve code or design tools.");
  }

  actionPlan.push("Create a professional profile on a freelance platform relevant to your niche.");
  actionPlan.push("Start with a small number of realistic, smaller-scope projects to build reviews and confidence.");
  actionPlan.push("Use client feedback from early projects to improve your profile and offering.");
  actionPlan.push("Gradually raise your rates and target better-paying work as your portfolio and reviews grow.");

  const learningPlan = [`Focus your practice specifically on the niche you've chosen within ${subject}, rather than spreading across many skills.`];

  const profilePreparation = [
    "Write a clear, specific profile description stating exactly what you offer and to whom.",
    "Set an honest, competitive starting price based on similar freelancers' listings.",
  ];

  const nextSteps = [
    "Publish your freelance profile and sample projects this week.",
    "Apply or pitch to 3–5 relevant small projects to get your first reviews.",
  ];

  return {
    title: "Starting to Freelance",
    summary: `A realistic progression for freelancing based on your ${subject} background — not assuming a coding-based niche unless it fits.`,
    actionPlan,
    learningPlan,
    profilePreparation,
    nextSteps,
  };
};

const FIELD_GROUP_BUSINESS_NOTE = {
  "Computer Science / Software Engineering": "a software, app, or SaaS-style idea",
  "Web Development": "a web-based product or service idea",
  "AI / Data Science": "a data or AI-driven product idea",
  "Cyber Security": "a security-focused service or tool idea",
  Engineering: "a technical product or service idea",
  "Medical / Healthcare": "a general health-related service idea (kept at a general level, without medical or legal claims)",
  "Business / Entrepreneurship": "a services, e-commerce, or general business concept",
  "Design / Creative": "a design or creative services idea",
  General: "an idea grounded in a problem you personally understand well",
};

const buildBusinessPlan = (student, fieldGroup, guidance, bachelorPlan) => {
  const subject = subjectLabel(student);
  const ideaNote = FIELD_GROUP_BUSINESS_NOTE[fieldGroup] || FIELD_GROUP_BUSINESS_NOTE.General;

  const actionPlan = [
    `Identify a real problem you understand well, ideally connected to ${subject} — for example, ${ideaNote}.`,
    "Validate the idea by talking to a handful of real potential users before building anything.",
    "Research who your target customers actually are and what they currently do instead.",
    "Study 2–3 existing competitors or alternatives and note what they do well or poorly.",
    "Define a clear value proposition — why someone would choose this over the alternatives.",
    "Create a simple MVP (minimum viable product) or service version, without over-building.",
    "Test the MVP with a small number of real users and gather honest feedback.",
    "Develop basic marketing and sales skills — even simple outreach and messaging practice helps.",
    "Put together a simple, one-page business plan covering the idea, customers, and next steps.",
    "Connect with relevant startup or entrepreneurship communities, on campus or online.",
  ];

  const learningPlan = [
    "Learn the basics of validating an idea before investing significant time or money.",
    "Learn simple budgeting and pricing so your MVP or service has a realistic cost basis.",
  ];

  const profilePreparation = [
    "Prepare a short, clear pitch (2–3 sentences) you can explain to anyone in under a minute.",
    "Keep a simple record of your validation conversations and what you learned from each.",
  ];

  const nextSteps = [
    "Talk to 3–5 potential users about the problem this week, before building anything.",
    "Set a small, realistic timeline for testing your first MVP version.",
  ];

  if (student.education === "Bachelor" && bachelorPlan?.applicable) {
    safeArray(bachelorPlan.jobReadiness?.recommendations)
      .filter((r) => /validat|pilot|venture/i.test(r))
      .slice(0, 1)
      .forEach((r) => nextSteps.push(r));
  }

  return {
    title: "Exploring Business / Startup",
    summary: `A grounded, field-aware starting point for exploring a business idea connected to ${subject} — not a specific idea imposed on you.`,
    actionPlan,
    learningPlan,
    profilePreparation,
    nextSteps,
  };
};

const GOAL_PLAN_BUILDERS = {
  "Continue Studies": buildContinueStudiesPlan,
  Job: buildJobPlan,
  Internship: buildInternshipPlan,
  Freelancing: buildFreelancingPlan,
  Business: buildBusinessPlan,
};

/* ============================================================
   SAFE FALLBACK
   ============================================================ */

const notApplicableResult = () => ({
  applicable: false,
  goal: "",
  title: "",
  summary: "",
  actionPlan: [],
  recommendedPlatforms: [],
  learningPlan: [],
  profilePreparation: [],
  nextSteps: [],
  bachelorPlan: null,
});

/* ============================================================
   ENTRY POINT
   ============================================================ */

export const generateCareerActionGuidance = (student, guidance) => {
  if (!student || !EDUCATION_LEVELS.includes(student.education)) {
    return notApplicableResult();
  }

  const education = student.education;

  // Bachelor readiness guidance is attached unconditionally whenever the
  // student is Bachelor-level, regardless of whether a goal was resolved.
  const bachelorPlan = education === "Bachelor" ? generateBachelorGuidance(student) : null;

  const goal = resolveGoal(student);
  const fieldGroup = resolveFieldGroup(student);

  if (!goal) {
    return {
      applicable: true,
      goal: "",
      title: "Next Steps",
      summary:
        "We couldn't determine a specific goal from your answers, so here are some general next steps to help you move forward.",
      actionPlan: [
        "Reflect on whether you're currently leaning toward further study, a job, an internship, freelancing, or starting something of your own.",
        "Talk to a teacher, professor, senior, or career advisor to help clarify your direction.",
        `Explore a few realistic options connected to ${subjectLabel(student)} before committing to one path.`,
      ],
      recommendedPlatforms: [],
      learningPlan: [],
      profilePreparation: [],
      nextSteps: ["Revisit your assessment once you have a clearer sense of direction."],
      bachelorPlan,
    };
  }

  const builder = GOAL_PLAN_BUILDERS[goal];
  const plan = builder(student, fieldGroup, guidance, bachelorPlan);

  const recommendedPlatforms = getRecommendedPlatforms(goal, education, fieldGroup);

  return {
    applicable: true,
    goal,
    title: plan.title,
    summary: plan.summary,
    actionPlan: plan.actionPlan,
    recommendedPlatforms,
    learningPlan: plan.learningPlan,
    profilePreparation: plan.profilePreparation,
    nextSteps: plan.nextSteps,
    bachelorPlan,
  };
};

export default generateCareerActionGuidance;