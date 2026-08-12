import React, { useState, useEffect, useMemo } from "react";
import "./CareerForm.css";
import { generateGuidance } from "../utils/generateGuidance.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";


/* -------------------------------------------------------------------------
   STEP FLOWS
   Each education level has its own static array of step keys. Navigation
   is just "flow[flow.indexOf(currentKey) + 1]" — no hardcoded step numbers,
   so nothing can accidentally get skipped when the flow changes.
---------------------------------------------------------------------------*/
const COMMON_STEPS = ["personal", "education", "subject"];

const MATRIC_FLOW = [
  "m_subjects",
  "m_interests",
  "m_strengths",
  "m_learning",
  "m_performance",
  "m_future",
  "final",
];

const INTER_FLOW = [
  "i_year",
  "i_subjects",
  "i_fields",
  "i_worktype",
  "i_skills",
  "i_result",
  "i_direction",
  "i_studyplan",
  "final",
];

const BACHELOR_FLOW = [
  "b_semester",
  "b_favareas",
  "b_weakareas",
  "b_skills",
  "b_projects",
  "b_internship",
  "b_priority",
  "b_goal",
  "b_environment",
  "final",
];

const getFlowFor = (education) => {
  if (education === "Matric") return MATRIC_FLOW;
  if (education === "Intermediate") return INTER_FLOW;
  if (education === "Bachelor") return BACHELOR_FLOW;
  return [];
};

/* -------------------------------------------------------------------------
   OPTION DATA
---------------------------------------------------------------------------*/
const educationOptions = {
  Matric: ["Biology", "Computer Science", "Arts"],
  Intermediate: [
    "FSc Pre Medical",
    "FSc Pre Engineering",
    "ICS Physics",
    "ICS Statistics",
    "I.Com",
    "FA",
  ],
  Bachelor: ["Computer Science", "Engineering", "Business", "Medical"],
};

// ---- Matric ----
const matricSubjectOptions = [
  "Mathematics",
  "Science (Biology / Chemistry / Physics)",
  "Computer Studies",
  "English / Languages",
  "Social Studies",
  "Arts",
];

const matricInterestOptions = [
  "Technology & Computers",
  "Creativity & Design",
  "Science & Nature",
  "Sports & Physical Activities",
  "Communication & Social Work",
  "Business & Money",
];

const matricStrengthOptions = [
  "Problem-Solving",
  "Memory & Theory",
  "Creativity",
  "Communication",
  "Leadership",
  "Hands-on / Practical Work",
];

const learningStyles = [
  "Practical Work",
  "Reading & Theory",
  "Creativity & Designing",
  "Problem Solving",
];

const performanceOptions = [
  { label: "🌟 Excellent — I consistently score top marks", value: "Excellent" },
  { label: "👍 Good — I perform well overall", value: "Good" },
  { label: "📘 Average — I do fine, with room to grow", value: "Average" },
  { label: "📈 Needs Improvement — I want to do better", value: "Needs Improvement" },
];

const matricFutureGoals = ["Continue Studies", "Professional Course", "Start Earning"];

// ---- Intermediate ----
const intermediateFavoriteSubjects = {
  "FSc Pre Medical": ["Biology", "Chemistry", "Physics"],
  "FSc Pre Engineering": ["Mathematics", "Physics", "Chemistry"],
  "ICS Physics": ["Programming", "Physics", "Mathematics"],
  "ICS Statistics": ["Statistics", "Mathematics", "Programming"],
  "I.Com": ["Accounting", "Economics", "Business Studies"],
  FA: ["Literature", "Economics", "Social Studies"],
};

const intermediateFieldPreferences = {
  "FSc Pre Medical": ["Clinical Medicine", "Medical Research", "Pharmacy", "Public Health", "Dentistry"],
  "FSc Pre Engineering": ["Mechanical / Civil Engineering", "Electrical / Electronics", "Computer Engineering", "Architecture", "Research & Development"],
  "ICS Physics": ["Software Development", "Networking", "AI & Data", "Game Development", "Cyber Security"],
  "ICS Statistics": ["Data Analysis", "Software Development", "Actuarial Science", "Research"],
  "I.Com": ["Accounting & Finance", "Business Management", "Marketing", "Entrepreneurship"],
  FA: ["Literature & Languages", "Media & Journalism", "Design & Arts", "Social Sciences", "Teaching"],
};

