/*
 * window.storage shim — Supabase-backed.
 * The original app was built against a sandboxed host that exposes an async
 * key-value store as window.storage.{get,set,delete}. This shim reproduces
 * that exact interface on top of a single Supabase table (app_storage, see
 * supabase/schema.sql) so the rest of the app (see js/app.js) runs
 * unmodified against a real database.
 */
(function(){
  const { url, anonKey } = window.SUPABASE_CONFIG || {};
  if(!url || !anonKey){
    console.error('Supabase 설정이 없습니다. js/supabase-config.js를 확인하세요.');
  }
  const client = supabase.createClient(url, anonKey);
  const TABLE = 'app_storage';

  window.storage = {
    async get(key){
      const { data, error } = await client.from(TABLE).select('value').eq('key', key).maybeSingle();
      if(error){
        // storageGetWithRetry() in app.js retries/handles failures based on
        // this exact phrase, matching the original host's error convention.
        throw new Error('internal server error: ' + error.message);
      }
      if(!data) return null;
      return { value: JSON.stringify(data.value) };
    },
    async set(key, value){
      try{
        const { error } = await client.from(TABLE).upsert({
          key, value: JSON.parse(value), updated_at: new Date().toISOString()
        });
        if(error){ console.error('storage.set failed:', error); return false; }
        return true;
      }catch(e){ console.error('storage.set failed:', e); return false; }
    },
    async delete(key){
      const { error } = await client.from(TABLE).delete().eq('key', key);
      if(error){ console.error('storage.delete failed:', error); return false; }
      return true;
    }
  };
})();
