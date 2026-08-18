import { NavLink } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FiMenu, FiX } from "react-icons/fi";
// import "./Navbar.css";

const Navbar = ({
  setShowModal,
  setShowLogin,
  user,
  setUser,
  setHighlightAssessment
}) => {

  const [profileOpen, setProfileOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navRef = useRef(null);


  useEffect(()=>{


    const checkUser = async()=>{


      const savedUser = JSON.parse(
        localStorage.getItem("user")
      );


      if(!savedUser){

        setUser(null);
        return;

      }


      try{


        const response = await axios.get(

          `https://career-compass-eo2e.vercel.app/api/users/check-user/${savedUser.email}`

        );


        if(!response.data.exists){


          localStorage.removeItem("user");

          setUser(null);


        }


      }

      catch(error){

        console.log(error);

      }


    };


    checkUser();


  },[]);


  // Close the mobile menu on outside click or Escape key
  useEffect(() => {

    if (!isMenuOpen) return;

    const handleClickOutside = (e) => {

      if (navRef.current && !navRef.current.contains(e.target)) {

        setIsMenuOpen(false);

      }

    };

    const handleEscape = (e) => {

      if (e.key === "Escape") {

        setIsMenuOpen(false);

      }

    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {

      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);

    };

  }, [isMenuOpen]);


  const closeMenu = () => setIsMenuOpen(false);


  const logout = ()=>{


    localStorage.removeItem("user");

    setUser(null);

    setProfileOpen(false);

    closeMenu();


  };

const handleProtectedClick = (e) => {

  e.preventDefault();

  if(!user){

    setShowLogin(true);
    closeMenu();
    return;

  }

  setHighlightAssessment(true);

  closeMenu();

  setTimeout(() => {

    document
      .querySelector(".career-assessment-box")
      ?.scrollIntoView({
        behavior: "smooth"
      });

  }, 100);

  setTimeout(() => {

    setHighlightAssessment(false);

  }, 4000);

};



  return (
    
    <nav className="navbar" data-aos="fade-down" ref={navRef}>

      <div className="navbar-logo"
       data-aos="fade-right">

        <img
          className="navbar-logo-img"
          src="/images/logo.png" 
          alt="Career Compass Logo"
        />

        <h2 className="navbar-logo-title">
          Career Compass
        </h2>

      </div>


      <button
        type="button"
        className="navbar-toggle"
        onClick={() => setIsMenuOpen((prev) => !prev)}
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        aria-expanded={isMenuOpen}
      >
        {isMenuOpen ? <FiX /> : <FiMenu />}
      </button>


      <ul
        className={`navbar-menu${isMenuOpen ? " open" : ""}`}
        data-aos="fade-left"
      >


        <li className="navbar-menu-item">
          <NavLink to="/" className="navbar-link" onClick={closeMenu}>
            Home
          </NavLink>
        </li>


        <li className="navbar-menu-item">

  <NavLink 
    to="/career" 
    className="navbar-link"
    onClick={handleProtectedClick}
  >
    Careers
  </NavLink>

</li>
        <li className="navbar-menu-item">
          <NavLink to="/about" className="navbar-link" onClick={closeMenu}>
            About
          </NavLink>
        </li>

        <li className="navbar-menu-item">
          <NavLink to="/contact" className="navbar-link" onClick={closeMenu}>
  Contact
</NavLink>
        </li>


        




        <li className="navbar-menu-item navbar-profile-wrapper">


        {
          user ? (


            <>


            <div

              className="navbar-profile-circle"

              onClick={()=>setProfileOpen(!profileOpen)}

            >

              {
                user.name.charAt(0).toUpperCase()
              }

            </div>





            {
              profileOpen &&


              <div className="navbar-profile-popup">


                <h3 className="navbar-profile-name">
                  {user.name}
                </h3>


                <p className="navbar-profile-email">
                  {user.email}
                </p>



                <button
                  className="navbar-profile-btn"
                  onClick={logout}
                >

                  Log Out

                </button>



               <button
 
  className="navbar-profile-btn navbar-profile-btn-alt"

  onClick={()=>{
    
 
    setShowLogin(true);
    closeMenu();

  }}

>
Switch Account
</button>



              </div>


            }


            </>


          ) : (

             
            <button 
              className="navbar-login-btn"
              
              onClick={() => {

                setShowLogin(true);
                closeMenu();

              }}
            >

              Log In

            </button>


          )
        }


        </li>


      </ul>


    </nav>
  );
};


export default Navbar;