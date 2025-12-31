# Supabase Setup Guide

This guide will help you integrate Supabase with your OGRO Impact Survey application.

## Step 1: Create a Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - **Project Name**: `ogro-impact-survey` (or your preferred name)
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose the closest region to your users
5. Click "Create new project" and wait for it to be ready (~2 minutes)

## Step 2: Get Your API Keys

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (under "Project URL")
   - **anon public** key (under "Project API keys")

## Step 3: Create Environment Variables

1. Create a `.env` file in the root of your project (same level as `package.json`)
2. Add your Supabase credentials:

```env
VITE_SUPABASE_URL=your-project-url-here
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Example:**
```env
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **Important**: 
- Never commit `.env` to Git (it's already in `.gitignore`)
- The `.env.example` file shows the format without real values

## Step 4: Create the Database Table

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy and paste the entire contents of `supabase-schema.sql`
4. Click "Run" (or press Ctrl+Enter)
5. You should see "Success. No rows returned"

The table `survey_responses` is now created with:
- All survey fields
- Automatic timestamps
- Row Level Security (RLS) enabled
- Policies for anonymous inserts and authenticated reads

## Step 5: Verify the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Fill out and submit a survey form
3. Check your Supabase dashboard:
   - Go to **Table Editor**
   - Select `survey_responses` table
   - You should see your submitted survey data

## Step 6: Configure Row Level Security (Optional)

The default setup allows:
- **Anyone** to insert survey responses (anonymous surveys)
- **Authenticated users** to read all responses

To customize security:

1. Go to **Authentication** → **Policies** in Supabase
2. Click on `survey_responses` table
3. Modify or create policies as needed

**Example: Restrict reads to admin users only:**
```sql
-- Drop existing policy
DROP POLICY IF EXISTS "Allow authenticated reads" ON survey_responses;

-- Create new policy for admin only
CREATE POLICY "Admin only reads" ON survey_responses
  FOR SELECT
  TO authenticated
  USING (
    auth.jwt() ->> 'email' IN (
      'admin@yourcompany.com',
      'manager@yourcompany.com'
    )
  );
```

## Troubleshooting

### "Failed to load survey responses"
- Check that your `.env` file has correct values
- Verify the table exists in Supabase
- Check browser console for detailed error messages

### "Invalid API key"
- Make sure you're using the **anon public** key, not the service role key
- Verify the key is correctly copied (no extra spaces)

### "relation does not exist"
- Run the SQL schema from `supabase-schema.sql` again
- Check that the table name is exactly `survey_responses`

### Data not appearing
- Check Supabase dashboard → Table Editor
- Verify RLS policies allow your operation
- Check browser console for errors

## Features

✅ **Automatic backups**: Data is stored in Supabase cloud database  
✅ **Real-time sync**: Multiple users can submit simultaneously  
✅ **Scalable**: Handles thousands of responses  
✅ **Secure**: Row Level Security protects your data  
✅ **Fallback**: Falls back to localStorage if Supabase is unavailable  

## Next Steps

- Set up authentication if you want user accounts
- Create views for aggregated analytics
- Set up database backups
- Configure email notifications for new submissions

## Support

For Supabase help:
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)

