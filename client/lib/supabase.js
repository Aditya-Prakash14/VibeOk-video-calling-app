import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://apwrmkvhyjipnpswrqly.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwd3Jta3ZoeWppcG5wc3dycWx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1MDEyODcsImV4cCI6MjA4MDA3NzI4N30.0Fbkp_ASKJdSOWhCrwzCwfHYwRCDFwHpJJIQOqmyA6M';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
