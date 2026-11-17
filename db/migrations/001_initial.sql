CREATE TABLE IF NOT EXISTS profiles (
  github_id text PRIMARY KEY,
  username text NOT NULL,
  opt_in boolean NOT NULL DEFAULT false,
  progress jsonb NOT NULL DEFAULT '{"version":1,"learned":[],"completed":[],"bookmarks":{},"mistakes":{},"lastLesson":null}'::jsonb,
  revision integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS verified_terms (
  github_id text NOT NULL REFERENCES profiles(github_id) ON DELETE CASCADE,
  term_id text NOT NULL,
  verified_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (github_id,term_id)
);
