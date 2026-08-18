import Hero from "../components/Hero";
import Features from "../components/Features";
import IntroSection from "../components/IntroSection";
import Footer from "../components/Footer";
import SignupModal from "../components/SignupModal.jsx";
import LoginModal from "../components/LoginModal.jsx";
import ForgotPassword from "../components/ForgotPassword.jsx";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import CareerSection from "../components/CareerSection";


const Home = ({ user, setUser }) => {

const [highlightAssessment, setHighlightAssessment] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [showLogin, setShowLogin] = useState(false);
const [showForgotPassword, setShowForgotPassword] = useState(false);

 
  const handleProtectedClick = () => {

  if(user){

    window.location.href="/career";

  }
  else{

    setShowLogin(true);

  }

};


  useEffect(() => {

  console.log("showLogin changed:", showLogin);

}, [showLogin]);
  return (
    <div className="home-page">

      <Navbar
    setShowModal={setShowModal}
    setShowLogin={setShowLogin}
    user={user}
    setUser={setUser}
    setHighlightAssessment={setHighlightAssessment}
  />



     <Hero 
      user={user}
  setShowLogin={setShowLogin}
    setHighlightAssessment={setHighlightAssessment}
/>



      <IntroSection />

      <Features />

      <CareerSection
  user={user}
  setShowLogin={setShowLogin}
  highlightAssessment={highlightAssessment}
   setHighlightAssessment={setHighlightAssessment}
/>

      <Footer />





      {
        showModal && 

        <SignupModal

          closeModal={() => setShowModal(false)}
  setUser={setUser}

        />

      }





      {
  showLogin && 

  <LoginModal

    closeLogin={() => setShowLogin(false)}

    setUser={setUser}

    openSignup={() => {
      setShowLogin(false);
      setShowModal(true);
    }}

    openForgotPassword={() => {
       setShowLogin(false);

  setShowForgotPassword(true);

    }}

  />

}

{
  showForgotPassword &&

  <ForgotPassword

    closeForgot={() => setShowForgotPassword(false)}

  />

}

   </div>
  );
};


export default Home;