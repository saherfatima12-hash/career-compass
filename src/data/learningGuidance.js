/* ============================================================
   learningGuidance.js
   Static, data-driven lookup for the "Your Learning Style" and
   "Personalized Learning Resources" sections. Keyed exactly by
   the learningStyle values produced in CareerForm.jsx:
   "Practical Work" | "Reading & Theory" | "Creativity & Designing" | "Problem Solving"
   ============================================================ */

const learningGuidanceData = {
  "Practical Work": {
    label: "Practical Work",
    tagline: "You learn best by doing.",
    explanation:
      "You grasp concepts fastest through direct, hands-on application rather than theory alone. Real experience sticks with you far more than reading about it.",
    recommendedMethod:
      "Prioritize building things — the more you create, the faster and deeper your learning will be.",
    resources: [
      { icon: "route", title: "Project-Based Learning", description: "Learn every concept by building a real, working project around it." },
      { icon: "target", title: "Practice Tasks", description: "Complete small, focused hands-on exercises on a regular schedule." },
      { icon: "briefcase", title: "Real-World Projects", description: "Take on practical problems that mirror actual industry work." },
      { icon: "compass", title: "Internships", description: "Get exposure to real work environments as early as possible." },
      { icon: "spark", title: "Portfolio Building", description: "Document and showcase everything you build along the way." },
    ],
  },

  "Reading & Theory": {
    label: "Reading & Theory",
    tagline: "You learn best through structured understanding.",
    explanation:
      "You absorb concepts deeply by reading, studying structured material, and understanding the reasoning behind every idea before applying it.",
    recommendedMethod:
      "Build a solid theoretical foundation first — practice will come naturally once the concepts are clear.",
    resources: [
      { icon: "book", title: "Documentation", description: "Study official documentation and well-structured reference material." },
      { icon: "book", title: "Books", description: "Read in-depth books that cover your subject with real depth." },
      { icon: "bulb", title: "Core Concepts", description: "Focus on deeply understanding the 'why' behind every topic." },
      { icon: "route", title: "Structured Courses", description: "Follow organized, sequential courses rather than scattered content." },
      { icon: "chart", title: "Note Making", description: "Summarize and organize what you learn to reinforce memory." },
    ],
  },

  "Creativity & Designing": {
    label: "Creativity & Designing",
    tagline: "You learn best through visual and creative expression.",
    explanation:
      "You thrive when learning involves creativity, visuals, and design thinking — ideas click for you when you can see and shape them.",
    recommendedMethod:
      "Learn through iterative visual practice, creative challenges, and constant experimentation.",
    resources: [
      { icon: "spark", title: "UI/UX Practice", description: "Practice designing real interfaces and end-to-end user experiences." },
      { icon: "target", title: "Design Challenges", description: "Take on timed creative challenges to sharpen your instincts." },
      { icon: "briefcase", title: "Figma Practice", description: "Get hands-on with industry-standard design tools daily." },
      { icon: "compass", title: "Creative Projects", description: "Build a variety of self-directed creative projects for your portfolio." },
    ],
  },

  "Problem Solving": {
    label: "Problem Solving",
    tagline: "You learn best through logic and challenges.",
    explanation:
      "You enjoy breaking problems into pieces and thinking analytically to arrive at solutions — puzzles motivate you more than passive study.",
    recommendedMethod:
      "Learn through consistent, structured problem-solving practice rather than passive reading.",
    resources: [
      { icon: "spark", title: "Coding Challenges", description: "Solve regular coding problems to keep your logic sharp." },
      { icon: "route", title: "Algorithms", description: "Study core algorithms and practice applying them to new problems." },
      { icon: "bulb", title: "Logical Exercises", description: "Work through puzzles and logic-based exercises consistently." },
      { icon: "chart", title: "Debugging Practice", description: "Get better at tracing, isolating, and fixing issues methodically." },
    ],
  },
};

/**
 * Returns the learning guidance data for a given learningStyle,
 * or null if the style is missing/unrecognized (e.g. Bachelor
 * students who were never asked this question).
 */
export const getLearningGuidance = (learningStyle) => {
  return learningGuidanceData[learningStyle] || null;
};

export default learningGuidanceData;