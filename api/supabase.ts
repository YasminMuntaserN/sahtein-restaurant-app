import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lfuuhjlfuynjqpufdjfl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmdXVoamxmdXluanFwdWZkamZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzMTkwNjIsImV4cCI6MjA2Mzg5NTA2Mn0.QNdcpPzwpW9d9K66_VoUvtHzbwkU9YQ4wA68D0deVqs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});