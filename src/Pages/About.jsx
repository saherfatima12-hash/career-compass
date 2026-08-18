import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import "./About.css";

import {
  FaCompass,
  FaSearch,
  FaChartLine,
  FaMapMarkedAlt,
  FaLightbulb,
  FaBullseye,
  FaEye,
  FaGraduationCap,
  FaRoute,
  FaChartBar,
  FaUserGraduate,
  FaReact,
  FaNodeJs,
  FaLeaf,
} from "react-icons/fa";
import { SiExpress, SiMongodb } from "react-icons/si";

/* ---------------------------------------------------------------- */
/*  Animated counter for the "Why Choose Career Compass" section     */
/* ---------------------------------------------------------------- */

const AnimatedCounter = ({ target, suffix = "", duration = 1.6 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const totalFrames = Math.round(duration * 60);
    const increment = target / totalFrames;
    let frame = 0;

    const timer = setInterval(() => {
      frame += 1;
      start += increment;

      if (frame >= totalFrames) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.round(start));
      }
    }, 1000 / 60);

    return () => clearInterval(timer);
  }, [isInView, target, duration]);

  return (
    <span className="about-stat-number" ref={ref}>
      {count}
      {suffix}
    </span>
  );
};

/* ---------------------------------------------------------------- */
/*  Main About component                                             */
/* ---------------------------------------------------------------- */

