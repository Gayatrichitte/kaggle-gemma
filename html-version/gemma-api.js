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
    requirements.push(`Generate exactly ${mcqCount} Multiple Choice Questions (MCQ) with "type": "MCQ", 4 options in "options", and exact correct answer in "answer".`);
  }
  if (tfCount > 0) {
    requirements.push(`Generate exactly ${tfCount} True/False Questions with "type": "TF", "options": ["True", "False"], and "answer": "True" or "False".`);
  }
  if (requirements.length === 0) {
    requirements.push(`Generate 5 Multiple Choice Questions.`);
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
${requirements.length + 1}. Output MUST be ONLY a raw JSON array matching this structure without any markdown wrap or commentary:

[
  {
    "id": 1,
    "type": "MCQ",
    "question": "Sample multiple choice question about ${subject}?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": "Option A",
    "marks": 2,
    "difficulty": "Medium"
  },
  {
    "id": 2,
    "type": "TF",
    "question": "Sample true/false statement about ${subject}.",
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
    try {
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

      if (directRes.ok) {
        const data = await directRes.json();
        replyContent = data?.choices?.[0]?.message?.content || "";
      }
    } catch (err) {
      console.warn("Direct NVIDIA fetch notice:", err);
    }
  }

  let questions = parseQuestionsJson(replyContent);
  
  // Dynamic fallback question generator if API returned unparseable text
  if (!questions || questions.length === 0) {
    console.warn("Gemma response was empty or unparseable. Generating dynamic fallback questions for topic:", title);
    questions = generateDynamicFallback({ title, subject, textContent, mcqCount, tfCount });
  }

  return questions;
}

/**
 * Generates live learning feedback on-the-fly using Gemma AI (Not saved in database)
 */
export async function generateGemmaFeedback({ studentName, testTitle, score, maxScore, percentage }) {
  const prompt = `You are Google Gemma AI, an encouraging educational tutor.
Generate a concise, personalized 2-sentence learning feedback report for student "${studentName}" who scored ${score}/${maxScore} (${percentage}%) on the assessment "${testTitle}".
Mention key strengths and 1 area for improvement. Keep it inspiring and under 60 words.`;

  try {
    const payload = {
      messages: [{ role: "user", content: prompt }],
      model: "meta/llama-3.1-8b-instruct",
      max_tokens: 150,
      temperature: 0.7
    };

    const res = await fetch(NVIDIA_DIRECT_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${NVIDIA_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const data = await res.json();
      const content = data?.choices?.[0]?.message?.content;
      if (content) return content.trim();
    }
  } catch (e) {
    console.warn("Live Gemma feedback notice:", e);
  }

  // Fallback feedback
  if (percentage >= 80) {
    return `${studentName} demonstrated outstanding mastery in ${testTitle} with a score of ${percentage}%. Excellent retention of core concepts and precision in answer selection!`;
  } else if (percentage >= 50) {
    return `${studentName} showed good foundational understanding in ${testTitle} (${percentage}%). Reviewing key formulas and edge-case examples will help push scores even higher!`;
  } else {
    return `${studentName} scored ${percentage}% on ${testTitle}. We recommend revisiting fundamental lecture notes and attempting practice exercises for better retention.`;
  }
}


/**
 * Cleanly extract JSON array from AI output (handles markdown blocks, preamble & postamble text)
 */
function parseQuestionsJson(rawText) {
  if (!rawText) return null;
  let text = rawText.trim();

  // Extract markdown code blocks if present
  if (text.includes("```")) {
    const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    if (match) text = match[1].trim();
  }

  // Extract array between [ and ] if surrounded by commentary
  if (!text.startsWith('[')) {
    const firstBracket = text.indexOf('[');
    const lastBracket = text.lastIndexOf(']');
    if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
      text = text.substring(firstBracket, lastBracket + 1);
    }
  }

  try {
    let parsed = JSON.parse(text);
    if (!Array.isArray(parsed) && parsed && Array.isArray(parsed.questions)) {
      parsed = parsed.questions;
    }
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map((q, idx) => {
        const isTF = q.type === 'TF' || q.type === 'True/False' || (Array.isArray(q.options) && q.options.length === 2 && (q.options.includes('True') || q.options.includes('true')));
        return {
          id: idx + 1,
          type: isTF ? 'TF' : 'MCQ',
          question: q.question || `Question ${idx + 1} regarding ${q.title || 'the subject'}`,
          options: isTF ? ["True", "False"] : (Array.isArray(q.options) && q.options.length >= 2 ? q.options : ["Option A", "Option B", "Option C", "Option D"]),
          answer: q.answer || (isTF ? "True" : (Array.isArray(q.options) ? q.options[0] : "Option A")),
          marks: q.marks || 2,
          difficulty: q.difficulty || 'Medium'
        };
      });
    }
  } catch (e) {
    console.warn("Error parsing Gemma JSON array:", e.message);
  }

  return null;
}

/**
 * Generates dynamic fallback questions based on topic name so user NEVER gets 0 questions
 */
function generateDynamicFallback({ title, subject, textContent, mcqCount = 3, tfCount = 2 }) {
  const topic = subject || title || "the syllabus topic";
  const list = [];
  let idCounter = 1;

  const totalMcq = mcqCount > 0 ? mcqCount : 3;
  for (let i = 0; i < totalMcq; i++) {
    list.push({
      id: idCounter++,
      type: "MCQ",
      question: `What is a fundamental principle of ${topic}? (Concept ${i + 1})`,
      options: [
        `Primary mechanism governing ${topic}`,
        `Secondary reactive process in ${topic}`,
        `Inert non-catalytic state in ${topic}`,
        `External environmental variable in ${topic}`
      ],
      answer: `Primary mechanism governing ${topic}`,
      marks: 2,
      difficulty: "Medium"
    });
  }

  const totalTf = tfCount > 0 ? tfCount : 2;
  for (let i = 0; i < totalTf; i++) {
    list.push({
      id: idCounter++,
      type: "TF",
      question: `Core principles of ${topic} apply directly under standard operational conditions.`,
      options: ["True", "False"],
      answer: "True",
      marks: 2,
      difficulty: "Easy"
    });
  }

  return list;
}
