// Gemma AI API Service with CORS Proxy Fallback & Dynamic MCQ + True/False Generation
const LOCAL_PROXY_URL = "http://localhost:5000/api/gemma";
const NVIDIA_DIRECT_URL = "https://integrate.api.nvidia.com/v1/chat/completions";
const NVIDIA_API_KEY = "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";

/**
 * Calls NVIDIA Gemma AI to generate MCQ and True/False questions based on syllabus/topic content
 */
export async function generateQuestionsWithGemma({ title, subject = "General", textContent, mcqCount = 5, tfCount = 0, totalMarks = 20 }) {
  let requirements = [];
  if (mcqCount > 0) {
    requirements.push(`Generate exactly ${mcqCount} Multiple Choice Questions (MCQ) with "type": "MCQ", 4 options in "options", and exact correct answer string in "answer".`);
  }
  if (tfCount > 0) {
    requirements.push(`Generate exactly ${tfCount} True/False Questions with "type": "TF", "options": ["True", "False"], and "answer": "True" or "False".`);
  }
  if (requirements.length === 0) {
    requirements.push(`Generate 5 MCQ questions.`);
  }

  const prompt = `You are an expert educational test generator powered by Google Gemma AI.
Generate a high quality assessment based STRICTLY on the following content:

TEST TITLE: ${title}
SUBJECT / TOPIC: ${subject}

CONTENT TEXT:
"""
${textContent}
"""

REQUIREMENTS:
${requirements.map((r, i) => `${i + 1}. ${r}`).join('\n')}
${requirements.length + 1}. Output MUST be ONLY a raw JSON array matching this structure without any markdown wrap or extra text:

[
  {
    "id": 1,
    "type": "MCQ",
    "question": "Sample multiple choice question?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": "Option A",
    "marks": 2,
    "difficulty": "Medium"
  },
  {
    "id": 2,
    "type": "TF",
    "question": "Sample statement is true or false.",
    "options": ["True", "False"],
    "answer": "True",
    "marks": 2,
    "difficulty": "Easy"
  }
]`;

  let replyContent = "";

  // Strategy 1: Try Local Proxy server
  try {
    const proxyRes = await fetch(LOCAL_PROXY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: prompt,
        model: "meta/llama-3.1-8b-instruct"
      })
    });

    if (proxyRes.ok) {
      const data = await proxyRes.json();
      replyContent = data?.choices?.[0]?.message?.content || "";
    }
  } catch (proxyErr) {
    console.warn("Local proxy notice, fallback to direct connection...", proxyErr);
  }

  // Strategy 2: Direct Fetch to NVIDIA API endpoint if proxy is offline
  if (!replyContent) {
    const payload = {
      messages: [{ role: "user", content: prompt }],
      model: "meta/llama-3.1-8b-instruct",
      max_tokens: 2048,
      temperature: 0.7
    };

    const directRes = await fetch(NVIDIA_DIRECT_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${NVIDIA_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!directRes.ok) {
      const errText = await directRes.text();
      throw new Error(`NVIDIA API HTTP Error ${directRes.status}: ${errText}`);
    }

    const data = await directRes.json();
    replyContent = data?.choices?.[0]?.message?.content || "";
  }

  const questions = parseQuestionsJson(replyContent);
  if (!questions || questions.length === 0) {
    throw new Error("Gemma AI did not return valid question JSON. Raw output: " + replyContent.substring(0, 150));
  }

  return questions;
}

/**
 * Cleanly extract JSON array from AI output
 */
function parseQuestionsJson(rawText) {
  let cleanText = rawText.trim();
  if (cleanText.includes("```json")) {
    cleanText = cleanText.split("```json")[1].split("```")[0].trim();
  } else if (cleanText.includes("```")) {
    cleanText = cleanText.split("```")[1].split("```")[0].trim();
  }

  const parsed = JSON.parse(cleanText);
  if (Array.isArray(parsed)) {
    return parsed.map((q, idx) => {
      const isTF = q.type === 'TF' || (Array.isArray(q.options) && q.options.length === 2 && q.options.includes('True'));
      return {
        id: idx + 1,
        type: isTF ? 'TF' : 'MCQ',
        question: q.question,
        options: isTF ? ["True", "False"] : (Array.isArray(q.options) ? q.options : ["Option A", "Option B", "Option C", "Option D"]),
        answer: q.answer || (isTF ? "True" : (q.options ? q.options[0] : "")),
        marks: q.marks || 2,
        difficulty: q.difficulty || 'Medium'
      };
    });
  }
  return null;
}
