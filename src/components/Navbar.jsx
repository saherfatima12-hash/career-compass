import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
// import "./Navbar.css";

const Navbar = ({
  setShowModal,
  setShowLogin,
  user,
  setUser,
  setHighlightAssessment
}) => {

  const [profileOpen, setProfileOpen] = useState(false);


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

          `http://localhost:5000/api/users/check-user/${savedUser.email}`

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





  const logout = ()=>{


    localStorage.removeItem("user");

    setUser(null);

    setProfileOpen(false);


  };

const handleProtectedClick = (e) => {

  e.preventDefault();

  if(!user){

    setShowLogin(true);
    return;

  }

  setHighlightAssessment(true);

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
    
    <nav className="navbar" data-aos="fade-down">

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



      <ul className="navbar-menu" data-aos="fade-left">


        <li className="navbar-menu-item">
          <NavLink to="/" className="navbar-link">
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
          <NavLink to="/about" className="navbar-link">
            About
          </NavLink>
        </li>

        <li className="navbar-menu-item">
          <NavLink to="/contact" className="navbar-link">
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
              
              onClick={() => 
                    
                setShowLogin(true)}
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