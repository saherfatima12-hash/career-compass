/**
 * bachelorGuidance.js
 * ---------------------------------------------------------------------------
 * ADDITIONAL guidance layer for Bachelor-level students only.
 *
 * This file does NOT replace generateGuidance.js. It does not compute the
 * main career recommendation, performance advice, roadmap, skills, or
 * student profile — that remains the responsibility of generateGuidance.js.
 *
 * This file adds a separate, focused "Bachelor Career Development Plan":
 * project guidance, internship guidance, portfolio guidance, skill
 * development, and job-readiness — derived purely from rule-based logic.
 *
 * NO fetch, NO API calls, NO AI (Groq/Gemini/etc), NO hard-coded students.
 * ---------------------------------------------------------------------------
 */

/* ============================================================
   SHARED HELPERS
   ============================================================ */

const safeArray = (val) => (Array.isArray(val) ? val : val ? [val] : []);
const safeString = (val) => (typeof val === "string" ? val.trim() : "");

const matchesAny = (value, patterns) => {
  const v = safeString(value).toLowerCase();
  if (!v) return false;
  return patterns.some((p) => p.test(v));
};

const NO_PROJECTS_PATTERNS = [/no project/i, /none/i, /not yet/i, /^n\/a$/i];
const NO_INTERNSHIP_PATTERNS = [/no experience/i, /none/i, /not yet/i, /^n\/a$/i];

const isNoProjects = (projects) => {
  const arr = safeArray(projects);
  if (arr.length === 0 && !safeString(projects)) return true;
  const value = arr.length > 0 ? arr[0] : projects;
  return matchesAny(value, NO_PROJECTS_PATTERNS);
};

const isNoInternship = (internship) => {
  if (!safeString(internship)) return true;
  return matchesAny(internship, NO_INTERNSHIP_PATTERNS);
};

const isInternshipInProgress = (internship) => /currently intern/i.test(safeString(internship));
const isInternshipCompleted = (internship) => /completed/i.test(safeString(internship));

// "1–2 projects" / "3 or more projects" / "No projects yet"
const projectsLevel = (projects) => {
  if (isNoProjects(projects)) return "not-started";
  const value = safeString(Array.isArray(projects) ? projects[0] : projects);
  if (/3 or more/i.test(value)) return "strong";
  if (/1[–-]2/.test(value)) return "developing";
  return "developing"; // any non-empty, non-"no projects" value defaults here
};

// Parses a leading number out of strings like "3rd Semester".
const parseSemesterStage = (semester) => {
  const value = safeString(semester);
  const match = value.match(/^(\d+)/);
  if (!match) return "unknown";
  const num = parseInt(match[1], 10);
  if (Number.isNaN(num)) return "unknown";
  if (num <= 3) return "early";
  if (num <= 6) return "middle";
  return "final";
};

/* ============================================================
   FIELD METADATA
   Keyed on the exact Bachelor subjects offered by CareerForm.jsx
   (educationOptions.Bachelor: Computer Science, Engineering, Business,
   Medical). An unrecognized subject falls back to a generic, safe meta
   object so the function never breaks on unexpected input.
   ============================================================ */

const SUBJECT_META = {
  "Computer Science": {
    label: "Computer Science",
    isTechnical: true,
    usesGitHub: true,
    coreSkills: [
      "Programming",
      "Problem Solving",
      "Version Control (Git)",
      "Data Structures & Algorithms",
      "Debugging & Testing",
    ],
    projectIdeasBeginner: [
      "a small CRUD web application",
      "a command-line tool that solves a real, everyday problem",
      "a basic REST API with a simple database",
    ],
    projectIdeasAdvanced: [
      "a full-stack application with authentication and a deployed live demo",
      "a project that integrates a public API",
      "a small open-source contribution to an existing project",
    ],
    portfolioType: "technical",
  },
  Engineering: {
    label: "Engineering",
    isTechnical: true,
    usesGitHub: false,
    coreSkills: [
      "Technical Problem Solving",
      "CAD / Simulation Tools",
      "Project Documentation",
      "Team Collaboration",
      "Industry Standards Awareness",
    ],
    projectIdeasBeginner: [
      "a small design or simulation project using tools relevant to your discipline",
      "a hands-on lab-based mini project",
      "a documented technical report analyzing a practical problem",
    ],
    projectIdeasAdvanced: [
      "a more complex design/build project with measurable, documented results",
      "a project addressing a real campus or industry problem",
      "a project prepared for a student symposium or engineering competition",
    ],
    portfolioType: "technical-engineering",
  },
  Business: {
    label: "Business",
    isTechnical: false,
    usesGitHub: false,
    coreSkills: [
      "Market Research",
      "Business Communication",
      "Financial Literacy",
      "Basic Data Analysis (Excel)",
      "Presentation & Pitching",
    ],
    projectIdeasBeginner: [
      "a small market research project on a real product or service",
      "a basic business plan or feasibility study",
      "a mock marketing campaign for a local or student business",
    ],
    projectIdeasAdvanced: [
      "a more detailed business case study built on real data",
      "a small, informal consulting-style project for an actual small business",
      "a documented growth or go-to-market plan",
    ],
    portfolioType: "case-study",
  },
  Medical: {
    label: "Medical",
    isTechnical: false,
    usesGitHub: false,
    coreSkills: [
      "Clinical Reasoning",
      "Patient Communication",
      "Research & Literature Review",
      "Academic Writing",
      "Attention to Detail",
    ],
    projectIdeasBeginner: [
      "assisting with a small research project or case study under a professor's supervision",
      "a structured literature review on a topic of interest",
      "a community health awareness initiative",
    ],
    projectIdeasAdvanced: [
      "contributing to or co-authoring a research paper or case report",
      "a more structured clinical or academic research project",
      "presenting findings at a student or academic conference",
    ],
    portfolioType: "academic-research",
  },
};

