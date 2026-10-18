import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // Hanya izinkan method POST
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { nama, email, pesan } = req.body;

    if (!nama || !email || !pesan) {
      return res.status(400).json({ success: false, error: 'Semua field wajib diisi' });
    }

    // Ambil variabel dari Vercel Environment Variables yang sudah kita set sebelumnya
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Server configuration error: Supabase keys missing');
    }

    // Inisialisasi Supabase client menggunakan Service Role Key (akses penuh aman di server)
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Masukkan data ke tabel 'messages'
    const { error: dbError } = await supabase
      .from('messages')
      .insert([{ nama, email, pesan }]);

    if (dbError) throw dbError;

    return res.status(200).json({ success: true, message: 'Pesan berhasil disimpan ke database' });
  } catch (err) {
    console.error('API Contact Error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Internal server error' });
  }
}