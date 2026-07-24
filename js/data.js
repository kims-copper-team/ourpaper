/*
 * Supabase client + auth helpers.
 * Replaces the old single-user window.storage KV shim now that the app has
 * real accounts and per-project membership (see supabase/002_auth_and_membership.sql).
 * Project/profile CRUD lives directly in js/app.js (window.sb.from(...)),
 * mirroring how those queries were already written inline there.
 */
(function(){
  const { url, anonKey } = window.SUPABASE_CONFIG || {};
  if(!url || !anonKey){
    console.error('Supabase 설정이 없습니다. js/supabase-config.js를 확인하세요.');
  }
  window.sb = supabase.createClient(url, anonKey, {
    auth: { persistSession: true, autoRefreshToken: true }
  });

  window.authSignUp = async function(email, password){
    const redirectTo = window.location.origin + window.location.pathname;
    const { data, error } = await window.sb.auth.signUp({ email, password, options: { emailRedirectTo: redirectTo } });
    return { user: data && data.user, session: data && data.session, error };
  };

  window.authSignIn = async function(email, password){
    const { data, error } = await window.sb.auth.signInWithPassword({ email, password });
    return { user: data && data.user, session: data && data.session, error };
  };

  window.authSignOut = async function(){
    const { error } = await window.sb.auth.signOut();
    return { error };
  };

  window.getSession = async function(){
    const { data, error } = await window.sb.auth.getSession();
    if(error) return null;
    return data.session;
  };

  window.onAuthStateChange = function(cb){
    window.sb.auth.onAuthStateChange((event, session) => cb(event, session));
  };

  // 로그인한 사용자의 profiles 행. 방금 가입해서 트리거가 아직 처리 중일
  // 수도 있으니 짧게 재시도한다.
  window.getMyProfile = async function(attempts = 4){
    const session = await window.getSession();
    if(!session) return null;
    for(let i=0; i<attempts; i++){
      const { data, error } = await window.sb.from('profiles').select('*').eq('id', session.user.id).maybeSingle();
      if(!error && data) return data;
      await new Promise(res => setTimeout(res, 350));
    }
    return null;
  };
})();
