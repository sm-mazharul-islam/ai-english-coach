import { GoogleGenAI } from "@google/genai";
const COMMON_CORRECTIONS: Record<string, { corrected: string; explanation: string }> = {
  "he go market yesterday": {
    corrected: "He went to the market yesterday.",
    explanation: "1. **Past Tense**: Since the action happened 'yesterday', the verb 'go' must be in its past tense form, which is 'went'.\n2. **Preposition**: The verb 'went' requires the preposition 'to' to connect it to the destination ('the market').\n3. **Article**: We add the definite article 'the' before 'market' to specify a particular market the speaker is referring to."
  },
  "he go market": {
    corrected: "He goes to the market.",
    explanation: "1. **Subject-Verb Agreement**: 'He' is third-person singular, so the verb 'go' becomes 'goes'.\n2. **Preposition & Article**: We use the preposition 'to' before 'the market' to show the direction of movement."
  },
  "i has a pen": {
    corrected: "I have a pen.",
    explanation: "1. **Subject-Verb Agreement**: The pronoun 'I' is first-person singular and always pairs with the verb 'have', not 'has' (which is used for third-person singular subjects like he/she/it)."
  },
  "she dont like apple": {
    corrected: "She doesn't like apples.",
    explanation: "1. **Subject-Verb Agreement**: 'She' is third-person singular, so the negative auxiliary verb should be 'does not' (doesn't) instead of 'do not' (don't).\n2. **Plural Noun**: When speaking about likes/dislikes generally, we use the plural noun 'apples' or 'an apple' instead of the bare singular 'apple'."
  }
};
// Initialize the Google GenAI client (it automatically picks up GEMINI_API_KEY from .env)
const ai = new GoogleGenAI({});
export async function checkGrammar(text: string): Promise<{ correctedText: string; explanation: string }> {
  const normalized = text.trim().toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
  
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    try {
      // Call Google Gemini API
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `You are an expert AI English Learning Coach. Analyze the user's English input. Correct any grammatical, spelling, or stylistic errors. Return your response in JSON format containing two keys: 'correctedText' (the fully corrected input) and 'explanation' (a list of detailed explanations in markdown explaining the corrections made). Here is the text: "${text}"`,
        config: {
          responseMimeType: "application/json",
        }
      });
      if (response && response.text) {
        const content = JSON.parse(response.text);
        
        // Defensive Check: Convert explanation array to formatted string if Gemini returns an array
        let explanationText = "";
        if (Array.isArray(content.explanation)) {
          explanationText = content.explanation
            .map((item: string, idx: number) => `${idx + 1}. ${item}`)
            .join("\n\n");
        } else {
          explanationText = content.explanation || "Corrected successfully.";
        }
        return {
          correctedText: content.correctedText || text,
          explanation: explanationText,
        };
      }
    } catch (e) {
      console.warn("Gemini API call failed, falling back to local engine:", e);
    }
  }
  // Local Mock Engine fallback if no key or error
  let matched = COMMON_CORRECTIONS[normalized];
  if (!matched) {
    const key = Object.keys(COMMON_CORRECTIONS).find(k => normalized.includes(k) || k.includes(normalized));
    if (key) {
      matched = COMMON_CORRECTIONS[key];
    }
  }
  if (matched) {
    return {
      correctedText: matched.corrected,
      explanation: matched.explanation,
    };
  }
  // General fallback heuristics
  let corrected = text;
  let explanation = "No major grammatical issues detected! Try to challenge yourself with more complex structures.";
  if (text.toLowerCase().includes("he go ")) {
    corrected = text.replace(/he go /i, "He goes ");
    explanation = "Corrected 'he go' to 'he goes' to satisfy subject-verb agreement (third-person singular).";
  } else if (text.toLowerCase().includes("i has ")) {
    corrected = text.replace(/i has /i, "I have ");
    explanation = "Corrected 'i has' to 'I have' to satisfy subject-verb agreement (first-person singular).";
  }
  return {
    correctedText: corrected,
    explanation: explanation + "\n\n*(Note: Running in offline mock mode. Add a `GEMINI_API_KEY` in `.env` to unlock open-ended Gemini AI corrections!)*",
  };
}
export async function gradeIELTSRecord(prompt: string, responseText: string): Promise<{ aiFeedback: string; score: number }> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    try {
      // Call Google Gemini API to grade IELTS response
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `You are an expert IELTS Examiner. Evaluate the user's response based on the prompt. Grade it on an IELTS band scale from 1.0 to 9.0 (with 0.5 steps) and return a JSON containing 'score' (a number, e.g. 6.5) and 'feedback' (a detailed review covering Lexical Resource, Grammatical Range & Accuracy, Coherence & Cohesion, and Task Achievement in markdown format). Prompt: "${prompt}" | Response: "${responseText}"`,
        config: {
          responseMimeType: "application/json",
        }
      });
      if (response && response.text) {
        const content = JSON.parse(response.text);
        // Defensive Check: Convert feedback array to string if model returns an array
        let feedbackText = "";
        if (Array.isArray(content.feedback)) {
          feedbackText = content.feedback.join("\n\n");
        } else {
          feedbackText = content.feedback || "Good response.";
        }
        return {
          aiFeedback: feedbackText,
          score: Math.round(Number(content.score) * 10) / 10 || 5.0,
        };
      }
    } catch (e) {
      console.warn("Gemini API call failed, falling back to mock IELTS grader:", e);
    }
  }
  // Local Offline Heuristic Grader
  const words = responseText.trim().split(/\s+/).length;
  let score = 5.0;
  let feedback = "";
  if (words < 10) {
    score = 3.5;
    feedback = "### IELTS Evaluation (Offline Mode)\n\n- **Overall Band**: 3.5\n- **Task Achievement**: Response is extremely short. Aim for at least 3-4 full sentences.\n- **Advice**: Elaborate on your points. Try adding examples.";
  } else if (words < 25) {
    score = 5.5;
    feedback = "### IELTS Evaluation (Offline Mode)\n\n- **Overall Band**: 5.5\n- **Task Achievement**: Good start, but expand on your ideas.\n- **Coherence**: Try using more transition words (e.g. 'furthermore', 'however').";
  } else {
    score = 7.0;
    feedback = "### IELTS Evaluation (Offline Mode)\n\n- **Overall Band**: 7.0\n- **Task Achievement**: Excellent details! You structured your argument effectively.";
  }
  return {
    aiFeedback: feedback + "\n\n*(Note: Running in offline mock mode. Add a `GEMINI_API_KEY` in `.env` to unlock real open-ended Gemini AI grading!)*",
    score,
  };
}
