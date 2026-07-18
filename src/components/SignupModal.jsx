import { FaEye, FaEyeSlash } from "react-icons/fa";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios";


const SignupModal = ({ closeModal, setUser: updateNavbarUser }) => {


  const [user, setUser] = useState({
    name: "",
    email: "",
    password: ""
  });


  const [showPassword, setShowPassword] = useState(false);


  const [errors, setErrors] = useState({});


  const [waiting, setWaiting] = useState(false);


  const [success, setSuccess] = useState(false);





  const handleChange = (e) => {


    setUser({
      ...user,
      [e.target.name]: e.target.value
    });


    setErrors({
      ...errors,
      [e.target.name]: ""
    });


  };







  const validateForm = () => {


    let newErrors = {};



    if(!user.name){

      newErrors.name = "Please enter your name";

    }




    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;



    if(!user.email){

      newErrors.email = "Please enter your email";

    }

    else if(!emailPattern.test(user.email)){


      newErrors.email = "Please enter a valid email address";

    }





    if(!user.password){

      newErrors.password = "Please enter your password";

    }

    else if(user.password.length < 8){


      newErrors.password = "Password must be at least 8 characters";

    }




    setErrors(newErrors);


    return Object.keys(newErrors).length === 0;


  };











  const handleSignup = async()=>{


    if(!validateForm()){

      return;

    }




    try{


      await axios.post(

        "http://localhost:5000/api/users/register",

        user

      );



      setWaiting(true);



    }


    catch(error){



      console.log(error);



      if(error.response){


        setErrors({

          email:error.response.data.message

        });


      }

      else{


        setErrors({

          general:"Something went wrong"

        });


      }


    }



  };

  // Check verification

  useEffect(()=>{


    if(!waiting){

      return;

    }



    const checkVerification = setInterval(async()=>{


      try{


        const response = await axios.get(

          `http://localhost:5000/api/users/check-verification/${user.email}`

        );



        

 if(response.data.verified){

  clearInterval(checkVerification);

  setWaiting(false);

  const newUser = {
    name:user.name,
    email:user.email
  };

  localStorage.setItem(
    "user",
    JSON.stringify(newUser)
  );

 updateNavbarUser(newUser);

  setSuccess(true);

}

  




      }

      catch(error){

        console.log(error);

      }



    },3000);




    return ()=>clearInterval(checkVerification);



  },[waiting,user.email]);









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




      {
        !success &&

        <span

        className="close-btn"

        onClick={closeModal}

        >

        ✕

        </span>

      }






      {
        success ?



        <div className="success-box">


          <h2>
            🎉 Congratulations!
          </h2>


          <p>
            You have successfully signed up.
          </p>


          <button onClick={closeModal}>
            Continue
          </button>


        </div>



        :



        <>



        <h2>
          Create Your Account
        </h2>



        <p>
          Sign up to explore personalized career guidance.
        </p>






        <input

        type="text"

        name="name"

        placeholder="Full Name"

        value={user.name}

        onChange={handleChange}

        />



        {
        errors.name &&

        <p className="input-error">
        {errors.name}
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
        errors.email &&

        <p className="input-error">
        {errors.email}
        </p>

        }





        {
        waiting &&

        <p className="input-error">

        Please check your email and verify your account.

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






        {
        errors.password &&

        <p className="input-error">
        {errors.password}
        </p>

        }





        <button onClick={handleSignup}>

          Sign Up

        </button>





        </>


      }





      {
        errors.general &&

        <p className="input-error">

        {errors.general}

        </p>

      }





      </motion.div>



    </div>


  );


};



export default SignupModal;