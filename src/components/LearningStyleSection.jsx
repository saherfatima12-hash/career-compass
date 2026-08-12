import React from "react";
import { getLearningGuidance } from "../data/learningGuidance";
import { iconMap } from "./CareerIcons";
import "./LearningStyleSection.css";

const LearningStyleSection = ({ learningStyle }) => {
  const guidance = getLearningGuidance(learningStyle);

  if (!guidance) return null;

  return (
    <section className="learning-style-section">

      <div className="learning-style-intro">
        <span className="card-eyebrow">Your Learning Style</span>
        <h2>{guidance.label}</h2>
        <p className="learning-style-tagline">{guidance.tagline}</p>
        <p className="card-message">{guidance.explanation}</p>

        <div className="learning-style-method">
          <span className="learning-style-method-label">Recommended Approach</span>
          <p>{guidance.recommendedMethod}</p>
        </div>
      </div>

      <div className="learning-resources">
        <h3 className="subsection-title">Personalized Learning Resources</h3>

        <div className="learning-resources-grid">
          {guidance.resources.map((resource, index) => {
            const ResourceIcon = iconMap[resource.icon] || iconMap.spark;
            return (
              <div className="learning-resource-card" key={index}>
                <span className="learning-resource-icon">
                  <ResourceIcon />
                </span>
                <h4>{resource.title}</h4>
                <p>{resource.description}</p>
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
};

export default LearningStyleSection;