const GENERIC_SUBJECT_META = {
  label: "Your Field",
  isTechnical: false,
  usesGitHub: false,
  coreSkills: ["Communication", "Problem Solving", "Time Management", "Research Skills"],
  projectIdeasBeginner: ["a small, practical project relevant to your field of study"],
  projectIdeasAdvanced: ["a more advanced, well-documented project relevant to your field"],
  portfolioType: "general",
};

const getSubjectMeta = (subject) => SUBJECT_META[safeString(subject)] || GENERIC_SUBJECT_META;

/* ============================================================
   TRACK DERIVATION
   Priority: careerPriority (most direct) -> careerGoal keywords ->
   futureGoal keywords -> default "job". The student's stated goal is
   never silently overridden.
   ============================================================ */

const deriveTrack = (student) => {
  const priority = safeString(student.careerPriority);
  if (priority === "Job") return "job";
  if (priority === "Higher Studies") return "research";
  if (priority === "Freelancing") return "freelancing";
  if (priority === "Startup") return "business";
  if (priority === "Research") return "research";
  if (priority === "Confused — need guidance") return "confused";

  const goal = safeString(student.careerGoal).toLowerCase();
  if (goal) {
    if (/freelanc/.test(goal)) return "freelancing";
    if (/founder|entrepreneur/.test(goal)) return "business";
    if (/research|r&d|higher studies/.test(goal)) return "research";
    if (goal) return "job";
  }

  const futureGoal = safeString(student.futureGoal).toLowerCase();
  if (futureGoal) {
    if (/freelanc/.test(futureGoal)) return "freelancing";
    if (/startup|business|entrepreneur/.test(futureGoal)) return "business";
    if (/research|higher studies/.test(futureGoal)) return "research";
  }

  return "job";
};

/* ============================================================
   1. PROJECT GUIDANCE
   ============================================================ */

const buildProjectGuidance = (student, meta, track) => {
  const status = projectsLevel(student.projects);
  const recommendations = [];
  let message = "";

  if (status === "not-started") {
    message = meta.isTechnical
      ? `You don't have any projects yet. Before relying heavily on job applications, it's important to build a small number of practical projects that demonstrate your ${meta.label} skills.`
      : `You don't have any projects yet. Projects don't have to involve programming — for ${meta.label}, practical, field-relevant work is just as valuable to show what you can do.`;

    meta.projectIdeasBeginner.slice(0, 2).forEach((idea) => {
      recommendations.push(`Consider starting with ${idea}.`);
    });

    if (meta.usesGitHub) {
      recommendations.push("Create a GitHub account and push your code as you build, even for small practice projects.");
    } else if (meta.isTechnical) {
      recommendations.push("Keep clear documentation or reports for each project — this becomes your evidence of practical skill.");
    } else {
      recommendations.push("Keep a simple written record of each project — the problem, your approach, and the outcome.");
    }
  } else {
    message =
      status === "strong"
        ? `You already have a solid project base. At this point, the focus should shift from quantity to depth — strengthening and showcasing what you've built.`
        : `You've started building projects, which is a good foundation. The focus now should be on going deeper rather than starting over.`;

    meta.projectIdeasAdvanced.slice(0, 2).forEach((idea) => {
      recommendations.push(`Consider adding ${idea}.`);
    });

    recommendations.push("Improve and polish your existing projects rather than only starting new ones.");
    recommendations.push("Add measurable outcomes where possible (e.g. what problem it solved, results, or impact).");
    recommendations.push("Write clear documentation so someone unfamiliar with the project can understand it quickly.");

    if (meta.usesGitHub) {
      recommendations.push("Make sure your best projects are pinned and well-documented on GitHub, ideally with a live/deployed demo.");
    }

    recommendations.push("Be ready to talk through these projects in detail in interviews and reference them on your CV.");
  }

  if (track === "freelancing") {
    recommendations.push("Package your strongest projects into a focused portfolio aimed at the type of freelance work you want to do.");
  } else if (track === "business") {
    recommendations.push("If possible, treat one project as a small pilot — something you could realistically test with real users or customers.");
  } else if (track === "research") {
    recommendations.push("Consider whether one of your projects could be extended into a more formal research write-up.");
  }

  return { status, message, recommendations };
};

