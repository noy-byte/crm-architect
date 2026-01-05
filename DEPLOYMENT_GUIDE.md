# Deployment Guide - CRM Architect Pro

## Quick Deploy to Netlify

### Option 1: Deploy via Git (Recommended)

1. **Commit and push your changes:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy to Netlify:**
   - Go to [Netlify Dashboard](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your Git provider (GitHub/GitLab/Bitbucket)
   - Select your repository
   - Netlify will auto-detect settings from `netlify.toml`:
     - Build command: (none needed)
     - Publish directory: `public`
     - Functions directory: `netlify/functions`
   - Click "Deploy site"

3. **Verify deployment:**
   - Wait for build to complete (~2-3 minutes)
   - Visit your site URL (e.g., `https://your-site.netlify.app`)
   - Test the archive feature

### Option 2: Manual Deploy via Netlify CLI

1. **Install Netlify CLI (if not installed):**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify:**
   ```bash
   netlify login
   ```

3. **Deploy:**
   ```bash
   netlify deploy --prod
   ```

### Option 3: Drag & Drop Deploy

1. **Build the site locally (optional):**
   - The `public` folder is already ready
   - No build step needed

2. **Deploy:**
   - Go to [Netlify Drop](https://app.netlify.com/drop)
   - Drag and drop the `public` folder
   - **Note:** This method won't deploy functions - use Git method for full deployment

## Important Notes

### MongoDB Connection
- ✅ MongoDB URI is hardcoded in `netlify/functions/api.js`
- ✅ No environment variables needed
- ✅ Works out of the box

### File Structure
```
crm-project/
├── public/              ← Served as static site
│   └── index.html      ← Main app
├── netlify/
│   └── functions/
│       └── api.js      ← Serverless API
└── netlify.toml        ← Netlify configuration
```

### After Deployment

1. **Test the API:**
   - Visit: `https://your-site.netlify.app/.netlify/functions/api/proposals`
   - Should return: `[]` (empty array) or list of proposals

2. **Test the app:**
   - Visit: `https://your-site.netlify.app`
   - Click "ארכיון" (Archive) button
   - Should load without 404 errors

3. **Check function logs:**
   - Netlify Dashboard → Functions → View logs
   - Monitor for any errors

## Troubleshooting

### If API returns 404:
- Check Netlify function logs
- Verify `netlify.toml` redirects are correct
- Ensure `netlify/functions/api.js` exists

### If site doesn't load:
- Check build logs in Netlify dashboard
- Verify `public/index.html` exists
- Check publish directory is set to `public`

### If MongoDB connection fails:
- Check MongoDB Atlas IP whitelist (allow 0.0.0.0/0 for testing)
- Verify connection string in `netlify/functions/api.js`

## Next Steps

After successful deployment:
1. ✅ Test all features
2. ✅ Share proposal links with clients
3. ✅ Monitor function logs
4. ✅ Set up custom domain (optional)