const workTypeOptions = [
  "Hands-on / Practical Work",
  "Research & Theory",
  "Creative / Design Work",
  "Helping & Working With People",
  "Business & Leadership",
];

const generalSkillOptions = [
  "Analytical Thinking",
  "Communication",
  "Technical / Computer Skills",
  "Lab & Practical Skills",
  "Leadership",
  "Time Management",
];

const careerDirections = ["Technology", "Healthcare", "Engineering", "Business", "Research"];

const futureStudyPlans = ["University Degree", "Professional Course", "Job", "Freelancing", "Not Sure Yet"];

const intermediateYears = ["1st Year", "2nd Year"];

// ---- Bachelor ----
const bachelorAreas = {
  "Computer Science": ["Web Development", "Artificial Intelligence", "Data Science", "Cyber Security", "App Development", "UI/UX Design", "Software Engineering"],
  Engineering: ["Design", "Electronics", "Automation", "Programming", "Research", "Project Management"],
  Business: ["Marketing", "Finance", "Entrepreneurship", "Business Analytics", "Management", "E-Commerce"],
  Medical: ["Clinical Practice", "Pharmacology", "Anatomy & Physiology", "Medical Research", "Patient Care"],
};

const bachelorSkills = {
  "Computer Science": ["Programming", "Problem Solving", "Database", "Git/GitHub", "Communication", "Team Work"],
  Medical: ["Clinical Examination", "Patient History Taking", "Research Skills", "Critical Thinking", "Patient Communication"],
  Engineering: ["Technical Skills", "Problem Solving", "Team Work", "Communication", "Project Planning"],
  Business: ["Communication", "Leadership", "Marketing", "Management", "Analytics"],
};

const bachelorCareerGoals = {
  Medical: ["Clinical Doctor", "Medical Specialist", "Medical Researcher", "Healthcare Management", "Higher Studies"],
  "Computer Science": ["Software Developer", "AI/ML Engineer", "Data Scientist", "Cyber Security Specialist", "Freelancer", "Startup Founder"],
  Engineering: ["Industry Engineer", "Research & Development", "Technical Specialist", "Project Management", "Entrepreneurship"],
  Business: ["Business Manager", "Entrepreneur", "Marketing Specialist", "Finance Professional", "Business Analyst"],
};

const semesters = [
  "1st Semester", "2nd Semester", "3rd Semester", "4th Semester",
  "5th Semester", "6th Semester", "7th Semester", "8th Semester",
];

const projectOptions = ["No projects yet", "1–2 projects", "3 or more projects"];

const internshipOptions = [
  "Completed an internship",
  "Currently interning",
  "No experience yet",
];

const careerPriorityOptions = [
  "Job",
  "Higher Studies",
  "Freelancing",
  "Startup",
  "Research",
  "Confused — need guidance",
];

const careerEnvironmentOptions = [
  "Corporate / Structured Environment",
  "Startup / Fast-Paced",
  "Remote / Freelance",
  "Research / Academia",
  "Not Sure Yet",
];