/* ============================================================
   2. INTERNSHIP GUIDANCE
   ============================================================ */

const buildInternshipGuidance = (student, meta, track) => {
  const noInternship = isNoInternship(student.internship);
  const inProgress = isInternshipInProgress(student.internship);
  const completed = isInternshipCompleted(student.internship);

  const status = noInternship ? "not-started" : inProgress ? "in-progress" : completed ? "completed" : "unknown";

  const recommendations = [];
  let message = "";

  if (status === "not-started") {
    message = `You don't have internship or practical experience yet. Actively preparing for and pursuing an internship should be a priority alongside your studies.`;
    recommendations.push("Prepare a clear, well-structured CV highlighting your skills and any projects.");
    recommendations.push("Set up or update your LinkedIn profile so you're easy to find and reach out to.");
    recommendations.push("Visit your university's career office to ask about internship opportunities and application support.");
    recommendations.push("Talk to professors or seniors — many internship opportunities come through direct referrals.");
    recommendations.push(`Look into internship platforms and resources relevant to ${meta.label} to find openings to apply to.`);
    recommendations.push("Research local companies or organizations in your field that may offer internships or shadowing opportunities.");

    if (track === "research") {
      recommendations.push("Also consider asking faculty about research assistantship opportunities as an alternative to an industry internship.");
    }
  } else {
    message =
      status === "completed"
        ? "You've completed an internship — this is valuable, real experience that should be actively used in your applications and profile."
        : "You're currently interning, which is great. Use this time deliberately to build toward your next step.";

    recommendations.push("Document what you actually did during the internship, including specific tasks and outcomes.");
    recommendations.push("Add this experience to your CV and LinkedIn with concrete details, not just the job title.");
    recommendations.push("Reflect on which skills this experience strengthened, and which gaps it revealed.");

    if (status === "in-progress") {
      recommendations.push("Use the remaining time to ask for feedback and take on more responsibility where possible.");
    } else {
      recommendations.push("Consider whether you need a second, stronger, or more specialized experience before you graduate.");
    }

    recommendations.push("Start shifting more of your attention toward broader job readiness — CV, interviews, and applications.");
  }

  return { status, message, recommendations };
};

/* ============================================================
   3. PORTFOLIO GUIDANCE
   ============================================================ */

const buildPortfolioGuidance = (student, meta, track) => {
  const favoriteAreas = safeArray(student.favoriteAreas).map((a) => safeString(a).toLowerCase());
  const isDesignLeaning = favoriteAreas.some((a) => /design|ui\/ux/.test(a));

  const recommendations = [];

  if (meta.portfolioType === "technical") {
    recommendations.push("Maintain a GitHub profile with a few pinned, well-documented projects.");
    recommendations.push("Consider a simple personal portfolio site that links to your best work and live demos.");
    if (isDesignLeaning) {
      recommendations.push("Since design also interests you, consider a visual portfolio (e.g. on a design-focused platform) alongside your GitHub.");
    }
  } else if (meta.portfolioType === "technical-engineering") {
    recommendations.push("Build a portfolio of technical project reports, design files, or lab work rather than a code-focused profile.");
    recommendations.push("Include clear write-ups: the problem, your approach, tools used, and the outcome for each project.");
  } else if (meta.portfolioType === "case-study") {
    recommendations.push("Put together a small set of case studies — market research write-ups, mock campaigns, or business plans you've worked on.");
    recommendations.push("Keep a clean, professional LinkedIn profile that summarizes your experience and interests clearly.");
  } else if (meta.portfolioType === "academic-research") {
    recommendations.push("Focus on an academic/research profile instead of a visual portfolio — coursework, research involvement, and certifications.");
    recommendations.push("Keep a well-structured academic CV that's easy to update as you gain more experience.");
    recommendations.push("A traditional visual portfolio isn't typically expected in this field — your academic and clinical record matters more.");
  } else {
    recommendations.push("Keep a simple, well-organized record of your projects, experience, and skills that you can share with others.");
  }

  if (track === "freelancing") {
    recommendations.push("Whatever format fits your field, treat your portfolio as a priority — it's often the deciding factor for freelance clients.");
  } else if (track === "business") {
    recommendations.push("Consider a simple one-page overview summarizing any ventures, projects, or initiatives you've attempted.");
  }

  return { recommendations };
};

