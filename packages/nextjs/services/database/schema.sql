-- Create users table
CREATE TABLE users (
  id text PRIMARY KEY,
  role text DEFAULT 'anonymous' CHECK (role IN ('anonymous', 'builder', 'admin')),
  function text,
  creation_timestamp bigint,
  ens text,
  social_links jsonb,
  status jsonb,
  graduated jsonb,
  batch jsonb,
  builder_cohort jsonb,
  stream jsonb,
  builds jsonb,
  created_at timestamp with time zone DEFAULT now()
);

-- Create grants table
CREATE TABLE grants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  ask_amount decimal NOT NULL,
  builder text NOT NULL,
  link text,
  status text DEFAULT 'proposed' CHECK (status IN ('proposed', 'approved', 'submitted', 'completed', 'rejected')),
  approved_tx text,
  completed_tx text,
  note text,
  tx_chain_id text,
  proposed_at bigint,
  approved_at bigint,
  submitted_at bigint,
  completed_at bigint,
  rejected_at bigint,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create grant_private_notes table
CREATE TABLE grant_private_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  grant_id uuid NOT NULL REFERENCES grants(id) ON DELETE CASCADE,
  note text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create events table for cohort withdrawals and other events
CREATE TABLE events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  timestamp bigint NOT NULL,
  signature text,
  payload jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_grants_status ON grants(status);
CREATE INDEX idx_grants_builder ON grants(builder);
CREATE INDEX idx_grants_created_at ON grants(created_at);
CREATE INDEX idx_events_type ON events(type);
CREATE INDEX idx_grant_private_notes_grant_id ON grant_private_notes(grant_id);

-- Enable RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE grants ENABLE ROW LEVEL SECURITY;
ALTER TABLE grant_private_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users" ON users FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON users FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON users FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for all users" ON grants FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON grants FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON grants FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for all users" ON grant_private_notes FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON grant_private_notes FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON grant_private_notes FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for all users" ON events FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON events FOR INSERT WITH CHECK (auth.role() = 'authenticated'); 