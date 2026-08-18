import { motion } from "framer-motion";
// import "./Hero.css";

const Hero = ({ user, setShowLogin,setHighlightAssessment}) => {
  return (
    <section className="hero-section">

      <div className="hero-content">

        <h1
          className="hero-title"
         
        >
          Discover the Career Path That's Right for You
        </h1>


        <p
          className="hero-description"
         
        >
          Get personalized, AI-powered career guidance built around your
          interests, skills, and academic background — so every decision
          you make moves you forward with confidence.
        </p>


        <motion.button
  onClick={() => {

    if(user){

      document
        .querySelector(".career-assessment-box")
        ?.scrollIntoView({
          behavior: "smooth"
        });
        
      setHighlightAssessment(true);


      setTimeout(()=>{

        setHighlightAssessment(false);

      },3000);
    }
    else{

      setShowLogin(true);

    }

  }}
  className="hero-cta-btn"
  whileHover={{scale:1.08, y:-4}}
  whileTap={{scale:0.97}}
>
  Start Your Journey
</motion.button>

      </div>

    </section>
  );
};

export default Hero;