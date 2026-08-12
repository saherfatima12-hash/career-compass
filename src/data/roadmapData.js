/* ============================================================
   roadmapData.js
   Pure presentation-layer helper — generates a dynamic career
   journey roadmap from an already-computed student + guidance
   object. Does NOT alter or duplicate any decision-making logic
   from generateGuidance.js / careerGuidance.json.
   ============================================================ */

/**
 * Builds a dynamic list of roadmap milestones for a student.
 * Different students produce different roadmaps because every
 * step's title/description is derived from their own data, and
 * some steps are included/excluded conditionally.
 *
 * @param {object} student - the student object passed to Career.jsx
 * @param {object} guidanceData - guidance.futureAdvice (may be undefined)
 * @returns {Array<{id:string, title:string, description:string, icon:string, isFinal?:boolean}>}
 */
export const generateRoadmap = (student = {}, guidanceData = {}) => {
  const steps = [];

  const subject = student.subject || "your field of study";
  const interest = student.interest || "your area of interest";
  const careerGoal =
    student.careerGoal || guidanceData?.recommend || interest;

  const performanceValue = (student.performance || "").toLowerCase();
  const needsImprovement =
    performanceValue === "average" ||
    performanceValue === "need improvement" ||
    performanceValue === "needs improvement";

  const hasSkills = Array.isArray(student.skills) && student.skills.length > 0;
  const hasProjects = student.projects === "Yes";

  /* 1. Start */
  steps.push({
    id: "start",
    title: "Start Your Journey",
    description: `Beginning as a ${student.education || "student"} with a strong interest in ${interest}.`,
    icon: "flag",
  });

  /* 2. Learn Fundamentals */
  steps.push({
    id: "fundamentals",
    title: "Learn Fundamentals",
    description:
      guidanceData?.focusSubjects?.length
        ? `Build strong foundations in ${guidanceData.focusSubjects.slice(0, 2).join(" and ")}.`
        : `Strengthen your core concepts in ${subject}.`,
    icon: "book",
  });

  /* 3. Improve Weak Areas — only shown for students who need it */
  if (needsImprovement) {
    steps.push({
      id: "improve",
      title: "Improve Weak Areas",
      description:
        "Focus on strengthening the topics you find challenging through regular revision, guided practice, and consistent review.",
      icon: "chart",
    });
  }

  /* 4. Build Skills */
  steps.push({
    id: "skills",
    title: "Build Skills",
    description: hasSkills
      ? `Develop and sharpen key skills: ${student.skills.slice(0, 3).join(", ")}.`
      : guidanceData?.skills?.length
      ? `Develop key skills such as ${guidanceData.skills.slice(0, 3).join(", ")}.`
      : `Develop the core skills needed to succeed in ${subject}.`,
    icon: "spark",
  });

  /* 5. Practice Projects */
  steps.push({
    id: "practice",
    title: "Practice Projects",
    description: hasProjects
      ? "Keep expanding on your existing project experience with more advanced, real-world builds."
      : "Start applying what you learn through small, hands-on practice projects.",
    icon: "route",
  });

  /* 6. Build Portfolio */
  steps.push({
    id: "portfolio",
    title: "Build Portfolio",
    description:
      "Showcase your strongest work to stand out to mentors, recruiters, or institutions in your chosen field.",
    icon: "briefcase",
  });

  /* 7. Career Goal — final destination */
  steps.push({
    id: "goal",
    title: "Reach Your Career Goal",
    description: `Arrive at your destination: ${careerGoal}.`,
    icon: "compass",
    isFinal: true,
  });

  return steps;
};