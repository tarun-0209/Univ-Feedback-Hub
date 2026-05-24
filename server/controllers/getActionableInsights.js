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
You are an expert pedagogical consultant specializing in higher education. Your goal is to provide highly actionable, constructive, and empathetic advice to a university professor in the ${department} department based on the following areas for improvement identified by their students:

${weaknesses.map((w, i) => `${i + 1}. ${w}`).join("\n")}

For each area of improvement, provide a structured action plan containing:
1. **The Core Issue:** A brief, empathetic interpretation of why students might be struggling with this.
2. **Quick Win:** One simple, immediate change the professor can implement in their very next lecture.
3. **Long-Term Strategy:** A concrete pedagogical technique to systematically address the issue over the semester.
4. **Suggested Tool/Method:** A specific teaching framework, software tool, or active learning technique relevant to the ${department} department.

**Tone & Formatting Guidelines:**
- Tone: Encouraging, highly professional, and collegiate. Never condescending.
- Format: Use clean Markdown. Use \`###\` for each weakness title, and bullet points for the action plan.
- Rule: Output the analysis directly. Do NOT include introductory or concluding pleasantries.
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
