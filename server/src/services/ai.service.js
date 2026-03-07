const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash"
});


/* --------------------------------------------------- */
/* 1️⃣ DERMA CHATBOT                                   */
/* --------------------------------------------------- */

async function generateChatResponse(user, message, imageBuffer) {

  const prompt = `
You are DermaVerse Intelligence, an advanced AI skincare assistant designed to help users understand and manage their skin health.

You are NOT a doctor and must never claim to diagnose diseases. Instead, provide helpful skincare guidance based on visible symptoms and user concerns.

PERSONALIZATION DATA:
Skin Type: ${user.skinType || "Unknown"}
Primary Skin Concerns: ${user.primaryConcerns?.join(", ") || "Not specified"}
Sun Exposure Level: ${user.sunExposure || "Unknown"}
Pollution Exposure: ${user.pollutionExposure || "Unknown"}
Diet Pattern: ${user.dietPattern || "Unknown"}

ASSISTANT BEHAVIOR RULES:
- Be friendly, supportive, and professional.
- Focus on skincare education and prevention.
- Avoid giving prescription medical advice.
- If symptoms appear severe, recommend consulting a dermatologist.
- Provide clear actionable steps.

RESPONSE FORMAT:
1. Brief Understanding of the Problem
2. Possible Causes
3. Recommended Skincare Actions
4. Ingredients That May Help
5. Ingredients or Habits to Avoid

USER MESSAGE:
${message}

Respond clearly and helpfully.
`;

  let result;

  if (imageBuffer) {

    const imagePart = {
      inlineData: {
        data: imageBuffer.toString("base64"),
        mimeType: "image/jpeg"
      }
    };

    result = await model.generateContent([
      prompt,
      imagePart
    ]);

  } else {

    result = await model.generateContent(prompt);

  }

  return result.response.text();
}



/* --------------------------------------------------- */
/* 2️⃣ SKIN IMAGE ANALYSIS                             */
/* --------------------------------------------------- */

async function analyzeSkinImage(imageBuffer) {
  try {
    console.log('🤖 Starting Gemini analysis...');
    console.log('🤖 Image buffer size:', imageBuffer.length);

    const prompt = `
You are DermaVerse Clinical Skin Analyzer.

Your task is to analyze a facial skin image and provide an AI-based cosmetic skin assessment.

IMPORTANT LIMITATIONS:
- You are NOT diagnosing diseases.
- Only analyze visible cosmetic skin indicators.
- If something looks medically concerning, recommend seeing a dermatologist.

ANALYSIS OBJECTIVES:

Evaluate the following:

1️⃣ Skin Type Estimation  
(dry, oily, combination, balanced, sensitive)

2️⃣ Acne / Breakouts  
- none
- mild
- moderate
- severe

3️⃣ Oiliness / Sebum Level  

4️⃣ Visible Pores  

5️⃣ Pigmentation / Dark Spots  

6️⃣ Redness / Irritation  

7️⃣ Texture Quality  

Then provide:

SKIN ANALYSIS REPORT FORMAT:

Skin Type:
Acne Severity:
Oil Level:
Pore Visibility:
Pigmentation Level:
Redness / Irritation:
Skin Texture:

KEY OBSERVATIONS:
(short explanation)

RECOMMENDED SKINCARE ROUTINE:
Morning Routine
Evening Routine

INGREDIENTS TO LOOK FOR:
(list)

INGREDIENTS TO AVOID:
(list)

LIFESTYLE SUGGESTIONS:
(short tips)

DISCLAIMER:
Mention that this is an AI-based cosmetic analysis and not a medical diagnosis.
`;

    console.log('🤖 Sending request to Gemini...');
    
    // Detect MIME type from buffer or use file info
    let mimeType = "image/jpeg"; // default
    if (imageBuffer[0] === 0x89 && imageBuffer[1] === 0x50) {
      mimeType = "image/png";
    } else if (imageBuffer[0] === 0xFF && imageBuffer[1] === 0xD8) {
      mimeType = "image/jpeg";
    } else if (imageBuffer[0] === 0x47 && imageBuffer[1] === 0x49) {
      mimeType = "image/gif";
    }

    const imagePart = {
      inlineData: {
        data: imageBuffer.toString("base64"),
        mimeType: mimeType
      }
    };

    const result = await model.generateContent([
      prompt,
      imagePart
    ]);

    console.log('🤖 Gemini response received');
    const response = result.response.text();
    console.log('🤖 Response length:', response.length);
    
    return response;
  } catch (error) {
    console.error('🤖 Gemini API Error:', error);
    console.error('🤖 Error details:', error.message);
    console.error('🤖 Error stack:', error.stack);
    throw new Error(`Gemini API Error: ${error.message}`);
  }
}



module.exports = {
  generateChatResponse,
  analyzeSkinImage
};