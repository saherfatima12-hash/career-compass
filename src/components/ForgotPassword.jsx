import { motion } from "framer-motion";
import { useState } from "react";
import axios from "axios";


const ForgotPassword = ({ closeForgot }) => {


  const [email, setEmail] = useState("");

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");



  const handleSubmit = async()=>{


    if(!email){

      setError("Please enter your email");
      return;

    }


    try{


      const response = await axios.post(

        "http://localhost:5000/api/users/forgot-password",

        {
          email
        }

      );


      setMessage(response.data.message);

      setError("");



    }

    catch(error){


      setError(
        error.response?.data?.message ||
        "Something went wrong"
      );


      setMessage("");

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

      >



        <span

          className="close-btn"

          onClick={closeForgot}

        >

          ✕

        </span>



        <h2>
          Forgot Password?
        </h2>



        <p>
          Enter your email to receive reset link.
        </p>



        {
          error &&

          <p className="input-error">
            {error}
          </p>

        }



        {
          message &&

          <p className="success-message">
            {message}
          </p>

        }




        <input

          type="email"

          placeholder="Enter your email"

          value={email}

          onChange={(e)=>setEmail(e.target.value)}

        />




        <button onClick={handleSubmit}>

          Send Link

        </button>



      </motion.div>


    </div>


  );

};


export default ForgotPassword;