import { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";


const ResetPassword = () => {


  const { token } = useParams();


  const [password,setPassword] = useState("");
  const [confirmPassword,setConfirmPassword] = useState("");

  const [message,setMessage] = useState("");
  const [error,setError] = useState("");



  const handleReset = async()=>{


    if(!password || !confirmPassword){

      setError("Please fill all fields");
      return;

    }


    if(password !== confirmPassword){

      setError("Passwords do not match");
      return;

    }



    if(password.length < 8){

      setError("Password must be at least 8 characters");
      return;

    }



    try{


      const response = await axios.post(

        `https://career-compass-eo2e.vercel.app/api/users/reset-password/${token}`,

        {
          password
        }

      );


      setMessage(response.data.message);

      setError("");

      setPassword("");
      setConfirmPassword("");


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


    <div className="reset-page">


      <div className="reset-box">


        <h2>
          Reset Password
        </h2>


        <p>
          Create your new Career Compass password.
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

          type="password"

          placeholder="New Password"

          value={password}

          onChange={(e)=>setPassword(e.target.value)}

        />




        <input

          type="password"

          placeholder="Confirm Password"

          value={confirmPassword}

          onChange={(e)=>setConfirmPassword(e.target.value)}

        />




        <button onClick={handleReset}>

          Reset Password

        </button>



      </div>


    </div>


  );

};


export default ResetPassword;