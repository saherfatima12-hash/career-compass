import React from "react";
import {
  IconArrow,
  IconBook,
  IconCompass,
  IconFlag,
  IconSpark,
  IconTarget,
} from "./CareerIcons";
import "./CareerActionGuidance.css";

const CareerActionGuidance = ({ actionGuidance }) => {
  if (!actionGuidance?.applicable) {
    return null;
  }

  const {
    goal,
    title,
    summary,
    actionPlan = [],
    recommendedPlatforms = [],
    learningPlan = [],
    profilePreparation = [],
    nextSteps = [],
  } = actionGuidance;

  const getGoalLabel = () => {
    const labels = {
      "Continue Studies": "Continue Studies",
      Job: "Job Preparation",
      Internship: "Internship",
      Freelancing: "Freelancing",
      Business: "Business & Startup",
    };

    return labels[goal] || "Your Next Steps";
  };

  return (
    <section className="guidance-card action-guidance-card">
      {/* Header */}
      <div className="card-header">
        <span className="card-icon-badge card-icon-badge-gold">
          <IconTarget />
        </span>

        <div>
          <p className="card-eyebrow">Personalized Action Guidance</p>
          <h2>{title || "Your Next Steps"}</h2>
        </div>
      </div>

      {/* Goal banner */}
      <div className="action-goal-banner">
        <div className="action-goal-icon">
          <IconCompass />
        </div>

        <div>
          <span className="action-goal-label">Your Current Direction</span>
          <h3>{getGoalLabel()}</h3>
        </div>
      </div>

      {/* Summary */}
      {summary && <p className="card-message action-summary">{summary}</p>}

      {/* Action Plan */}
      {actionPlan.length > 0 && (
        <div className="subsection">
          <h3 className="subsection-title">
            <IconFlag className="subsection-icon" />
            What You Should Do
          </h3>

          <ol className="timeline action-timeline">
            {actionPlan.map((item, index) => (
              <li className="timeline-item" key={index}>
                <span className="timeline-dot">{index + 1}</span>
                <span className="timeline-text">{item}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Recommended Platforms */}
      {recommendedPlatforms.length > 0 && (
        <div className="subsection">
          <h3 className="subsection-title">
            <IconSpark className="subsection-icon" />
            Recommended Platforms & Resources
          </h3>

          <div className="action-resource-grid">
            {recommendedPlatforms.map((resource, index) => (
              <a
                key={resource.id || index}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="action-resource-card"
              >
                <div className="action-resource-icon">
                  <IconArrow />
                </div>

                <div className="action-resource-content">
                  <h4>{resource.name}</h4>

                  {resource.description && (
                    <p>{resource.description}</p>
                  )}

                  {resource.category && (
                    <span>{resource.category}</span>
                  )}
                </div>

                <IconArrow className="action-resource-arrow" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Learning Plan */}
      {learningPlan.length > 0 && (
        <div className="subsection">
          <h3 className="subsection-title">
            <IconBook className="subsection-icon" />
            Skills & Learning Plan
          </h3>

          <div className="action-list">
            {learningPlan.map((item, index) => (
              <div className="action-list-item" key={index}>
                <span className="action-check">
                  ✓
                </span>

                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Profile Preparation */}
      {profilePreparation.length > 0 && (
        <div className="subsection">
          <h3 className="subsection-title">
            <IconUserSafe />
            Profile Preparation
          </h3>

          <div className="action-list">
            {profilePreparation.map((item, index) => (
              <div className="action-list-item" key={index}>
                <span className="action-check">
                  ✓
                </span>

                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Next Steps */}
      {nextSteps.length > 0 && (
        <div className="action-next-step">
          <div className="action-next-icon">
            <IconArrow />
          </div>

          <div>
            <p className="next-step-label">Your Immediate Next Steps</p>

            <ul>
              {nextSteps.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
};

/*
  CareerIcons.jsx mein IconUser available na hone ki wajah se
  yahan small local icon rakha gaya hai.
  Isse existing icon system ko touch nahi karna padega.
*/
const IconUserSafe = () => (
  <span className="action-profile-icon">
    👤
  </span>
);

export default CareerActionGuidance;