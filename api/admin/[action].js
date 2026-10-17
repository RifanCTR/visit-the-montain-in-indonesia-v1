import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function reply(res, status, body) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  return res.status(status).json(body);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return reply(res, 405, { error: 'Method not allowed' });
  if (!supabaseUrl || !serviceRoleKey) return reply(res, 500, { error: 'Server auth is not configured' });

  const origin = req.headers.origin;
  const expectedOrigin = process.env.APP_ORIGIN;
  if (expectedOrigin && origin && origin !== expectedOrigin) {
    return reply(res, 403, { error: 'Origin not allowed' });
  }

  const action = String(req.query.action || '');
  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  // Login langsung cek username & password ke tabel 'admins'
  if (action === 'login') {
    const username = typeof req.body?.username === 'string' ? req.body.username.trim() : '';
    const password = typeof req.body?.password === 'string' ? req.body.password : '';
    
    if (!username || !password) {
      return reply(res, 400, { error: 'Username and password are required' });
    }

    const { data: adminRow, error: lookupError } = await admin
      .from('admins')
      .select('*')
      .eq('username', username)
      .eq('password', password)
      .maybeSingle();

    if (lookupError || !adminRow) {
      return reply(res, 401, { error: 'Invalid username or password' });
    }

    // Berikan token sesi sukses ke frontend
    return reply(res, 200, { success: true, username: adminRow.username });
  }

  // Untuk aksi lainnya (messages, visitors, delmsg, dll)
  try {
    if (action === 'check') return reply(res, 200, { ok: true });
    
    if (action === 'messages') {
      const { data, error } = await admin.from('messages')
        .select('id,created_at,nama,email,pesan')
        .order('created_at', { ascending: false }).limit(100);
      if (error) return reply(res, 400, { error: 'Could not retrieve messages' });
      return reply(res, 200, { data: data || [] });
    }
    
    if (action === 'visitors') {
      const { data, error } = await admin.from('visitors')
        .select('created_at,ip_address,device_info')
        .order('created_at', { ascending: false }).limit(100);
      if (error) return reply(res, 400, { error: 'Could not retrieve visitor records' });
      return reply(res, 200, { data: data || [] });
    }
    
    if (action === 'delmsg') {
      const id = req.body?.id;
      if (!id) return reply(res, 400, { error: 'Valid message ID required' });
      const { error } = await admin.from('messages').delete().eq('id', id);
      if (error) return reply(res, 400, { error: 'Could not delete message record' });
      return reply(res, 200, { ok: true });
    }
    
    return reply(res, 404, { error: 'Unknown admin action' });
  } catch {
    return reply(res, 500, { error: 'Unexpected server error' });
  }
}