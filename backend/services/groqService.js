require("dotenv").config();
const Groq = require("groq-sdk");
const careerGuidance = require("../../src/data/careerGuidance.json");


const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});


const generateCareerAdvice = async (studentData) => {

  try {

 const prompt = `
You are an expert career counselor.

Student Profile:
${JSON.stringify(studentData)}

Career Knowledge Base:
${JSON.stringify(careerGuidance)}
If you use the knowledge base, include the specialNote value in reason.
Use the student profile and career knowledge base to generate personalized guidance.

Return only JSON:

{
"recommendation":"",
"reason":"",
"skills":[],
"roadmap":[],
"futureFields":[]
}

Return only JSON.
`;

    const response = await groq.chat.completions.create({

      model: "llama-3.3-70b-versatile",

      messages: [
        {
          role: "user",
          content: prompt
        }
      ]

    });


    return response.choices[0].message.content;


  } catch(error){

    console.log("Groq Error:", error);
    throw error;

  }

};


module.exports = {
 generateCareerAdvice
};
