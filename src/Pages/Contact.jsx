import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMail,
  FiMapPin,
  FiClock,
  FiSend,
  FiCheckCircle,
  FiMessageCircle,
  FiAlertTriangle,
  FiHeart,
  FiChevronDown,
} from "react-icons/fi";
import Navbar from "../components/Navbar";
import "./Contact.css";

/* ---------------------------------------------------------------------------
   Static content
--------------------------------------------------------------------------- */

const CONTACT_INFO = [
  {
    icon: <FiMail />,
    title: "Email Us",
    value: "support@careercompass.com",
    note: "For general questions and support",
  },
  {
    icon: <FiMapPin />,
    title: "Our Location",
    value: "Gujranwala, Pakistan",
    note: "Serving students everywhere",
  },
  {
    icon: <FiClock />,
    title: "Response Time",
    value: "24–48 Hours",
    note: "We'll get back to you as soon as possible",
  },
];

const INQUIRY_TYPES = [
  "General Inquiry",
  "Feedback",
  "Complaint",
  "Technical Issue",
  "Career Guidance Question",
  "Other",
];

const INITIAL_FORM = {
  name: "",
  email: "",
  inquiryType: "",
  subject: "",
  message: "",
  feedbackText: "",
  complaintText: "",
  improvementText: "",
};

/* ---------------------------------------------------------------------------
   Submission stub — structured so it can be wired to the real
   Express/MongoDB backend later. Deliberately does NOT simulate a fake
   "email sent" network response.
--------------------------------------------------------------------------- */
const submitContactForm = async (payload) => {
  // TODO: replace with a real request once the backend endpoint exists, e.g.
  // return fetch("/api/contact", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(payload),
  // });
  return Promise.resolve({ received: true });
};

/* ---------------------------------------------------------------------------
   Animation variants
--------------------------------------------------------------------------- */

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
};

const fieldReveal = {
  hidden: { opacity: 0, height: 0, marginTop: 0 },
  visible: { opacity: 1, height: "auto", marginTop: 18 },
  exit: { opacity: 0, height: 0, marginTop: 0 },
};

/* ---------------------------------------------------------------------------
   Component
--------------------------------------------------------------------------- */

