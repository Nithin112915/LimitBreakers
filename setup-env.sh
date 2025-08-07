#!/bin/bash

# Database Environment Configuration Script
echo "🔧 Setting up environment variables for MongoDB..."

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    touch .env.local
fi

echo ""
echo "Please provide your MongoDB connection details:"
echo ""

# Get MongoDB URI
read -p "🔗 Enter your MongoDB URI (from Atlas): " MONGODB_URI

# Generate a secure NextAuth secret
echo "🔐 Generating NextAuth secret..."
NEXTAUTH_SECRET=$(openssl rand -base64 32)

# Get the current domain for local development
NEXTAUTH_URL="http://localhost:3000"

# Write to .env.local
cat > .env.local << EOF
# Database Configuration
MONGODB_URI=$MONGODB_URI

# NextAuth Configuration
NEXTAUTH_SECRET=$NEXTAUTH_SECRET
NEXTAUTH_URL=$NEXTAUTH_URL

# Optional: OpenAI API Key for AI features
# OPENAI_API_KEY=your-openai-api-key-here

# Development Settings
NODE_ENV=development
EOF

echo ""
echo "✅ Environment variables configured in .env.local"
echo ""
echo "📋 Summary:"
echo "   ✅ MONGODB_URI: Set"
echo "   ✅ NEXTAUTH_SECRET: Generated"
echo "   ✅ NEXTAUTH_URL: $NEXTAUTH_URL"
echo ""
echo "🚀 Next steps:"
echo "   1. Run: npm run db:seed (to populate with sample data)"
echo "   2. Run: npm run dev (to start development server)"
echo ""
echo "🌐 For Netlify deployment, add these variables to:"
echo "   Netlify Dashboard → Site Settings → Environment Variables"
echo ""

# Ask if user wants to seed the database
read -p "Would you like to seed the database with sample data now? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo "🌱 Seeding database..."
    npm run db:seed
fi

echo "🎉 Setup complete!"