/* -------------------------------------------------------------------------
   COMPONENT
---------------------------------------------------------------------------*/
const CareerForm = ({ closeForm }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const scrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollY);
    };
  }, []);

  const [stepKey, setStepKey] = useState("personal");
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    age: "",

    education: "",
    subject: "",

    // Matric
    favoriteSubjects: [],
    interests: [],
    strengths: [],
    learningStyle: "",
    performance: "",
    matricFutureGoal: "",

    // Intermediate
    year: "",
    fieldPreferences: [],
    workType: "",
    skills: [],
    resultPercentage: "",
    careerDirection: "",
    futureStudyPlan: "",

    // Bachelor
    semester: "",
    favoriteAreas: [],
    weakAreas: [],
    projects: "",
    internship: "",
    careerPriority: "",
    careerGoal: "",
    careerEnvironment: "",
  });

  const flow = useMemo(() => getFlowFor(formData.education), [formData.education]);
  const fullFlow = useMemo(() => [...COMMON_STEPS, ...flow], [flow]);

  const validatePersonal = () => {
    let newErrors = {};
    if (!formData.name) {
      newErrors.name = "Please enter your full name";
    } else if (!/^[A-Za-z ]+$/.test(formData.name)) {
      newErrors.name = "Please enter a valid name";
    }
    if (!formData.age) {
      newErrors.age = "Please enter your age";
    } else if (isNaN(formData.age) || formData.age < 10 || formData.age > 80) {
      newErrors.age = "Please enter a valid age";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Generic "select one option and auto-advance within the CURRENT flow"
  const advanceWithin = (flowArray, currentKey) => {
    const idx = flowArray.indexOf(currentKey);
    return flowArray[idx + 1] ?? currentKey;
  };
const validateCurrentStep = () => {
  switch (stepKey) {
    case "m_subjects":
      return {
        isValid: formData.favoriteSubjects.length > 0,
        message: "Please select at least one subject.",
      };

    case "m_interests":
      return {
        isValid: formData.interests.length > 0,
        message: "Please select at least one interest.",
      };

    case "m_strengths":
      return {
        isValid: formData.strengths.length > 0,
        message: "Please select at least one strength.",
      };

    case "i_subjects":
      return {
        isValid: formData.favoriteSubjects.length > 0,
        message: "Please select at least one subject.",
      };

    case "i_fields":
      return {
        isValid: formData.fieldPreferences.length > 0,
        message: "Please select at least one area.",
      };

    case "i_skills":
      return {
        isValid: formData.skills.length > 0,
        message: "Please select at least one skill.",
      };

    case "i_result":
      return {
        isValid:
          formData.resultPercentage !== "" &&
          formData.resultPercentage >= 0 &&
          formData.resultPercentage <= 100,
        message: "Please enter your result percentage.",
      };

    case "b_favareas":
      return {
        isValid: formData.favoriteAreas.length > 0,
        message: "Please select at least one area.",
      };

    case "b_weakareas":
      return {
        isValid: formData.weakAreas.length > 0,
        message: "Please select at least one area.",
      };

    case "b_skills":
      return {
        isValid: formData.skills.length > 0,
        message: "Please select at least one skill.",
      };

    default:
      return {
        isValid: true,
        message: "",
      };
  }
};
  const selectAndAdvance = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setTimeout(() => {
      setStepKey((prevKey) => advanceWithin(fullFlow, prevKey));
    }, 180);
  };

 const goNext = () => {
  const validation = validateCurrentStep();

  if (!validation.isValid) {
    setErrors({
      [stepKey]: validation.message,
    });
    return;
  }

  setErrors({});
  setStepKey((prevKey) => advanceWithin(fullFlow, prevKey));
};

  const toggleArrayField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item) => item !== value)
        : [...prev[field], value],
    }));
  };

  const renderMultiSelectOptions = (field, options) =>
    options.map((option) => (
      <button
        className={`option-btn ${formData[field].includes(option) ? "active" : ""}`}
        key={option}
        type="button"
        aria-pressed={formData[field].includes(option)}
        onClick={() => toggleArrayField(field, option)}
      >
        {option}
      </button>
    ));

  const renderSingleSelectOptions = (field, options) =>
    options.map((option) => (
      <button
        className={`option-btn ${formData[field] === option ? "active" : ""}`}
        key={option}
        type="button"
        aria-pressed={formData[field] === option}
        onClick={() => selectAndAdvance(field, option)}
      >
        {option}
      </button>
    ));
