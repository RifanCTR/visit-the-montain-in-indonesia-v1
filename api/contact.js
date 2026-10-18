import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { nama, email, pesan } = req.body;

    if (!nama || !email || !pesan) {
      return res.status(400).json({ success: false, error: 'Semua field wajib diisi' });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Server configuration error: Supabase keys missing');
    }

    // 1. Simpan pesan ke database Supabase
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { error: dbError } = await supabase
      .from('messages')
      .insert([{ nama, email, pesan }]);

    if (dbError) throw dbError;

    // 2. Kirim notifikasi polos tanpa emoji ke Telegram Bot
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (botToken && chatId) {
      const text = `PESAN BARU MASUK - MOUNTAIN\n\nNama: ${nama}\nEmail: ${email}\nPesan: ${pesan}`;
      
      const teleUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
      await fetch(teleUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: text
        })
      }).catch(err => console.error('Telegram notification failed:', err));
    }

    return res.status(200).json({ success: true, message: 'Pesan berhasil disimpan dan dikirim ke Telegram' });
  } catch (err) {
    console.error('API Contact Error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Internal server error' });
  }
}