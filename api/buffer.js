export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { action, accessToken, profileId, text } = req.body;

  try {
    if (action === 'profiles') {
      const r = await fetch(`https://api.bufferapp.com/1/profiles.json?access_token=${encodeURIComponent(accessToken)}`);
      const data = await r.json();
      return res.status(200).json(data);
    }

    if (action === 'post') {
      const body = new URLSearchParams();
      body.append('access_token', accessToken);
      body.append('profile_ids[]', profileId);
      body.append('text', text);

      const r = await fetch('https://api.bufferapp.com/1/updates/create.json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString()
      });
      const data = await r.json();
      return res.status(200).json(data);
    }

    return res.status(400).json({ error: 'Unknown action' });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