/* ============================================================
   4. SKILL DEVELOPMENT
   ============================================================ */

const TRACK_SKILL_ADDITIONS = {
  freelancing: ["Client Communication", "Pricing & Proposals", "Time Management"],
  business: ["Basic Financial Planning", "Pitching", "Market Validation"],
  research: ["Academic Writing", "Literature Review", "Research Methodology"],
  job: [],
  confused: [],
};

const buildSkillDevelopment = (student, meta, track) => {
  const currentSkills = safeArray(student.skills);
  const currentSkillsNorm = currentSkills.map((s) => safeString(s).toLowerCase());

  const recommendedSkills = [
    ...meta.coreSkills,
    ...(TRACK_SKILL_ADDITIONS[track] || []),
  ];

  // De-duplicate while preserving order.
  const seen = new Set();
  const uniqueRecommended = recommendedSkills.filter((skill) => {
    const key = skill.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const skillsToDevelop = uniqueRecommended.filter(
    (skill) => !currentSkillsNorm.some((s) => skill.toLowerCase().includes(s) || s.includes(skill.toLowerCase()))
  );

  const recommendations = [];

  if (skillsToDevelop.length > 0) {
    recommendations.push(
      `Based on your field and goals, prioritize developing: ${skillsToDevelop.slice(0, 4).join(", ")}.`
    );
  } else {
    recommendations.push("Your current skills already cover the core areas typically expected for your field and goal — focus on deepening them through real practice.");
  }

  const favoriteAreas = safeArray(student.favoriteAreas);
  if (favoriteAreas.length > 0) {
    recommendations.push(`Since you're drawn to ${favoriteAreas.slice(0, 2).join(" and ")}, look for ways to build skills through projects or coursework in that specific area.`);
  }

  if (student.careerGoal) {
    recommendations.push(`Keep your skill-building focused on what's directly useful for your goal of ${safeString(student.careerGoal)}, rather than trying to learn everything at once.`);
  }

  return {
    currentSkills,
    skillsToDevelop,
    recommendations,
  };
};

/* ============================================================
   5. JOB READINESS
   ============================================================ */

const READINESS_LABELS = {
  job: ["early-stage", "building", "ready-to-apply"],
  freelancing: ["early-stage", "building-toward-freelance", "freelance-ready"],
  business: ["exploring", "validating", "venture-ready"],
  research: ["foundational", "developing-research-profile", "postgrad-ready"],
  confused: ["exploring-options", "exploring-options", "exploring-options"],
};

const buildJobReadiness = (student, track, semesterStage, projectStatus, internshipStatus) => {
  let score = 0;

  if (projectStatus === "developing") score += 1;
  if (projectStatus === "strong") score += 2;

  if (internshipStatus === "in-progress") score += 1;
  if (internshipStatus === "completed") score += 2;

  if (semesterStage === "final") score += 1;
  if (semesterStage === "middle") score += 0.5;

  const labels = READINESS_LABELS[track] || READINESS_LABELS.job;
  let status;
  if (score >= 4) status = labels[2];
  else if (score >= 2) status = labels[1];
  else status = labels[0];

  const recommendations = [];

  if (semesterStage === "early") {
    recommendations.push("Focus mainly on fundamentals, exploring your field, building core skills, and starting small projects.");
  } else if (semesterStage === "middle") {
    recommendations.push("Focus on stronger, more specialized projects, seeking an internship, and building a professional profile.");
  } else if (semesterStage === "final") {
    recommendations.push("Prioritize your CV/portfolio, internships, interview preparation, active job applications, and networking.");
  } else {
    recommendations.push("Balance building core skills and projects with starting to prepare your CV and professional profile.");
  }

  if (track === "job") {
    if (status === "early-stage") {
      recommendations.push("Focus on projects and foundational skills before putting heavy emphasis on job applications.");
    } else if (status === "building") {
      recommendations.push("Start preparing your CV and applying to internships or entry-level roles alongside your studies.");
    } else {
      recommendations.push("You appear well-positioned to actively apply for entry-level roles — prioritize CV polish, interview practice, and networking.");
    }
  } else if (track === "freelancing") {
    recommendations.push("Prioritize a small number of strong, focused projects over a broad but shallow portfolio.");
  } else if (track === "business") {
    recommendations.push("Prioritize validating a real problem and testing a small idea over building a large formal plan too early.");
  } else if (track === "research") {
    recommendations.push("Prioritize research involvement, academic writing, and relationships with faculty who can support future applications.");
  } else if (track === "confused") {
    recommendations.push("Since you're still deciding on a direction, prioritize exploring — small projects, conversations with professionals, and trying different types of work.");
  }

  return { status, recommendations };
};

/* ============================================================
   NEXT ACTIONS
   A short, prioritized summary pulled from the sections above.
   ============================================================ */

const buildNextActions = ({ projectGuidance, internshipGuidance, portfolioGuidance, semesterStage, track }) => {
  const actions = [];

  if (projectGuidance.status === "not-started") {
    actions.push("Start your first practical project relevant to your field.");
  } else {
    actions.push("Strengthen or extend one of your existing projects with a clear, documented outcome.");
  }

  if (internshipGuidance.status === "not-started") {
    actions.push(semesterStage === "final" ? "Prioritize applying for internships or entry-level roles immediately." : "Begin preparing your CV and reaching out about internship opportunities.");
  } else if (internshipGuidance.status === "in-progress") {
    actions.push("Make the most of your current internship and ask for feedback on your performance.");
  } else if (internshipGuidance.status === "completed") {
    actions.push("Update your CV and LinkedIn with details from your completed internship.");
  }

  if (portfolioGuidance.recommendations[0]) {
    actions.push(portfolioGuidance.recommendations[0]);
  }

  if (track === "confused") {
    actions.push("Talk to a professor, senior, or career advisor to help narrow down your direction.");
  }

  if (semesterStage === "final") {
    actions.push("Begin active interview preparation and networking, since graduation is approaching.");
  }

  return actions.slice(0, 6);
};

/* ============================================================
   SAFE FALLBACK (non-Bachelor students)
   ============================================================ */

const emptySection = () => ({ status: "", message: "", recommendations: [] });

const notApplicableResult = () => ({
  applicable: false,
  title: "",
  summary: "",
  projectGuidance: emptySection(),
  internshipGuidance: emptySection(),
  portfolioGuidance: { recommendations: [] },
  skillDevelopment: { currentSkills: [], skillsToDevelop: [], recommendations: [] },
  jobReadiness: { status: "", recommendations: [] },
  nextActions: [],
});

/* ============================================================
   ENTRY POINT
   ============================================================ */

export const generateBachelorGuidance = (student) => {
  if (!student || student.education !== "Bachelor") {
    return notApplicableResult();
  }

  const meta = getSubjectMeta(student.subject);
  const track = deriveTrack(student);
  const semesterStage = parseSemesterStage(student.semester);

  const projectGuidance = buildProjectGuidance(student, meta, track);
  const internshipGuidance = buildInternshipGuidance(student, meta, track);
  const portfolioGuidance = buildPortfolioGuidance(student, meta, track);
  const skillDevelopment = buildSkillDevelopment(student, meta, track);
  const jobReadiness = buildJobReadiness(
    student,
    track,
    semesterStage,
    projectGuidance.status,
    internshipGuidance.status
  );

  const nextActions = buildNextActions({
    projectGuidance,
    internshipGuidance,
    portfolioGuidance,
    semesterStage,
    track,
  });

  const title = `Your ${meta.label} Career Development Plan`;

  const stageText =
    semesterStage === "early"
      ? "early in your degree"
      : semesterStage === "middle"
      ? "midway through your degree"
      : semesterStage === "final"
      ? "close to graduation"
      : "at your current stage";

  const summary = `Based on where you are ${stageText} and your focus on ${
    track === "confused" ? "figuring out your direction" : track
  }, here's an additional development plan covering your projects, experience, portfolio, and skills.`;

  return {
    applicable: true,
    title,
    summary,
    projectGuidance,
    internshipGuidance,
    portfolioGuidance,
    skillDevelopment,
    jobReadiness,
    nextActions,
  };
};

export default generateBachelorGuidance;