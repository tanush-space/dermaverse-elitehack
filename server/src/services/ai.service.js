const { GoogleGenerativeAI } = require("@google/generative-ai");

/* --------------------------------------------------- */
/* GEMINI INITIALIZATION                               */
/* --------------------------------------------------- */

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash"
});


/* --------------------------------------------------- */
/* SAFETY SANITIZATION                                 */
/* --------------------------------------------------- */

function sanitizeAIResponse(text) {

  const dangerKeywords = [
    "melanoma",
    "skin cancer",
    "carcinoma",
    "malignant",
    "tumor",
    "necrosis",
    "infection",
    "bleeding",
    "rapidly spreading",
    "ulcer",
    "painful lesion",
    "severe rash"
  ];

  const lower = text.toLowerCase();

  const detected = dangerKeywords.some(word => lower.includes(word));

  if (detected) {

    text += `

hey friend, quick little note 🌿

some of the things mentioned might sometimes be connected with more serious skin conditions.

i might be wrong of course, but it would honestly be a really good idea to let a dermatologist check it in person just to stay safe.

skin specialists can spot things early and give the most accurate advice.

and just a reminder, i'm only an ai helper trying to guide you a little, not a medical professional.
`;

  }

  return text;
}


/* --------------------------------------------------- */
/* 1️⃣ DERMA CHATBOT                                   */
/* --------------------------------------------------- */

async function generateChatResponse(user, message, imageBuffer) {

  try {

    const prompt = `
You are DermaVerse Intelligence, a friendly skincare companion.

You talk like a calm, caring best friend who understands skincare.

Your tone should feel warm, human, gentle and supportive.

You may occasionally use small friendly expressions like:
hey friend
hey bestie
hey pookie
no worries
we'll figure this out together

but do NOT overuse them.

IMPORTANT SAFETY RULES

You are NOT a doctor.
You must NEVER diagnose diseases.

If the situation sounds serious, painful, infected, spreading, or unusual,
gently suggest that the user visit a dermatologist.

Always encourage professional medical help for serious skin concerns.

PERSONALIZATION DATA

Skin Type: ${user?.skinType || "Unknown"}
Primary Concerns: ${user?.primaryConcerns?.join(", ") || "Not specified"}
Sun Exposure: ${user?.sunExposure || "Unknown"}
Pollution Exposure: ${user?.pollutionExposure || "Unknown"}
Diet Pattern: ${user?.dietPattern || "Unknown"}

RESPONSE STYLE

Speak like a thoughtful human.

Avoid robotic language.

Do NOT use bold text or markdown styling.

Avoid long paragraphs.

Use short bullet points.

Keep answers structured and easy to read.

STRUCTURE YOUR RESPONSE LIKE THIS

hey friend, let's look at what's going on with your skin 🙂

what might be happening
- observation
- observation

why this might be happening
- cause
- cause

things that may help your skin
- skincare step
- skincare step
- skincare step

ingredients your skin may like
- ingredient
- ingredient

things to be careful with
- habit or ingredient
- habit or ingredient

little supportive note
gently encourage consistent skincare and remind the user that if anything feels serious they should visit a dermatologist.

USER MESSAGE:
${message}
`;

    let result;

    if (imageBuffer) {

      const imagePart = {
        inlineData: {
          data: imageBuffer.toString("base64"),
          mimeType: "image/jpeg"
        }
      };

      result = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [
              { text: prompt },
              imagePart
            ]
          }
        ]
      });

    } else {

      result = await model.generateContent(prompt);

    }

    let response = result.response.text();

    response = sanitizeAIResponse(response);

    return response;

  } catch (error) {

    console.error("Gemini Chat Error:", error);

    return `
hey friend, something went wrong while generating the skincare advice.

please try again in a moment 🙂
`;
  }
}


/* --------------------------------------------------- */
/* 2️⃣ SKIN IMAGE ANALYSIS                             */
/* --------------------------------------------------- */

async function analyzeSkinImage(imageBuffer) {

  try {

    console.log("starting gemini skin analysis...");

    const prompt = `
You are DermaVerse Skin Analyzer.

You help people understand what their skin might be showing from a face photo.

You speak like a warm, thoughtful skincare friend who is trying to help.

IMPORTANT RULES

You are NOT a doctor.

You must NOT diagnose diseases.

You only describe visible skin characteristics like:
oiliness
dryness
acne
pores
redness
texture
pigmentation

If anything looks unusual, severe, infected, or concerning,
gently recommend that the user visit a dermatologist.

RESPONSE STYLE

Speak like a thoughtful human friend.

Avoid robotic language.

Avoid long paragraphs.

Do NOT use bold formatting.

Use simple bullet points.

Keep the response structured.

STRUCTURE YOUR RESPONSE

hey friend, thanks for sharing your skin photo with me 🙂

what i noticed from the image
- observation
- observation

what this might mean for your skin
- explanation
- explanation

simple things that may help
- skincare tip
- skincare tip
- skincare tip

ingredients your skin may like
- ingredient
- ingredient

things to be careful with
- habit or ingredient
- habit or ingredient

little reminder
mention that this is only an ai based cosmetic observation and a dermatologist is the best person to consult for serious concerns.
`;

    /* Detect MIME type */

    let mimeType = "image/jpeg";

    if (imageBuffer[0] === 0x89 && imageBuffer[1] === 0x50) {
      mimeType = "image/png";
    }
    else if (imageBuffer[0] === 0xFF && imageBuffer[1] === 0xD8) {
      mimeType = "image/jpeg";
    }
    else if (imageBuffer[0] === 0x47 && imageBuffer[1] === 0x49) {
      mimeType = "image/gif";
    }

    const imagePart = {
      inlineData: {
        data: imageBuffer.toString("base64"),
        mimeType: mimeType
      }
    };

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            imagePart
          ]
        }
      ]
    });

    let response = result.response.text();

    response = sanitizeAIResponse(response);

    console.log("skin analysis complete");

    return response;

  } catch (error) {

    console.error("Gemini Image Analysis Error:", error);

    throw new Error("AI skin analysis failed. Please try again.");

  }

}


/* --------------------------------------------------- */
/* EXPORT FUNCTIONS                                    */
/* --------------------------------------------------- */

module.exports = {
  generateChatResponse,
  analyzeSkinImage
};