// Gemma AI API Service with CORS Proxy Fallback
const LOCAL_PROXY_URL = "http://localhost:5000/api/gemma";
const NVIDIA_DIRECT_URL = "https://integrate.api.nvidia.com/v1/chat/completions";
const NVIDIA_API_KEY = "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";

/**
 * Calls NVIDIA Gemma API to generate dynamic MCQ questions based directly on PDF text content
 */
export async function generateQuestionsWithGemma({ title, subject = "General", textContent, mcqCount = 5, tfCount = 0, totalMarks = 20 }) {
  const prompt = `You are an expert AI educational test generator.
Generate a high quality Multiple Choice Quiz assessment based STRICTLY on the following document text content:

TEST TITLE: ${title}

DOCUMENT CONTENT TEXT:
"""
${textContent}
"""

REQUIREMENTS:
1. Generate exactly ${mcqCount} Multiple Choice Questions (MCQ).
2. Each question MUST have exactly 4 options: ["Option A", "Option B", "Option C", "Option D"].
3. Specify the exact correct answer in the "answer" field.
4. Output MUST be ONLY a raw JSON array matching this structure without any markdown text outside it:

[
  {
    "id": 1,
    "type": "MCQ",
    "question": "Clear question based on syllabus?",
    "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
    "answer": "Option 1",
    "marks": 2,
    "difficulty": "Medium"
  }
]`;

  let replyContent = "";

  // Strategy 1: Try Local Proxy server (bypasses browser CORS completely)
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
    console.warn("Local proxy notice, attempting direct NVIDIA connection...", proxyErr);
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
    throw new Error("Gemma AI did not return a valid question array. Response: " + replyContent.substring(0, 150));
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
    return parsed.map((q, idx) => ({
      id: idx + 1,
      type: 'MCQ',
      question: q.question,
      options: Array.isArray(q.options) ? q.options : [],
      answer: q.answer || (q.options ? q.options[0] : ''),
      marks: q.marks || 2,
      difficulty: q.difficulty || 'Medium'
    }));
  }
  return null;
}
