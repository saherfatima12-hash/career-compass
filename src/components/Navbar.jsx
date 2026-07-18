import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const Navbar = ({ setShowModal, setShowLogin, user, setUser }) => {


 



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





  return (
    <nav>

      <div className="logo-container">

        <img 
          src="/images/logo.png" 
          alt="Career Compass Logo"
        />

        <h2>
          Career Compass
        </h2>

      </div>



      <ul>


        <li>
          <NavLink to="/">
            Home
          </NavLink>
        </li>


        <li>
          <NavLink to="/careers">
            Careers
          </NavLink>
        </li>


        <li>
          <NavLink to="/about">
            About
          </NavLink>
        </li>


        <li>
          <NavLink to="/contact">
            Contact
          </NavLink>
        </li>



        <li>

        {
          user ? (

            <div className="profile-circle">

              {
                user.name.charAt(0).toUpperCase()
              }

            </div>


          ) : (

            <button 
              onClick={() => setShowLogin(true)}
            >
              Login
            </button>

          )
        }


        </li>


      </ul>


    </nav>
  );
};


export default Navbar;