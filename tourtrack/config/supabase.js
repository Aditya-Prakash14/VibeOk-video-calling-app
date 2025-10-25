import { createClient } from '@supabase/supabase-js';

// Replace with your actual Supabase URL and anon key
const supabaseUrl = 'https://dbmvayybiacsufdrkmhc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRibXZheXliaWFjc3VmZHJrbWhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4MDg1NTksImV4cCI6MjA3MjM4NDU1OX0.cRVR1DhQzGpac2dDx-gCFok9F1dw1vJx8Fr7HNMRVxA';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Demo user data for testing
export const DEMO_USER = {
  id: 'demo-user-123',
  email: 'demo@tourist.com',
  first_name: 'John',
  last_name: 'Doe',
  phone: '+1-555-0123',
  nationality: 'American',
  passport_number: 'US123456789',
  emergency_contact_name: 'Jane Doe',
  emergency_contact_phone: '+1-555-0124',
  emergency_contact_relationship: 'Spouse'
};

// Demo login credentials
export const DEMO_CREDENTIALS = {
  email: 'demo@tourist.com',
  password: 'demo123'
};

// SQL to create the Tourist Safety App database tables:
/*
-- 1. Create tourists table for user profiles
CREATE TABLE tourists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  nationality VARCHAR(100),
  passport_number VARCHAR(50),
  date_of_birth DATE,
  emergency_contact_name VARCHAR(255),
  emergency_contact_phone VARCHAR(20),
  emergency_contact_relationship VARCHAR(100),
  profile_picture_url TEXT,
  current_location_country VARCHAR(100),
  current_location_city VARCHAR(100),
  travel_insurance_provider VARCHAR(255),
  travel_insurance_policy VARCHAR(100),
  medical_conditions TEXT,
  allergies TEXT,
  blood_group VARCHAR(10),
  preferred_language VARCHAR(50) DEFAULT 'english',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- 2. Update SOS alerts table to link with tourists
DROP TABLE IF EXISTS sos_alerts;
CREATE TABLE sos_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tourist_id UUID REFERENCES tourists(id) ON DELETE CASCADE,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  address TEXT,
  emergency_type VARCHAR(100) DEFAULT 'general',
  message TEXT,
  device_info JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by VARCHAR(255),
  local_emergency_services_contacted BOOLEAN DEFAULT FALSE,
  embassy_contacted BOOLEAN DEFAULT FALSE
);

-- 3. Create travel itinerary table
CREATE TABLE travel_itinerary (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tourist_id UUID REFERENCES tourists(id) ON DELETE CASCADE,
  destination_country VARCHAR(100) NOT NULL,
  destination_city VARCHAR(100) NOT NULL,
  arrival_date DATE NOT NULL,
  departure_date DATE,
  accommodation_name VARCHAR(255),
  accommodation_address TEXT,
  accommodation_phone VARCHAR(20),
  local_contact_name VARCHAR(255),
  local_contact_phone VARCHAR(20),
  planned_activities TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create safety check-ins table
CREATE TABLE safety_checkins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tourist_id UUID REFERENCES tourists(id) ON DELETE CASCADE,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  address TEXT,
  status VARCHAR(50) DEFAULT 'safe', -- safe, help_needed, emergency
  message TEXT,
  check_in_type VARCHAR(50) DEFAULT 'manual', -- manual, automatic, scheduled
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create emergency contacts table
CREATE TABLE emergency_contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tourist_id UUID REFERENCES tourists(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  relationship VARCHAR(100),
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE tourists ENABLE ROW LEVEL SECURITY;
ALTER TABLE sos_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE travel_itinerary ENABLE ROW LEVEL SECURITY;
ALTER TABLE safety_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for tourists (users can only access their own data)
CREATE POLICY "Users can insert own profile" ON tourists FOR INSERT WITH CHECK (auth.uid()::text = id::text);
CREATE POLICY "Users can view own profile" ON tourists FOR SELECT USING (auth.uid()::text = id::text);
CREATE POLICY "Users can update own profile" ON tourists FOR UPDATE USING (auth.uid()::text = id::text);

-- Create RLS policies for SOS alerts
CREATE POLICY "Users can insert own SOS alerts" ON sos_alerts FOR INSERT WITH CHECK (auth.uid()::text = tourist_id::text);
CREATE POLICY "Users can view own SOS alerts" ON sos_alerts FOR SELECT USING (auth.uid()::text = tourist_id::text);
CREATE POLICY "Admins can view all SOS alerts" ON sos_alerts FOR SELECT USING (true); -- For emergency responders

-- Similar policies for other tables
CREATE POLICY "Users can manage own itinerary" ON travel_itinerary FOR ALL USING (auth.uid()::text = tourist_id::text);
CREATE POLICY "Users can manage own check-ins" ON safety_checkins FOR ALL USING (auth.uid()::text = tourist_id::text);
CREATE POLICY "Users can manage own emergency contacts" ON emergency_contacts FOR ALL USING (auth.uid()::text = tourist_id::text);

-- Create indexes for better performance
CREATE INDEX idx_tourists_email ON tourists(email);
CREATE INDEX idx_sos_alerts_tourist_id ON sos_alerts(tourist_id);
CREATE INDEX idx_sos_alerts_created_at ON sos_alerts(created_at);
CREATE INDEX idx_safety_checkins_tourist_id ON safety_checkins(tourist_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_tourists_updated_at BEFORE UPDATE ON tourists FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_travel_itinerary_updated_at BEFORE UPDATE ON travel_itinerary FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
*/
/*
CREATE TABLE sos_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_name VARCHAR(255) NOT NULL,
  user_phone VARCHAR(20),
  user_email VARCHAR(255),
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  address TEXT,
  emergency_type VARCHAR(100) DEFAULT 'general',
  message TEXT,
  device_info JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by VARCHAR(255)
);

-- Enable Row Level Security
ALTER TABLE sos_alerts ENABLE ROW LEVEL SECURITY;

-- Create policy to allow insert for all users
CREATE POLICY "Allow insert for all users" ON sos_alerts FOR INSERT WITH CHECK (true);

-- Create policy to allow select for all users (for website dashboard)
CREATE POLICY "Allow select for all users" ON sos_alerts FOR SELECT USING (true);

-- Create policy to allow update for all users (for resolving alerts)
CREATE POLICY "Allow update for all users" ON sos_alerts FOR UPDATE USING (true);
*/
