CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
	"sess" json NOT NULL,
	"expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE TABLE users (
  user_id varchar(255) NOT NULL PRIMARY KEY,
  type varchar(50),
  user_created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE tasks (
  task_id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id varchar(255) NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  task_name varchar(255) NOT NULL,
  task_duration numeric NOT NULL,
  task_consumed numeric NOT NULL DEFAULT 0,
  task_created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  task_updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
