import { FaEye, FaEyeSlash } from "react-icons/fa";
import { motion } from "framer-motion";
import { useState } from "react";
import axios from "axios";


const LoginModal = ({ 
  closeLogin, 
  openSignup, 
  openForgotPassword,
  setUser: updateNavbarUser 
}) => {


  const [user, setLoginUser] = useState({
    email:"",
    password:""
  });


  const [showPassword,setShowPassword] = useState(false);


  const [errors,setErrors] = useState({});




  const handleChange = (e)=>{


   setLoginUser({
  ...user,
  [e.target.name]: e.target.value
});



    setErrors({
      ...errors,
      [e.target.name]:""
    });


  };

  const handleLogin = async()=>{


    if(!user.email || !user.password){


      setErrors({
        general:"Please fill all fields"
      });


      return;

    }





    try{


      const response = await axios.post(

        "http://localhost:5000/api/users/login",

        user

      );



      localStorage.setItem(
  "user",
  JSON.stringify(response.data.user)
);

updateNavbarUser(response.data.user);

closeLogin();



    }

    catch(error){


      console.log(error);



      const message = error.response?.data?.message;



      if(message === "Email not found"){


        setErrors({

          email: message

        });


      }


      else if(message === "Invalid password"){


        setErrors({

          password: message

        });


      }


      else{


        setErrors({

          general: message || "Login failed"

        });


      }



    }



  };









  return (


    <div className="modal-overlay">


      <motion.div

        className="signup-modal"

        initial={{
          scale:0,
          opacity:0
        }}

        animate={{
          scale:1,
          opacity:1
        }}

        transition={{
          duration:0.3
        }}

      >




        <span

          className="close-btn"

          onClick={closeLogin}

        >

          ✕

        </span>





        <h2>
          Welcome Back
        </h2>




        <p>
          Login to continue your career journey.
        </p>





        {
          errors.general &&

          <p className="input-error">
            {errors.general}
          </p>

        }






        {
          errors.email &&

          <p className="input-error">
            {errors.email}
          </p>

        }





        <input

          type="email"

          name="email"

          placeholder="Email"

          value={user.email}

          onChange={handleChange}

        />








        {
          errors.password &&

          <p className="input-error">
            {errors.password}
          </p>

        }






        <div className="password-container">


          <input

            type={
              showPassword
              ?
              "text"
              :
              "password"
            }

            name="password"

            placeholder="Password"

            value={user.password}

            onChange={handleChange}

          />




          <span

            className="eye-icon"

            onClick={()=>setShowPassword(!showPassword)}

          >

            {
              showPassword
              ?
              <FaEyeSlash/>
              :
              <FaEye/>
            }


          </span>



        </div>







        <button onClick={handleLogin}>

          Login

        </button>

<p 
 className="forgot-password"
 onClick={openForgotPassword}
>
 Forgot Password?
</p>




        <p className="signup-switch">

          Don't have an account?

           <span onClick={openSignup}>
    Sign Up
  </span>


        </p>





      </motion.div>


    </div>


  );

};


export default LoginModal;