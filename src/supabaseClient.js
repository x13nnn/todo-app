// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://niufliollslbmirwkdom.supabase.co'; // 用你的 Supabase URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pdWZsaW9sbHNsYm1pcndrZG9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwNTE1MzIsImV4cCI6MjA2MDYyNzUzMn0.gfVadPg08NnvhvUU_B8ZEhZ_x3peQvRncyrdQl-xlcA'; // 用你的 Supabase 公開 API 金鑰
export const supabase = createClient(supabaseUrl, supabaseKey);
