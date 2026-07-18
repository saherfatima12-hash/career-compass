import { motion } from "framer-motion";

const Hero = ({setShowModal}) => {
  return (
    <section className="hero">

      <motion.h1
        initial={{opacity:0, y:50}}
        animate={{opacity:1, y:0}}
        transition={{duration:1}}
      >
        Discover Your Perfect Career Path
      </motion.h1>


      <motion.p
        initial={{opacity:0}}
        animate={{opacity:1}}
        transition={{delay:0.5}}
      >
        Get personalized career guidance based on your interests,
        skills and education.
      </motion.p>

       
      <motion.button onClick={() => setShowModal(true)}
        whileHover={{scale:1.1}}
      >
        Start Your Journey
      </motion.button>

    </section>
  );
};

export default Hero;