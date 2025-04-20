// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// 用你的 Supabase URL 和 Anon key 替換以下內容
const SUPABASE_URL = 'https://niufliollslbmirwkdom.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pdWZsaW9sbHNsYm1pcndrZG9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwNTE1MzIsImV4cCI6MjA2MDYyNzUzMn0.gfVadPg08NnvhvUU_B8ZEhZ_x3peQvRncyrdQl-xlcA';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 命名導出 supabase
export { supabase };
