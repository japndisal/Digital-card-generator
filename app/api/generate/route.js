// Server-side proxy to Gemini. Keeps the API key out of the browser.
// Swap the model via the GEMINI_MODEL env var if you want a different one.

export async function POST(request) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== 'string') {
      return Response.json({ error: 'Prompt required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: 'GEMINI_API_KEY not set. Add it to .env.local (locally) or Vercel env vars (in production).' },
        { status: 500 }
      );
    }

    const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const geminiRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 300,
        },
      }),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error('Gemini error:', errText);
      return Response.json({ error: 'AI request failed' }, { status: 502 });
    }

    const data = await geminiRes.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Strip wrapping quotes the model sometimes adds.
    const clean = text.trim().replace(/^["']|["']$/g, '');

    return Response.json({ text: clean });
  } catch (err) {
    console.error('Route error:', err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}
