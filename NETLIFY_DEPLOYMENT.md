# Netlify Deployment Guide for Limit Breakers

## Prerequisites
- [Netlify account](https://netlify.com) (free)
- GitHub repository with your code
- Node.js 18+ locally

## Deployment Steps

### Option 1: Deploy via Netlify Dashboard (Recommended)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Netlify deployment"
   git push origin main
   ```

2. **Connect to Netlify**
   - Go to [Netlify Dashboard](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Choose "Deploy with GitHub"
   - Select your repository

3. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: `18` (set in Environment variables)

4. **Set Environment Variables**
   Go to Site settings → Environment variables and add:
   ```
   NODE_ENV=production
   NEXTAUTH_SECRET=your-secret-key-here
   NEXTAUTH_URL=https://your-app-name.netlify.app
   ```

5. **Deploy**
   - Click "Deploy site"
   - Your app will be available at `https://your-app-name.netlify.app`

### Option 2: Deploy via Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Build the project**
   ```bash
   npm run build
   ```

4. **Deploy**
   ```bash
   # For preview deployment
   netlify deploy

   # For production deployment
   netlify deploy --prod
   ```

## Configuration Files

### netlify.toml
This file configures the build process and redirects for your Next.js app.

### next.config.js
Updated with Netlify-specific optimizations:
- Static image optimization
- Standalone output mode
- Build error handling

## Environment Variables

Set these in Netlify Dashboard → Site settings → Environment variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `NODE_ENV` | Set to "production" | ✅ |
| `NEXTAUTH_SECRET` | Random 32+ character string | ✅ |
| `NEXTAUTH_URL` | Your Netlify app URL | ✅ |
| `MONGODB_URI` | MongoDB connection string | ❌ (using mock data) |
| `OPENAI_API_KEY` | OpenAI API key for AI features | ❌ (optional) |

## Features Available

✅ **Demo Experience**: Full interactive demo with video player
✅ **Habit Tracking**: Complete habit management interface
✅ **Analytics**: User statistics and progress tracking
✅ **Social Features**: Community and leaderboard
✅ **Responsive Design**: Works on all devices
✅ **Mock Data**: No database required for demo

## Troubleshooting

### Build Issues
- Ensure Node.js version is 18+
- Check that all dependencies are in package.json
- Verify netlify.toml is in root directory

### Runtime Issues
- Check environment variables are set correctly
- Ensure NEXTAUTH_URL matches your deployed domain
- Check Netlify function logs for errors

### Performance
- Images are optimized for static deployment
- API routes use mock data for fast responses
- Build time optimized to under 3 minutes

## Post-Deployment

1. **Test all features**:
   - Visit `/demo` for the complete demo experience
   - Test habit creation and completion
   - Check analytics dashboard
   - Verify responsive design

2. **Custom Domain** (Optional):
   - Go to Site settings → Domain management
   - Add your custom domain
   - Configure DNS settings

3. **Analytics** (Optional):
   - Enable Netlify Analytics
   - Add Google Analytics if needed

Your Limit Breakers app is now live and ready to showcase! 🚀
