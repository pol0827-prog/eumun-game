// Vercel 서버 함수: Anthropic API 키는 환경 변수(ANTHROPIC_API_KEY)에만 두고, 브라우저에는 노출하지 않아요.
// 로그인한 교사(Firebase ID 토큰 확인)만 사용할 수 있어요.
const FIREBASE_API_KEY = 'AIzaSyBEXpoKO30KUa0ASDoa-heAk24IBfR0nPI'; // Firebase 웹 키는 공개용이에요

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' });
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return res.status(500).json({ error: 'missing_api_key' });

  const body = typeof req.body === 'string' ? safeJson(req.body) : (req.body || {});
  const { idToken, prompt } = body;
  if (!idToken || typeof prompt !== 'string' || !prompt.trim() || prompt.length > 12000) {
    return res.status(400).json({ error: 'bad_request' });
  }

  // 1) 로그인한 교사인지 확인
  let email = '';
  try {
    const v = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=' + FIREBASE_API_KEY, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ idToken })
    });
    if (!v.ok) return res.status(401).json({ error: 'unauthorized' });
    const j = await v.json();
    email = ((j.users && j.users[0] && j.users[0].email) || '').toLowerCase();
    if (!j.users || !j.users.length) return res.status(401).json({ error: 'unauthorized' });
  } catch (e) { return res.status(401).json({ error: 'unauthorized' }); }

  // 2) (선택) 허용 이메일 목록: Vercel 환경 변수 ALLOWED_EMAILS="a@gmail.com,b@gmail.com"
  const allow = (process.env.ALLOWED_EMAILS || '').split(',').map(x => x.trim().toLowerCase()).filter(Boolean);
  if (allow.length && !allow.includes(email)) return res.status(403).json({ error: 'forbidden' });

  // 3) Claude 호출
  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || 'claude-haiku-5-5',
        max_tokens: 1500,
        messages: [{ role: 'user', content: prompt }]
      })
    });
    if (!r.ok) return res.status(502).json({ error: 'upstream_' + r.status });
    const j = await r.json();
    const text = (j.content || []).filter(c => c.type === 'text').map(c => c.text).join('');
    return res.status(200).json({ text });
  } catch (e) { return res.status(502).json({ error: 'upstream_failed' }); }
};

function safeJson(s) { try { return JSON.parse(s); } catch (e) { return {}; } }
