#!/bin/bash

# Netlify Environment Variables Setup Script
# This script configures the required environment variables for the Limit Breakers platform

echo "🚀 Setting up Netlify environment variables..."

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "❌ Netlify CLI not found. Install with: npm install -g netlify-cli"
    echo "📋 Manual setup required. Please configure these variables in Netlify dashboard:"
    echo ""
    echo "MONGODB_URI=mongodb+srv://thisisnithin1122:Galaxcy1122%40@cluster0.jyzp0ki.mongodb.net/limitbreakers?retryWrites=true&w=majority&appName=Cluster0"
    echo "NEXTAUTH_SECRET=yctmXGAO+a6WEW/YGEaoixz9frh4f4DuzaxBG7iHz/E="
    echo "NEXTAUTH_URL=https://limibreakers.netlify.app"
    echo "NODE_ENV=production"
    echo ""
    echo "🌐 Visit: https://app.netlify.com/sites/limibreakers/settings/env"
    exit 1
fi

# Set environment variables
echo "📝 Setting MONGODB_URI..."
netlify env:set MONGODB_URI "mongodb+srv://thisisnithin1122:Galaxcy1122%40@cluster0.jyzp0ki.mongodb.net/limitbreakers?retryWrites=true&w=majority&appName=Cluster0"

echo "🔐 Setting NEXTAUTH_SECRET..."
netlify env:set NEXTAUTH_SECRET "yctmXGAO+a6WEW/YGEaoixz9frh4f4DuzaxBG7iHz/E="

echo "🌐 Setting NEXTAUTH_URL..."
netlify env:set NEXTAUTH_URL "https://limibreakers.netlify.app"

echo "⚙️ Setting NODE_ENV..."
netlify env:set NODE_ENV "production"

echo "✅ Environment variables configured successfully!"
echo "🔄 Triggering a new deployment to apply changes..."

# Trigger a new deployment
netlify deploy --build --prod

echo "🎉 Deployment triggered! The signup error should be fixed once deployment completes."
echo "🔗 Check deployment status: https://app.netlify.com/sites/limibreakers/deploys"
