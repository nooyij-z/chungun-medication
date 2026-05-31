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
    const apiKey = process.env.GEMINI_API_KEY;
 
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 1200 }
        }),
      }
    );
 
    const data = await response.json();
    console.log('Gemini 응답:', JSON.stringify(data));
 
    if (!response.ok) {
      console.error('Gemini 오류:', data);
      return res.status(response.status).json({ error: data.error?.message || 'API 오류', detail: data });
    }
 
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return res.status(200).json({ text });
  } catch (e) {
    console.error('서버 오류:', e);
    return res.status(500).json({ error: e.message });
  }
}
