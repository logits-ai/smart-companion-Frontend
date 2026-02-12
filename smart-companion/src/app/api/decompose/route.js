import { NextResponse } from 'next/server';

// --- MEMBER B's PROMPT LOGIC ---
const SYSTEM_PROMPT = `
Break the task into AT MOST 5 very small steps.
Each step must take less than 2 minutes.
Steps must NOT repeat.
Steps must be concrete and immediately doable.
Return ONLY a numbered list.
`;

export async function POST(request) {
  try {
    const body = await request.json();
    const { task } = body; 

    console.log("⚡ [API] Recieved task:", task);

    // 1. CALL LOCAL AI (OLLAMA)
    // We use a timeout so your website doesn't freeze if AI is off
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gemma3:4b", // Using Member B's specific model
        prompt: `${SYSTEM_PROMPT}\n\nTask: ${task}`,
        stream: false
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
        throw new Error("Ollama/AI Server is not responding");
    }

    const data = await response.json();
    
    // 2. CLEAN THE DATA (Member B's logic)
    const cleanSteps = processAIResponse(data.response);

    return NextResponse.json({ tasks: cleanSteps });

  } catch (error) {
    console.error("⚠️ AI Failed (Using Fallback):", error.message);
    
    // FALLBACK: If AI is offline, return this so the demo still works
    return NextResponse.json({ 
      tasks: [
        { id: 1, text: "Gather your materials (AI Offline Mode)", energy: "Low", status: "active" },
        { id: 2, text: "Clear a small workspace", energy: "Medium", status: "pending" },
        { id: 3, text: "Start with the easiest item", energy: "Low", status: "pending" }
      ]
    });
  }
}

// Helper to clean up the text (Adapted from Member B)
function processAIResponse(text) {
  return text
    .split("\n")
    .map(line => line.replace(/^\d+\.?\s*/, "").trim()) // Remove "1. "
    .filter(Boolean)
    .slice(0, 5) // Limit to 5 steps
    .map((step, index) => ({
      id: index + 1,
      text: step.slice(0, 120),
      energy: index % 2 === 0 ? "Low" : "Medium",
      status: index === 0 ? "active" : "pending"
    }));
}