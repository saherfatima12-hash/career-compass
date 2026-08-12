const express = require("express");
const router = express.Router();

const { generateCareerAdvice } = require("../services/groqService");


router.post("/generate-guidance", async(req,res)=>{

try{

const studentData = req.body;


const guidance = await generateCareerAdvice(studentData);


res.json({
  success:true,
  guidance: JSON.parse(
    guidance.replace(/```json|```/g, "")
  )
});


}
catch(error){

console.log(error);

res.status(500).json({
success:false,
message:"Gemini generation failed"
});

}

});


module.exports = router;