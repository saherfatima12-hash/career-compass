import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import { useLocation } from "react-router-dom";
import { generateGuidance } from "../utils/generateGuidance";
import "./Career.css";
import {
  IconUser,
  IconBook,
  IconChart,
  IconSpark,
  IconTarget,
  IconCompass,
  IconBulb,
  IconArrow,
  IconFlag,
} from "../components/CareerIcons";
import CareerRoadmap from "../components/CareerRoadmap";
import LearningStyleSection from "../components/LearningStyleSection";
import { generateCareerActionGuidance } from "../utils/careerActionGuidance";
import CareerActionGuidance from "../components/CareerActionGuidance";

/* ---------------------------------------------------------------------------
   Small local helpers (not extracted into new files — they're single-purpose
   pieces of Career.jsx's own presentation logic, not reusable components).
--------------------------------------------------------------------------- */

// Truncates a long paragraph with a "Read more / Show less" toggle so a
// single block of text never dominates a card.
const ExpandableText = ({ text, limit = 220, className = "card-message" }) => {
  const [expanded, setExpanded] = useState(false);
  if (!text) return null;

  const isLong = text.length > limit;
  const shown = expanded || !isLong ? text : `${text.slice(0, limit).trim()}…`;

  return (
    <div>
      <p className={className}>{shown}</p>
      {isLong && (
        <button
          type="button"
          className="read-more-btn"
          onClick={() => setExpanded((prev) => !prev)}
          aria-expanded={expanded}
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
};

// A single clickable skill chip that reveals a short, generic explanation
// of why it matters when selected. Only one note is open at a time
// (controlled by the parent via selectedSkill/onSelect).
const SkillChip = ({ skill, selected, onSelect, tone }) => (
  <button
    type="button"
    className={`chip chip-skill chip-interactive ${tone === "have" ? "chip-skill-have" : ""} ${
      selected ? "chip-selected" : ""
    }`}
    aria-pressed={selected}
    onClick={() => onSelect(skill)}
  >
    {skill}
  </button>
);

/* ---------------------------- Page component ---------------------------- */

const Career = ({ user, setUser, setShowLogin, setShowModal }) => {
  const location = useLocation();

  const { student, guidance } = location.state || {};
  const actionGuidance = student ? generateCareerActionGuidance(student, guidance) : null;

  /* --------------------------------------------------------------------
     Data layers, from most-personalized to most-reliable:

     1. aiGuidance      -> Groq-personalized output, produced once inside
                           generateGuidance.js (CareerForm.jsx already
                           awaits this before navigating here — NO second
                           API call is made on this page).
     2. futureAdvice     -> pure rule-based recommendation from
                           careerGuidance.json (always available, used as
                           the fallback for every AI field).
     3. performanceData  -> rule-based academic improvement advice,
                           unchanged from the existing flow.
     4. profile          -> the normalized student profile computed by
                           generateGuidance.js (guaranteed arrays, bucketed
                           performance, etc.), falling back to the raw
                           `student` object submitted by CareerForm.jsx.
  -------------------------------------------------------------------- */
  const aiGuidance = guidance?.guidance || null;
  const futureAdvice = guidance?.futureAdvice || null;
  const performanceData = guidance?.performanceAdvice;
  const profile = guidance?.studentProfile || student || {};

  // Merge AI + rule-based into the single object the UI reads from.
  // AI fields are preferred when present; every field still has a
  // rule-based fallback so the page never shows blank content if Groq
  // fails, is slow, or returns a partial response.
  const guidanceData =
    aiGuidance || futureAdvice
      ? {
          recommendation: aiGuidance?.recommendation || futureAdvice?.recommend || "",
          reason: aiGuidance?.reason || futureAdvice?.description || "",
          // Groq's schema doesn't return these — always rule-based.
          focusSubjects: futureAdvice?.focusSubjects || [],
          skills: aiGuidance?.skills?.length ? aiGuidance.skills : futureAdvice?.skills || [],
          roadmap: aiGuidance?.roadmap?.length ? aiGuidance.roadmap : futureAdvice?.roadmap || [],
          nextStep: futureAdvice?.nextStep || "",
          futureFields: aiGuidance?.futureFields?.length
            ? aiGuidance.futureFields
            : futureAdvice?.futureFields || [],
        }
      : null;

  // skillGapAnalysis is produced by generateGuidance.js for Intermediate and
  // Bachelor students only — used to split the skills section into "have"
  // vs "to build" instead of one flat list. Matric guidance doesn't compute
  // this, so that flow falls back to a single group (unchanged behavior).
  const skillGap = futureAdvice?.skillGapAnalysis || null;

  // student.interest (singular) never existed in the submitted form data —
  // derive a display value from whichever field actually applies to this
  // education level (Matric -> interests[], Intermediate -> careerDirection,
  // Bachelor -> favoriteAreas[]).
  const interestDisplay =
    (Array.isArray(profile?.interests) && profile.interests.length > 0 && profile.interests.join(", ")) ||
    profile?.careerDirection ||
    (Array.isArray(profile?.favoriteAreas) && profile.favoriteAreas.length > 0 && profile.favoriteAreas.join(", ")) ||
    "—";

  const learningStyleValue = profile?.learningStyle || student?.learningStyle;

  const [selectedSkill, setSelectedSkill] = useState(null);
  const handleSkillSelect = (skill) => {
    setSelectedSkill((prev) => (prev === skill ? null : skill));
  };

  const skillNote = (skill, tone) =>
    tone === "have"
      ? `You already have a foundation in ${skill}. Keep using it directly in projects and examples related to ${
          guidanceData?.recommendation || "your recommended path"
        }.`
      : `Building ${skill} will directly strengthen your fit for ${
          guidanceData?.recommendation || "your recommended path"
        }. Look for a short course, tutorial, or small practice project focused on this.`;

  /* --------------------------------------------------------------------
     "Why This Career Matches You" reasons, scored so the single strongest
     signal can be visually highlighted instead of presenting three
     equally-weighted cards.
  -------------------------------------------------------------------- */
  const performanceScore =
    profile?.performance === "Excellent" ? 3 : profile?.performance === "Good" ? 2 : 1;

  const matchReasons = [
    {
      key: "interest",
      icon: <IconCompass />,
      title: "Your Interest",
      text: (
        <>
          You showed strong interest in{" "}
          <strong>{interestDisplay !== "—" ? interestDisplay : "this field"}</strong>, which
          directly shapes this recommendation.
        </>
      ),
      score: interestDisplay !== "—" ? 2 : 0,
    },
    {
      key: "performance",
      icon: <IconChart />,
      title: "Your Performance",
      text:
        profile?.performance === "Excellent" || profile?.performance === "Good"
          ? "Your strong academic performance shows you're ready to move forward with confidence."
          : "Your current assessment shows room to grow, and this path is designed to help you build steadily from where you are.",
      score: performanceScore,
    },
    {
      key: "skills",
      icon: <IconSpark />,
      title: "Your Skills",
      text:
        Array.isArray(profile?.skills) && profile.skills.length > 0
          ? `Skills like ${profile.skills.slice(0, 3).join(", ")} align well with this direction.`
          : "This path is a strong starting point for building the skills you'll need.",
      score: Array.isArray(profile?.skills) && profile.skills.length > 0 ? 2 : 0,
    },
  ];

  if (skillGap?.alreadyStrong?.length > 0) {
    matchReasons.push({
      key: "existing-strength",
      icon: <IconBulb />,
      title: "Existing Strengths",
      text: `You already bring ${skillGap.alreadyStrong.slice(0, 3).join(", ")} to this path — a real head start.`,
      score: skillGap.alreadyStrong.length + 1,
    });
  }

  const strongestKey = matchReasons.reduce((top, r) => (r.score > top.score ? r : top), matchReasons[0]).key;

  /* --------------------------------------------------------------------
     Section jump-nav — only lists sections that will actually render,
     so there are no dead links.
  -------------------------------------------------------------------- */
  const sectionRefs = {
    overview: useRef(null),
    match: useRef(null),
    improvement: useRef(null),
    roadmap: useRef(null),
    skills: useRef(null),
    "learning-style": useRef(null),
    actions: useRef(null),
    growth: useRef(null),
  };

  const navItems = [
    { id: "overview", label: "Overview", show: true },
    { id: "match", label: "Why It Fits", show: !!guidanceData },
    { id: "improvement", label: "Improve", show: !!performanceData },
    { id: "roadmap", label: "Roadmap", show: !!guidanceData },
    { id: "skills", label: "Skills", show: (guidanceData?.skills?.length || 0) > 0 },
    { id: "learning-style", label: "Learning Style", show: !!learningStyleValue },
    { id: "actions", label: "Next Actions", show: !!actionGuidance?.applicable },
    { id: "growth", label: "Growth", show: !!guidanceData },
  ].filter((item) => item.show);

  const scrollToSection = (id) => {
    sectionRefs[id]?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="career-page">
      <Navbar
        user={user}
        setUser={setUser}
        setShowLogin={setShowLogin}
        setShowModal={setShowModal}
      />

      <div className="roadmap-page">
        {/* 1. Hero Result Section */}
        <section className="hero-section" ref={sectionRefs.overview}>
          <div className="hero-glow hero-glow-a" />
          <div className="hero-glow hero-glow-b" />

          <span className="hero-eyebrow">
            <IconSpark className="eyebrow-icon" />
            AI Career Mentor
          </span>

          <h1 className="hero-title">
            Welcome, <span className="hero-name">{student?.name || "Student"}</span>
          </h1>

          <p className="hero-subtitle">
            {guidanceData?.recommendation
              ? `Based on your profile, we recommend exploring ${guidanceData.recommendation}. Here's your complete, personalized career roadmap.`
              : "Your personalized career roadmap is ready — built around your academic profile, interests, and goals."}
          </p>
        </section>

        {/* Jump-nav — quick wayfinding across a long page */}
        {navItems.length > 1 && (
          <nav className="section-nav" aria-label="Jump to section">
            {navItems.map((item) => (
              <button
                type="button"
                key={item.id}
                className="section-nav-chip"
                onClick={() => scrollToSection(item.id)}
              >
                {item.label}
              </button>
            ))}
          </nav>
        )}

        {/* Student Profile */}
        <section className="profile-card">
          <div className="card-header">
            <span className="card-icon-badge">
              <IconUser />
            </span>
            <h2>Your Selected Information</h2>
          </div>

          <div className="profile-grid">
            <div className="profile-stat">
              <span className="profile-stat-icon">
                <IconBook />
              </span>
              <div className="profile-stat-text">
                <p className="profile-label">Education</p>
                <p className="profile-value">{profile?.education || student?.education || "—"}</p>
              </div>
            </div>

            <div className="profile-stat">
              <span className="profile-stat-icon">
                <IconTarget />
              </span>
              <div className="profile-stat-text">
                <p className="profile-label">Current Field</p>
                <p className="profile-value">{profile?.subject || student?.subject || "—"}</p>
              </div>
            </div>

            <div className="profile-stat">
              <span className="profile-stat-icon">
                <IconChart />
              </span>
              <div className="profile-stat-text">
                <p className="profile-label">Performance</p>
                <p className="profile-value">
                  <span
                    className={`performance-badge performance-${(profile?.performance || "")
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                  >
                    {profile?.performance || "—"}
                  </span>
                </p>
              </div>
            </div>

            <div className="profile-stat">
              <span className="profile-stat-icon">
                <IconCompass />
              </span>
              <div className="profile-stat-text">
                <p className="profile-label">Interest</p>
                <p className="profile-value">{interestDisplay}</p>
              </div>
            </div>

            <div className="profile-stat profile-stat-wide">
              <span className="profile-stat-icon">
                <IconFlag />
              </span>
              <div className="profile-stat-text">
                <p className="profile-label">Future Plan</p>
                <p className="profile-value">{profile?.futureGoal || student?.futureGoal || "—"}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Academic Improvement Advice — existing functionality, first step highlighted */}
        {performanceData && (
          <section className="guidance-card performance-card" ref={sectionRefs.improvement}>
            <div className="card-header">
              <span className="card-icon-badge card-icon-badge-alt">
                <IconBulb />
              </span>
              <div>
                <p className="card-eyebrow">Academic Improvement Advice</p>
                <h2>{performanceData.title}</h2>
              </div>
            </div>

            <ExpandableText text={performanceData.message} />

            {performanceData.focusAreas?.length > 0 && (
              <div className="subsection">
                <h3 className="subsection-title">Focus Areas</h3>
                <div className="chip-row">
                  {performanceData.focusAreas.map((item, index) => (
                    <span className="chip" key={index}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {performanceData.learningPlan?.length > 0 && (
              <div className="subsection">
                <h3 className="subsection-title">Learning Plan</h3>
                <ol className="timeline">
                  {performanceData.learningPlan.map((item, index) => (
                    <li
                      className={`timeline-item ${index === 0 ? "timeline-item-priority" : ""}`}
                      key={index}
                    >
                      <span className="timeline-dot">{index + 1}</span>
                      <span className="timeline-text">
                        {index === 0 && <span className="priority-badge">Start Here</span>}
                        {item}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </section>
        )}

        {/* 2. Career Journey Roadmap — component unchanged, presentation already strong */}
        {guidanceData && (
          <div ref={sectionRefs.roadmap}>
            <CareerRoadmap student={student} guidanceData={guidanceData} />
          </div>
        )}

        {/* 3. Why This Career Matches You */}
        {guidanceData && (
          <section className="guidance-card match-card" ref={sectionRefs.match}>
            <div className="card-header">
              <span className="card-icon-badge card-icon-badge-gold">
                <IconCompass />
              </span>
              <div>
                <p className="card-eyebrow">Career Guidance For You</p>
                <h2>Why This Career Matches You</h2>
              </div>
            </div>

            <div className="recommend-banner">
              <span className="recommend-label">Recommended Path</span>
              <h4 className="recommend-title">{guidanceData.recommendation}</h4>
            </div>

            <ExpandableText text={guidanceData.reason} />

            <div className="match-reasons">
              {matchReasons.map((reason, index) => (
                <motion.div
                  className={`match-reason ${reason.key === strongestKey ? "match-reason-strongest" : ""}`}
                  key={reason.key}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                >
                  <span className="match-reason-icon">{reason.icon}</span>
                  <div>
                    <h4>
                      {reason.title}
                      {reason.key === strongestKey && <span className="strongest-badge">Strongest Match</span>}
                    </h4>
                    <p>{reason.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {guidanceData.focusSubjects?.length > 0 && (
              <div className="subsection">
                <h3 className="subsection-title">
                  <IconBook className="subsection-icon" />
                  Subjects You Should Focus On
                </h3>
                <div className="chip-row">
                  {guidanceData.focusSubjects.map((item, index) => (
                    <span className="chip chip-subject" key={index}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Skills — split into "have" vs "to build" when skillGapAnalysis is available */}
        {guidanceData?.skills?.length > 0 && (
          <section className="guidance-card skills-card" ref={sectionRefs.skills}>
            <div className="card-header">
              <span className="card-icon-badge card-icon-badge-gold">
                <IconSpark />
              </span>
              <div>
                <p className="card-eyebrow">Build Your Toolkit</p>
                <h2>Skills for This Path</h2>
              </div>
            </div>

            <p className="card-message-small">Tap a skill to see why it matters.</p>

            {skillGap?.alreadyStrong?.length > 0 && (
              <div className="subsection">
                <h3 className="subsection-title">Skills You Already Have</h3>
                <div className="chip-row">
                  {skillGap.alreadyStrong.map((skill, index) => (
                    <SkillChip
                      key={`have-${index}`}
                      skill={skill}
                      tone="have"
                      selected={selectedSkill === skill}
                      onSelect={handleSkillSelect}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="subsection">
              <h3 className="subsection-title">
                {skillGap?.toBuild?.length > 0 ? "Skills to Build" : "Skills You Should Develop"}
              </h3>
              <div className="chip-row">
                {(skillGap?.toBuild?.length > 0 ? skillGap.toBuild : guidanceData.skills).map(
                  (skill, index) => (
                    <SkillChip
                      key={`build-${index}`}
                      skill={skill}
                      tone="build"
                      selected={selectedSkill === skill}
                      onSelect={handleSkillSelect}
                    />
                  )
                )}
              </div>
            </div>

            <AnimatePresence>
              {selectedSkill && (
                <motion.div
                  className="skill-note"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p>
                    {skillNote(
                      selectedSkill,
                      skillGap?.alreadyStrong?.includes(selectedSkill) ? "have" : "build"
                    )}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        )}

        {/* 4. Recommended next actions — existing component, untouched */}
        {actionGuidance?.applicable && (
          <div ref={sectionRefs.actions}>
            <CareerActionGuidance student={student} actionGuidance={actionGuidance} />
          </div>
        )}

        {/* 5. Learning Style — component unchanged, already visually engaging */}
        {learningStyleValue && (
          <div ref={sectionRefs["learning-style"]}>
            <LearningStyleSection learningStyle={learningStyleValue} />
          </div>
        )}

        {/* 6. Future Growth Plan */}
        {guidanceData && (
          <section className="guidance-card future-card" ref={sectionRefs.growth}>
            <div className="card-header">
              <span className="card-icon-badge card-icon-badge-gold">
                <IconFlag />
              </span>
              <div>
                <p className="card-eyebrow">What Comes Next</p>
                <h2>Future Growth Plan</h2>
              </div>
            </div>

            {guidanceData.roadmap?.length > 0 && (
              <div className="subsection">
                <h3 className="subsection-title">
                  <IconBook className="subsection-icon" />
                  Your Learning Roadmap
                </h3>
                <ol className="timeline">
                  {guidanceData.roadmap.map((item, index) => (
                    <li className="timeline-item" key={index}>
                      <span className="timeline-dot">{index + 1}</span>
                      <span className="timeline-text">{item}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {guidanceData.nextStep && (
              <div className="next-step-callout">
                <span className="next-step-icon">
                  <IconArrow />
                </span>
                <div>
                  <p className="next-step-label">Future Opportunities</p>
                  <p className="next-step-text">{guidanceData.nextStep}</p>
                </div>
              </div>
            )}

            {guidanceData.futureFields?.length > 0 && (
              <div className="subsection">
                <h3 className="subsection-title">
                  <IconBook className="subsection-icon" />
                  Possible Career Fields
                </h3>
                <div className="field-grid">
                  {guidanceData.futureFields.map((item, index) => (
                    <motion.div
                      className="field-card"
                      key={index}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.5 }}
                      transition={{ duration: 0.35, delay: index * 0.06 }}
                    >
                      <span className="field-card-icon">
                        <IconBook />
                      </span>
                      <span className="field-card-text">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default Career;