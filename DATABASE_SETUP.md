# MongoDB Database Setup Guide

## 🚀 Quick Setup

### Option 1: Automated Setup (Recommended)
```bash
# Run the MongoDB setup guide
./setup-mongodb.sh

# Configure environment variables
./setup-env.sh
```

### Option 2: Manual Setup

## 📊 MongoDB Atlas Setup (Cloud Database)

1. **Create Account & Cluster**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a free account
   - Create a new cluster (M0 Sandbox - Free)
   - Choose AWS, region closest to you

2. **Database Access**
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Username: `limitbreakers-user`
   - Password: Generate a secure password (save it!)
   - Database User Privileges: "Read and write to any database"

3. **Network Access**
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Add `0.0.0.0/0` (Allow access from anywhere)
   - This is required for Netlify deployment

4. **Get Connection String**
   - Go to "Clusters" and click "Connect"
   - Choose "Connect your application"
   - Select "Node.js" and version "5.5 or later"
   - Copy the connection string
   - Replace `<password>` with your actual password
   - Should look like: `mongodb+srv://limitbreakers-user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`

## 🔧 Environment Configuration

### Local Development (.env.local)

Create a `.env.local` file in your project root:

```bash
# Database Configuration
MONGODB_URI=mongodb+srv://limitbreakers-user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/limitbreakers?retryWrites=true&w=majority

# NextAuth Configuration
NEXTAUTH_SECRET=your-32-character-secret-key
NEXTAUTH_URL=http://localhost:3000

# Optional: AI Features
OPENAI_API_KEY=your-openai-api-key

# Development
NODE_ENV=development
```

### Production (Netlify)

Add these environment variables in Netlify Dashboard → Site Settings → Environment Variables:

| Variable | Value |
|----------|-------|
| `MONGODB_URI` | Your Atlas connection string |
| `NEXTAUTH_SECRET` | Generate with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Your Netlify app URL |
| `NODE_ENV` | `production` |

## 🌱 Database Seeding

Populate your database with sample data:

```bash
# Install dependencies
npm install

# Seed the database
npm run db:seed
```

This creates:
- ✅ Sample users (John Doe, Sarah Wilson)
- ✅ Sample habits (Morning Run, Reading, Meditation, etc.)
- ✅ Realistic habit logs and completion data
- ✅ User achievements and statistics

## 🔄 Switching from Mock Data

Your API routes are now configured to use the real database. The mock data has been replaced with actual MongoDB queries.

### What Changed:
- `/api/habits` - Now fetches from MongoDB
- `/api/user/profile` - Real user profiles
- `/api/user/stats` - Calculated from actual data
- `/api/auth/register` - Creates real users
- Authentication now works with database

## 🧪 Testing the Database

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Register a new user:**
   - Go to http://localhost:3000/auth/signup
   - Create an account

3. **Create habits:**
   - Login and go to dashboard
   - Add new habits
   - Complete some habits

4. **Check MongoDB Atlas:**
   - Go to your cluster → Browse Collections
   - See your data in `users` and `habits` collections

## 🚀 Deployment with Database

### Build and Test
```bash
# Test build with database
npm run build

# Deploy to Netlify
netlify deploy --prod
```

### Environment Variables for Netlify
Make sure these are set in Netlify:
- ✅ `MONGODB_URI`
- ✅ `NEXTAUTH_SECRET`
- ✅ `NEXTAUTH_URL`
- ✅ `NODE_ENV=production`

## 🔍 Monitoring

### MongoDB Atlas Monitoring
- Go to your cluster → Monitoring
- View real-time performance metrics
- Monitor database operations

### Application Logs
- Check Netlify function logs for errors
- Monitor API response times
- Track user activity

## 🛠️ Troubleshooting

### Common Issues:

1. **Connection Error**
   - Check if IP address is whitelisted (0.0.0.0/0)
   - Verify username/password in connection string
   - Ensure cluster is not paused

2. **Authentication Issues**
   - Check NEXTAUTH_SECRET is set
   - Verify NEXTAUTH_URL matches your domain
   - Clear browser cookies and try again

3. **Seeding Fails**
   - Ensure MONGODB_URI is set correctly
   - Check database user permissions
   - Verify network access settings

### Database Collections Structure:

**Users Collection:**
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String (hashed),
  honorPoints: Number,
  level: Number,
  streaks: { current: Number, longest: Number },
  achievements: Array,
  preferences: Object,
  createdAt: Date
}
```

**Habits Collection:**
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  title: String,
  description: String,
  category: String,
  difficulty: String,
  frequency: Object,
  logs: Array,
  analytics: Object,
  createdAt: Date
}
```

## ✅ Success!

Your Limit Breakers app now has a real database! 🎉

- ✅ User registration and authentication
- ✅ Persistent habit tracking
- ✅ Real-time analytics
- ✅ Achievement system
- ✅ Social features ready
- ✅ Production deployment ready

Next: Deploy to Netlify and share your app with the world!
