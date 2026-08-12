import React from "react";
import { motion } from "framer-motion";
import { generateRoadmap } from "../data/roadmapData";
import { iconMap } from "./CareerIcons";
import "./CareerRoadmap.css";

const CareerRoadmap = ({ student, guidanceData }) => {
  const steps = generateRoadmap(student, guidanceData);

  const destination =
    student?.careerGoal || guidanceData?.recommend || student?.interest || "Your Goal";

  return (
    <section className="career-roadmap-section">

      <div className="career-roadmap-header">
        <span className="card-eyebrow">Career Journey Roadmap</span>
        <h2>Your Path to {destination}</h2>
        <p className="card-message">
          Follow your personalized journey — every milestone below brings you
          one step closer to your career destination.
        </p>
      </div>

      <div className="career-roadmap-track">

        <div className="career-roadmap-line" />

        <motion.div
          className="career-roadmap-traveler"
          initial={{ top: "0%" }}
          whileInView={{ top: "96%" }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: Math.max(steps.length * 0.6, 2), ease: "easeInOut" }}
          aria-hidden="true"
        >
          🎓
        </motion.div>

        {steps.map((step, index) => {
          const StepIcon = iconMap[step.icon] || iconMap.spark;
          const alignment = index % 2 === 0 ? "career-roadmap-align-left" : "career-roadmap-align-right";

          return (
            <motion.div
              className={`career-roadmap-milestone ${alignment} ${
                step.isFinal ? "career-roadmap-milestone-final" : ""
              }`}
              key={step.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: index * 0.12 }}
            >
              <span className="career-roadmap-dot">
                <StepIcon />
              </span>

              <div className="career-roadmap-content">
                <span className="career-roadmap-step-number">
                  {step.isFinal ? "Destination" : `Step ${index + 1}`}
                </span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </motion.div>
          );
        })}

      </div>

    </section>
  );
};

export default CareerRoadmap;