const [isSubmitting, setIsSubmitting] = useState(false);
 const submitAssessment = async () => {
  if (isSubmitting) return;

  setIsSubmitting(true);

  try {
    const student = {
      name: formData.name,
      age: formData.age,
      education: formData.education,
      subject: formData.subject,

      // Matric
      favoriteSubjects: formData.favoriteSubjects,
      interests: formData.interests,
      strengths: formData.strengths,
      learningStyle: formData.learningStyle,
      performance: formData.performance,
      matricFutureGoal: formData.matricFutureGoal,

      // Intermediate
      year: formData.year,
      fieldPreferences: formData.fieldPreferences,
      workType: formData.workType,
      skills: formData.skills,
      resultPercentage: formData.resultPercentage,
      careerDirection: formData.careerDirection,
      futureStudyPlan: formData.futureStudyPlan,

      // Bachelor
      semester: formData.semester,
      favoriteAreas: formData.favoriteAreas,
      weakAreas: formData.weakAreas,
      projects: formData.projects,
      internship: formData.internship,
      careerPriority: formData.careerPriority,
      careerGoal: formData.careerGoal,
      careerEnvironment: formData.careerEnvironment,

      futureGoal:
        formData.matricFutureGoal ||
        formData.futureStudyPlan ||
        formData.careerPriority,
    };

    const result = await generateGuidance(student);

    console.log(
      "GUIDANCE RESULT:",
      JSON.stringify(result, null, 2)
    );

    navigate("/career", {
      state: { student, guidance: result },
    });

  } catch (error) {
    console.error("Guidance generation failed:", error);
    setIsSubmitting(false);
  }
};
    

   
  const totalSteps = fullFlow.length || 3;
  const currentIndex = Math.max(0, fullFlow.indexOf(stepKey));
  const progressPercent = Math.min(100, Math.round(((currentIndex + 1) / totalSteps) * 100));

  const getIntermediateFavoriteSubjects = () => intermediateFavoriteSubjects[formData.subject] || [];
  const getIntermediateFieldPreferences = () => intermediateFieldPreferences[formData.subject] || [];

  return (
    <div className="assessment-form">
      <div className="form-shell">
        <button className="close-form" onClick={closeForm} aria-label="Close assessment">
          ×
        </button>

        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
        </div>

        {/* ---------------- COMMON ---------------- */}

        {stepKey === "personal" && (
          <div className="form-card">
            <span className="step-eyebrow">Step 1 · Let's get acquainted</span>
            <h2>Tell Us About Yourself</h2>
            <p className="form-description">A few quick details to personalize your career journey.</p>

            <input
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                setErrors({ ...errors, name: "" });
              }}
            />
            {errors.name && <p className="input-error">{errors.name}</p>}

            <input
              type="number"
              placeholder="Enter your age"
              value={formData.age}
              onChange={(e) => {
                setFormData({ ...formData, age: e.target.value });
                setErrors({ ...errors, age: "" });
              }}
            />
            {errors.age && <p className="input-error">{errors.age}</p>}

            <button
              onClick={() => {
                if (validatePersonal()) setStepKey("education");
              }}
            >
              Continue
            </button>
          </div>
        )}

        {stepKey === "education" && (
          <div className="form-card">
            <span className="step-eyebrow">Step 2 · Academic Background</span>
            <h2>What's Your Education Level?</h2>
            <p className="form-description">This helps us tailor the right questions and guidance for you.</p>

            <select
              value={formData.education}
              onChange={(e) => setFormData({ ...formData, education: e.target.value, subject: "" })}
            >
              <option value="">Select your education level</option>
              <option>Matric</option>
              <option>Intermediate</option>
              <option>Bachelor</option>
            </select>

            <button
              onClick={() => {
                if (formData.education) setStepKey("subject");
              }}
            >
              Continue
            </button>
          </div>
        )}

        {stepKey === "subject" && (
          <div className="form-card">
            <span className="step-eyebrow">Step 3 · Field of Study</span>
            <h2>Choose Your Field</h2>
            <p className="form-description">Select the subject or program you're currently studying.</p>

            {(educationOptions[formData.education] || []).map((item) => (
              <button
                className={`option-btn ${formData.subject === item ? "active" : ""}`}
                key={item}
                type="button"
                aria-pressed={formData.subject === item}
                onClick={() => {
                  setFormData((prev) => ({ ...prev, subject: item }));
                  setTimeout(() => setStepKey(getFlowFor(formData.education)[0]), 180);
                }}
              >
                {item}
              </button>
            ))}
          </div>
        )}

        {/* ---------------- MATRIC ---------------- */}

        {stepKey === "m_subjects" && (
          <div className="form-card">
            <span className="step-eyebrow">Step · Favorite Subjects</span>
            <h2>Which Subjects Do You Enjoy Most?</h2>
            <p className="form-description">Select all that apply.</p>
            <div className="interests-grid">
              {renderMultiSelectOptions("favoriteSubjects", matricSubjectOptions)}
            </div>
            {errors.m_subjects && (
  <p className="input-error">{errors.m_subjects}</p>
)}
            <button className="next-btn" onClick={goNext}>Continue</button>
          </div>
        )}

        {stepKey === "m_interests" && (
          <div className="form-card">
            <span className="step-eyebrow">Step · Interests</span>
            <h2>What Kind of Activities Do You Enjoy?</h2>
            <p className="form-description">Select the areas that genuinely interest you.</p>
            <div className="interests-grid">
              {renderMultiSelectOptions("interests", matricInterestOptions)}
            </div>
            {errors[stepKey] && (
  <p className="input-error">{errors[stepKey]}</p>
)}
            <button className="next-btn" onClick={goNext}>Continue</button>
          </div>
        )}

        {stepKey === "m_strengths" && (
          <div className="form-card">
            <span className="step-eyebrow">Step · Strengths</span>
            <h2>What Are You Naturally Good At?</h2>
            <p className="form-description">Select the strengths that describe you best.</p>
            <div className="interests-grid">
              {renderMultiSelectOptions("strengths", matricStrengthOptions)}
            </div>
            {errors[stepKey] && (
  <p className="input-error">{errors[stepKey]}</p>
)}
            <button className="next-btn" onClick={goNext}>Continue</button>
          </div>
        )}

        {stepKey === "m_learning" && (
          <div className="form-card">
            <span className="step-eyebrow">Step · Learning Style</span>
            <h2>How Do You Prefer to Learn?</h2>
            <div className="interests-grid">
              {renderSingleSelectOptions("learningStyle", learningStyles)}
            </div>
          </div>
        )}

        {stepKey === "m_performance" && (
          <div className="form-card">
            <span className="step-eyebrow">Step · Academic Performance</span>
            <h2>How Would You Rate Your Performance?</h2>
            {performanceOptions.map((opt) => (
              <button
                className={`option-btn ${formData.performance === opt.value ? "active" : ""}`}
                key={opt.value}
                type="button"
                aria-pressed={formData.performance === opt.value}
                onClick={() => selectAndAdvance("performance", opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}

        {stepKey === "m_future" && (
          <div className="form-card">
            <span className="step-eyebrow">Step · Next Steps</span>
            <h2>What Do You Plan to Do After Matric?</h2>
            <div className="interests-grid">
              {renderSingleSelectOptions("matricFutureGoal", matricFutureGoals)}
            </div>
          </div>
        )}

        {/* ---------------- INTERMEDIATE ---------------- */}

        {stepKey === "i_year" && (
          <div className="form-card">
            <span className="step-eyebrow">Step · Current Year</span>
            <h2>Which Year Are You In?</h2>
            <div className="interests-grid">
              {renderSingleSelectOptions("year", intermediateYears)}
            </div>
          </div>
        )}

        {stepKey === "i_subjects" && (
          <div className="form-card">
            <span className="step-eyebrow">Step · Favorite Subjects</span>
            <h2>Which Subjects Do You Enjoy Most?</h2>
            <div className="interests-grid">
              {renderMultiSelectOptions("favoriteSubjects", getIntermediateFavoriteSubjects())}
            </div>
            {errors[stepKey] && (
  <p className="input-error">{errors[stepKey]}</p>
)}
            <button className="next-btn" onClick={goNext}>Continue</button>
          </div>
        )}

        {stepKey === "i_fields" && (
          <div className="form-card">
            <span className="step-eyebrow">Step · Areas to Explore</span>
            <h2>Which Areas Would You Like to Explore?</h2>
            <p className="form-description">Select all that interest you within your field.</p>
            <div className="interests-grid">
              {renderMultiSelectOptions("fieldPreferences", getIntermediateFieldPreferences())}
            </div>
            {errors[stepKey] && (
  <p className="input-error">{errors[stepKey]}</p>
)}
            <button className="next-btn" onClick={goNext}>Continue</button>
          </div>
        )}

        {stepKey === "i_worktype" && (
          <div className="form-card">
            <span className="step-eyebrow">Step · Type of Work</span>
            <h2>What Kind of Work Attracts You?</h2>
            <div className="interests-grid">
              {renderSingleSelectOptions("workType", workTypeOptions)}
            </div>
          </div>
        )}

        {stepKey === "i_skills" && (
          <div className="form-card">
            <span className="step-eyebrow">Step · Skills</span>
            <h2>Which Skills Would You Like to Build?</h2>
            <div className="interests-grid">
              {renderMultiSelectOptions("skills", generalSkillOptions)}
            </div>
            {errors[stepKey] && (
  <p className="input-error">{errors[stepKey]}</p>
)}
            <button className="next-btn" onClick={goNext}>Continue</button>
          </div>
        )}

        {stepKey === "i_result" && (
          <div className="form-card">
            <span className="step-eyebrow">Step · Result</span>
            <h2>Your Approximate Result Percentage</h2>
            <input
              type="number"
              placeholder="e.g. 85"
              value={formData.resultPercentage}
              onChange={(e) => setFormData({ ...formData, resultPercentage: e.target.value })}
            />
            {errors[stepKey] && (
  <p className="input-error">{errors[stepKey]}</p>
)}
            <button className="next-btn" onClick={goNext}>Continue</button>
          </div>
        )}

        {stepKey === "i_direction" && (
          <div className="form-card">
            <span className="step-eyebrow">Step · Career Direction</span>
            <h2>Which Direction Interests You Most?</h2>
            <div className="interests-grid">
              {renderSingleSelectOptions("careerDirection", careerDirections)}
            </div>
          </div>
        )}

        {stepKey === "i_studyplan" && (
          <div className="form-card">
            <span className="step-eyebrow">Step · Future Plans</span>
            <h2>What Are Your Plans After Intermediate?</h2>
            <div className="interests-grid">
              {renderSingleSelectOptions("futureStudyPlan", futureStudyPlans)}
            </div>
          </div>
        )}

        {/* ---------------- BACHELOR ---------------- */}

        {stepKey === "b_semester" && (
          <div className="form-card">
            <h2>Which Semester Are You Currently In?</h2>
            <div className="semester-grid">
              {renderSingleSelectOptions("semester", semesters)}
            </div>
          </div>
        )}

        {stepKey === "b_favareas" && (
          <div className="form-card">
            <h2>Which Areas Do You Enjoy the Most?</h2>
            <div className="interests-grid">
              {renderMultiSelectOptions("favoriteAreas", bachelorAreas[formData.subject] || [])}
            </div>
            {errors[stepKey] && (
  <p className="input-error">{errors[stepKey]}</p>
)}
            <button className="next-btn" onClick={goNext}>Next</button>
          </div>
        )}

        {stepKey === "b_weakareas" && (
          <div className="form-card">
            <h2>Which Areas Would You Like to Strengthen?</h2>
            <div className="interests-grid">
              {renderMultiSelectOptions("weakAreas", bachelorAreas[formData.subject] || [])}
            </div>
            {errors[stepKey] && (
  <p className="input-error">{errors[stepKey]}</p>
)}
            <button className="next-btn" onClick={goNext}>Next</button>
          </div>
        )}

        {stepKey === "b_skills" && (
          <div className="form-card">
            <h2>Which Skills Do You Currently Have?</h2>
            <div className="interests-grid">
              {renderMultiSelectOptions("skills", bachelorSkills[formData.subject] || [])}
            </div>
            {errors[stepKey] && (
  <p className="input-error">{errors[stepKey]}</p>
)}
            <button className="next-btn" onClick={goNext}>Next</button>
          </div>
        )}

        {stepKey === "b_projects" && (
          <div className="form-card">
            <h2>Have You Built Any Projects?</h2>
            <div className="interests-grid">
              {renderSingleSelectOptions("projects", projectOptions)}
            </div>
          </div>
        )}

        {stepKey === "b_internship" && (
          <div className="form-card">
            <h2>What Practical / Internship Experience Do You Have?</h2>
            <div className="interests-grid">
              {renderSingleSelectOptions("internship", internshipOptions)}
            </div>
          </div>
        )}

        {stepKey === "b_priority" && (
          <div className="form-card">
            <h2>What's Your Current Career Priority?</h2>
            <p className="form-description">What matters most to you right now?</p>
            <div className="interests-grid">
              {renderSingleSelectOptions("careerPriority", careerPriorityOptions)}
            </div>
          </div>
        )}

        {stepKey === "b_goal" && (
          <div className="form-card">
            <h2>Your Career Goal?</h2>
            <div className="interests-grid">
              {renderSingleSelectOptions("careerGoal", bachelorCareerGoals[formData.subject] || [])}
            </div>
          </div>
        )}

        {stepKey === "b_environment" && (
          <div className="form-card">
            <h2>What Career Environment Do You Prefer?</h2>
            <div className="interests-grid">
              {renderSingleSelectOptions("careerEnvironment", careerEnvironmentOptions)}
            </div>
          </div>
        )}

        {/* ---------------- FINAL ---------------- */}

        {stepKey === "final" && (
          <div className="form-card">
            <span className="step-eyebrow">Almost There</span>
            <h2>Your Assessment Is Complete!</h2>
            <p className="form-description">
              Great work! Click submit below to receive your personalized career roadmap, built just for you.
            </p>
           <button
  className={`next-btn ${isSubmitting ? "submitting" : ""}`}
  onClick={submitAssessment}
  disabled={isSubmitting}
>
  {isSubmitting ? "Generating Your Roadmap..." : "Get My Career Roadmap"}
</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CareerForm;
