# Limit Breakers

An AI-driven personal growth and productivity platform that empowers users to schedule and complete habits with accountability, featuring smart reminders, proof submission, Honor Points system, and professional networking.

## Features

### 🎯 Core Functionality
- **AI-Powered Coaching**: Personalized daily schedules and habit recommendations
- **Proof Submission**: Photo, document, or video evidence for accountability
- **Honor Points System**: Earn or lose points based on completion with consequence-based feedback
- **Smart Reminders**: Time-based, location-aware, and snoozable notifications

### 🤖 AI Integration
- Analyzes long-term goals and past behavior patterns
- Recommends adaptive daily schedules
- Provides personalized insights and motivation
- Predicts potential slip-ups and offers preventive suggestions

### 👥 Social Features
- **Live Résumé Profiles**: Showcase education, skills, achievements, and badges
- **Professional Network**: Connect with like-minded individuals
- **Community Challenges**: Participate in group goals and competitions
- **Peer Support**: Share progress and get motivated by others

### 📊 Analytics & Insights
- Streak heatmaps and completion trends
- Leaderboards and achievement tracking
- Deep visual insights into habit patterns
- Progress sharing and community engagement

### 🔐 Privacy & Security
- Strong privacy controls
- Secure data handling
- Flexible sharing settings
- GDPR compliant

## Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js, MongoDB
- **Authentication**: NextAuth.js
- **AI Integration**: OpenAI API
- **Real-time Features**: Socket.io
- **File Upload**: Multer, Cloudinary (optional)
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Heroicons

## Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd limit-breakers
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your configuration:
```env
MONGODB_URI=mongodb://localhost:27017/limit-breakers
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
OPENAI_API_KEY=your-openai-api-key-here
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js 13+ app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── Dashboard/         # Dashboard-specific components
│   ├── Home/              # Landing page components
│   └── Layout/            # Layout components
├── lib/                   # Utility libraries
├── models/                # MongoDB models
└── types/                 # TypeScript type definitions
```

## API Routes

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/[...nextauth]` - NextAuth.js authentication

### Habits
- `GET /api/habits` - Get user habits
- `POST /api/habits` - Create new habit
- `PUT /api/habits/:id` - Update habit
- `DELETE /api/habits/:id` - Delete habit
- `POST /api/habits/:id/complete` - Mark habit as complete

### Community
- `GET /api/community/posts` - Get community posts
- `POST /api/community/posts` - Create new post
- `POST /api/community/posts/:id/like` - Like a post
- `POST /api/community/posts/:id/comment` - Comment on post

### AI Coach
- `POST /api/ai/recommendations` - Get AI recommendations
- `POST /api/ai/schedule` - Generate AI schedule

## Key Features Implementation

### Honor Points System
- Points awarded for habit completion
- Penalty system for missed habits
- Bonus points for streaks and achievements
- Leaderboards and social recognition

### Proof Submission
- Multiple proof types (photo, video, document, text)
- Verification system (pending, approved, rejected)
- Automated and manual review processes
- Integration with habit completion

### AI Coaching
- Pattern analysis of user behavior
- Personalized recommendations
- Schedule optimization
- Motivational messaging

### Social Network
- User profiles with achievements
- Following/followers system
- Activity feeds and notifications
- Community challenges and groups

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@limit-breakers.com or join our community Discord.
