// import "./IntroSection.css";

const IntroSection = () => {
  return (
    
    <div className="intro-section">


      <div 
        className="intro-content"
        data-aos="fade-right"
      >

        <h2 className="intro-heading">
          Empowering You to Choose the Right Career
        </h2>


        <p className="intro-description">
         Career Compass helps students and professionals discover career paths
         that genuinely match their interests, skills, and academic background.
         Through personalized assessments, expert guidance, and clear learning
         roadmaps, we make it simple to choose a career with confidence and
         prepare for the opportunities ahead.
        </p>


      </div>



     <div className="intro-cards">

  <div className="intro-card">

    <img className="intro-card-img" src="/images/assesment-final.webp" alt="Career Assessment" />

    <div className="intro-card-text">

      <h3 className="intro-card-title">Career Assessment</h3>

      <p className="intro-card-desc">
        Take an intelligent, in-depth assessment that uncovers your
        strengths and points you toward the careers that fit you best.
      </p>

    </div>

  </div>



  <div className="intro-card">

    <img className="intro-card-img" src="/images/guidance-final.webp" alt="Expert Career Guidance" />

    <div className="intro-card-text">

      <h3 className="intro-card-title">Expert Career Guidance</h3>

      <p className="intro-card-desc">
        Receive personalized recommendations and explore opportunities
        aligned with your ambitions and long-term goals.
      </p>

    </div>

  </div>



  <div className="intro-card">

    <img className="intro-card-img" src="/images/roadmap-final.webp" alt="Learning Roadmap" />

    <div className="intro-card-text">

      <h3 className="intro-card-title">Learning Roadmap</h3>

      <p className="intro-card-desc">
        Follow a clear, structured roadmap designed to help you build
        the exact skills your chosen career path demands.
      </p>

    </div>

  </div>

</div>


    </div>
  )
};


export default IntroSection;