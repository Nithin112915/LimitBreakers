// Advanced AI Response System similar to ChatGPT
export interface ConversationMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface AIContext {
  conversationHistory: ConversationMessage[];
  userProfile: {
    name?: string;
    interests?: string[];
    goals?: string[];
    recentTopics?: string[];
  };
  sessionContext: {
    mood?: 'positive' | 'neutral' | 'seeking_help' | 'curious';
    conversationStyle?: 'casual' | 'professional' | 'supportive';
    preferredLength?: 'brief' | 'detailed' | 'comprehensive';
  };
}

export class AdvancedAIEngine {
  private context: AIContext;
  
  constructor() {
    this.context = {
      conversationHistory: [],
      userProfile: {},
      sessionContext: {}
    };
  }

  updateContext(message: ConversationMessage, userInput: string) {
    this.context.conversationHistory.push(message);
    this.analyzeUserIntent(userInput);
    this.updateUserProfile(userInput);
    
    // Keep only last 20 messages for context efficiency
    if (this.context.conversationHistory.length > 20) {
      this.context.conversationHistory = this.context.conversationHistory.slice(-20);
    }
  }

  analyzeUserIntent(input: string): string {
    const lowerInput = input.toLowerCase();
    
    // Intent classification
    if (this.isQuestion(lowerInput)) return 'question';
    if (this.isRequestForHelp(lowerInput)) return 'help_request';
    if (this.isExpressingEmotion(lowerInput)) return 'emotional_expression';
    if (this.isSeekingAdvice(lowerInput)) return 'advice_seeking';
    if (this.isStoryRequest(lowerInput)) return 'story_request';
    if (this.isSharingInformation(lowerInput)) return 'information_sharing';
    if (this.isCasualChat(lowerInput)) return 'casual_conversation';
    
    return 'general';
  }

  private isQuestion(input: string): boolean {
    const questionWords = ['what', 'how', 'why', 'when', 'where', 'who', 'which', 'can you', 'could you', 'do you', 'is it', 'are you'];
    return questionWords.some(word => input.includes(word)) || input.endsWith('?');
  }

  private isRequestForHelp(input: string): boolean {
    const helpKeywords = ['help', 'assist', 'support', 'guidance', 'advice', 'suggest', 'recommend', 'stuck', 'confused'];
    return helpKeywords.some(word => input.includes(word));
  }

  private isExpressingEmotion(input: string): boolean {
    const emotionKeywords = ['feel', 'feeling', 'sad', 'happy', 'angry', 'frustrated', 'excited', 'worried', 'anxious', 'stressed'];
    return emotionKeywords.some(word => input.includes(word));
  }

  private isSeekingAdvice(input: string): boolean {
    const adviceKeywords = ['should i', 'what if', 'how can i', 'best way', 'tips for', 'advice on', 'thoughts on'];
    return adviceKeywords.some(phrase => input.includes(phrase));
  }

  private isStoryRequest(input: string): boolean {
    const storyKeywords = ['tell me a story', 'story about', 'can you tell', 'create a story', 'write a story', 'story for', 'bedtime story', 'short story', 'make up a story'];
    return storyKeywords.some(phrase => input.includes(phrase));
  }

  private isSharingInformation(input: string): boolean {
    const sharingKeywords = ['i did', 'i went', 'yesterday', 'today', 'i have', 'i am', 'just finished', 'recently'];
    return sharingKeywords.some(phrase => input.includes(phrase));
  }

  private isCasualChat(input: string): boolean {
    const casualKeywords = ['hello', 'hi', 'hey', 'good morning', 'good evening', 'how are you', 'whats up'];
    return casualKeywords.some(phrase => input.includes(phrase));
  }

  private updateUserProfile(input: string) {
    // Extract interests and goals from conversation
    const interests = this.extractInterests(input);
    const goals = this.extractGoals(input);
    
    if (interests.length > 0) {
      this.context.userProfile.interests = [...(this.context.userProfile.interests || []), ...interests];
    }
    
    if (goals.length > 0) {
      this.context.userProfile.goals = [...(this.context.userProfile.goals || []), ...goals];
    }
  }

  private extractInterests(input: string): string[] {
    const interests: string[] = [];
    const interestPatterns = [
      { pattern: /i love ([\w\s]+)/gi, category: 'love' },
      { pattern: /i enjoy ([\w\s]+)/gi, category: 'enjoy' },
      { pattern: /i like ([\w\s]+)/gi, category: 'like' },
      { pattern: /interested in ([\w\s]+)/gi, category: 'interest' },
      { pattern: /passionate about ([\w\s]+)/gi, category: 'passion' }
    ];

    interestPatterns.forEach(({ pattern }) => {
      let match;
      while ((match = pattern.exec(input)) !== null) {
        if (match[1]) {
          interests.push(match[1].trim());
        }
      }
    });

    return interests;
  }

