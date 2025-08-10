'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { aiEngine } from '@/lib/advancedAI';
import { 
  Sparkles, 
  Brain, 
  Target, 
  TrendingUp, 
  Calendar,
  Clock,
  MessageCircle,
  Send,
  User,
  Bot,
  Lightbulb,
  CheckCircle,
  ChevronUp,
  ChevronDown,
  EyeOff,
  Eye,
  Globe,
  Search,
  ExternalLink
} from 'lucide-react';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: string;
  benefits: string[];
  reason: string;
}

export default function CoachPage() {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hello! 👋 I'm your advanced AI assistant. I can help with questions, provide detailed explanations, search the web, and chat about any topic. What would you like to talk about?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userStats, setUserStats] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [conversationContext, setConversationContext] = useState<string[]>([]);
  const [showQuickStarters, setShowQuickStarters] = useState(true);
  const [isSearchingWeb, setIsSearchingWeb] = useState(false);

  useEffect(() => {
    fetchUserStats();
    generateRecommendations();
  }, []);

  const fetchUserStats = async () => {
    try {
      // Fetch real user habits data
      const response = await fetch('/api/habits');
      if (response.ok) {
        const habits = await response.json();
        const habitsArray = Array.isArray(habits) ? habits : [];
        
        // Calculate real stats from habits
        const totalHabits = habitsArray.length;
        const activeHabits = habitsArray.filter(h => h.isActive).length;
        const currentStreak = Math.max(...habitsArray.map(h => h.analytics?.currentStreak || 0), 0);
        const honorPoints = habitsArray.reduce((sum, h) => 
          sum + (h.analytics?.totalCompletions || 0) * h.honorPointsReward, 0
        );
        const successRate = habitsArray.length > 0 
          ? Math.round(habitsArray.reduce((sum, h) => sum + (h.analytics?.successRate || 0), 0) / habitsArray.length)
          : 0;
        
        setUserStats({
          totalHabits,
          activeHabits,
          currentStreak,
          honorPoints,
          successRate,
          level: Math.floor(honorPoints / 1000) + 1
        });
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const generateRecommendations = () => {
    // Simulated AI recommendations based on user patterns
    const sampleRecommendations: Recommendation[] = [
      {
        id: '1',
        title: 'Morning Chat & Coffee',
        description: 'Start your day with 5 minutes of gratitude journaling',
        category: 'Mindfulness & Mental Health',
        difficulty: 'easy',
        estimatedTime: '5 minutes',
        benefits: ['Better mood', 'Increased gratitude', 'Positive mindset'],
        reason: 'A great way to set a positive tone for the day and practice mindfulness! ☕✨'
      },
      {
        id: '2',
        title: 'Evening Reflection',
        description: 'Write down 3 good things that happened today',
        category: 'Learning & Growth',
        difficulty: 'easy',
        estimatedTime: '10 minutes',
        benefits: ['Better sleep', 'Positive focus', 'Self-awareness'],
        reason: 'Ending the day on a positive note can improve sleep and overall wellbeing! 🌙'
      },
      {
        id: '3',
        title: 'Weekly Friend Check-in',
        description: 'Reach out to a friend or family member once a week',
        category: 'Social & Relationships',
        difficulty: 'medium',
        estimatedTime: '15 minutes',
        benefits: ['Stronger relationships', 'Better social support', 'Increased happiness'],
        reason: 'Social connections are crucial for happiness and mental health! 💙'
      },
      {
        id: '4',
        title: 'Daily Movement Break',
        description: 'Take a 10-minute walk or stretch break',
        category: 'Health & Fitness',
        difficulty: 'easy',
        estimatedTime: '10 minutes',
        benefits: ['Better energy', 'Improved mood', 'Physical health'],
        reason: 'Even small movements can boost energy and mood throughout the day! 🚶‍♀️'
      }
    ];
    
    setRecommendations(sampleRecommendations);
  };

  const shouldSearchWeb = (message: string): boolean => {
    const webSearchKeywords = [
      // Current events and news
      'news', 'latest', 'recent', 'today', 'yesterday', 'current', 'breaking',
      
      // Information requests
      'what is', 'what are', 'tell me about', 'explain', 'how does', 'how do',
      'who is', 'who are', 'when did', 'when is', 'where is', 'where are',
      'why does', 'why do', 'definition of', 'meaning of',
      
      // Specific domains
      'weather', 'temperature', 'forecast', 'stock', 'price', 'market',
      'recipe', 'restaurant', 'movie', 'film', 'book', 'review',
      'address', 'phone', 'contact', 'hours', 'open', 'closed',
      
      // Research requests
      'research', 'study', 'statistics', 'data', 'facts', 'information',
      'compare', 'versus', 'vs', 'difference between', 'better than',
      
      // Technology and updates
      'latest version', 'update', 'new features', 'release', 'download',
      'software', 'app', 'website', 'tool', 'platform',
      
      // Health and science
      'symptoms', 'treatment', 'medicine', 'doctor', 'hospital',
      'scientific', 'research paper', 'study shows'
    ];
    
    const lowerMessage = message.toLowerCase();
    return webSearchKeywords.some(keyword => lowerMessage.includes(keyword));
  };

  const searchWeb = async (query: string): Promise<string> => {
    try {
      setIsSearchingWeb(true);
      
      // Use the fetch_webpage tool to search for information
      // For demonstration, we'll simulate a web search response
      const searchResults = await fetch('/api/web-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      
      if (searchResults.ok) {
        const data = await searchResults.json();
        return data.summary || "I found some information, but couldn't retrieve the details right now.";
      }
      
      // Fallback response when web search isn't available
      return generateWebSearchFallback(query);
      
    } catch (error) {
      console.error('Web search error:', error);
      return generateWebSearchFallback(query);
    } finally {
      setIsSearchingWeb(false);
    }
  };

  const generateWebSearchFallback = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('weather')) {
      return "🌤️ I'd love to help you with weather information! For the most current weather forecast, I recommend checking weather.com, your local weather app, or asking a voice assistant. Weather conditions change frequently, so real-time sources are most accurate.";
    }
    
    if (lowerQuery.includes('news') || lowerQuery.includes('current') || lowerQuery.includes('latest')) {
      return "📰 For the latest news and current events, I recommend checking reliable news sources like Reuters, BBC, Associated Press, or your preferred news app. This ensures you get the most up-to-date and accurate information.";
    }
    
    if (lowerQuery.includes('stock') || lowerQuery.includes('market') || lowerQuery.includes('price')) {
      return "📈 For current stock prices and market information, I suggest checking financial websites like Yahoo Finance, Google Finance, or Bloomberg. These provide real-time market data and analysis.";
    }
    
    if (lowerQuery.includes('recipe') || lowerQuery.includes('cooking')) {
      return "👨‍🍳 For recipes and cooking ideas, websites like AllRecipes, Food Network, or Bon Appétit have amazing collections! You could also try searching YouTube for cooking videos or asking for specific dietary preferences.";
    }
    
    if (lowerQuery.includes('movie') || lowerQuery.includes('film') || lowerQuery.includes('show')) {
      return "🎬 For movie and TV show information, IMDb, Rotten Tomatoes, or streaming platforms like Netflix, Hulu, or Disney+ are great resources. They have ratings, reviews, and recommendations!";
    }
    
    return "🌐 That's a great question that would benefit from current web information! For the most accurate and up-to-date details, I recommend searching on Google, checking official websites, or consulting specialized resources for that topic. Is there anything else I can help you with regarding habits, motivation, or personal growth?";
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage;
    setInputMessage('');

    try {
      // Add user message to conversation
      setChatMessages(prev => [...prev, { 
        id: Date.now().toString(),
        type: 'user', 
        content: userMessage,
        timestamp: new Date()
      }]);
      setIsLoading(true);

      let aiResponse = '';

      // Check if the message is a web search request
      if (userMessage.toLowerCase().includes('search for') || 
          userMessage.toLowerCase().includes('look up') || 
          userMessage.toLowerCase().includes('find information') ||
          userMessage.toLowerCase().includes('what is') ||
          userMessage.toLowerCase().includes('tell me about') ||
          userMessage.toLowerCase().includes('news about') ||
          userMessage.toLowerCase().includes('current') ||
          userMessage.toLowerCase().includes('latest') ||
          userMessage.toLowerCase().includes('recent') ||
          userMessage.toLowerCase().includes('update on') ||
          userMessage.toLowerCase().includes('research on') ||
          userMessage.toLowerCase().includes('trends in') ||
          userMessage.toLowerCase().includes('information about') ||
          userMessage.toLowerCase().includes('web search') ||
          userMessage.toLowerCase().includes('google') ||
          userMessage.toLowerCase().includes('today')) {
        
        try {
          const response = await fetch('/api/web-search', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: userMessage }),
          });
          
          const data = await response.json();
          aiResponse = data.summary || data.answer || 'I apologize, but I encountered an issue while searching for that information. Could you try rephrasing your question?';
        } catch (error) {
          console.error('Web search error:', error);
          aiResponse = generateAIResponse(userMessage, chatMessages.map(msg => msg.content));
        }
      } else {
        // Use advanced AI engine for regular conversation
        aiResponse = generateAIResponse(userMessage, chatMessages.map(msg => msg.content));
      }

      // Add AI response
      setTimeout(() => {
        setChatMessages(prev => [...prev, { 
          id: (Date.now() + 1).toString(),
          type: 'ai', 
          content: aiResponse,
          timestamp: new Date()
        }]);
        setIsLoading(false);
      }, 1000);

    } catch (error) {
      console.error('Error generating response:', error);
      setTimeout(() => {
        setChatMessages(prev => [...prev, { 
          id: (Date.now() + 1).toString(),
          type: 'ai', 
          content: "I apologize, but I'm having trouble processing your message right now. Please try again!",
          timestamp: new Date()
        }]);
        setIsLoading(false);
      }, 1000);
    }
  };

  const generateAIResponse = (userMessage: string, context: string[] = []): string => {
    // Add user message to AI engine context
    aiEngine.updateContext({
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    }, userMessage);

    // Analyze intent and generate response
    const intent = aiEngine.analyzeUserIntent(userMessage);
    const response = aiEngine.generateResponse(userMessage, intent);

    // Add AI response to context
    aiEngine.updateContext({
      role: 'assistant',
      content: response,
      timestamp: new Date()
    }, userMessage);

    return response;
  };

  const handleQuickMessage = (message: string) => {
    setInputMessage(message);
    // Small delay to ensure state is updated before sending
    setTimeout(() => {
      const userMessage = message;
      setInputMessage('');

      // Add user message to conversation
      setChatMessages(prev => [...prev, { 
        id: Date.now().toString(),
        type: 'user', 
        content: userMessage,
        timestamp: new Date()
      }]);
      setIsLoading(true);

      // Generate AI response
      const aiResponse = generateAIResponse(userMessage, chatMessages.map(msg => msg.content));

      // Simulate typing delay for better UX
      setTimeout(() => {
        setChatMessages(prev => [...prev, { 
          id: Date.now().toString(),
          type: 'ai', 
          content: aiResponse,
          timestamp: new Date()
        }]);
        setIsLoading(false);
      }, 1000);
    }, 100);
  };

  const quickMessages = [
    "Hello! How are you today?",
    "Tell me about your morning routine",
    "I'm feeling unmotivated today",
    "What's a good habit to start with?",
    "How do you deal with stress?",
    "I want to be more productive",
    "What's the latest on meditation benefits?",
    "Tell me about current fitness trends"
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen premium-gradient p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 glass-morphism p-6 rounded-xl card-3d">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg floating-animation">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold premium-text neon-glow">AI Companion & Coach</h1>
          </div>
          <p className="premium-text-muted">
            Your intelligent AI companion with web access for current information, casual conversations, habit coaching, and personal growth
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* AI Recommendations */}
          <div className="lg:col-span-1">
            <div className="glass-morphism rounded-xl p-6 mb-6 card-3d">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 gold-accent floating-animation" />
                <h3 className="font-semibold premium-text">Daily Inspiration & Ideas</h3>
                <span className="text-sm bg-gradient-to-r from-purple-600 to-pink-600 text-white px-2 py-1 rounded-full neon-glow">✨ For You</span>
              </div>
              
              <div className="space-y-4">
                {recommendations.map((rec) => (
                  <motion.div
                    key={rec.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-800">{rec.title}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full border ${getDifficultyColor(rec.difficulty)}`}>
                        {rec.difficulty}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
                    
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                      <Clock className="w-3 h-3" />
                      <span>{rec.estimatedTime}</span>
                    </div>
                    
                    <div className="text-xs text-blue-600 mb-3">
                      {rec.reason}
                    </div>
                    
                    <button
                      onClick={() => handleQuickMessage(`Tell me more about ${rec.title}`)}
                      className="w-full text-sm bg-purple-50 text-purple-700 py-2 rounded-lg hover:bg-purple-100 transition-colors"
                    >
                      Learn More
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            {userStats && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Your Progress</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Habits</span>
                    <span className="font-medium">{userStats.totalHabits}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Active Habits</span>
                    <span className="font-medium">{userStats.activeHabits}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Current Streak</span>
                    <span className="font-medium">{userStats.currentStreak} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Honor Points</span>
                    <span className="font-medium">{userStats.honorPoints}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Success Rate</span>
                    <span className="font-medium">{userStats.successRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Level</span>
                    <span className="font-medium">Level {userStats.level}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <div className="glass-morphism rounded-xl h-[600px] flex flex-col card-3d">
              {/* Chat Header */}
              <div className="border-b border-gray-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-800">AI Companion</h3>
                      <div className="flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        <Globe className="w-3 h-3" />
                        <span>Web Access</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">
                      <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                      Online & ready to search the web for you
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {chatMessages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex gap-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        message.type === 'user' 
                          ? 'bg-purple-600' 
                          : 'bg-gradient-to-r from-purple-500 to-blue-500'
                      }`}>
                        {message.type === 'user' ? (
                          <User className="w-4 h-4 text-white" />
                        ) : (
                          <Bot className="w-4 h-4 text-white" />
                        )}
                      </div>
                      
                      <div className={`p-3 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.type === 'user' ? 'text-purple-200' : 'text-gray-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {(isLoading || isSearchingWeb) && (
                  <div className="flex justify-start">
                    <div className="flex gap-3 max-w-[80%]">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                          <span className="text-xs text-gray-500 ml-2">
                            {isSearchingWeb ? (
                              <div className="flex items-center gap-1">
                                <Globe className="w-3 h-3 animate-spin" />
                                searching the web...
                              </div>
                            ) : (
                              'thinking...'
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Message Buttons */}
              <div className="border-t border-gray-200 p-4">
                {/* Toggle Button for Quick Starters */}
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-gray-500">
                    💭 Quick conversation starters
                    {!showQuickStarters && <span className="ml-1 text-gray-400">(hidden)</span>}
                  </p>
                  <button
                    onClick={() => setShowQuickStarters(!showQuickStarters)}
                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-purple-600 transition-colors p-1.5 rounded-md hover:bg-purple-50 border border-transparent hover:border-purple-200"
                    title={showQuickStarters ? "Hide quick starters" : "Show quick starters"}
                  >
                    {showQuickStarters ? (
                      <>
                        <EyeOff className="w-3 h-3" />
                        <span>Hide</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3 h-3" />
                        <span>Show</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Quick Starter Buttons - Collapsible */}
                <AnimatePresence>
                  {showQuickStarters && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        {quickMessages.map((message, index) => (
                          <motion.button
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => handleQuickMessage(message)}
                            className="text-sm p-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left border border-gray-200 hover:border-purple-300"
                          >
                            {message}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Message Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder={showQuickStarters 
                      ? "Ask me anything... I can chat about life, search the web for current info, or help with habits! 🌐💬"
                      : "Type your message here... I can search the web for current information! 🌐 (or click 'Show' for starters)"
                    }
                    className={`flex-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                      showQuickStarters ? 'p-3' : 'p-4'
                    }`}
                  />
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={!inputMessage.trim() || isLoading}
                    className="p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
