export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { nama, email, pesan } = req.body;

  if (!nama || !email || !pesan) {
    return res.status(400).json({ error: 'Field tidak boleh kosong' });
  }

  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  if (!BOT_TOKEN || !CHAT_ID) {
    return res.status(500).json({ error: 'Server environment variable belum diset' });
  }

  const textMessage = `Pesan Baru dari Website:\n\n` +
                      `Nama: ${nama}\n` +
                      `Email: ${email}\n` +
                      `Pesan: ${pesan}`;

  try {
    const telegramRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: textMessage
      })
    });

    const data = await telegramRes.json();

    if (data.ok) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(500).json({ success: false, error: data.description });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}