const About = ({ user, setUser, setShowLogin, setShowModal }) => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const processSteps = [
    {
      icon: <FaSearch />,
      title: "Discover",
      description:
        "Students share their interests, education, and skills through a simple guided assessment.",
    },
    {
      icon: <FaChartLine />,
      title: "Analyze",
      description:
        "The platform evaluates preferences, strengths, and career possibilities in real time.",
    },
    {
      icon: <FaLightbulb />,
      title: "Recommend",
      description:
        "Students receive suitable career paths along with personalized, actionable guidance.",
    },
    {
      icon: <FaMapMarkedAlt />,
      title: "Plan",
      description:
        "Students get a clear, structured roadmap for building the skills their future goals require.",
    },
  ];

  const features = [
    {
      icon: <FaCompass />,
      title: "Personalized Career Recommendations",
      description:
        "Guidance tailored to each student's unique interests, skills, and academic background.",
    },
    {
      icon: <FaRoute />,
      title: "Career Field Exploration",
      description:
        "Explore a wide range of career fields across technology, business, healthcare, and more.",
    },
    {
      icon: <FaGraduationCap />,
      title: "Educational Path Guidance",
      description:
        "Clear direction on which subjects, degrees, and programs align with each career path.",
    },
    {
      icon: <FaMapMarkedAlt />,
      title: "Future Career Roadmaps",
      description:
        "Step-by-step roadmaps that turn long-term career goals into achievable milestones.",
    },
    {
      icon: <FaChartBar />,
      title: "Skill Development Suggestions",
      description:
        "Actionable recommendations on the specific skills worth building for every stage.",
    },
    {
      icon: <FaUserGraduate />,
      title: "Student-Friendly Experience",
      description:
        "An intuitive, engaging platform designed around how students actually think and explore.",
    },
  ];

  const technologies = [
    { icon: <FaReact />, name: "React.js" },
    { icon: <FaNodeJs />, name: "Node.js" },
    { icon: <SiExpress />, name: "Express.js" },
    { icon: <SiMongodb />, name: "MongoDB" },
  ];

  return (
    <div className="home-page about-page">
      <Navbar
        user={user}
        setUser={setUser}
        setShowLogin={setShowLogin}
        setShowModal={setShowModal}
      />

      <div className="about-content">

        {/* ============================================================
            1. About Hero Section
        ============================================================ */}
        <section className="about-hero">
          <div className="about-hero-glow about-hero-glow-a" />
          <div className="about-hero-glow about-hero-glow-b" />

          <div className="about-hero-inner">

            <motion.div
              className="about-hero-text"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="about-hero-eyebrow">
                <FaCompass className="about-hero-eyebrow-icon" />
                About Career Compass
              </span>

              <h1 className="about-hero-title">
                Empowering Students to Discover the{" "}
                <span className="about-hero-title-accent">Right Career Path</span>
              </h1>

              <p className="about-hero-subtitle">
                Career Compass helps students make confident career decisions
                through personalized guidance, career exploration, and
                intelligent recommendations.
              </p>
            </motion.div>

            <motion.div
              className="about-hero-visual"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.2 }}
            >
              <div className="about-hero-visual-card">
                <img
                  src="/images/roadmap-final.webp"
                  alt="Career planning roadmap"
                  className="about-hero-visual-img"
                />
              </div>

              <motion.div
                className="about-float-chip about-float-chip-a"
                animate={{ y: [0, -14, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <FaGraduationCap />
                <span>Education</span>
              </motion.div>

              <motion.div
                className="about-float-chip about-float-chip-b"
                animate={{ y: [0, 14, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              >
                <FaBullseye />
                <span>Career Match</span>
              </motion.div>

              <motion.div
                className="about-float-chip about-float-chip-c"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <FaRoute />
                <span>Roadmap</span>
              </motion.div>
            </motion.div>

          </div>
        </section>

        {/* ============================================================
            2. Our Story Section
        ============================================================ */}
        <section className="about-story-section" data-aos="fade-up">
          <div className="about-glass-card about-story-card">

            <span className="card-eyebrow">Our Story</span>
            <h2 className="about-section-heading">Why Career Compass Exists</h2>

            <p className="about-story-text">
              Every year, countless students struggle to choose the right
              career — not because they lack potential, but because they
              lack awareness and proper guidance. Confusing options, generic
              advice, and limited exposure often lead to decisions made out
              of pressure rather than clarity.
            </p>

            <p className="about-story-text">
              Career Compass was created to change that. By simplifying
              career exploration and matching students with paths that align
              with their interests, skills, and goals, we help turn
              uncertainty into a clear, confident direction forward.
            </p>

            <div className="about-story-timeline">

              <div className="about-story-timeline-item" data-aos="fade-right" data-aos-delay="100">
                <span className="about-story-timeline-icon">
                  <FaSearch />
                </span>
                <div>
                  <h4>The Problem</h4>
                  <p>Students lacked structured, personalized career guidance.</p>
                </div>
              </div>

              <div className="about-story-timeline-item" data-aos="fade-right" data-aos-delay="250">
                <span className="about-story-timeline-icon">
                  <FaLightbulb />
                </span>
                <div>
                  <h4>The Idea</h4>
                  <p>Build an intelligent platform that understands each student individually.</p>
                </div>
              </div>

              <div className="about-story-timeline-item" data-aos="fade-right" data-aos-delay="400">
                <span className="about-story-timeline-icon">
                  <FaRoute />
                </span>
                <div>
                  <h4>The Solution</h4>
                  <p>Career Compass — personalized guidance, clear roadmaps, confident decisions.</p>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ============================================================
            3. Mission & Vision Section
        ============================================================ */}
        <section className="about-mv-section">

          <motion.div
            className="about-glass-card about-mv-card"
            data-aos="fade-up"
            whileHover={{ y: -8 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <span className="about-mv-icon about-mv-icon-mission">
              <FaBullseye />
            </span>
            <h3>Our Mission</h3>
            <p>
              To provide students with personalized career guidance and
              meaningful insights that help them make informed decisions
              about their future.
            </p>
          </motion.div>

          <motion.div
            className="about-glass-card about-mv-card"
            data-aos="fade-up"
            data-aos-delay="150"
            whileHover={{ y: -8 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <span className="about-mv-icon about-mv-icon-vision">
              <FaEye />
            </span>
            <h3>Our Vision</h3>
            <p>
              To build a future where every student can discover a career
              path aligned with their passion, abilities, and potential.
            </p>
          </motion.div>

        </section>

        {/* ============================================================
            4. How Career Compass Works
        ============================================================ */}
        <section className="about-process-section">

          <div className="about-section-header" data-aos="fade-up">
            <span className="card-eyebrow">The Process</span>
            <h2 className="about-section-heading">How Career Compass Works</h2>
            <p className="about-section-subtext">
              A simple, four-step journey from uncertainty to a clear career direction.
            </p>
          </div>

          <div className="about-process-track">

            <div className="about-process-line" />

            {processSteps.map((step, index) => (
              <motion.div
                className="about-process-node"
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
              >
                <span className="about-process-node-icon">{step.icon}</span>

                <div className="about-process-node-content">
                  <span className="about-process-node-number">
                    Step {index + 1}
                  </span>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </motion.div>
            ))}

          </div>

        </section>

        {/* ============================================================
            5. Features Section
        ============================================================ */}
        <section className="about-features-section">

          <div className="about-section-header" data-aos="fade-up">
            <span className="card-eyebrow">What We Offer</span>
            <h2 className="about-section-heading">Features Built for Your Future</h2>
          </div>

          <div className="about-features-grid">
            {features.map((feature, index) => (
              <motion.div
                className="about-glass-card about-feature-card"
                key={feature.title}
                data-aos="fade-up"
                data-aos-delay={index * 100}
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <span className="about-feature-icon">{feature.icon}</span>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.div>
            ))}
          </div>

        </section>

        {/* ============================================================
            6. Why Choose Career Compass (Stats)
        ============================================================ */}
        <section className="about-stats-section" data-aos="fade-up">
          <div className="about-glass-card about-stats-card">

            <div className="about-stats-grid">

              <div className="about-stat-item">
                <AnimatedCounter target={10} suffix="+" />
                <p className="about-stat-label">Career Fields</p>
              </div>

              <div className="about-stat-item">
                <AnimatedCounter target={50} suffix="+" />
                <p className="about-stat-label">Career Paths</p>
              </div>

              <div className="about-stat-item">
                <span className="about-stat-number about-stat-text-value">
                  Personalized
                </span>
                <p className="about-stat-label">Guidance</p>
              </div>

              <div className="about-stat-item">
                <span className="about-stat-number about-stat-text-value">
                  Future Ready
                </span>
                <p className="about-stat-label">Planning</p>
              </div>

            </div>

          </div>
        </section>

        {/* ============================================================
            7. Technology Section
        ============================================================ */}
        <section className="about-tech-section" data-aos="fade-up">
          <div className="about-glass-card about-tech-card">

            <span className="card-eyebrow">Under the Hood</span>
            <h2 className="about-section-heading">Built With Modern Technology</h2>

            <p className="about-section-subtext about-tech-text">
              Built using modern web technologies to provide a fast,
              interactive, and personalized experience.
            </p>

            <div className="about-tech-badges">
              {technologies.map((tech) => (
                <div className="about-tech-badge" key={tech.name}>
                  <span className="about-tech-badge-icon">{tech.icon}</span>
                  <span>{tech.name}</span>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ============================================================
            8. Final CTA Section
        ============================================================ */}
        <section className="about-cta-section" data-aos="fade-up">

          <div className="about-cta-glow" />

          <FaLeaf className="about-cta-decor-icon about-cta-decor-a" />
          <FaCompass className="about-cta-decor-icon about-cta-decor-b" />

          <h2 className="about-cta-title">Ready to Discover Your Future?</h2>
          <p className="about-cta-text">
            Discover your strengths, explore possibilities, and build a clear roadmap
  toward a career that matches your interests and goals.
          </p>

          <motion.h2
  className="about-cta-heading"
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
  Navigate Your Future With Confidence
</motion.h2>

        </section>

      </div>
    </div>
  );
};

export default About;