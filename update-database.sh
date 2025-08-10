#!/bin/bash

# Script to update MongoDB Atlas connection string
# Usage: ./update-database.sh "your-new-connection-string"

if [ $# -eq 0 ]; then
    echo "❌ Error: No connection string provided"
    echo "Usage: ./update-database.sh \"mongodb+srv://username:password@cluster.mongodb.net/limitbreakers\""
    exit 1
fi

NEW_CONNECTION_STRING="$1"

echo "🔄 Updating MongoDB connection string..."

# Update local environment file
sed -i.bak "s|MONGODB_URI=.*|MONGODB_URI=$NEW_CONNECTION_STRING|" .env.local

# Update production environment file
sed -i.bak "s|MONGODB_URI=.*|MONGODB_URI=$NEW_CONNECTION_STRING|" .env.production

echo "✅ Updated .env.local and .env.production"

# Update Netlify environment variable
echo "🚀 Updating Netlify environment variable..."
netlify env:set MONGODB_URI "$NEW_CONNECTION_STRING"

echo "🎉 Database connection updated successfully!"
echo ""
echo "Next steps:"
echo "1. Test locally: npm run dev"
echo "2. Test registration: curl -X POST http://localhost:3000/api/auth/register ..."
echo "3. Initialize database: curl -X POST http://localhost:3000/api/init-database"
echo "4. Deploy: git add . && git commit -m 'Update to new MongoDB Atlas database' && git push"
