CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  roles TEXT[] NOT NULL,
  email_verified_at TIMESTAMPTZ,
  verification_token_hash TEXT UNIQUE,
  verification_token_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL,
  CONSTRAINT users_roles_not_empty CHECK (cardinality(roles) > 0),
  CONSTRAINT users_roles_allowed CHECK (
    roles <@ ARRAY['contratante', 'profissional']::TEXT[]
  )
);

CREATE INDEX IF NOT EXISTS users_verification_token_hash_idx
  ON users (verification_token_hash)
  WHERE verification_token_hash IS NOT NULL;
