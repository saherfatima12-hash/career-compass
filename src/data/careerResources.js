/**
 * careerResources.js
 * ---------------------------------------------------------------------------
 * Static, reusable resource catalog for the rule-based career guidance
 * system. This file contains NO student-specific data, makes NO API calls,
 * and generates NO AI content — it is pure, hand-curated reference data.
 *
 * Later filtering logic (e.g. in careerActionGuidance.js) is expected to
 * select relevant resources by comparing a student's education level,
 * field/subject, and goal against the metadata on each entry below —
 * not every resource is shown to every student.
 * ---------------------------------------------------------------------------
 */

/* ============================================================
   SHARED VOCABULARY
   Exported so filtering logic elsewhere references the same strings
   instead of retyping them (and risking mismatches).
   ============================================================ */

export const EDUCATION_LEVELS = ["Matric", "Intermediate", "Bachelor"];

export const GOALS = ["Continue Studies", "Job", "Internship", "Freelancing", "Business"];

export const FIELD_GROUPS = [
  "Computer Science / Software Engineering",
  "Web Development",
  "AI / Data Science",
  "Cyber Security",
  "Engineering",
  "Medical / Healthcare",
  "Business / Entrepreneurship",
  "Design / Creative",
  "General",
];

export const RESOURCE_CATEGORIES = [
  "Job Platforms",
  "Internship Platforms",
  "Freelancing Platforms",
  "Professional Networking",
  "Portfolio Platforms",
  "Learning Platforms",
  "Project/Development Platforms",
  "Research Platforms",
  "Business/Startup Resources",
  "Career Preparation",
];

/* ============================================================
   RESOURCE CATALOG
   ============================================================ */

