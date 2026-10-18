import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return res.status(500).json({ success: false, error: 'Supabase environment variables missing' });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return res.status(200).json({ success: true, data });
    }

    if (req.method === 'POST') {
      const { nama, pesan } = req.body;
      if (!nama || !pesan) {
        return res.status(400).json({ success: false, error: 'Nama dan pesan wajib diisi' });
      }

      const { error } = await supabase
        .from('comments')
        .insert([{ nama, pesan, likes: 0, dislikes: 0 }]);

      if (error) throw error;
      return res.status(200).json({ success: true, message: 'Komentar berhasil dikirim' });
    }

    if (req.method === 'PUT') {
      const { id, likes, dislikes } = req.body;
      if (!id) {
        return res.status(400).json({ success: false, error: 'ID komentar diperlukan' });
      }

      const { error } = await supabase
        .from('comments')
        .update({ likes, dislikes })
        .eq('id', id);

      if (error) throw error;
      return res.status(200).json({ success: true, message: 'Reaksi diperbarui' });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (err) {
    console.error('API Comments Error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Internal server error' });
  }
}