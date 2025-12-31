# Impact Page Troubleshooting Guide

## Quick Checks

### 1. Check Browser Console
Open your browser's Developer Tools (F12) and check the Console tab for any errors.

### 2. Verify the Route
- Make sure you're navigating to: `http://localhost:5173/impact`
- Not: `http://localhost:5173/impact/` (trailing slash)

### 3. Check if Dev Server is Running
```bash
npm run dev
```
You should see: `Local: http://localhost:5173/`

### 4. Test Direct Navigation
Try typing `/impact` directly in the browser address bar after the localhost URL.

## Common Issues

### Issue: Blank Page
**Solution**: Check browser console for JavaScript errors

### Issue: "Cannot read property of undefined"
**Solution**: The context might not be loading. Check if SurveyProvider is wrapping the routes.

### Issue: Page Shows "Loading..." Forever
**Solution**: 
1. Check if Supabase is configured in `.env`
2. Check browser console for network errors
3. The page should fallback to localStorage automatically

### Issue: 404 Not Found
**Solution**: 
- Make sure you're using React Router
- Check `src/App.tsx` has the route defined
- Restart the dev server

## Manual Test

1. **Open browser console** (F12)
2. **Navigate to** `/impact`
3. **Check for errors** in console
4. **Share the error message** if any

## Quick Fix: Reset to localStorage Only

If Supabase is causing issues, you can temporarily disable it:

1. Rename `.env` to `.env.backup`
2. Restart dev server
3. The app will use localStorage only

