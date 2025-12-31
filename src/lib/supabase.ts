import { createClient } from '@supabase/supabase-js';

// Supabase configuration
// Get these from your Supabase project settings: https://app.supabase.com
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Enhanced logging for production debugging
const isProduction = import.meta.env.PROD;
const hasUrl = !!supabaseUrl;
const hasKey = !!supabaseAnonKey;
const isConfigured = hasUrl && hasKey;

if (isProduction) {
  // In production (Netlify), log diagnostic info
  console.log('🔍 Supabase Configuration Check:', {
    environment: 'production',
    hasUrl: hasUrl,
    hasKey: hasKey,
    isConfigured: isConfigured,
    urlLength: supabaseUrl.length,
    keyLength: supabaseAnonKey.length,
    urlPrefix: supabaseUrl.substring(0, 20) + '...',
  });
}

if (!isConfigured) {
  const missingVars = [];
  if (!hasUrl) missingVars.push('VITE_SUPABASE_URL');
  if (!hasKey) missingVars.push('VITE_SUPABASE_ANON_KEY');
  
  console.warn(
    `⚠️ Supabase configuration incomplete. Missing: ${missingVars.join(', ')}\n` +
    'The app will continue to work with localStorage as fallback.\n' +
    (isProduction 
      ? '💡 To fix: Add environment variables in Netlify dashboard → Site settings → Environment variables'
      : '💡 To fix: Add these to your .env file')
  );
}

// Use placeholder values if env vars are missing to prevent app crash
const safeUrl = supabaseUrl || 'https://placeholder.supabase.co';
const safeKey = supabaseAnonKey || 'placeholder-key';

export const supabase = createClient(safeUrl, safeKey);

// Helper to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return isConfigured;
};

// Get configuration status for UI display
export const getSupabaseConfigStatus = () => {
  return {
    isConfigured,
    hasUrl,
    hasKey,
    url: hasUrl ? supabaseUrl.substring(0, 30) + '...' : 'Not set',
  };
};

