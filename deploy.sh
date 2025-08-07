#!/bin/bash

# Limit Breakers - Netlify Deployment Script

echo "🚀 Starting Netlify deployment for Limit Breakers..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Build the project
echo "📦 Building the project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the errors and try again."
    exit 1
fi

echo "✅ Build successful!"

# Check if netlify-cli is installed
if ! command -v netlify &> /dev/null; then
    echo "📦 Installing Netlify CLI..."
    npm install -g netlify-cli
fi

# Login check
echo "🔐 Checking Netlify authentication..."
netlify status > /dev/null 2>&1

if [ $? -ne 0 ]; then
    echo "🔐 Please login to Netlify..."
    netlify login
fi

# Deploy to preview first
echo "🌐 Deploying to preview..."
netlify deploy --dir=.next

echo ""
echo "🎉 Preview deployment complete!"
echo ""
echo "To deploy to production, run:"
echo "   netlify deploy --prod --dir=.next"
echo ""
echo "Or use the Netlify dashboard at: https://app.netlify.com"
echo ""
echo "📖 See NETLIFY_DEPLOYMENT.md for detailed instructions"
