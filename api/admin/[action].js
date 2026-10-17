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

  if (action === 'login') {
    const username = typeof req.body?.username === 'string' ? req.body.username.trim() : '';
    const password = typeof req.body?.password === 'string' ? req.body.password : '';
    if (!username || !password || username.length > 64 || password.length > 1024) {
      return reply(res, 400, { error: 'Username and password are required' });
    }

    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false }
    });

    const { data: account, error: lookupError } = await admin
      .from('admin_users')
      .select('user_id, login_email')
      .eq('username', username)
      .maybeSingle();

    if (lookupError) return reply(res, 500, { error: 'Could not verify administrator account' });
    if (!account?.login_email || !account?.user_id) return reply(res, 401, { error: 'Invalid username or password' });

    const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;
    if (!publishableKey) return reply(res, 500, { error: 'Login is not configured' });

    const authClient = createClient(supabaseUrl, publishableKey, {
      auth: { persistSession: false, autoRefreshToken: false }
    });

    const { data: signInData, error: signInError } = await authClient.auth.signInWithPassword({
      email: account.login_email,
      password
    });

    if (signInError || !signInData?.session || signInData.user?.id !== account.user_id) {
      return reply(res, 401, { error: 'Invalid username or password' });
    }
    return reply(res, 200, { session: signInData.session });
  }

  const match = /^Bearer\s+(.+)$/i.exec(req.headers.authorization || '');
  if (!match) return reply(res, 401, { error: 'Authentication required' });

  const token = match[1];
  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  const { data: userData, error: userError } = await admin.auth.getUser(token);
  if (userError || !userData?.user) return reply(res, 401, { error: 'Invalid or expired session' });

  const { data: adminRow, error: adminError } = await admin
    .from('admin_users')
    .select('user_id')
    .eq('user_id', userData.user.id)
    .maybeSingle();

  if (adminError) return reply(res, 500, { error: 'Could not verify administrator role' });
  if (!adminRow) return reply(res, 403, { error: 'Administrator access required' });

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
      if ((typeof id !== 'string' && typeof id !== 'number') || String(id).length < 1 || String(id).length > 100) {
        return reply(res, 400, { error: 'Valid message ID required' });
      }
      const { error } = await admin.from('messages').delete().eq('id', id);
      if (error) return reply(res, 400, { error: 'Could not delete message record' });
      return reply(res, 200, { ok: true });
    }
    return reply(res, 404, { error: 'Unknown admin action' });
  } catch {
    return reply(res, 500, { error: 'Unexpected server error' });
  }
}