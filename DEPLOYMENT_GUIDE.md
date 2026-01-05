# Deployment Guide - CRM Architect Pro

## Quick Deploy to Netlify

### Option 1: Deploy via Netlify UI (Easiest)

1. **Prepare your code:**
   ```bash
   cd "c:\Users\USER\Desktop\crm-project"
   git add .
   git commit -m "Ready for deployment"
   ```

2. **Push to GitHub/GitLab/Bitbucket:**
   - If you don't have a remote repository yet:
     - Create a new repository on GitHub
     - Add it as remote: `git remote add origin <your-repo-url>`
     - Push: `git push -u origin main` (or `master`)

3. **Deploy on Netlify:**
   - Go to [netlify.com](https://netlify.com) and sign up/login
   - Click "Add new site" → "Import an existing project"
   - Connect your Git provider (GitHub/GitLab/Bitbucket)
   - Select your repository
   - Netlify will auto-detect settings:
     - **Build command:** (leave empty - no build needed)
     - **Publish directory:** `public` ✅
     - **Functions directory:** `netlify/functions` ✅
   - Click "Deploy site"

4. **Wait for deployment** (usually 1-2 minutes)

5. **Test your site:**
   - Visit your Netlify URL (e.g., `https://your-site.netlify.app`)
   - Test the archive/history feature
   - Test creating a proposal

### Option 2: Deploy via Netlify CLI

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify:**
   ```bash
   netlify login
   ```

3. **Initialize and deploy:**
   ```bash
   cd "c:\Users\USER\Desktop\crm-project"
   netlify init
   ```
   - Follow prompts to link/create site
   - Choose "Create & configure a new site"
   - Choose your team
   - Site name: (choose a name or leave blank for random)

4. **Deploy:**
   ```bash
   netlify deploy --prod
   ```

## Post-Deployment Checklist

- [ ] Site loads correctly
- [ ] Archive/history button works
- [ ] Can create new proposals
- [ ] Can save proposals to cloud
- [ ] Client view works (`?viewProposal=ID`)
- [ ] Digital signature works

## Troubleshooting

### If API returns 404:
- Check Netlify function logs: Dashboard → Functions → View logs
- Verify `netlify.toml` redirects are correct
- Check that `netlify/functions/api.js` exists

### If MongoDB connection fails:
- MongoDB URI is hardcoded in `netlify/functions/api.js`
- Verify MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
- Check MongoDB connection string is correct

### If static files don't load:
- Verify `public` directory contains `index.html`
- Check `netlify.toml` has `publish = "public"`

## Your Site URL

After deployment, Netlify will provide a URL like:
- `https://your-site-name.netlify.app`

You can also add a custom domain in Netlify settings.
