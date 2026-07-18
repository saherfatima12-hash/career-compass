const Footer = () => {
  return (
    <footer className="footer">

      <div className="footer-container">

        <div className="footer-box">
          <h2>Career Compass</h2>
          <p>
            Career Compass helps students and professionals discover
            the right career path through personalized guidance,
            skill assessment, and learning roadmaps for a successful future.
          </p>
        </div>

        <div className="footer-box">
          <h3>Quick Links</h3>
          <ul>
            <li>Home</li>
            <li>Careers</li>
            <li>About</li>
            <li>Contact</li>
          </ul>
        </div>

        <div className="footer-box">
          <h3>Services</h3>
          <ul>
            <li>Career Guidance</li>
            <li>Skill Assessment</li>
            <li>Learning Roadmap</li>
            <li>Job Opportunities</li>
          </ul>
        </div>

        <div className="footer-box">
          <h3>Contact</h3>
          <p>📧 support@careercompass.com</p>
          <p>📞 +92 300 1234567</p>
          <p>📍 Gujranwala, Pakistan</p>
        </div>

      </div>

      <hr />

      <div className="footer-bottom">
        <p>© 2026 Career Compass. All Rights Reserved.</p>
      </div>

    </footer>
  );
};

export default Footer;