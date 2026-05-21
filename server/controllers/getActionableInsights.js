const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const marked = require("marked");

const getActionableInsights = async (req, res) => {
  try {
    const DOMPurifyModule = await import("isomorphic-dompurify");
    const DOMPurify = DOMPurifyModule.default || DOMPurifyModule;
    
    const { department, weaknesses } = req.body;

    if (!department || !weaknesses?.length) {
      return res.status(400).json({
        error: "Department and weaknesses are required",
      });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
As a senior pedagogical consultant for ${department}, analyze these teaching weaknesses:
${weaknesses.map((w, i) => `${i + 1}. ${w}`).join("\n")}

Generate for each weakness:
1. 2 actionable solutions with implementation steps
2. Department-specific resources
4. Time investment estimates
5. Anything else whatever you feel is necessary

Keep it short, engaging, positive and natural.
The output will directly we displayed on the frontend to the Professor so adjust the language/format.
Format in markdown with clear headings and bullet points.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Sanitize and convert markdown safely
    const html = DOMPurify.sanitize(marked.parse(text || ""));

    res.json({ insights: html });
  } catch (error) {
    console.error("Insights generation error:", error);
    res.status(500).json({
      error: error.message || "Failed to process your request",
    });
  }
};

module.exports = { getActionableInsights };
