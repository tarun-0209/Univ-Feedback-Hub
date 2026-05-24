const feedbacksReceived = require("../models/FeedbacksReceived");
const ProcessedFeedback = require("../models/processedFeedbacks");
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});
const model = "gemini-3-flash-preview";

const processFeedbacksCore = async () => {
  console.log("Running feedback processing task...");

  try {
    const feedbacks = await feedbacksReceived.find({
      isProcessed: false,
      deadline: { $lte: new Date() },
    });

    if (feedbacks.length === 0) {
      return { message: "No feedbacks to process." };
    }

    const feedbackProcessingResults = [];

    // Process forms sequentially to avoid AI rate limits
    for (const feedback of feedbacks) {
      try {
        // Initialize metric accumulators
        const metrics = {
          clarity: { sum: 0, count: 0 },
          doubtResolution: { sum: 0, count: 0 },
          practicalKnowledge: { sum: 0, count: 0 },
          overallRating: { sum: 0, count: 0 },
        };

        const textResponses = [];

        // Process each student response
        feedback.responses.forEach((response) => {
          // Process fixed questions (numeric ratings are at indices 5, 6, 7, 8)
          const fixedAnswers = response.answers.slice(5, 9);

          fixedAnswers.forEach((answer, index) => {
            const numericValue = parseInt(answer);
            if (
              !isNaN(numericValue) &&
              numericValue >= 1 &&
              numericValue <= 5
            ) {
              switch (index) {
                case 0:
                  metrics.clarity.sum += numericValue;
                  metrics.clarity.count++;
                  break;
                case 1:
                  metrics.doubtResolution.sum += numericValue;
                  metrics.doubtResolution.count++;
                  break;
                case 2:
                  metrics.practicalKnowledge.sum += numericValue;
                  metrics.practicalKnowledge.count++;
                  break;
                case 3:
                  metrics.overallRating.sum += numericValue;
                  metrics.overallRating.count++;
                  break;
              }
            }
          });

          // Process text responses (text answers are at indices 0 to 4)
          const textAnswers = response.answers
            .slice(0, 5)
            .filter((answer) => answer.length > 15);

          if (textAnswers.length > 0) {
            textResponses.push(textAnswers.join("\n"));
          }
        });

        // Calculate metric averages
        const processedMetrics = {
          clarity: {
            average:
              metrics.clarity.count > 0
                ? Number((metrics.clarity.sum / metrics.clarity.count).toFixed(2))
                : 0,
            responses: metrics.clarity.count,
          },
          doubtResolution: {
            average:
              metrics.doubtResolution.count > 0
                ? Number(
                    (metrics.doubtResolution.sum / metrics.doubtResolution.count).toFixed(2)
                  )
                : 0,
            responses: metrics.doubtResolution.count,
          },
          practicalKnowledge: {
            average:
              metrics.practicalKnowledge.count > 0
                ? Number(
                    (metrics.practicalKnowledge.sum / metrics.practicalKnowledge.count).toFixed(2)
                  )
                : 0,
            responses: metrics.practicalKnowledge.count,
          },
          overallRating: {
            average:
              metrics.overallRating.count > 0
                ? Number((metrics.overallRating.sum / metrics.overallRating.count).toFixed(2))
                : 0,
            responses: metrics.overallRating.count,
          },
        };

        // Process text feedbacks with AI
        let strengths = [];
        let weaknesses = [];
        
        if (textResponses.length > 0) {
          const feedbackData = textResponses.join("\n\n");

          const prompt = `
Analyze the following professor feedback from students and provide a consolidated analysis.

**Input Data:**
${feedbackData}

**Processing Instructions:**
1. Cluster similar feedback using semantic analysis 
2. Identify patterns through frequency analysis of clustered feedback
3. Select top 3 most frequent/impactful strengths and weaknesses based on pattern prevalence
4. Generalize specific comments into broader categories
5. Ignore minor wording variations while maintaining core meaning

**Output Requirements:**
Return JSON strictly in this format:
{
  "strengths": ["<Generalized Strength 1>", "<Generalized Strength 2>", "<Generalized Strength 3>"],
  "weaknesses": ["<Generalized Weakness 1>", "<Generalized Weakness 2>", "<Generalized Weakness 3>"]
}
`;

          const aiResponse = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
              thinkingConfig: {
                thinkingLevel: "HIGH",
              },
            },
          });
          const cleanedResponse = aiResponse.text
            .replace(/```json\s*|```/g, "")
            .trim();

          ({ strengths, weaknesses } = JSON.parse(cleanedResponse));
        }

        // Create processed feedback document
        const processedFeedback = new ProcessedFeedback({
          feedbackForm: feedback.name,
          professorName: feedback.professorName,
          professorDepartment: feedback.department,
          strengths,
          weaknesses,
          metrics: processedMetrics,
          processedAt: new Date(),
        });

        await processedFeedback.save();
        await feedbacksReceived.updateOne(
          { _id: feedback._id },
          { $set: { isProcessed: true } }
        );

        feedbackProcessingResults.push({ feedbackForm: feedback.name, success: true });
        
        // Optional 1 second delay to ensure no rate limits are hit
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`Error processing feedback form "${feedback.name}":`, error);
        feedbackProcessingResults.push({
          feedbackForm: feedback.name,
          success: false,
          error: error.message,
        });
      }
    }

    return {
      message: "Feedback processing completed.",
      results: feedbackProcessingResults,
    };
  } catch (error) {
    console.error("Error running feedback processing task:", error);
    throw new Error("Feedback processing failed: " + error.message);
  }
};

// API Endpoint Caller
const processFeedbacksAI = async (req, res) => {
  try {
    const result = await processFeedbacksCore();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cron Job Caller
const processFeedbacksCron = async () => {
  try {
    const result = await processFeedbacksCore();
    console.log(result.message);
    if (result.results) {
      console.log("Processed Feedbacks:", result.results);
    }
  } catch (error) {
    console.error("Error running feedback processing task:", error);
  }
};

module.exports = { processFeedbacksAI, processFeedbacksCron };
