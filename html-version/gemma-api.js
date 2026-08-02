// Gemma AI API Service via NVIDIA Build Endpoint
const NVIDIA_API_URL = "https://integrate.api.nvidia.com/v1/chat/completions";
const NVIDIA_API_KEY = "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";

/**
 * Calls NVIDIA Gemma API to generate dynamic MCQ questions based directly on PDF text content
 */
export async function generateQuestionsWithGemma({ title, subject = "General", textContent, mcqCount = 5, tfCount = 0, totalMarks = 20 }) {
  const prompt = `You are an expert AI educational test generator powered by Google Gemma.
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
4. Output MUST be ONLY a raw JSON array matching this structure without any markdown wrap or extra commentary:

[
  {
    "id": 1,
    "type": "MCQ",
    "question": "Question text extracted directly from syllabus?",
    "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
    "answer": "Option 1",
    "marks": 2,
    "difficulty": "Medium"
  }
]`;

  const payload = {
    messages: [{ role: "user", content: prompt }],
    model: "google/gemma-4-31b-it",
    chat_template_kwargs: { enable_thinking: true },
    max_tokens: 16384,
    stream: false,
    temperature: 0.7,
    top_p: 0.95
  };

  const response = await fetch(NVIDIA_API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${NVIDIA_API_KEY}`,
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errText = await response.text();
    console.warn(`NVIDIA Gemma API HTTP error ${response.status}:`, errText);
    // Secondary attempt with gemma-3-27b-it model if endpoint format requires
    return await fallbackGemmaModel(payload);
  }

  const data = await response.json();
  const replyContent = data?.choices?.[0]?.message?.content || "";
  
  const questions = parseQuestionsJson(replyContent);
  if (!questions || questions.length === 0) {
    throw new Error("Gemma AI did not return a valid question array. Raw response: " + replyContent.substring(0, 200));
  }

  return questions;
}

async function fallbackGemmaModel(originalPayload) {
  const fallbackPayload = {
    ...originalPayload,
    model: "google/gemma-3-27b-it"
  };

  const res = await fetch(NVIDIA_API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${NVIDIA_API_KEY}`,
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(fallbackPayload)
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemma API connection failed (${res.status}): ${err}`);
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content || "";
  return parseQuestionsJson(content);
}

/**
 * Cleanly extract JSON array from Gemma output
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
      options: q.options || [],
      answer: q.answer || (q.options ? q.options[0] : ''),
      marks: q.marks || 2,
      difficulty: q.difficulty || 'Medium'
    }));
  }
  return null;
}
