# Vercel Deployment Guide

## Prerequisites

1. **Backend Deployed**: Make sure your Flask backend is already deployed and accessible via HTTPS
2. **Firebase Project**: Ensure your Firebase project is set up and configured
3. **Vercel Account**: Sign up at [vercel.com](https://vercel.com) if you haven't already
4. **Git Repository**: Your code should be in a Git repository (GitHub, GitLab, or Bitbucket)

## Step 1: Update Backend URL

1. Edit `vercel.json` and replace `https://your-backend-url.com` with your actual backend URL:
   ```json
   {
     "rewrites": [
       {
         "source": "/api/(.*)",
         "destination": "https://your-actual-backend-url.com/api/$1"
       },
       {
         "source": "/(.*)",
         "destination": "/index.html"
       }
     ]
   }
   ```

## Step 2: Deploy to Vercel

### Option A: Using Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your Git repository
4. Set the following configuration:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### Option B: Using Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Navigate to your frontend directory:
   ```bash
   cd frontend
   ```

3. Deploy:
   ```bash
   vercel --prod
   ```

## Step 3: Configure Environment Variables

In your Vercel project settings, add the following environment variables:

### Required Firebase Variables:
- `VITE_FIREBASE_API_KEY` - Your Firebase API key
- `VITE_FIREBASE_AUTH_DOMAIN` - Your Firebase auth domain (e.g., `your-project.firebaseapp.com`)
- `VITE_FIREBASE_PROJECT_ID` - Your Firebase project ID
- `VITE_FIREBASE_STORAGE_BUCKET` - Your Firebase storage bucket (e.g., `your-project.appspot.com`)
- `VITE_FIREBASE_MESSAGING_SENDER_ID` - Your Firebase messaging sender ID
- `VITE_FIREBASE_APP_ID` - Your Firebase app ID
- `VITE_FIREBASE_MEASUREMENT_ID` - Your Firebase measurement ID (optional)

### Optional API Configuration:
- `VITE_API_BASE_URL` - Only if you want to override the default API URL (not recommended if using vercel.json rewrites)

## Step 4: Configure Custom Domain (Optional)

1. In your Vercel project settings, go to "Domains"
2. Add your custom domain
3. Configure DNS records as instructed by Vercel

## Step 5: Update Firebase Configuration

Make sure your Firebase project allows your new Vercel domain:

1. Go to Firebase Console
2. Select your project
3. Go to Authentication > Settings > Authorized domains
4. Add your Vercel domain (e.g., `your-app.vercel.app`)

## Step 6: Update CORS Settings (Backend)

Make sure your Flask backend allows requests from your Vercel domain. Update your CORS configuration to include your new domain.

## Troubleshooting

### Common Issues:

1. **API calls fail**: Check that your `vercel.json` rewrites are correct and your backend URL is accessible
2. **Firebase auth issues**: Verify all environment variables are set correctly
3. **Routing issues**: The `vercel.json` file handles client-side routing for React Router
4. **Build fails**: Check that all dependencies are properly listed in `package.json`

### Checking Environment Variables:
You can verify your environment variables are loaded correctly by checking the browser console or adding a temporary log in your app.

## Post-Deployment Checklist

- [ ] All pages load correctly
- [ ] Firebase authentication works
- [ ] API calls to backend work
- [ ] All environment variables are set
- [ ] Firebase authorized domains updated
- [ ] Backend CORS configured
- [ ] Custom domain configured (if applicable)

## Commands for Quick Deployment

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Test build locally
npm run build

# Deploy to Vercel (if using CLI)
vercel --prod
```

## Environment Variables Template

Create a `.env.local` file for local development:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

Never commit this file to version control - it's already in `.gitignore`. 