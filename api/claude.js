export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://nooyij-z.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: '허용되지 않는 메서드입니다.' });
  }

  try {
    const { prompt } = req.body;
    const apiKey = process.env.OPENROUTER_API_KEY;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://nooyij-z.github.io',
        'X-Title': '청운인 의약품 안전나라'
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.3-8b-instruct:free',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1200
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('OpenRouter 오류:', JSON.stringify(data));
      return res.status(response.status).json({ error: data.error?.message || 'API 오류' });
    }

    const text = data.choices?.[0]?.message?.content || '';
    return res.status(200).json({ text });
  } catch (e) {
    console.error('서버 오류:', e);
    return res.status(500).json({ error: e.message });
  }
}
