DROP DATABASE IF EXISTS foodfy;
CREATE DATABASE foodfy;

-- RECIPES TABLE

CREATE TABLE "recipes" (
  "id" SERIAL UNIQUE PRIMARY KEY,
  "chef_id" int,
  "user_id" int,
  "title" text,
  "ingredients" text[],
  "preparation" text[],
  "information" text,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now())
);

-- CHEFS TABLE

CREATE TABLE "chefs" (
  "id" SERIAL UNIQUE PRIMARY KEY,
  "name" text,
  "file_id" int,
  "created_at" timestamp DEFAULT (now())
);

-- FILES TABLE

CREATE TABLE "files" (
  "id" SERIAL PRIMARY KEY,
  "name" text,
  "path" text NOT NULL
);

-- RECIPE FILES TABLE

CREATE TABLE "recipe_files" (
  "id" SERIAL PRIMARY KEY,
  "recipe_id" INTEGER REFERENCES recipes(id),
  "file_id" INTEGER REFERENCES files(id)
);

-- USERS TABLE

CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT UNIQUE NOT NULL,
  "password" TEXT NOT NULL,
  "reset_token" TEXT,
  "reset_token_expires" TEXT,
  "is_admin" BOOLEAN DEFAULT false,
  "created_at" TIMESTAMP DEFAULT(now()),
  "updated_at" TIMESTAMP DEFAULT(now())
);

-- CREATE PROCEDURE

CREATE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- AUTO UPDATE OF PRODUCTS

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON recipes
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp()

-- AUTO UPDATE OF USERS

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp()

-- SESSION TABLE

CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "session" 
ADD CONSTRAINT "session_pkey" 
PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- FOREIGN KEYS

ALTER TABLE "recipes" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");
ALTER TABLE "chefs" ADD FOREIGN KEY ("file_id") REFERENCES "files" ("id");

-- TO RUN SEEDS

DELETE FROM chefs;
DELETE FROM users;
DELETE FROM recipes;
DELETE FROM files;
DELETE FROM recipe_files;

-- RESTART SEQUENCE AUTO_INCREMENT FROM TABLES IDS

ALTER SEQUENCE recipes_id_seq RESTART WITH 1;
ALTER SEQUENCE chefs_id_seq RESTART WITH 1;
ALTER SEQUENCE users_id_seq RESTART WITH 1;
ALTER SEQUENCE files_id_seq RESTART WITH 1;
ALTER SEQUENCE recipe_files_id_seq RESTART WITH 1;