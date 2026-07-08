## Setting up Supabase

1. Create a new project at https://supabase.com/dashboard.
2. In the SQL editor, run the migrations in this folder in order: `0001_schema.sql`, `0002_rls.sql`, `0003_storage.sql`.
3. In Project Settings > API, copy the Project URL and `anon public` key.
4. Copy `.env.local.example` to `.env.local` in the project root and fill in the two values.
5. In Authentication > Providers, make sure Email is enabled. For local dev, you can disable "Confirm email" under Authentication > Settings if you want to skip email verification while testing.
