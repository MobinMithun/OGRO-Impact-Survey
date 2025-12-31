# Netlify Deployment Setup Guide

This guide will help you configure your OGRO Impact Survey application on Netlify with Supabase integration.

## Prerequisites

- A Netlify account (sign up at [netlify.com](https://www.netlify.com))
- A Supabase project with the database table created (see [SUPABASE_SETUP.md](./SUPABASE_SETUP.md))
- Your Supabase project URL and anon key

## Step 1: Deploy to Netlify

### Option A: Deploy via Git (Recommended)

1. **Push your code to GitHub/GitLab/Bitbucket**
   ```bash
   git add .
   git commit -m "Ready for Netlify deployment"
   git push origin main
   ```

2. **Connect to Netlify**
   - Go to [app.netlify.com](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Select your Git provider and repository
   - Netlify will auto-detect build settings

3. **Configure Build Settings** (if not auto-detected)
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - Click "Deploy site"

### Option B: Deploy via Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Initialize and deploy**
   ```bash
   netlify init
   netlify deploy --prod
   ```

## Step 2: Configure Environment Variables

**This is the most critical step!** Without these, Supabase won't work on Netlify.

1. **Go to your Netlify site dashboard**
   - Navigate to your site → **Site settings** → **Environment variables**

2. **Add the following variables:**

   | Variable Name | Value | Description |
   |--------------|-------|-------------|
   | `VITE_SUPABASE_URL` | `https://your-project.supabase.co` | Your Supabase project URL |
   | `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | Your Supabase anon key |

3. **Where to find your Supabase credentials:**
   - Go to [app.supabase.com](https://app.supabase.com)
   - Select your project
   - Go to **Settings** → **API**
   - Copy:
     - **Project URL** → Use for `VITE_SUPABASE_URL`
     - **anon public** key → Use for `VITE_SUPABASE_ANON_KEY`

4. **Important Notes:**
   - ⚠️ **Variable names MUST start with `VITE_`** for Vite to include them in the build
   - ⚠️ **After adding variables, you MUST redeploy** for changes to take effect
   - ⚠️ Environment variables are case-sensitive

## Step 3: Redeploy After Adding Environment Variables

After adding environment variables, you need to trigger a new deployment:

1. **Option A: Trigger redeploy manually**
   - Go to **Deploys** tab
   - Click **Trigger deploy** → **Deploy site**

2. **Option B: Push a new commit**
   ```bash
   git commit --allow-empty -m "Trigger Netlify rebuild with env vars"
   git push
   ```

3. **Option C: Clear cache and redeploy**
   - Go to **Deploys** tab
   - Click **Trigger deploy** → **Clear cache and deploy site**

## Step 4: Verify the Deployment

1. **Check the build logs**
   - Go to **Deploys** tab
   - Click on the latest deploy
   - Check for any build errors
   - Look for console logs showing Supabase configuration status

2. **Test the application**
   - Open your Netlify site URL
   - Open browser DevTools (F12) → Console tab
   - Look for Supabase configuration logs:
     - ✅ `🔍 Supabase Configuration Check: { isConfigured: true, ... }` = Good!
     - ⚠️ `⚠️ Supabase configuration incomplete` = Environment variables missing

3. **Test form submission**
   - Fill out the survey form
   - Submit it
   - Check browser console for:
     - `🔄 Saving to Supabase...`
     - `✅ Successfully saved to Supabase`
   - Check your Supabase dashboard → Table Editor → `survey_responses` table

4. **Test the Impact Dashboard**
   - Navigate to `/impact` page
   - Check the data source indicator:
     - ✅ Green "Data from Supabase" = Working!
     - ⚠️ Yellow "Supabase not configured" = Missing env vars
     - ⚠️ Red "Using localStorage" = Supabase error (check console)

## Troubleshooting

### Issue: "Supabase not configured" message on dashboard

**Cause:** Environment variables not set or not loaded

**Solution:**
1. Verify variables are set in Netlify dashboard
2. Check variable names start with `VITE_`
3. Redeploy the site after adding variables
4. Check browser console for configuration logs

### Issue: Form submissions not saving to Supabase

**Cause:** Environment variables incorrect or RLS policies blocking

**Solution:**
1. Verify environment variables in Netlify dashboard
2. Check Supabase RLS policies allow anonymous inserts
3. Check browser console for error messages
4. Verify Supabase table exists and has correct schema

### Issue: Dashboard shows "Using localStorage" even after setting env vars

**Cause:** Build happened before env vars were set, or env vars not redeployed

**Solution:**
1. Clear cache and redeploy in Netlify
2. Verify env vars are set correctly
3. Check browser console for specific error messages
4. Test Supabase connection directly (see below)

### Issue: Build succeeds but app doesn't work

**Cause:** Environment variables not included in build

**Solution:**
1. Ensure variable names start with `VITE_`
2. Redeploy after adding variables
3. Check build logs for any warnings
4. Verify variables are in "Environment variables" not "Build environment variables"

## Testing Supabase Connection

You can test if Supabase is working by checking the browser console:

1. Open your Netlify site
2. Open DevTools (F12) → Console
3. Look for these logs:
   ```
   🔍 Supabase Configuration Check: {
     environment: 'production',
     hasUrl: true,
     hasKey: true,
     isConfigured: true,
     ...
   }
   ```

If `isConfigured: false`, your environment variables are not set correctly.

## Environment Variable Best Practices

1. **Never commit `.env` files** - They're already in `.gitignore`
2. **Use Netlify's environment variables** for production secrets
3. **Use different Supabase projects** for development and production (optional but recommended)
4. **Rotate keys** if they're accidentally exposed
5. **Use Netlify's environment variable scopes** (Build-time vs Runtime)

## Additional Resources

- [Netlify Environment Variables Docs](https://docs.netlify.com/environment-variables/overview/)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Supabase Setup Guide](./SUPABASE_SETUP.md)

---

**Need Help?** Check the browser console for detailed error messages and Supabase configuration status.

