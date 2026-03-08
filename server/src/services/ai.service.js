const { GoogleGenerativeAI } = require("@google/generative-ai");

/* --------------------------------------------------- */
/* GEMINI INITIALIZATION                               */
/* --------------------------------------------------- */

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash"
});


/* --------------------------------------------------- */
/* 1️⃣ DERMA CHATBOT                                   */
/* --------------------------------------------------- */

async function generateChatResponse(user, message, imageBuffer) {
  try {

    const prompt = `
You are DermaVerse Intelligence, a warm and friendly AI skincare assistant.

Your goal is to help users understand and care for their skin in a supportive and human way.

PERSONALITY:
You speak like a caring skincare friend. Calm, kind, and supportive.
Your tone should feel natural and conversational.

IMPORTANT LIMITATIONS:
You are NOT a doctor.
Never diagnose diseases or claim medical authority.
If something sounds serious, gently suggest visiting a dermatologist.

PERSONALIZATION DATA:
Skin Type: ${user?.skinType || "Unknown"}
Primary Skin Concerns: ${user?.primaryConcerns?.join(", ") || "Not specified"}
Sun Exposure Level: ${user?.sunExposure || "Unknown"}
Pollution Exposure: ${user?.pollutionExposure || "Unknown"}
Diet Pattern: ${user?.dietPattern || "Unknown"}

RESPONSE STYLE RULES:
- Talk like you are chatting with the user.
- Be warm, calm, and supportive.
- Do NOT use markdown formatting like **bold**, # headings, or bullet symbols.
- Write in short natural paragraphs.
- Use a few gentle emojis like 🌿✨💧🙂 but don't overuse them.
- Avoid robotic or textbook language.
- Avoid sounding like a report.

HOW TO STRUCTURE YOUR RESPONSE:

Start with a warm acknowledgement.

Then talk about:
what might be happening with their skin
possible causes
simple skincare steps they can try
helpful ingredients
things they may want to avoid

End with a supportive message.

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

    /* Clean unwanted markdown formatting */
    response = response
      .replace(/\*\*/g, "")
      .replace(/##/g, "")
      .replace(/#/g, "");

    return response;

  } catch (error) {

    console.error("Gemini Chat Error:", error);

    return "Sorry, something went wrong while generating the skincare advice. Please try again in a moment 🙂";

  }
}



/* --------------------------------------------------- */
/* 2️⃣ SKIN IMAGE ANALYSIS                             */
/* --------------------------------------------------- */

async function analyzeSkinImage(imageBuffer) {
  try {

    console.log("🤖 Starting Gemini image analysis...");

    const prompt = `
You are DermaVerse Skin Analyzer.

You help users understand visible skin characteristics from a photo and give gentle skincare suggestions.

IMPORTANT:
You are NOT diagnosing medical conditions.
You only describe visible cosmetic skin traits.

If something looks medically concerning, suggest visiting a dermatologist.

RESPONSE STYLE:

Write like a smart, friendly skincare guide talking to the user.

FORMAT RULES:
- Use short chat-style sections.
- Avoid long paragraphs.
- Use **bold** for important ideas.
- Use *italics* for subtle emphasis.
- Use bullet points for tips.
- Keep each section 1–3 lines max.
- Add a few light emojis like 🌿💧✨🙂 but don't overdo them.

STRUCTURE:

Start with a short friendly opener.

Then include sections like this:

**What I think might be happening**
(short explanation)

**Why this might be happening**
(short insights)

**Things that could help**
- tip
- tip
- tip

**Ingredients your skin may like**
- ingredient
- ingredient

**Things to avoid**
- item
- item

End with a short supportive line.
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

    /* Clean formatting */
    response = response
      .replace(/\*\*/g, "")
      .replace(/##/g, "")
      .replace(/#/g, "");

    console.log("🤖 Gemini analysis complete");

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