  private extractGoals(input: string): string[] {
    const goals: string[] = [];
    const goalPatterns = [
      /i want to ([\w\s]+)/gi,
      /i hope to ([\w\s]+)/gi,
      /i plan to ([\w\s]+)/gi,
      /my goal is ([\w\s]+)/gi,
      /trying to ([\w\s]+)/gi
    ];

    goalPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(input)) !== null) {
        if (match[1]) {
          goals.push(match[1].trim());
        }
      }
    });

    return goals;
  }

  generateResponse(userInput: string, intent: string): string {
    const recentContext = this.getRecentContext();
    
    switch (intent) {
      case 'question':
        return this.handleQuestion(userInput, recentContext);
      case 'help_request':
        return this.handleHelpRequest(userInput, recentContext);
      case 'emotional_expression':
        return this.handleEmotionalExpression(userInput, recentContext);
      case 'advice_seeking':
        return this.handleAdviceSeeking(userInput, recentContext);
      case 'story_request':
        return this.handleStoryRequest(userInput, recentContext);
      case 'information_sharing':
        return this.handleInformationSharing(userInput, recentContext);
      case 'casual_conversation':
        return this.handleCasualConversation(userInput, recentContext);
      default:
        return this.handleGeneral(userInput, recentContext);
    }
  }

  private getRecentContext(): string {
    return this.context.conversationHistory
      .slice(-5)
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n');
  }

  private handleQuestion(input: string, context: string): string {
    const lowerInput = input.toLowerCase();

    // Check for story requests phrased as questions
    if (lowerInput.includes('story') && (lowerInput.includes('tell') || lowerInput.includes('share') || lowerInput.includes('know'))) {
      return this.handleStoryRequest(input, context);
    }

    // Scientific and factual questions
    if (lowerInput.includes('how does') || lowerInput.includes('how do')) {
      return this.generateExplanatoryResponse(input);
    }

    // Definition questions
    if (lowerInput.includes('what is') || lowerInput.includes('what are')) {
      return this.generateDefinitionResponse(input);
    }

    // Comparison questions
    if (lowerInput.includes('difference between') || lowerInput.includes('vs') || lowerInput.includes('versus')) {
      return this.generateComparisonResponse(input);
    }

    // Personal questions about AI
    if (lowerInput.includes('are you') || lowerInput.includes('can you') || lowerInput.includes('do you')) {
      return this.generatePersonalResponse(input);
    }

    // Time-related questions
    if (lowerInput.includes('what time') || lowerInput.includes('when') || lowerInput.includes('how long')) {
      return "I'd be happy to help with timing questions! However, I don't have access to real-time information like the current time or your local timezone. For time-related information, I'd recommend checking your device's clock or asking about timeframes in general terms. Is there something specific about timing or scheduling I can help you think through?";
    }

    // Weather questions
    if (lowerInput.includes('weather') || lowerInput.includes('temperature') || lowerInput.includes('rain') || lowerInput.includes('sunny')) {
      return "I'd love to help with weather information! For current conditions and forecasts, I recommend checking a reliable weather service like Weather.com, your phone's weather app, or asking a voice assistant. Weather changes frequently, so real-time sources are most accurate. Is there anything about weather patterns or seasonal planning I can help you think through?";
    }

    // Location questions  
    if (lowerInput.includes('where is') || lowerInput.includes('location') || lowerInput.includes('address')) {
      return "For location and address information, I'd recommend using a mapping service like Google Maps, Apple Maps, or similar navigation apps. These provide current, accurate location data and directions. Is there something about travel planning or location-based decisions I can help you think through?";
    }

    return this.generateContextualResponse(input, context);
  }

  private generateExplanatoryResponse(input: string): string {
    const lowerInput = input.toLowerCase();
    
    // Habit-related explanations
    if (lowerInput.includes('habit')) {
      return "Great question about habit formation! Here's how habits actually work:\n\n**The Habit Loop:**\n1. **Cue** - Environmental trigger (time, location, emotion, etc.)\n2. **Routine** - The behavior itself \n3. **Reward** - The benefit your brain receives\n\n**The Science:**\nYour brain creates neural pathways through repetition. The basal ganglia (a brain region) automates repeated behaviors to save mental energy. This is why habits feel effortless once established!\n\n**Timeline:** New habits typically take 21-66 days to form, depending on complexity.\n\n**Pro tip:** Start with tiny habits (2-minute rule) and focus on consistency over intensity.\n\nWhat specific habit are you trying to build or understand better?";
    }

    // Productivity explanations
    if (lowerInput.includes('productivity') || lowerInput.includes('focus') || lowerInput.includes('concentration')) {
      return "Productivity and focus work through several key mechanisms:\n\n**Attention Management:**\n• Your brain can only focus deeply for 90-120 minutes at a time\n• After that, you need a 15-20 minute break for optimal performance\n• This is called the ultradian rhythm\n\n**Focus Strategies:**\n• **Pomodoro Technique** - 25 min work, 5 min break\n• **Time blocking** - Dedicate specific times for specific tasks\n• **Single-tasking** - Multitasking reduces efficiency by up to 40%\n\n**The Science:**\nFocus requires the prefrontal cortex, which gets fatigued with overuse. Regular breaks restore this mental resource.\n\nWhat aspect of productivity are you most curious about or struggling with?";
    }

    // Learning explanations
    if (lowerInput.includes('learn') || lowerInput.includes('memory') || lowerInput.includes('study')) {
      return "Learning and memory formation is fascinating! Here's how it works:\n\n**Memory Types:**\n• **Working memory** - Temporary storage (7±2 items)\n• **Short-term memory** - Lasts minutes to hours\n• **Long-term memory** - Permanent storage through repetition\n\n**Effective Learning Strategies:**\n1. **Spaced repetition** - Review at increasing intervals\n2. **Active recall** - Test yourself instead of re-reading\n3. **Interleaving** - Mix different types of practice\n4. **Elaboration** - Connect new info to existing knowledge\n\n**The Process:**\nLearning creates new neural connections (synapses). Sleep consolidates these connections into long-term memory.\n\nWhat type of learning or studying are you working on?";
    }

    // Motivation/psychology explanations
    if (lowerInput.includes('motivation') || lowerInput.includes('willpower') || lowerInput.includes('discipline')) {
      return "Motivation and willpower are complex psychological systems:\n\n**Types of Motivation:**\n• **Intrinsic** - Internal satisfaction and enjoyment\n• **Extrinsic** - External rewards and consequences\n• **Autonomous** - Aligned with your values and goals\n\n**How Willpower Works:**\n• It's like a muscle - gets tired with use but strengthens with training\n• Glucose depletion affects self-control (why snacks help!)\n• Decision fatigue reduces willpower throughout the day\n\n**Sustainable Strategies:**\n1. **Environment design** - Make good choices easier\n2. **Implementation intentions** - \"If X, then Y\" planning\n3. **Identity-based habits** - \"I am someone who...\"\n4. **Systems over goals** - Focus on process, not just outcomes\n\nWhat motivational challenge are you facing right now?";
    }

    // Default explanatory response
    return "That's a fascinating question that deserves a thorough explanation! To give you the most helpful and accurate information, could you tell me more specifically what aspect you're most curious about?\n\nI can provide detailed explanations on topics like:\n• The underlying mechanisms and processes\n• Step-by-step breakdowns\n• Practical applications and examples\n• Scientific research and evidence\n\nWhat would be most useful for you to understand?";
  }

  private generateDefinitionResponse(input: string): string {
    const term = this.extractTermFromDefinitionQuery(input);
    const lowerTerm = term.toLowerCase();
    
    // Common productivity and personal development terms
    if (lowerTerm.includes('habit')) {
      return "**Habit** refers to a routine behavior that's performed automatically in response to a specific cue or trigger.\n\n**Key characteristics:**\n• **Automatic** - Requires minimal conscious thought\n• **Triggered** - Activated by environmental or internal cues\n• **Rewarding** - Provides some form of benefit or satisfaction\n• **Repeated** - Done consistently over time\n\n**Types of habits:**\n• **Behavioral** - Physical actions (exercise, brushing teeth)\n• **Mental** - Thought patterns (gratitude, positive self-talk)\n• **Social** - Interpersonal behaviors (saying please/thank you)\n\n**Why they matter:** Habits make up about 40% of our daily actions, making them incredibly powerful for life change.\n\nIs there a specific type of habit you're interested in developing?";
    }

    if (lowerTerm.includes('mindfulness') || lowerTerm.includes('meditation')) {
      return "**Mindfulness** is the practice of purposefully paying attention to the present moment without judgment.\n\n**Core elements:**\n• **Awareness** - Noticing what's happening right now\n• **Attention** - Focusing on the present rather than past/future\n• **Acceptance** - Observing without trying to change or judge\n• **Non-attachment** - Not getting caught up in thoughts/emotions\n\n**Benefits:**\n• Reduced stress and anxiety\n• Improved focus and concentration\n• Better emotional regulation\n• Enhanced self-awareness\n• Increased resilience\n\n**Simple practices:**\n• Breathing exercises (5-10 minutes daily)\n• Body scans\n• Mindful eating\n• Walking meditation\n\nWould you like some specific techniques to get started?";
    }

    if (lowerTerm.includes('productivity')) {
      return "**Productivity** is the effectiveness of effort in accomplishing meaningful work and achieving desired outcomes.\n\n**Key principles:**\n• **Efficiency** - Doing things with minimal waste of time/energy\n• **Effectiveness** - Doing the right things that matter most\n• **Focus** - Concentrating attention on high-priority tasks\n• **Systems** - Repeatable processes that generate consistent results\n\n**Common misconceptions:**\n❌ Being busy = being productive\n❌ Working more hours = better results\n❌ Multitasking increases output\n\n**True productivity factors:**\n✅ Clear priorities and goals\n✅ Focused, single-tasking\n✅ Regular breaks and recovery\n✅ Elimination of low-value activities\n\nWhat aspect of productivity would you like to improve?";
    }

    if (lowerTerm.includes('goal') || lowerTerm.includes('objective')) {
      return "**Goals** are specific, desired outcomes or achievements that guide our actions and decisions.\n\n**Effective goal characteristics (SMART):**\n• **Specific** - Clear and well-defined\n• **Measurable** - Quantifiable progress indicators\n• **Achievable** - Realistic given your resources\n• **Relevant** - Aligned with your values and priorities\n• **Time-bound** - Has a clear deadline\n\n**Types of goals:**\n• **Outcome goals** - Final results you want\n• **Process goals** - Actions you'll take consistently\n• **Performance goals** - Standards you'll meet\n\n**Goal-setting tips:**\n1. Write them down (increases achievement by 42%)\n2. Break into smaller milestones\n3. Review and adjust regularly\n4. Focus on systems, not just outcomes\n\nWhat kind of goal are you working on setting?";
    }

    // Default response for unknown terms
    return `I'd be happy to explain **${term}** for you!\n\nTo give you the most accurate and helpful definition, could you provide a bit more context about:\n• What area or field this term relates to\n• Whether you're looking for a simple explanation or detailed breakdown\n• If there's a specific aspect you're most curious about\n\nThis will help me tailor the explanation to exactly what you need to know. In the meantime, is this related to personal development, productivity, health, technology, or another area?`;
  }

  private extractTermFromDefinitionQuery(input: string): string {
    const patterns = [
      /what is (a |an |the )?([\w\s]+)/i,
      /what are ([\w\s]+)/i,
      /define ([\w\s]+)/i,
      /meaning of ([\w\s]+)/i
    ];

    for (const pattern of patterns) {
      const match = input.match(pattern);
      if (match) {
        return match[match.length - 1].trim();
      }
    }

    return 'that concept';
  }

  private generateComparisonResponse(input: string): string {
    return "That's a great comparison question! I'll analyze both sides to give you a balanced perspective.\n\n**Key Differences:**\n- [I would compare the main distinguishing factors]\n- [Practical implications of each option]\n- [Context where one might be preferred over the other]\n\n**Similarities:**\n- [Common ground between the options]\n\n**Bottom Line:**\nThe choice often depends on your specific needs, goals, and circumstances. \n\nWhat's the context for this comparison? That would help me give you more targeted advice.";
  }

  private generatePersonalResponse(input: string): string {
    const lowerInput = input.toLowerCase();

    if (lowerInput.includes('are you human') || lowerInput.includes('are you real')) {
      return "I'm an AI assistant - not human, but designed to be helpful, thoughtful, and genuinely useful in our conversations. While I don't have consciousness like humans do, I can understand context, remember our conversation, and provide meaningful responses based on the patterns I've learned.\n\nI'm here to assist you with information, have thoughtful discussions, and help you work through problems. What would you like to explore together?";
    }

    if (lowerInput.includes('can you')) {
      return "I can help with a wide range of tasks! I'm particularly good at:\n\n• **Answering questions** with detailed, accurate information\n• **Problem-solving** and breaking down complex issues\n• **Creative tasks** like writing, brainstorming, and planning\n• **Analysis** of information and situations\n• **Learning support** on virtually any topic\n• **Personal coaching** for habits, goals, and productivity\n\nI also have access to current information through web search when needed. What specific task do you have in mind?";
    }

    if (lowerInput.includes('do you')) {
      return "I do my best to understand, learn from our conversation, and provide helpful responses! While I don't experience things the way humans do, I can:\n\n• Process and understand complex information\n• Remember our conversation context\n• Adapt my responses to your communication style\n• Provide emotional support and encouragement\n• Learn about your interests and goals\n\nI'm genuinely interested in helping you achieve what you're working toward. What's on your mind today?";
    }

    return "That's an interesting question about my capabilities! I'm designed to be a helpful, knowledgeable assistant that can engage in meaningful conversations. I aim to understand not just what you're asking, but why you're asking it, so I can provide the most useful response possible.\n\nIs there something specific you'd like to know about how I can help you?";
  }

  private generateContextualResponse(input: string, context: string): string {
    // Analyze context for better responses
    if (context.includes('habit') || context.includes('goal')) {
      return "Building on what we've been discussing about your goals and habits, this is a really insightful question. Let me give you a comprehensive answer that connects to what you're working on...\n\n[I would provide a detailed, contextual response here based on the conversation history]\n\nHow does this relate to the specific situation you're dealing with?";
    }

    return "That's a thoughtful question! Let me give you a comprehensive answer...\n\n[I would provide detailed information based on the specific question]\n\nI want to make sure I'm addressing exactly what you need to know. Is there a particular aspect of this you'd like me to focus on or expand upon?";
  }

  private handleHelpRequest(input: string, context: string): string {
    const lowerInput = input.toLowerCase();
    
    // Specific help categories
    if (lowerInput.includes('habit') || lowerInput.includes('routine')) {
      return "I'd love to help you with habits and routines! 🎯\n\n**I can assist with:**\n• Choosing the right habits for your goals\n• Creating sustainable morning/evening routines\n• Overcoming habit-building obstacles\n• Tracking and maintaining consistency\n• Habit stacking and environment design\n\n**Quick questions to get started:**\n• What area of your life do you want to improve?\n• Are you building a new habit or breaking an old one?\n• What's your biggest challenge with consistency?\n\nWhat specific habit or routine challenge can I help you tackle?";
    }

    if (lowerInput.includes('productivity') || lowerInput.includes('focus') || lowerInput.includes('time')) {
      return "Absolutely! I'm here to help with productivity and focus challenges. 📈\n\n**Common areas I help with:**\n• Time management and prioritization\n• Overcoming procrastination\n• Improving focus and concentration\n• Creating effective work systems\n• Balancing multiple responsibilities\n\n**To give you the best guidance:**\n• What's your biggest productivity challenge right now?\n• Are you struggling more with starting tasks or finishing them?\n• What does a typical day look like for you?\n\nTell me more about what's making you feel stuck or overwhelmed!";
    }

    if (lowerInput.includes('goal') || lowerInput.includes('plan') || lowerInput.includes('achieve')) {
      return "I'm excited to help you with goal setting and achievement! 🚀\n\n**Ways I can support you:**\n• Breaking big goals into actionable steps\n• Creating realistic timelines\n• Identifying potential obstacles and solutions\n• Building accountability systems\n• Adjusting strategies when things aren't working\n\n**Let's start with:**\n• What goal are you working toward?\n• What progress have you made so far?\n• What's feeling challenging or unclear?\n\nI'm here to help you create a clear path forward!";
    }

    if (lowerInput.includes('stress') || lowerInput.includes('overwhelm') || lowerInput.includes('balance')) {
      return "I'm here to help you work through stress and find better balance. 🧘‍♀️\n\n**We can explore:**\n• Stress management techniques and tools\n• Creating boundaries and saying no\n• Simplifying and prioritizing what matters\n• Building resilience and coping strategies\n• Work-life balance approaches\n\n**To understand your situation better:**\n• What's the main source of stress right now?\n• How is it affecting your daily life?\n• What have you tried before that helped (or didn't)?\n\nI want to help you find strategies that actually work for your specific situation.";
    }

    // General help response
    return "I'm absolutely here to help! 💪 I want to make sure I give you the most useful guidance possible.\n\n**I can help with:**\n• Personal development and growth\n• Habits, routines, and lifestyle changes\n• Productivity and time management\n• Goal setting and achievement\n• Problem-solving and decision making\n• Stress management and wellness\n• Learning and skill development\n\n**To get started:**\nCould you tell me more about what specific challenge you're facing or what area you'd like support with? The more details you share, the better I can tailor my advice to your situation.\n\nWhat's on your mind?";
  }

  private handleEmotionalExpression(input: string, context: string): string {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('sad') || lowerInput.includes('down') || lowerInput.includes('depressed')) {
      return "I hear that you're going through a difficult time, and I want you to know that what you're feeling is completely valid. It takes courage to share when you're struggling.\n\n**Right now, consider:**\n• Taking small, gentle steps rather than big changes\n• Reaching out to someone you trust if you haven't already\n• Being patient and compassionate with yourself\n\n**Gentle reminders:**\n• Difficult feelings are temporary, even when they don't feel that way\n• You've handled hard times before and found your way through\n• Small positive actions can gradually shift how you feel\n\nIf you're comfortable sharing, what's been weighing on you most? Sometimes talking through specific concerns can help lighten the load.";
    }

    if (lowerInput.includes('stressed') || lowerInput.includes('overwhelmed') || lowerInput.includes('anxious')) {
      return "Stress and feeling overwhelmed are so common, especially with everything we juggle these days. Let's break this down into manageable pieces.\n\n**Quick stress relief (right now):**\n• Take 3 deep, slow breaths\n• Name 5 things you can see, 4 you can touch, 3 you can hear\n• Remind yourself: \"I can handle this one step at a time\"\n\n**For ongoing management:**\n• Identify what's within your control vs. what isn't\n• Break big tasks into smaller, specific actions\n• Build in regular breaks and boundaries\n\nWhat's contributing most to the stress you're feeling? Let's tackle the most pressing piece first.";
    }

    return "Thank you for sharing how you're feeling. Emotions give us important information about what matters to us and what we might need to address.\n\nI'm here to listen and help you work through whatever you're experiencing. Would it help to talk about what's behind these feelings, or would you prefer to focus on practical steps to feel better?";
  }

  private handleAdviceSeeking(input: string, context: string): string {
    return "I'd be happy to share some thoughtful advice! Let me consider different angles on this situation to give you well-rounded guidance.\n\n**Here's what I'm thinking:**\n\n**Option 1:** [First approach with pros/cons]\n**Option 2:** [Alternative approach with considerations]\n**Option 3:** [Third perspective if applicable]\n\n**Questions to consider:**\n• What outcome are you hoping for?\n• What resources (time, energy, support) do you have available?\n• What has worked for you in similar situations before?\n\n**My recommendation:**\n[Specific, actionable advice based on the situation]\n\nEvery situation is unique though. What resonates most with your instincts about this decision?";
  }

  private handleStoryRequest(input: string, context: string): string {
    const lowerInput = input.toLowerCase();
    
    // Different types of stories based on request
    if (lowerInput.includes('motivational') || lowerInput.includes('inspiring') || lowerInput.includes('success')) {
      return this.generateMotivationalStory();
    }
    
    if (lowerInput.includes('habit') || lowerInput.includes('change') || lowerInput.includes('growth')) {
      return this.generateHabitStory();
    }
    
    if (lowerInput.includes('funny') || lowerInput.includes('humor') || lowerInput.includes('laugh')) {
      return this.generateFunnyStory();
    }
    
    if (lowerInput.includes('bedtime') || lowerInput.includes('relaxing') || lowerInput.includes('calm')) {
      return this.generateCalmingStory();
    }
    
    if (lowerInput.includes('adventure') || lowerInput.includes('exciting') || lowerInput.includes('journey')) {
      return this.generateAdventureStory();
    }
    
    if (lowerInput.includes('wisdom') || lowerInput.includes('life lesson') || lowerInput.includes('learning')) {
      return this.generateWisdomStory();
    }
    
    // Default: Generate a random uplifting story
    return this.generateRandomStory();
  }

  private generateMotivationalStory(): string {
    const stories = [
      "**The Bamboo Tree** 🎋\n\nA young farmer planted bamboo seeds and watered them diligently every day. For four years, nothing happened. No growth, no shoots - just barren ground. His neighbors mocked him, calling him foolish.\n\nBut the farmer didn't give up. He continued watering, believing in the process.\n\nIn the fifth year, something miraculous happened. The bamboo suddenly shot up 90 feet in just six weeks! \n\nWhat his neighbors didn't know was that for those four years, the bamboo was growing an extensive root system underground - building the foundation for explosive growth.\n\n**The lesson?** Sometimes our biggest breakthroughs come after periods of invisible progress. Your efforts are never wasted - they're building roots for your future success. 🌱✨",
      
      "**The Two Wolves** 🐺\n\nAn old Cherokee chief was teaching his grandson about life.\n\n'A fight is going on inside me,' he said. 'It's between two wolves. One wolf is evil - filled with anger, envy, sorrow, regret, greed, arrogance, and ego. The other is good - filled with joy, peace, love, hope, serenity, humility, kindness, and faith.'\n\nThe grandson thought about it and asked, 'Grandfather, which wolf will win?'\n\nThe old chief simply replied, 'The one you feed.'\n\n**The wisdom?** Every day, we choose which version of ourselves to nurture. Feed your positive thoughts, habits, and actions - they will grow stronger. Starve the negative ones, and they will fade away. 🌟",
      
      "**The Lighthouse Keeper** 💡\n\nOn a rocky coast stood an old lighthouse, its keeper devoted to maintaining the light that guided ships safely to shore. One stormy night, the keeper noticed his light was dimming.\n\nPanic set in - ships were coming! He could give up, thinking one dim light wouldn't matter in such a storm.\n\nInstead, he cleaned the lens, trimmed the wick, and polished every surface. His small light grew brighter and brighter.\n\nThat night, three ships safely reached harbor. Later, a ship captain thanked him: 'Your light saved us. In the storm, we couldn't see anything except that one bright beacon.'\n\n**The truth?** You might feel small in this big world, but your efforts, your kindness, your persistence - they matter more than you know. Keep your light burning bright. Someone, somewhere, needs to see it. 🔥"
    ];
    
    return stories[Math.floor(Math.random() * stories.length)];
  }

  private generateHabitStory(): string {
    return "**The Paper Clip Strategy** 📎\n\nThere was once a young salesperson who struggled to make consistent calls. Every day felt like starting from zero, and motivation was fleeting.\n\nThen she discovered a simple trick: she placed a jar of 120 paper clips on her desk each morning. Every time she made a sales call, she moved one clip to an empty jar.\n\nThe visual progress was addictive! She could literally see her daily achievement growing. Some days were hard, but seeing those clips pile up motivated her to keep going.\n\nWithin months, she became the top salesperson in her company. But the real magic wasn't in the calls - it was in turning an invisible habit into something visible and rewarding.\n\n**The secret?** Make your progress visible. Whether it's exercise, reading, or any habit - find a way to see your consistency. Paper clips, check marks, photos - whatever works!\n\nSmall, visible progress creates unstoppable momentum. 🚀\n\nWhat habit would you like to make visible today?";
  }

  private generateFunnyStory(): string {
    return "**The Procrastination Dragon** 🐲\n\nThere once lived a mighty dragon named Procrastinus in everyone's brain. This dragon was sneaky - it didn't breathe fire, but instead whispered sweet lies:\n\n'You have plenty of time...'\n'This task isn't that important...'\n'You'll feel more motivated tomorrow...'\n\nOne day, a brave knight named Today decided to face the dragon. But instead of fighting, Today tried something different - she brought snacks and said, 'Hey dragon, let's just do 5 minutes of this task together. Then you can go back to Netflix.'\n\nThe dragon, confused by this kindness, agreed. But something funny happened - after 5 minutes, they were both actually enjoying the task!\n\n'This isn't so bad,' admitted Procrastinus. 'Can we do 5 more minutes?'\n\nNow they work together every day. The dragon still suggests breaks (dragons need snacks), but they've become the most productive team in the kingdom!\n\n**Moral:** Don't fight your inner procrastinator - negotiate with it! Start with tiny steps, and even dragons can become your allies. 😄✨";
  }

  private generateCalmingStory(): string {
    return "**The Garden of Thoughts** 🌸\n\nIn a peaceful valley, there was a magical garden where thoughts grew like flowers. A gentle gardener tended this garden every evening, watching as the day's experiences bloomed into colorful memories.\n\nSome flowers were bright and joyful - laughter with friends, moments of accomplishment, acts of kindness. Others were darker - worries, frustrations, and fears.\n\nThe wise gardener knew a secret: she couldn't control which seeds would blow into her garden, but she could choose which ones to water.\n\nEvery evening, she would gently water the beautiful thoughts, allowing them to grow strong and fragrant. The worried thoughts? She would acknowledge them with a gentle nod, then let them naturally fade away without extra attention.\n\nAs seasons passed, her garden became a sanctuary of peace, filled with gratitude, love, and serenity. Visitors would come from far and wide, not knowing the secret was simply choosing which thoughts to nurture.\n\n**Tonight, as you rest,** imagine your own garden. What beautiful thoughts will you water before sleep? 🌙✨";
  }

  private generateAdventureStory(): string {
    return "**The Map of Possibilities** 🗺️\n\nAlex found an ancient map in their grandmother's attic, but it was unlike any map they'd ever seen. Instead of showing places, it showed possibilities:\n\n'The Valley of New Skills' lay to the north, where every challenge climbed made you stronger.\n'The Forest of Connections' spread to the east, where each person you helped became a lifelong ally.\n'The Mountains of Dreams' rose to the west, where the view from the top revealed paths you never imagined.\n\nThe map came with a peculiar compass - instead of pointing north, it pointed toward 'Next Right Step.'\n\nAlex packed light: just curiosity, courage, and a willingness to learn. The first step was scary - leaving the comfortable village of Status Quo.\n\nBut with each small adventure, the compass grew brighter. Alex discovered that the real treasure wasn't reaching any destination - it was becoming the kind of person who could navigate any terrain.\n\nYears later, Alex realized the truth: we all have this map and compass. The adventure begins the moment we decide to trust that next right step.\n\n**Your compass is pointing somewhere right now.** What adventure awaits your next step? 🧭✨";
  }

  private generateWisdomStory(): string {
    return "**The Master's Three Questions** 🤔\n\nA young seeker traveled far to find a renowned master, hoping to learn the secrets of a fulfilling life.\n\n'Master,' the seeker asked, 'what is the most important thing to know?'\n\nThe master smiled and replied with three questions:\n\n**'Who are you becoming through your daily choices?'**\nThe master explained: 'Every action is a vote for the type of person you wish to be. Choose wisely.'\n\n**'What are you contributing to the world around you?'**\n'Your purpose isn't just what you get from life, but what you give to it. Even small acts of kindness ripple outward.'\n\n**'How are you growing from your challenges?'**\n'Difficulties aren't punishments - they're invitations to become stronger, wiser, and more compassionate.'\n\nThe seeker expected complex teachings, but found profound simplicity in these questions.\n\nYears later, having become wise themselves, the former seeker realized: the questions were the answer. Living them was the practice.\n\n**Take a moment to ask yourself:** Who are you becoming? What are you contributing? How are you growing?\n\nThe answers will guide you home to yourself. 🏠💭";
  }

  private generateRandomStory(): string {
    const stories = [
      this.generateMotivationalStory(),
      this.generateHabitStory(),
      this.generateWisdomStory(),
      this.generateAdventureStory()
    ];
    
    return stories[Math.floor(Math.random() * stories.length)];
  }

  private handleInformationSharing(input: string, context: string): string {
    const responses = [
      "That's really interesting! Thank you for sharing that with me.",
      "I appreciate you telling me about this experience.",
      "That sounds like an important development in your situation.",
      "Thanks for the update - I'm glad to hear how things are going."
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    return `${randomResponse}\n\nIt sounds like this experience has given you some valuable insights. How are you feeling about how things unfolded? And what are you thinking about as next steps?\n\nI'm here if you want to process any of this further or brainstorm what comes next.`;
  }

  private handleCasualConversation(input: string, context: string): string {
    const lowerInput = input.toLowerCase();
    const timeOfDay = new Date().getHours();
    let greeting = "Hello there!";
    
    if (timeOfDay < 12) greeting = "Good morning!";
    else if (timeOfDay < 17) greeting = "Good afternoon!";
    else greeting = "Good evening!";

    // Greetings
    if (lowerInput.includes('hello') || lowerInput.includes('hi ') || lowerInput.includes('hey') || lowerInput === 'hi') {
      return `${greeting} I'm doing well and excited to chat with you! 😊\n\nI'm here for whatever kind of conversation you're in the mood for - whether that's:\n• Discussing your goals and habits\n• Brainstorming ideas or solutions\n• Having a thoughtful conversation about life\n• Answering questions about topics you're curious about\n• Just friendly chit-chat!\n\nWhat's on your mind today?`;
    }

    // How are you questions
    if (lowerInput.includes('how are you') || lowerInput.includes('how\'re you') || lowerInput.includes('how do you')) {
      return "I'm doing wonderfully, thank you for asking! 🌟 I genuinely love having conversations and helping people think through things. There's something really energizing about exploring ideas together.\n\nI'm curious about how YOUR day is going though! What's been the highlight of your day so far? Or if you're just starting your day, what are you looking forward to?";
    }

    // Weather conversations
    if (lowerInput.includes('weather') || lowerInput.includes('rain') || lowerInput.includes('sunny') || lowerInput.includes('hot') || lowerInput.includes('cold')) {
      return "Weather definitely affects how we feel and what we want to do! ☀️🌧️ I find it fascinating how a sunny day can boost energy for outdoor activities, while rainy days often feel perfect for cozy indoor pursuits like reading or reflection.\n\nHow does weather typically influence your mood or daily routine? Do you have favorite weather-dependent activities?";
    }

    // Weekend/time-related casual chat
    if (lowerInput.includes('weekend') || lowerInput.includes('monday') || lowerInput.includes('friday')) {
      return "There's something special about different days of the week, isn't there? 📅 Weekends often feel like a chance to reset, pursue hobbies, or tackle projects that got pushed aside during busy weekdays.\n\nDo you have any favorite weekend rituals or traditions? I'm always curious about how people like to spend their downtime!";
    }

    // Work/life conversations  
    if (lowerInput.includes('work') || lowerInput.includes('job') || lowerInput.includes('career')) {
      return "Work is such a big part of life! 💼 It's interesting how our relationship with work can vary so much - sometimes energizing, sometimes challenging, often a mix of both.\n\nI think the key is finding ways to make work feel meaningful and sustainable. What's your work situation like? Are you in a field you enjoy, or working toward something different?";
    }

    // Food conversations
    if (lowerInput.includes('food') || lowerInput.includes('coffee') || lowerInput.includes('lunch') || lowerInput.includes('dinner')) {
      return "Food is one of life's great pleasures! 🍎☕ I love how it can be both fuel for our bodies and a source of comfort, creativity, and social connection.\n\nAre you someone who enjoys cooking, or do you prefer simple meals? And more importantly - are you a coffee person, tea person, or something else entirely? 😄";
    }

    // General positive response
    const casualResponses = [
      "That's really interesting! I enjoy these kinds of natural conversations. Tell me more about what's been on your mind lately! 💭",
      "I love chatting about everyday life! There's something nice about casual conversation without any pressure. What else is going on with you? 😊",
      "Thanks for sharing that with me! I find that some of the best conversations happen when we're just talking naturally about whatever comes up. What else would you like to chat about? 🌟",
      "It's nice to just have a friendly conversation! I'm always curious about people's thoughts and experiences. What's something that's been interesting or important to you recently? ✨"
    ];

    return casualResponses[Math.floor(Math.random() * casualResponses.length)];
  }

  private handleGeneral(input: string, context: string): string {
    return "That's an interesting point you've raised. I want to make sure I understand what you're looking for so I can give you the most helpful response.\n\nCould you tell me a bit more about:\n• What specific aspect you're most curious about?\n• Whether you're looking for general information or advice for your particular situation?\n• If there's a particular angle or perspective you'd find most useful?\n\nI'm here to help however I can - just want to make sure I'm addressing exactly what you need!";
  }
}

// Export singleton instance
export const aiEngine = new AdvancedAIEngine();
