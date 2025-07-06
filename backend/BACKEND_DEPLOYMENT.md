# Flask Backend Deployment Guide

## Prerequisites

1. **Supabase Database**: Your PostgreSQL database is already set up on Supabase
2. **Firebase Project**: Your Firebase project for authentication is configured
3. **Git Repository**: Your backend code is in a Git repository

## Option 1: Deploy to Railway (Recommended)

Railway is excellent for Flask applications and handles PostgreSQL databases well.

### Step 1: Prepare Environment Variables

You'll need these environment variables for deployment:

```env
DATABASE_URL=postgresql://[user]:[password]@[host]:[port]/[database]
FIREBASE_ADMIN_CREDENTIALS=/app/firebase-credentials.json
PORT=8000
```

### Step 2: Deploy to Railway

1. Go to [Railway.app](https://railway.app) and sign in with GitHub
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway will detect it's a Python app automatically

### Step 3: Configure Environment Variables in Railway

In your Railway project dashboard:

1. Go to "Variables" tab
2. Add these variables:
   - `DATABASE_URL`: Your Supabase connection string
   - `FIREBASE_ADMIN_CREDENTIALS`: `/app/firebase-credentials.json`
   - `PORT`: `8000`

### Step 4: Add Firebase Credentials File

Since you can't upload files directly, you have two options:

**Option A: Environment Variable (Recommended)**
1. Copy the content of `fatoora-b2d0b-firebase-adminsdk-fbsvc-364c3ffd79.json`
2. Add as environment variable: `FIREBASE_ADMIN_CREDENTIALS_JSON`
3. Update `backend/utils/firebase_auth.py`:

```python
import json
import os
from firebase_admin import credentials

# Load credentials from environment variable
cred_json = os.getenv('FIREBASE_ADMIN_CREDENTIALS_JSON')
if cred_json:
    cred_dict = json.loads(cred_json)
    cred = credentials.Certificate(cred_dict)
else:
    # Fallback to file path
    cred = credentials.Certificate(os.getenv('FIREBASE_ADMIN_CREDENTIALS'))
```

## Option 2: Deploy to Render

### Step 1: Create a Render Account
Go to [Render.com](https://render.com) and sign up

### Step 2: Create a New Web Service
1. Click "New" → "Web Service"
2. Connect your Git repository
3. Use these settings:
   - **Name**: `fatoora-backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn wsgi:application`

### Step 3: Configure Environment Variables
Add the same environment variables as Railway

## Option 3: Deploy to Heroku

### Step 1: Install Heroku CLI
```bash
# macOS
brew tap heroku/brew && brew install heroku

# Ubuntu
curl https://cli-assets.heroku.com/install.sh | sh
```

### Step 2: Login and Create App
```bash
heroku login
heroku create your-app-name
```

### Step 3: Set Environment Variables
```bash
heroku config:set DATABASE_URL="your_supabase_connection_string"
heroku config:set FIREBASE_ADMIN_CREDENTIALS_JSON='{"type":"service_account",...}'
```

### Step 4: Deploy
```bash
git push heroku main
```

## Environment Variables Setup

### Required Variables:

1. **DATABASE_URL**: Your Supabase PostgreSQL connection string
   ```
   Format: postgresql://[user]:[password]@[host]:[port]/[database]
   Example: postgresql://postgres:your_password@db.your_project.supabase.co:5432/postgres
   ```

2. **FIREBASE_ADMIN_CREDENTIALS_JSON**: Your Firebase service account JSON (as string)

### Getting Your Supabase Database URL:

1. Go to your Supabase project dashboard
2. Settings → Database
3. Copy the connection string under "Connection string"
4. Replace `[YOUR-PASSWORD]` with your actual database password

## Database Migrations

After deploying, run database migrations:

### For Railway/Render:
Add this to your build command:
```bash
pip install -r requirements.txt && flask db upgrade
```

### For Heroku:
```bash
heroku run flask db upgrade
```

## Testing Your Deployment

1. Your backend will be available at: `https://your-app-name.up.railway.app` (Railway)
2. Test the health endpoint: `GET /api/auth/me` (should return 401 without token)
3. Check logs for any errors

## Update Frontend Configuration

Once your backend is deployed, update your frontend's `vercel.json`:

```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://your-backend-url.railway.app/api/$1"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## Security Notes

1. **CORS**: Already configured for Vercel domains
2. **Environment Variables**: Never commit sensitive data to Git
3. **Firebase Credentials**: Store as environment variable, not as file
4. **Database**: Use Supabase's built-in security features

## Troubleshooting

### Common Issues:

1. **Database Connection Failed**
   - Check DATABASE_URL format
   - Ensure Supabase allows connections
   - Verify password is correct

2. **Firebase Auth Errors**
   - Check FIREBASE_ADMIN_CREDENTIALS_JSON is valid JSON
   - Ensure Firebase project is active
   - Verify service account has correct permissions

3. **Build Failures**
   - Check requirements.txt has all dependencies
   - Ensure Python version compatibility
   - Check for import errors in logs

4. **CORS Errors**
   - Verify frontend domain is in CORS origins
   - Check if requests are using HTTPS in production

### Checking Logs:

- **Railway**: Dashboard → Deploy logs
- **Render**: Dashboard → Logs tab  
- **Heroku**: `heroku logs --tail`

## Production Checklist

- [ ] Database migrated successfully
- [ ] Environment variables set
- [ ] Firebase credentials configured
- [ ] CORS origins updated
- [ ] SSL/HTTPS enabled
- [ ] Health endpoint responding
- [ ] Frontend can connect to backend
- [ ] Authentication flow works
- [ ] File uploads work (if applicable)

## Quick Deploy Commands

```bash
# Test locally first
cd backend
pip install -r requirements.txt
flask run

# For Railway (using CLI)
railway login
railway link
railway up

# For Heroku
heroku create your-app-name
git push heroku main
heroku config:set DATABASE_URL="your_url"
heroku config:set FIREBASE_ADMIN_CREDENTIALS_JSON='your_json'
```

## Next Steps

After backend deployment:
1. Test all API endpoints
2. Update frontend vercel.json with your backend URL
3. Deploy frontend to Vercel
4. Update Firebase authorized domains
5. Test the complete application flow 