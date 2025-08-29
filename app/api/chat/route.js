// /app/api/chat/route.js
export async function POST(req) {
  const { userMessage } = await req.json();

  try {
    const HF_TOKEN = process.env.HF_API_KEY;
    const response = await fetch(
      "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium", // update if using a different model
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: {
            text: userMessage,
          },
        }),
      }
    );

    if (!response.ok) {
      const text = await response.text();
      return new Response(
        JSON.stringify({ reply: `⚠️ HuggingFace error: ${text}` }),
        { status: 500 }
      );
    }

    const data = await response.json();

    // Try extracting text reply from model response
    const replyText =
      data.generated_text || data[0]?.generated_text || "🤷 No reply.";

    return new Response(JSON.stringify({ reply: replyText }));
  } catch (error) {
    return new Response(
      JSON.stringify({ reply: `⚠️ Server error: ${error.message}` }),
      { status: 500 }
    );
  }
}
