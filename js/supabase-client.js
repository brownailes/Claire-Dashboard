/* ============================================
   JARVIS-Yooha — Supabase Client Wrapper
   ============================================ */

const SupabaseClient = (() => {
  const supabaseUrl = 'https://eftkaseohtuskodbceeq.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmdGthc2VvaHR1c2tvZGJjZWVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1OTIxNjksImV4cCI6MjA5MjE2ODE2OX0.ISwRSLhzwyArIuVf8bcLAjHoxiX-DGZReoTuoK0PmwI';
  
  if (typeof supabase === 'undefined') {
    throw new Error('Supabase client script not loaded.');
  }

  const client = supabase.createClient(supabaseUrl, supabaseKey);

  return {
    client
  };
})();
