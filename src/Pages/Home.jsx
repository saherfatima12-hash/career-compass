import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import IntroSection from "../components/IntroSection";
import Footer from "../components/Footer";
import SignupModal from "../components/SignupModal.jsx";
import LoginModal from "../components/LoginModal.jsx";
import { useState, useEffect } from "react";


const Home = () => {


  const [showModal, setShowModal] = useState(false);

  const [showLogin, setShowLogin] = useState(false);


  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );


  useEffect(()=>{

    const updateUser = () => {

      setUser(
        JSON.parse(localStorage.getItem("user"))
      );

    };


    window.addEventListener(
      "storage",
      updateUser
    );


    return ()=>{

      window.removeEventListener(
        "storage",
        updateUser
      );

    };


  },[]);
  return (
    <>

      <Navbar 
 setShowModal={setShowModal}
 setShowLogin={setShowLogin}
 user={user}
 setUser={setUser}
/>



      <Hero 
        setShowModal={setShowModal}
      />



      <IntroSection />

      <Features />

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

        />

      }



    </>
  );
};


export default Home;