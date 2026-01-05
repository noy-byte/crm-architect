# Netlify Deployment Steps

## Your Repository
- **GitHub**: https://github.com/noy-byte/crm-architect.git
- **Branch**: main
- **Status**: ✅ Code pushed and ready

## Deploy to Netlify

### Step 1: Go to Netlify Dashboard
Visit: https://app.netlify.com

### Step 2: Connect Repository

**If you DON'T have a site yet:**
1. Click **"Add new site"** → **"Import an existing project"**
2. Choose **"GitHub"** (or your Git provider)
3. Authorize Netlify if needed
4. Search for **"crm-architect"** repository
5. Click **"Import"**

**If you ALREADY have a site:**
1. Go to your site dashboard
2. Click **"Site settings"** → **"Build & deploy"**
3. Under **"Connected repository"**, verify it's connected to `noy-byte/crm-architect`
4. If not connected, click **"Link repository"** and select it

### Step 3: Configure Build Settings

Netlify should auto-detect from `netlify.toml`, but verify:

- **Build command**: (leave empty - no build needed)
- **Publish directory**: `public`
- **Functions directory**: `netlify/functions`

### Step 4: Deploy

**If new site:**
- Click **"Deploy site"** button

**If existing site:**
- Click **"Trigger deploy"** → **"Deploy site"**
- Or wait for auto-deploy (should happen automatically)

### Step 5: Wait for Deployment

- Build typically takes 2-3 minutes
- Watch the deploy log for any errors
- Status will show "Published" when done

### Step 6: Test Your Site

1. **Visit your site URL** (e.g., `https://your-site-name.netlify.app`)

2. **Test API endpoint:**
   ```
   https://your-site-name.netlify.app/.netlify/functions/api/proposals
   ```
   Should return: `[]` (empty array) or list of proposals

3. **Test the app:**
   - Click "ארכיון" (Archive) button
   - Should load without errors
   - Try creating a proposal

## Quick Test Commands

After deployment, test these URLs:

```bash
# Main app
https://your-site-name.netlify.app/

# API health check
https://your-site-name.netlify.app/.netlify/functions/api/proposals

# API root
https://your-site-name.netlify.app/.netlify/functions/api/
```

## Troubleshooting

### If deployment fails:
- Check build logs in Netlify dashboard
- Verify `netlify.toml` exists
- Ensure `public/index.html` exists
- Check `netlify/functions/api.js` exists

### If API returns 404:
- Check Function logs in Netlify dashboard
- Verify redirects in `netlify.toml`
- Test function directly: `/.netlify/functions/api/proposals`

### If MongoDB connection fails:
- Check Function logs for connection errors
- Verify MongoDB Atlas allows connections from Netlify IPs
- Connection string is hardcoded in `netlify/functions/api.js`

## Your Site Configuration

✅ **Build settings**: Auto-detected from `netlify.toml`
✅ **Functions**: Deployed from `netlify/functions/`
✅ **Static files**: Served from `public/`
✅ **MongoDB**: Hardcoded (no env vars needed)

## Next Steps After Deployment

1. ✅ Test all features
2. ✅ Create a test proposal
3. ✅ Test client view mode
4. ✅ Test signature functionality
5. ✅ Share proposal links

---

**Need help?** Check the Function logs in Netlify dashboard for detailed error messages.
