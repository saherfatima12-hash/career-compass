import React, { useState } from "react";
import "./CareerSection.css";
import CareerForm from "./CareerForm";

const categories = [
  {
    title: "Technology",
    image: "/images/technology-final.webp",
    desc: "Software Engineering, AI, Data Science and Web Development"
  },
  {
    title: "Design & Creativity",
    image: "/images/design-final.webp",
    desc: "UI/UX, Graphic Design and other creative career paths"
  },
  {
    title: "Business",
    image: "/images/bussiness-final.webp",
    desc: "Management, Marketing and Entrepreneurship"
  },
  {
    title: "Healthcare",
    image: "/images/meical-final.webp",
    desc: "Medical, clinical and healthcare professions"
  },
  {
    title: "Engineering",
    image: "/images/engineer-final.webp",
    desc: "Engineering and technical specializations"
  },
  {
    title: "Finance",
    image: "/images/finance-final.webp",
    desc: "Finance, Accounting and Banking careers"
  }
];


const CareerSection = ({
  user,
  setShowLogin,
  highlightAssessment,
  setHighlightAssessment
}) => {


const [showForm,setShowForm] = useState(false);


return (

<section className="career-section">


<section className="career-heading-wrapper">

<h1 className="career-heading-title" data-aos="fade-up">
Find the Career That Fits You Best
</h1>


<p className="career-heading-desc" data-aos="fade-up" data-aos-delay="150">
Explore a range of career fields and discover the path that
truly matches your skills, interests and goals.
</p>

</section>




<section className="career-fields">

<div className="career-category-container">


{
categories.map((item,index)=>(


<div
className="career-card-animation"
key={index}
data-aos="fade-left"
data-aos-duration="800"
data-aos-delay={index * 150}
>


<div className="career-category-card">


<img
className="career-category-card-img"
src={item.image}
alt={item.title}
/>


<h3 className="career-category-card-title">
{item.title}
</h3>


<p className="career-category-card-desc">
{item.desc}
</p>


</div>


</div>


))
}


</div>


</section>





<section className="career-assessment-box">

<div className="career-assessment-inner">

<h3 className="career-assessment-title">Ready to find your direction?</h3>

<p className="career-assessment-desc">Take our quick assessment and get a personalized career roadmap in minutes.</p>

<button
className="career-assessment-btn"
className={
  highlightAssessment
  ?
  "career-assessment-btn highlight"
  :
  "career-assessment-btn"
}
onClick={()=>{
 console.log(highlightAssessment);
  if(user){
    

    setShowForm(true);

  }
  else{

    setShowLogin(true);

  }

}}
>
Start Assessment
</button>

</div>


</section>




{
showForm && 

<CareerForm 
closeForm={()=>setShowForm(false)}
/>

}



</section>

);

};


export default CareerSection;