const careerResources = [
  /* ---------------- Professional Networking ---------------- */
  {
    name: "LinkedIn",
    category: "Professional Networking",
    url: "https://www.linkedin.com",
    description:
      "Build a professional profile, connect with people in your field, and find jobs, internships, and freelance opportunities in one place.",
    goals: ["Job", "Internship", "Freelancing", "Business"],
    fields: ["General"],
    educationLevels: ["Intermediate", "Bachelor"],
    type: "platform",
  },

  /* ---------------- Job Platforms ---------------- */
  {
    name: "Indeed",
    category: "Job Platforms",
    url: "https://www.indeed.com",
    description:
      "A large job search engine covering entry-level and experienced roles across almost every industry.",
    goals: ["Job"],
    fields: ["General"],
    educationLevels: ["Bachelor"],
    type: "platform",
  },
  {
    name: "Rozee.pk",
    category: "Job Platforms",
    url: "https://www.rozee.pk",
    description:
      "A leading local job platform with listings across technology, business, healthcare, and other sectors — useful for both full-time roles and internships.",
    goals: ["Job", "Internship"],
    fields: ["General"],
    educationLevels: ["Intermediate", "Bachelor"],
    type: "platform",
  },
  {
    name: "Glassdoor",
    category: "Job Platforms",
    url: "https://www.glassdoor.com",
    description:
      "Search jobs while also researching company reviews, salary ranges, and interview experiences before you apply.",
    goals: ["Job"],
    fields: ["General"],
    educationLevels: ["Bachelor"],
    type: "platform",
  },
  {
    name: "Wellfound (AngelList Talent)",
    category: "Job Platforms",
    url: "https://wellfound.com",
    description:
      "A job platform focused specifically on startups — useful if you're drawn to fast-paced, high-ownership environments rather than large structured companies.",
    goals: ["Job", "Internship"],
    fields: ["Computer Science / Software Engineering", "Web Development", "AI / Data Science", "Business / Entrepreneurship"],
    educationLevels: ["Bachelor"],
    type: "platform",
  },

  /* ---------------- Internship Platforms ---------------- */
  {
    name: "Internshala",
    category: "Internship Platforms",
    url: "https://internshala.com",
    description:
      "A platform focused specifically on internships and entry-level training programs across a wide range of fields.",
    goals: ["Internship"],
    fields: ["General"],
    educationLevels: ["Intermediate", "Bachelor"],
    type: "platform",
  },

  /* ---------------- Freelancing Platforms ---------------- */
  {
    name: "Upwork",
    category: "Freelancing Platforms",
    url: "https://www.upwork.com",
    description:
      "One of the largest freelance marketplaces, covering technical, creative, and business services for clients worldwide.",
    goals: ["Freelancing"],
    fields: ["General"],
    educationLevels: ["Bachelor"],
    type: "platform",
  },
  {
    name: "Fiverr",
    category: "Freelancing Platforms",
    url: "https://www.fiverr.com",
    description:
      "A freelance marketplace built around clearly-priced service packages — a good starting point for building your first reviews and clients.",
    goals: ["Freelancing"],
    fields: ["General"],
    educationLevels: ["Intermediate", "Bachelor"],
    type: "platform",
  },

  /* ---------------- Portfolio Platforms ---------------- */
  {
    name: "GitHub",
    category: "Portfolio Platforms",
    url: "https://github.com",
    description:
      "Host your code, contribute to open-source projects, and build a public portfolio that employers and clients can review directly.",
    goals: ["Job", "Internship", "Freelancing"],
    fields: ["Computer Science / Software Engineering", "Web Development", "AI / Data Science", "Cyber Security"],
    educationLevels: ["Bachelor"],
    type: "platform",
  },
  {
    name: "Behance",
    category: "Portfolio Platforms",
    url: "https://www.behance.net",
    description:
      "A visual portfolio platform for showcasing design, illustration, and creative work to potential clients and employers.",
    goals: ["Job", "Freelancing"],
    fields: ["Design / Creative"],
    educationLevels: ["Intermediate", "Bachelor"],
    type: "platform",
  },
  {
    name: "Dribbble",
    category: "Portfolio Platforms",
    url: "https://dribbble.com",
    description:
      "A design-focused community for sharing UI, branding, and illustration work, and discovering design job opportunities.",
    goals: ["Job", "Freelancing"],
    fields: ["Design / Creative"],
    educationLevels: ["Bachelor"],
    type: "platform",
  },

  /* ---------------- Learning Platforms ---------------- */
  {
    name: "Coursera",
    category: "Learning Platforms",
    url: "https://www.coursera.org",
    description:
      "University- and industry-backed online courses and certificates, spanning technology, business, healthcare, and more.",
    goals: ["Continue Studies", "Job"],
    fields: ["General"],
    educationLevels: ["Intermediate", "Bachelor"],
    type: "platform",
  },
  {
    name: "edX",
    category: "Learning Platforms",
    url: "https://www.edx.org",
    description:
      "Free and paid courses from universities worldwide, useful for both foundational learning and specialized upskilling.",
    goals: ["Continue Studies", "Job"],
    fields: ["General"],
    educationLevels: ["Intermediate", "Bachelor"],
    type: "platform",
  },
  {
    name: "Khan Academy",
    category: "Learning Platforms",
    url: "https://www.khanacademy.org",
    description:
      "Free, beginner-friendly lessons in core subjects like Mathematics, Science, and Computing — a strong foundation-building resource.",
    goals: ["Continue Studies"],
    fields: ["General"],
    educationLevels: ["Matric", "Intermediate"],
    type: "platform",
  },
  {
    name: "freeCodeCamp",
    category: "Learning Platforms",
    url: "https://www.freecodecamp.org",
    description:
      "Free, project-based coding curriculum covering web development fundamentals through full-stack development.",
    goals: ["Continue Studies", "Job", "Freelancing"],
    fields: ["Computer Science / Software Engineering", "Web Development"],
    educationLevels: ["Intermediate", "Bachelor"],
    type: "platform",
  },
  {
    name: "Kaggle",
    category: "Learning Platforms",
    url: "https://www.kaggle.com",
    description:
      "Practice data science and machine learning through real datasets and competitions, and learn from shared community notebooks.",
    goals: ["Continue Studies", "Job"],
    fields: ["AI / Data Science"],
    educationLevels: ["Intermediate", "Bachelor"],
    type: "platform",
  },
  {
    name: "TryHackMe",
    category: "Learning Platforms",
    url: "https://tryhackme.com",
    description:
      "Guided, hands-on cyber security training in safe, legal environments — suitable for beginners building practical security skills.",
    goals: ["Continue Studies", "Job"],
    fields: ["Cyber Security"],
    educationLevels: ["Bachelor"],
    type: "platform",
  },

  /* ---------------- Project/Development Platforms ---------------- */
  {
    name: "HackerRank",
    category: "Project/Development Platforms",
    url: "https://www.hackerrank.com",
    description:
      "Practice coding problems and data structures & algorithms — widely used for technical interview preparation.",
    goals: ["Job", "Internship"],
    fields: ["Computer Science / Software Engineering", "AI / Data Science"],
    educationLevels: ["Bachelor"],
    type: "platform",
  },
  {
    name: "LeetCode",
    category: "Project/Development Platforms",
    url: "https://leetcode.com",
    description:
      "A large library of coding interview questions, commonly used to prepare for technical software engineering interviews.",
    goals: ["Job", "Internship"],
    fields: ["Computer Science / Software Engineering"],
    educationLevels: ["Bachelor"],
    type: "platform",
  },
  {
    name: "HackTheBox",
    category: "Project/Development Platforms",
    url: "https://www.hackthebox.com",
    description:
      "Practice offensive and defensive security skills in realistic, sandboxed lab environments.",
    goals: ["Job", "Continue Studies"],
    fields: ["Cyber Security"],
    educationLevels: ["Bachelor"],
    type: "platform",
  },
  {
    name: "GrabCAD",
    category: "Project/Development Platforms",
    url: "https://grabcad.com",
    description:
      "A community and library of CAD models and design projects, useful for building and showcasing engineering design work.",
    goals: ["Job", "Continue Studies"],
    fields: ["Engineering"],
    educationLevels: ["Bachelor"],
    type: "platform",
  },
  {
    name: "Canva",
    category: "Project/Development Platforms",
    url: "https://www.canva.com",
    description:
      "An accessible design tool for creating graphics, social media content, and presentations — a practical starting point for creative work.",
    goals: ["Freelancing", "Job"],
    fields: ["Design / Creative"],
    educationLevels: ["Matric", "Intermediate", "Bachelor"],
    type: "platform",
  },

  /* ---------------- Research Platforms ---------------- */
  {
    name: "Google Scholar",
    category: "Research Platforms",
    url: "https://scholar.google.com",
    description:
      "Search academic papers, theses, and citations across disciplines — a starting point for any research-oriented work.",
    goals: ["Continue Studies"],
    fields: ["General"],
    educationLevels: ["Bachelor"],
    type: "platform",
  },
  {
    name: "ResearchGate",
    category: "Research Platforms",
    url: "https://www.researchgate.net",
    description:
      "A network for researchers to share papers, ask questions, and connect with others working in their field.",
    goals: ["Continue Studies"],
    fields: ["Engineering", "Medical / Healthcare", "Computer Science / Software Engineering", "AI / Data Science"],
    educationLevels: ["Bachelor"],
    type: "platform",
  },
  {
    name: "PubMed",
    category: "Research Platforms",
    url: "https://pubmed.ncbi.nlm.nih.gov",
    description:
      "A comprehensive database of biomedical and life sciences literature, essential for medical research and evidence-based study.",
    goals: ["Continue Studies"],
    fields: ["Medical / Healthcare"],
    educationLevels: ["Bachelor"],
    type: "platform",
  },
  {
    name: "IEEE Xplore",
    category: "Research Platforms",
    url: "https://ieeexplore.ieee.org",
    description:
      "A digital library of technical papers and standards in engineering, computing, and technology fields.",
    goals: ["Continue Studies"],
    fields: ["Engineering", "Computer Science / Software Engineering"],
    educationLevels: ["Bachelor"],
    type: "platform",
  },

  /* ---------------- Business/Startup Resources ---------------- */
  {
    name: "Y Combinator Startup School",
    category: "Business/Startup Resources",
    url: "https://www.startupschool.org",
    description:
      "Free structured lessons and resources for early-stage founders, covering idea validation, growth, and fundraising basics.",
    goals: ["Business"],
    fields: ["Business / Entrepreneurship", "Computer Science / Software Engineering", "Engineering"],
    educationLevels: ["Bachelor"],
    type: "platform",
  },
  {
    name: "Product Hunt",
    category: "Business/Startup Resources",
    url: "https://www.producthunt.com",
    description:
      "Discover new products and startups, and launch your own to an early-adopter audience for feedback and visibility.",
    goals: ["Business"],
    fields: ["Business / Entrepreneurship", "Computer Science / Software Engineering"],
    educationLevels: ["Bachelor"],
    type: "platform",
  },
  {
    name: "Shopify",
    category: "Business/Startup Resources",
    url: "https://www.shopify.com",
    description:
      "A platform for setting up and running an online store — a practical starting point for small business or e-commerce ideas.",
    goals: ["Business"],
    fields: ["Business / Entrepreneurship"],
    educationLevels: ["Intermediate", "Bachelor"],
    type: "platform",
  },
  {
    name: "Google Digital Garage",
    category: "Business/Startup Resources",
    url: "https://learndigital.withgoogle.com",
    description:
      "Free courses on digital marketing, data, and career development — useful groundwork for running or promoting a small business.",
    goals: ["Business", "Continue Studies"],
    fields: ["Business / Entrepreneurship"],
    educationLevels: ["Intermediate", "Bachelor"],
    type: "platform",
  },

  /* ---------------- Career Preparation ---------------- */
  {
    name: "Big Interview",
    category: "Career Preparation",
    url: "https://biginterview.com",
    description:
      "Practice mock interviews and learn structured techniques for answering common interview questions with confidence.",
    goals: ["Job", "Internship"],
    fields: ["General"],
    educationLevels: ["Bachelor"],
    type: "platform",
  },
  {
    name: "Novoresume",
    category: "Career Preparation",
    url: "https://novoresume.com",
    description:
      "Build a clean, structured resume using guided templates — useful when preparing to apply for jobs or internships.",
    goals: ["Job", "Internship"],
    fields: ["General"],
    educationLevels: ["Intermediate", "Bachelor"],
    type: "platform",
  },
];

export default careerResources;