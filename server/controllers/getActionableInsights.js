const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
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

    const model = "gemini-3-flash-preview";

    const prompt = `
You are an expert pedagogical consultant. A university professor in the ${department} department needs rapid, highly actionable advice to address the following student feedback:

${weaknesses.map((w, i) => `${i + 1}. ${w}`).join("\n")}

For each point, provide EXACTLY ONE bullet point containing a highly specific, practical "Quick Win" they can use in their very next lecture.

**Rules:**
- BE EXTREMELY CONCISE. Maximum 2 sentences per point.
- Zero fluff, zero pedagogical theory, and no empathy statements.
- Give them the absolute best, fastest solution to the problem.
- Format strictly as: \`**[Short Weakness Summary]:** [Your 1-2 sentence quick win.]\`
- Do not include any introductory or concluding text.
`;

    const result = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        thinkingConfig: {
          thinkingLevel: "HIGH",
        },
      },
    });
    const text = result.text;

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
