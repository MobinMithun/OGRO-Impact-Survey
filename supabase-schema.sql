-- OGRO Impact Survey Database Schema
-- Run this SQL in your Supabase SQL Editor to create the survey_responses table

CREATE TABLE IF NOT EXISTS survey_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Respondent Name (optional, for internal reference)
  name TEXT,
  
  -- Section A - Context
  role TEXT,
  usage_duration TEXT,
  modules_used TEXT[], -- Array of module names
  
  -- Section B - Satisfaction (Likert 1-5)
  reduced_manual_work INTEGER,
  saves_time_daily INTEGER,
  data_accuracy_improved INTEGER,
  easier_tracking INTEGER,
  improved_efficiency INTEGER,
  
  -- Section C - Module Impact Matrix (stored as JSONB)
  module_impact JSONB,
  
  -- Section D - Before vs After
  time_spent_before TEXT,
  time_spent_after TEXT,
  error_frequency_before TEXT,
  error_frequency_after TEXT,
  
  -- Section E - Confidence (Likert 1-5)
  trust_ogro_data INTEGER,
  less_excel_whatsapp INTEGER,
  prefer_ogro_over_old_tools INTEGER,
  
  -- Section F - Optional Text
  biggest_improvement TEXT,
  one_improvement_needed TEXT
);

-- Create an index on created_at for faster queries
CREATE INDEX IF NOT EXISTS idx_survey_responses_created_at ON survey_responses(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to insert (for anonymous surveys)
-- Adjust this based on your security requirements
CREATE POLICY "Allow anonymous inserts" ON survey_responses
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Create a policy that allows reading (adjust based on your needs)
-- For now, allowing authenticated users to read all responses
-- You may want to restrict this further
CREATE POLICY "Allow authenticated reads" ON survey_responses
  FOR SELECT
  TO authenticated
  USING (true);

-- Optional: Create a view for aggregated data (without names)
CREATE OR REPLACE VIEW survey_responses_anonymous AS
SELECT 
  id,
  created_at,
  role,
  usage_duration,
  modules_used,
  reduced_manual_work,
  saves_time_daily,
  data_accuracy_improved,
  easier_tracking,
  improved_efficiency,
  module_impact,
  time_spent_before,
  time_spent_after,
  error_frequency_before,
  error_frequency_after,
  trust_ogro_data,
  less_excel_whatsapp,
  prefer_ogro_over_old_tools,
  biggest_improvement,
  one_improvement_needed
FROM survey_responses;

