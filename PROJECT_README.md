# 🚀 Limit Breakers - AI-Driven Personal Growth Platform

![Limit Breakers](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=for-the-badge&logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-blue?style=for-the-badge&logo=tailwindcss)

A comprehensive personal growth and productivity platform that combines AI-driven coaching, social accountability, and gamification to help users build lasting habits and achieve their goals.

## ✨ Features

### 🎯 Core Functionality
- **Habit Tracking**: Create, track, and maintain daily habits with streak counters
- **AI Coach**: Personalized recommendations powered by OpenAI
- **Social Network**: Instagram-like feed with posts, following, and engagement
- **Gamification**: Honor points, levels, and achievement system
- **Premium Dashboard**: Comprehensive analytics and insights

### 📱 Social Features
- **User Profiles**: Unique usernames with follower/following system
- **Social Feed**: Share progress, achievements, and thoughts
- **Post Interactions**: Like, comment, and share functionality
- **Privacy Controls**: Public, followers-only, or private posts
- **Real-time Updates**: Dynamic content loading and interactions

### 🏆 Gamification
- **Honor Points**: Earn points for habit completion and achievements
- **Level System**: Progress through levels based on honor points
- **Streak Tracking**: Current and longest streak monitoring
- **Achievement Badges**: Recognition for milestones and consistency

## 🛠️ Tech Stack

### Frontend
- **Next.js 14**: App Router with TypeScript
- **React 18**: Modern React with hooks and context
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Smooth animations and transitions
- **Heroicons**: Beautiful SVG icons

### Backend
- **Next.js API Routes**: Server-side API endpoints
- **NextAuth.js**: Authentication and session management
- **MongoDB Atlas**: Cloud database with Mongoose ODM
- **bcryptjs**: Password hashing and security

### Deployment
- **Vercel**: Production deployment platform
- **MongoDB Atlas**: Cloud database hosting
- **Environment Variables**: Secure configuration management

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account (or local MongoDB)
- Git installed

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/limit-breakers.git
   cd limit-breakers
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   OPENAI_API_KEY=your_openai_api_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
limit-breakers/
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── api/            # API routes
│   │   ├── auth/           # Authentication pages
│   │   ├── dashboard/      # Dashboard page
│   │   ├── profile/        # User profile pages
│   │   └── social/         # Social feed page
│   ├── components/         # Reusable React components
│   │   ├── Dashboard/      # Dashboard-specific components
│   │   ├── Home/          # Homepage components
│   │   └── Layout/        # Layout components
│   ├── lib/               # Utility libraries
│   ├── models/            # MongoDB models
│   └── types/             # TypeScript type definitions
├── public/                # Static assets
└── docs/                  # Documentation
```

## 🎮 Usage

### Creating an Account
1. Visit `/auth/signup`
2. Enter your name, unique username, email, and password
3. Complete registration and sign in

### Using the Platform
1. **Dashboard**: View your stats, habits, and progress
2. **Social Feed**: Share posts and interact with the community
3. **Profile**: Customize your profile and view your timeline
4. **Habits**: Create and track daily habits
5. **Community**: Engage with other users and challenges

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/[...nextauth]` - NextAuth.js handlers

### User Management
- `GET /api/user/[username]` - Get user profile
- `POST /api/user/[username]/follow` - Follow/unfollow user
- `GET /api/user/stats` - Get current user stats

### Social Features
- `GET /api/posts` - Get social feed posts
- `POST /api/posts` - Create new post
- `POST /api/posts/[postId]/like` - Like/unlike post

### Habits & Progress
- `GET /api/habits` - Get user habits
- `POST /api/habits` - Create new habit
- `POST /api/habits/[id]/complete` - Mark habit complete

## 🎨 Styling

The platform uses a modern glassmorphism design with:
- **Color Scheme**: Purple-to-pink gradients with glass effects
- **Typography**: Clean, readable fonts with proper hierarchy
- **Animations**: Smooth transitions using Framer Motion
- **Responsive**: Mobile-first design that works on all devices

## 🔐 Security

- **Password Hashing**: bcryptjs for secure password storage
- **Session Management**: NextAuth.js with JWT tokens
- **Input Validation**: Server-side validation for all inputs
- **Environment Variables**: Secure configuration management
- **HTTPS**: Enforced in production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team**: For the incredible React framework
- **Vercel**: For seamless deployment platform
- **MongoDB**: For reliable cloud database
- **Tailwind CSS**: For utility-first styling
- **Framer Motion**: For beautiful animations
- **OpenAI**: For AI-powered recommendations

## 📞 Support

If you have any questions or need help:
- Create an issue on GitHub
- Contact us at support@limitbreakers.app
- Check out our documentation

---

**Built with ❤️ by the Limit Breakers Team**

*Empowering personal growth through technology*
