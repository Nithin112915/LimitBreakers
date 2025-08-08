# Netlify Deployment Environment Variables Setup

To fix the internal server error on Netlify, you need to configure the following environment variables in your Netlify dashboard:

## Step 1: Go to Netlify Dashboard
1. Visit https://app.netlify.com/
2. Select your site: `limibreakers`
3. Go to Site settings > Environment variables

## Step 2: Add Required Environment Variables

### Database Configuration
- **Variable name:** `MONGODB_URI`
- **Value:** `mongodb+srv://thisisnithin1122:Galaxcy1122%40@cluster0.jyzp0ki.mongodb.net/limitbreakers?retryWrites=true&w=majority&appName=Cluster0`

### NextAuth Configuration  
- **Variable name:** `NEXTAUTH_SECRET`
- **Value:** `yctmXGAO+a6WEW/YGEaoixz9frh4f4DuzaxBG7iHz/E=`

- **Variable name:** `NEXTAUTH_URL`
- **Value:** `https://limibreakers.netlify.app`

### Node Environment
- **Variable name:** `NODE_ENV`
- **Value:** `production`

## Step 3: Redeploy
After adding all environment variables, trigger a new deployment by:
1. Going to Deploys tab
2. Click "Trigger deploy" > "Deploy site"

This will fix the internal server error that friends are experiencing during signup.

## Monitoring Your Application

### Netlify Usage Monitoring
- **Dashboard**: https://app.netlify.com/projects/limibreakers
- **Analytics**: Monitor bandwidth, builds, and function invocations
- **Free Tier**: 100GB bandwidth/month, 300 build minutes/month

### MongoDB Atlas Monitoring  
- **Dashboard**: https://cloud.mongodb.com/
- **Metrics**: Database storage, connections, operations
- **Free Tier**: 512MB storage, shared cluster

### Cost Implications
- **Completely Free** within the limits above
- **No charges** for keeping the application running 24/7
- **Only pay** if you exceed free tier limits (very unlikely for personal projects)