const Contact = ({ user, setUser, setShowLogin, setShowModal }) => {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) newErrors.name = "Please enter your name";
    if (!formData.email.trim()) {
      newErrors.email = "Please enter your email";
    } else if (!emailPattern.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.inquiryType) newErrors.inquiryType = "Please select an inquiry type";
    if (!formData.subject.trim()) newErrors.subject = "Please add a subject";
    if (!formData.message.trim()) newErrors.message = "Please write a message";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await submitContactForm(formData);
      setSubmitted(true);
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        form: "Something went wrong on our end. Please try again in a moment.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM);
    setErrors({});
    setSubmitted(false);
  };

  return (
    <div className="contact-page">
      <Navbar
        user={user}
        setUser={setUser}
        setShowLogin={setShowLogin}
        setShowModal={setShowModal}
      />

      <div className="contact-shell">
        {/* 1. HERO */}
        <section className="hero-section contact-hero">
          <div className="hero-glow hero-glow-a" />
          <div className="hero-glow hero-glow-b" />
          <div className="hero-glow hero-glow-c" />

          <motion.span
            className="hero-eyebrow"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <FiMessageCircle className="eyebrow-icon" />
            Get in Touch
          </motion.span>

          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            We&rsquo;re Here to <span className="hero-name">Help</span>
          </motion.h1>

          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Have a question, suggestion, or concern? Reach out to the Career Compass
            team and we&rsquo;ll be happy to help.
          </motion.p>
        </section>

        {/* 2. CONTACT INFO CARDS */}
        <section className="contact-info-grid">
          {CONTACT_INFO.map((item, index) => (
            <motion.div
              className="contact-info-card"
              key={item.title}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              variants={fadeUp}
              whileHover={{ y: -6 }}
            >
              <span className="contact-icon-badge">{item.icon}</span>
              <h3>{item.title}</h3>
              <p className="contact-info-value">{item.value}</p>
              <p className="contact-info-note">{item.note}</p>
            </motion.div>
          ))}
        </section>

        {/* 3 & 5. MAIN FORM + FEEDBACK HIGHLIGHT */}
        <section className="contact-main-grid">
          {/* Feedback highlight card */}
          <motion.aside
            className="feedback-highlight-card"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6 }}
          >
            <div className="feedback-glow" />
            <span className="contact-icon-badge feedback-icon-badge">
              <FiHeart />
            </span>
            <h3>We&rsquo;d Love Your Feedback</h3>
            <p>
              Your feedback helps us improve Career Compass and create a better
              experience for every student.
            </p>
          </motion.aside>

          {/* Main form card */}
          <motion.div
            className="contact-form-card"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
          >
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  className="success-state"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  <motion.span
                    className="success-icon"
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.15, type: "spring", stiffness: 220, damping: 14 }}
                  >
                    <FiCheckCircle />
                  </motion.span>
                  <h2>Message Sent!</h2>
                  <p>
                    Thank you for reaching out. Our team will review your message
                    and get back to you soon.
                  </p>
                  <button type="button" className="btn-secondary" onClick={handleReset}>
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  className="contact-form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  noValidate
                >
                  <div className="form-card-header">
                    <h2>Send Us a Message</h2>
                    <p>Tell us how we can help.</p>
                  </div>

                  <div className="form-grid">
                    <div className="form-field">
                      <label htmlFor="name">Name</label>
                      <input
                        id="name"
                        type="text"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={handleChange("name")}
                        className={errors.name ? "has-error" : ""}
                      />
                      {errors.name && (
                        <span className="field-error">
                          <FiAlertTriangle /> {errors.name}
                        </span>
                      )}
                    </div>

                    <div className="form-field">
                      <label htmlFor="email">Email</label>
                      <input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange("email")}
                        className={errors.email ? "has-error" : ""}
                      />
                      {errors.email && (
                        <span className="field-error">
                          <FiAlertTriangle /> {errors.email}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="form-field">
                    <label htmlFor="inquiryType">Inquiry Type</label>
                    <div className="select-wrap">
                      <select
                        id="inquiryType"
                        value={formData.inquiryType}
                        onChange={handleChange("inquiryType")}
                        className={errors.inquiryType ? "has-error" : ""}
                      >
                        <option value="">Select an inquiry type</option>
                        {INQUIRY_TYPES.map((type) => (
                          <option value={type} key={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                      <FiChevronDown className="select-chevron" />
                    </div>
                    {errors.inquiryType && (
                      <span className="field-error">
                        <FiAlertTriangle /> {errors.inquiryType}
                      </span>
                    )}
                  </div>

                  {/* Dynamic Feedback section */}
                  <AnimatePresence>
                    {formData.inquiryType === "Feedback" && (
                      <motion.div
                        className="dynamic-section feedback-section"
                        variants={fieldReveal}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <label htmlFor="feedbackText">
                          What would you like to tell us?
                        </label>
                        <textarea
                          id="feedbackText"
                          rows={3}
                          placeholder="Share your thoughts or suggestions..."
                          value={formData.feedbackText}
                          onChange={handleChange("feedbackText")}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Dynamic Complaint section */}
                  <AnimatePresence>
                    {formData.inquiryType === "Complaint" && (
                      <motion.div
                        className="dynamic-section complaint-section"
                        variants={fieldReveal}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <label htmlFor="complaintText">Tell us what went wrong</label>
                        <textarea
                          id="complaintText"
                          rows={3}
                          placeholder="Describe the issue you experienced..."
                          value={formData.complaintText}
                          onChange={handleChange("complaintText")}
                        />

                        <label htmlFor="improvementText" className="secondary-label">
                          How can we improve your experience?
                        </label>
                        <textarea
                          id="improvementText"
                          rows={2}
                          placeholder="Optional — let us know what would help..."
                          value={formData.improvementText}
                          onChange={handleChange("improvementText")}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="form-field">
                    <label htmlFor="subject">Subject</label>
                    <input
                      id="subject"
                      type="text"
                      placeholder="What is this regarding?"
                      value={formData.subject}
                      onChange={handleChange("subject")}
                      className={errors.subject ? "has-error" : ""}
                    />
                    {errors.subject && (
                      <span className="field-error">
                        <FiAlertTriangle /> {errors.subject}
                      </span>
                    )}
                  </div>

                  <div className="form-field">
                    <label htmlFor="message">Message</label>
                    <textarea
                      id="message"
                      rows={5}
                      placeholder="Write your message here..."
                      value={formData.message}
                      onChange={handleChange("message")}
                      className={errors.message ? "has-error" : ""}
                    />
                    {errors.message && (
                      <span className="field-error">
                        <FiAlertTriangle /> {errors.message}
                      </span>
                    )}
                  </div>

                  {errors.form && <p className="form-level-error">{errors.form}</p>}

                  <button type="submit" className="btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        Send Message <FiSend />
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default Contact;
