// import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer-section">

      <div className="footer-container">

        <div className="footer-col">
          <h2 className="footer-brand-title">Career Compass</h2>
          <p className="footer-brand-desc">
            Career Compass helps students and professionals discover the
            right career path through personalized guidance, intelligent
            skill assessments, and clear learning roadmaps built for a
            confident future.
          </p>
        </div>

        <div className="footer-col">
          <h3 className="footer-col-heading">Quick Links</h3>
          <ul className="footer-list">
            <li className="footer-list-item">Home</li>
            <li className="footer-list-item">Careers</li>
            <li className="footer-list-item">About</li>
            <li className="footer-list-item">Contact</li>
          </ul>
        </div>

        <div className="footer-col">
          <h3 className="footer-col-heading">Services</h3>
          <ul className="footer-list">
            <li className="footer-list-item">Career Guidance</li>
            <li className="footer-list-item">Skill Assessment</li>
            <li className="footer-list-item">Learning Roadmap</li>
            <li className="footer-list-item">Job Opportunities</li>
          </ul>
        </div>

        <div className="footer-col">
          <h3 className="footer-col-heading">Contact</h3>
          <p className="footer-contact-item">📧 support@careercompass.com</p>
          <p className="footer-contact-item">📞 +92 300 1234567</p>
          <p className="footer-contact-item">📍 Gujranwala, Pakistan</p>
        </div>

      </div>

      <hr className="footer-divider" />

      <div className="footer-bottom">
        <p className="footer-bottom-text">© 2026 Career Compass. All Rights Reserved.</p>
      </div>

    </footer>
  );
};

export default Footer;