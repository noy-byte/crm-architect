# CRM Architect Pro - Proposal System

A CRM proposal system with remote digital signing capabilities, built with Express.js, MongoDB, and Netlify Functions.

## Features

- 📝 Create and manage CRM proposals
- ✍️ Digital signature capture
- ☁️ Cloud storage with MongoDB Atlas
- 📊 Proposal templates and customization
- 🔗 Shareable proposal links for clients
- 📱 Responsive design

## Project Structure

```
crm-project/
├── public/              # Static files (HTML, CSS, JS)
│   └── index.html       # Main application
├── netlify/
│   └── functions/
│       └── api.js       # Netlify serverless function
├── server.js            # Local development server
├── package.json         # Dependencies
├── netlify.toml         # Netlify configuration
└── .env                 # Environment variables (not in git)
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account (or local MongoDB)
- Netlify account (for deployment)

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   Create a `.env` file in the root directory:
   ```
   MONGODB_URI=your_mongodb_connection_string
   PORT=5000
   ```

3. **Start the local server:**
   ```bash
   node server.js
   ```

4. **Access the application:**
   - Open `public/index.html` in your browser
   - Or serve it with a local server (e.g., `npx serve public`)

### Netlify Deployment

1. **Set environment variables in Netlify:**
   - Go to Site Settings → Environment Variables
   - Add `MONGODB_URI` with your MongoDB connection string

2. **Deploy:**
   - Connect your repository to Netlify
   - Netlify will automatically detect the `netlify.toml` configuration
   - The build will publish the `public` directory and deploy functions from `netlify/functions`

3. **Verify deployment:**
   - Check that the API endpoint works: `https://your-site.netlify.app/.netlify/functions/api/proposals`
   - Access your app: `https://your-site.netlify.app/`

## API Endpoints

### Local Development (port 5000)
- `GET /api/proposals` - Get all proposals
- `GET /api/proposals/:id` - Get a specific proposal
- `POST /api/proposals` - Create or update a proposal
- `PATCH /api/proposals/:id/sign` - Sign a proposal
- `DELETE /api/proposals/:id` - Delete a proposal

### Netlify Functions
- `GET /.netlify/functions/api/proposals` - Get all proposals
- `GET /.netlify/functions/api/proposals/:id` - Get a specific proposal
- `POST /.netlify/functions/api/proposals` - Create or update a proposal
- `PATCH /.netlify/functions/api/proposals/:id/sign` - Sign a proposal
- `DELETE /.netlify/functions/api/proposals/:id` - Delete a proposal

## Security Notes

⚠️ **Important:** 
- Never commit `.env` file to version control
- Use environment variables for sensitive data (MongoDB credentials)
- The MongoDB URI in `netlify/functions/api.js` has a fallback for development - ensure you set `MONGODB_URI` in Netlify environment variables for production

## Troubleshooting

### MongoDB Connection Issues
- Verify your MongoDB URI is correct
- Check network access in MongoDB Atlas (IP whitelist)
- Ensure the database name in the connection string matches your database

### Netlify Function Errors
- Check Netlify function logs in the Netlify dashboard
- Verify environment variables are set correctly
- Ensure `node_bundler = "esbuild"` is set in `netlify.toml`

### Local Server Issues
- Make sure port 5000 is not in use
- Verify `.env` file exists and contains `MONGODB_URI`
- Check MongoDB connection string format

## License

Proprietary - All rights reserved
