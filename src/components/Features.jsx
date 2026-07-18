import { motion } from "framer-motion";
const Features = () => {

  const features = [
    "Career Recommendation",
    "Skill  Assessment Tech",
    "Learning Roadmap",
    "Future Opportunities"
  ];

  return (
    <section>
      <h2>Why Choose Us?</h2>
      
        <p className="features-description">
        We help you discover the right career path by understanding your
        skills, interests, and goals. Our platform provides personalized
        guidance, skill assessments, and learning roadmaps to help you make
        better career decisions and achieve your future goals with confidence.
      </p>
      {
        features.map((item,index)=>(
          <div key={index}>
            <h3>{item}</h3>
          </div>
        ))
      }

    </section>
  );
};

export default Features;