-- Add authentication tables for NextAuth.js
CREATE TABLE IF NOT EXISTS "accounts" (
    id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    type TEXT NOT NULL,
    provider TEXT NOT NULL,
    provider_account_id TEXT NOT NULL,
    refresh_token TEXT,
    access_token TEXT,
    expires_at INTEGER,
    token_type TEXT,
    scope TEXT,
    id_token TEXT,
    session_state TEXT,
    CONSTRAINT accounts_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS "sessions" (
    id TEXT NOT NULL,
    session_token TEXT NOT NULL,
    user_id TEXT NOT NULL,
    expires TIMESTAMP(3) NOT NULL,
    CONSTRAINT sessions_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS "users" (
    id TEXT NOT NULL,
    name TEXT,
    email TEXT NOT NULL,
    email_verified TIMESTAMP(3),
    image TEXT,
    password TEXT,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS "verification_tokens" (
    identifier TEXT NOT NULL,
    token TEXT NOT NULL,
    expires TIMESTAMP(3) NOT NULL
);

-- Create indexes
CREATE UNIQUE INDEX IF NOT EXISTS "accounts_provider_provider_account_id_key" ON "accounts"("provider", "provider_account_id");
CREATE UNIQUE INDEX IF NOT EXISTS "sessions_session_token_key" ON "sessions"("session_token");
CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX IF NOT EXISTS "verification_tokens_token_key" ON "verification_tokens"("token");
CREATE UNIQUE INDEX IF NOT EXISTS "verification_tokens_identifier_token_key" ON "verification_tokens"("identifier", "token");

-- Add foreign keys
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Link profiles to users
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "user_id" TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS "profiles_user_id_key" ON "profiles"("user_id");
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
