// import "./Features.css";

const Features = () => {

  const features = [
    {
      icon: "🎯",
      title: "Personalized Recommendations",
      description: "Career suggestions tailored to your unique profile, not generic advice."
    },
    {
      icon: "🧠",
      title: "Smart Skill Assessment",
      description: "An intelligent evaluation that identifies your true strengths and gaps."
    },
    {
      icon: "🗺️",
      title: "Structured Learning Roadmap",
      description: "A clear, step-by-step plan to build the skills your career path needs."
    },
    {
      icon: "🚀",
      title: "Future-Ready Opportunities",
      description: "Career fields and paths matched to where the industry is heading."
    }
  ];


  return (
    <section className="feature-section">


      <h2 className="feature-heading" data-aos="fade-up">
        Why Choose Career Compass?
      </h2>


      <p 
        className="feature-description"
       data-aos="fade-up" data-aos-delay="150"
      >
        We help you discover the right career path by understanding your
        skills, interests, and goals. Our platform combines personalized
        guidance, smart skill assessments, and clear learning roadmaps —
        so you can make confident career decisions and work toward your
        future with clarity.
      </p>



      <div className="feature-grid">

        {
          features.map((item,index)=>(

            <div

              className="feature-card"

              key={index}

              data-aos="fade-up"

              data-aos-delay={index * 150}

            >

              <span className="feature-card-icon">{item.icon}</span>

              <h3 className="feature-card-title">
                {item.title}
              </h3>

              <p className="feature-card-desc">
                {item.description}
              </p>


            </div>

          ))
        }

      </div>


    </section>
  );
};

export default Features;