import { motion } from "framer-motion";
// import "./Hero.css";

const Hero = ({ user, setShowLogin,setHighlightAssessment}) => {
  return (
    <section className="hero-section">

      <div className="hero-content">

        <motion.h1
          className="hero-title"
          // initial={{opacity:0, y:50}}
          // animate={{opacity:1, y:0}}
          // transition={{duration:1}}
        >
          Discover the Career Path That's Right for You
        </motion.h1>


        <motion.p
          className="hero-description"
          initial={{opacity:0}}
          animate={{opacity:1}}
          transition={{delay:0.5}}
        >
          Get personalized, AI-powered career guidance built around your
          interests, skills, and academic background — so every decision
          you make moves you forward with confidence.
        </motion.p>


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