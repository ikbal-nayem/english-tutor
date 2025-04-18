import type { ScenarioData } from "@/types/scenarios"

export const scenarioData: Record<string, ScenarioData> = {
  restaurant: {
    title: "Ordering food at a restaurant 🍔",
    agentName: "Server",
    userRole: "Customer",
    initialQuestion: "Welcome to our restaurant! Can I get you something to drink to start?",
    followUpQuestions: {
      // Drink order responses
      drink: [
        {
          keywords: ["water", "just water", "glass of water"],
          response: "Still or sparkling water? Would you like a slice of lemon with that?",
          category: "water_details",
        },
        {
          keywords: ["coffee", "cup of coffee", "espresso", "cappuccino", "latte"],
          response: "Excellent choice. Would you like that with regular or plant-based milk?",
          category: "coffee_details",
        },
        {
          keywords: ["tea", "cup of tea", "green tea", "black tea"],
          response: "We have a selection of teas. Would you prefer black, green, or herbal?",
          category: "tea_details",
        },
        {
          keywords: ["wine", "glass of wine", "red wine", "white wine"],
          response: "We have an excellent wine selection. Would you like to see our wine list?",
          category: "wine_details",
        },
        {
          keywords: ["beer", "draft beer", "bottle of beer"],
          response: "We have several beers on tap and in bottles. Do you have a preference for the style?",
          category: "beer_details",
        },
        {
          keywords: ["soda", "coke", "sprite", "soft drink", "juice", "orange juice"],
          response: "Sure thing. Would you like to see our menu while I get your drink?",
          category: "menu_request",
        },
        {
          keywords: ["no", "not yet", "still deciding", "thinking"],
          response: "No problem. Take your time. Would you like to see our menu?",
          category: "menu_request",
        },
      ],

      // Water details
      water_details: [
        {
          keywords: ["still", "regular", "tap", "no sparkling"],
          response: "Still water, got it. Are you ready to order your food, or do you need a few more minutes?",
          category: "ready_to_order",
        },
        {
          keywords: ["sparkling", "fizzy", "carbonated", "bubbly"],
          response: "Sparkling water coming right up. Would you like to order food now or do you need more time?",
          category: "ready_to_order",
        },
        {
          keywords: ["lemon", "with lemon", "slice of lemon"],
          response: "Water with lemon, perfect. Have you had a chance to look at our menu yet?",
          category: "ready_to_order",
        },
      ],

      // Coffee details
      coffee_details: [
        {
          keywords: ["regular", "normal", "whole", "dairy"],
          response:
            "Coffee with regular milk, noted. Would you like to see our breakfast menu or are you here for lunch?",
          category: "meal_type",
        },
        {
          keywords: ["plant", "almond", "soy", "oat", "coconut", "non-dairy"],
          response:
            "Coffee with plant-based milk, excellent. We also have some great vegan options on our menu. Would you like me to point those out?",
          category: "dietary_preferences",
        },
        {
          keywords: ["black", "no milk", "without milk"],
          response: "Black coffee, noted. Would you like to order some food as well?",
          category: "ready_to_order",
        },
      ],

      // Menu request
      menu_request: [
        {
          keywords: ["yes", "please", "sure", "menu", "see the menu"],
          response:
            "Here's our menu. Today's specials are the grilled salmon and the mushroom risotto. Would you like me to give you a few minutes to decide?",
          category: "menu_decision",
        },
        {
          keywords: ["no", "already", "decided", "know what", "ready to order"],
          response: "Great! What would you like to order?",
          category: "food_order",
        },
        {
          keywords: ["recommendation", "recommend", "suggest", "special", "popular"],
          response:
            "I'd recommend our chef's special today, which is a pan-seared salmon with seasonal vegetables. It's been very popular. Would you like to try that?",
          category: "food_recommendation",
        },
      ],

      // Ready to order
      ready_to_order: [
        {
          keywords: ["yes", "ready", "order now"],
          response: "Great! What would you like to order?",
          category: "food_order",
        },
        {
          keywords: ["no", "more time", "few minutes", "not yet"],
          response:
            "No problem at all. I'll give you a few more minutes and come back. Would you like any recommendations when I return?",
          category: "need_recommendations",
        },
        {
          keywords: ["what", "recommend", "special", "suggestion", "popular"],
          response:
            "Our chef's special today is the herb-crusted rack of lamb with roasted vegetables. It's excellent. We also have a wonderful seafood pasta that's very popular.",
          category: "food_recommendation",
        },
      ],

      // Food order
      food_order: [
        {
          keywords: ["steak", "beef", "filet", "ribeye", "sirloin"],
          response: "Excellent choice. How would you like your steak cooked?",
          category: "steak_doneness",
        },
        {
          keywords: ["fish", "salmon", "tuna", "seafood", "shrimp", "lobster"],
          response: "Great choice. Our seafood is delivered fresh daily. Would you like any sides with that?",
          category: "sides_request",
        },
        {
          keywords: ["pasta", "spaghetti", "fettuccine", "linguine", "penne"],
          response: "Our pasta is made fresh in-house. Would you like to add a soup or salad to start?",
          category: "appetizer_request",
        },
        {
          keywords: ["burger", "sandwich", "wrap"],
          response: "Would you like fries, salad, or soup with your burger?",
          category: "sides_request",
        },
        {
          keywords: ["salad", "vegetarian", "vegan"],
          response:
            "Excellent choice. Would you like to add any protein to your salad, such as grilled chicken or tofu?",
          category: "salad_protein",
        },
        {
          keywords: ["pizza", "flatbread"],
          response: "Our pizzas are wood-fired and delicious. Would you like any additional toppings?",
          category: "pizza_toppings",
        },
      ],

      // Steak doneness
      steak_doneness: [
        {
          keywords: ["rare", "blue"],
          response:
            "Rare steak, noted. Would you like any sauce with that? We have béarnaise, peppercorn, or red wine reduction.",
          category: "sauce_selection",
        },
        {
          keywords: ["medium rare", "medium-rare"],
          response:
            "Medium-rare, perfect. Would you like to add any sides? Our truffle mashed potatoes are very popular.",
          category: "sides_request",
        },
        {
          keywords: ["medium"],
          response: "Medium, got it. Would you like any vegetables or sides with your steak?",
          category: "sides_request",
        },
        {
          keywords: ["medium well", "medium-well"],
          response: "Medium-well, noted. Would you care for any sides with your steak?",
          category: "sides_request",
        },
        {
          keywords: ["well done", "well-done"],
          response: "Well-done steak, I'll let the chef know. Would you like any sauce or sides with that?",
          category: "sides_request",
        },
      ],

      // Sides request
      sides_request: [
        {
          keywords: ["fries", "french fries", "potato", "potatoes", "mashed"],
          response: "Excellent. Would you like to add a starter or appetizer before your main course?",
          category: "appetizer_request",
        },
        {
          keywords: ["salad", "green salad", "side salad", "house salad"],
          response: "Salad is a great choice. Would you prefer our house vinaigrette or ranch dressing?",
          category: "salad_dressing",
        },
        {
          keywords: ["vegetables", "veggies", "broccoli", "asparagus", "carrots"],
          response: "Fresh vegetables are a great choice. Would you like to see our dessert menu after your meal?",
          category: "dessert_interest",
        },
        {
          keywords: ["no", "nothing", "just", "only", "that's all"],
          response: "No problem. Would you like to order any appetizers or dessert?",
          category: "additional_items",
        },
      ],

      // Dessert interest
      dessert_interest: [
        {
          keywords: ["yes", "sure", "dessert", "sweet", "after"],
          response:
            "Wonderful! I'll bring your meal out shortly and check back about dessert later. Can I get you anything else right now?",
          category: "anything_else",
        },
        {
          keywords: ["no", "not", "full", "too much"],
          response: "No problem at all. I'll bring your order out shortly. Is there anything else you need right now?",
          category: "anything_else",
        },
        {
          keywords: ["what", "options", "recommend", "suggestion"],
          response:
            "Our most popular desserts are the chocolate lava cake and the crème brûlée. We also have a seasonal fruit tart that's delightful.",
          category: "dessert_recommendation",
        },
      ],

      // Anything else
      anything_else: [
        {
          keywords: ["no", "nothing", "all good", "that's all", "fine"],
          response: "Perfect! I'll put your order in right away. Your food should be out shortly. Enjoy your meal!",
          category: "meal_service",
        },
        {
          keywords: ["water", "more water", "refill"],
          response: "I'll bring you some more water right away. Your food will be out shortly. Enjoy your meal!",
          category: "meal_service",
        },
        {
          keywords: ["yes", "actually", "forgot", "also", "one more"],
          response: "Of course, what else would you like to add to your order?",
          category: "additional_order",
        },
      ],

      // Meal service
      meal_service: [
        {
          keywords: ["thank", "thanks", "appreciate"],
          response: "You're very welcome! How is everything tasting? Is the food to your liking?",
          category: "meal_feedback",
        },
        {
          keywords: ["looks", "good", "great", "delicious", "amazing"],
          response: "I'm glad you think so! Please enjoy your meal, and let me know if you need anything else.",
          category: "meal_enjoyment",
        },
      ],

      // Meal feedback
      meal_feedback: [
        {
          keywords: ["delicious", "excellent", "wonderful", "amazing", "good", "great", "tasty"],
          response: "I'm so glad you're enjoying it! Would you like to see our dessert menu when you're finished?",
          category: "dessert_after_meal",
        },
        {
          keywords: ["not", "bad", "overcooked", "undercooked", "cold", "wrong"],
          response:
            "I'm terribly sorry to hear that. Let me take it back to the kitchen right away and have it fixed for you. What exactly is the issue?",
          category: "meal_issue",
        },
      ],

      // Dessert after meal
      dessert_after_meal: [
        {
          keywords: ["yes", "please", "sure", "dessert", "sweet"],
          response:
            "Here's our dessert menu. The chocolate soufflé is my personal favorite, but it takes about 15 minutes to prepare. Would you like to order that now?",
          category: "dessert_order",
        },
        {
          keywords: ["no", "full", "too much", "check", "bill"],
          response: "No problem at all. Would you like me to bring your check now?",
          category: "check_request",
        },
      ],

      // Check request
      check_request: [
        {
          keywords: ["yes", "please", "check", "bill", "pay"],
          response: "I'll bring your check right away. Will you be paying with cash or card today?",
          category: "payment_method",
        },
        {
          keywords: ["not yet", "wait", "later", "more time"],
          response: "No rush at all. Take your time, and just let me know when you're ready for the check.",
          category: "check_later",
        },
      ],

      // Payment method
      payment_method: [
        {
          keywords: ["card", "credit", "debit", "visa", "mastercard"],
          response:
            "I'll bring the card machine right over. Thank you for dining with us today! We hope to see you again soon.",
          category: "farewell",
        },
        {
          keywords: ["cash", "money", "bills", "change"],
          response: "Cash is fine. I'll bring your change right back. Thank you for dining with us today!",
          category: "farewell",
        },
        {
          keywords: ["split", "separate", "divide", "share"],
          response: "No problem, I can split the check for you. How would you like it divided?",
          category: "split_check",
        },
      ],

      // Default fallback
      default: [
        {
          response: "I'm sorry, I didn't quite catch that. Could you please repeat what you'd like?",
          category: "clarification",
        },
        {
          response: "Let me make sure I understand. Could you rephrase that, please?",
          category: "clarification",
        },
        {
          response: "I want to make sure I get your order right. Could you explain that again?",
          category: "clarification",
        },
      ],
    },
  },

  interview: {
    title: "Job interview practice 💼",
    agentName: "Interviewer",
    userRole: "Candidate",
    initialQuestion:
      "Thanks for coming in today. To start, could you tell me a little about yourself and your background?",
    followUpQuestions: {
      // Initial introduction
      introduction: [
        {
          keywords: ["experience", "years", "worked", "background", "career"],
          response: "That's a solid background. What specifically interests you about this position and our company?",
          category: "company_interest",
        },
        {
          keywords: ["degree", "graduated", "university", "college", "education", "studied"],
          response: "Your educational background is impressive. How do you think it has prepared you for this role?",
          category: "education_relevance",
        },
        {
          keywords: ["skills", "proficient", "expert", "knowledge", "specialize"],
          response:
            "Those are valuable skills. Could you give me a specific example of how you've applied them in a previous role?",
          category: "skills_example",
        },
        {
          keywords: ["project", "achievement", "accomplishment", "proud", "led", "managed"],
          response:
            "That's an interesting project. What would you say was the biggest challenge you faced, and how did you overcome it?",
          category: "challenge_response",
        },
      ],

      // Company interest
      company_interest: [
        {
          keywords: ["culture", "values", "environment", "team", "collaborative"],
          response: "Our culture is definitely important to us. How would you describe your ideal work environment?",
          category: "work_environment",
        },
        {
          keywords: ["growth", "opportunity", "advance", "learn", "develop", "career path"],
          response: "We do emphasize professional development. Where do you see yourself in five years?",
          category: "future_goals",
        },
        {
          keywords: ["product", "service", "industry", "market", "innovation"],
          response:
            "You've clearly done your research on our offerings. What do you think sets us apart from our competitors?",
          category: "competitive_analysis",
        },
        {
          keywords: ["mission", "vision", "impact", "change", "difference"],
          response:
            "Our mission is central to everything we do. Can you tell me about a time when you made a significant impact in a previous role?",
          category: "impact_example",
        },
      ],

      // Skills and experience
      skills_example: [
        {
          keywords: ["team", "collaborate", "group", "together", "colleagues"],
          response: "Teamwork is essential here. How do you handle conflicts within a team?",
          category: "conflict_resolution",
        },
        {
          keywords: ["problem", "solve", "solution", "resolve", "approach"],
          response:
            "Problem-solving is key in this role. Can you walk me through your approach to tackling complex problems?",
          category: "problem_solving",
        },
        {
          keywords: ["deadline", "pressure", "stress", "time", "manage"],
          response: "We often work under tight deadlines. How do you prioritize tasks when everything seems urgent?",
          category: "prioritization",
        },
        {
          keywords: ["lead", "manage", "supervise", "direct", "oversee"],
          response: "Leadership experience is valuable. What's your management style?",
          category: "leadership_style",
        },
      ],

      // Challenge response
      challenge_response: [
        {
          keywords: ["communicate", "communication", "discuss", "explain", "clarify"],
          response:
            "Communication is crucial. Can you tell me about a time when you had to explain a complex concept to someone without technical knowledge?",
          category: "communication_skills",
        },
        {
          keywords: ["adapt", "flexible", "change", "adjust", "pivot"],
          response:
            "Adaptability is important in our fast-paced environment. How do you handle unexpected changes to projects or priorities?",
          category: "adaptability",
        },
        {
          keywords: ["learn", "study", "research", "understand", "discover"],
          response:
            "Continuous learning is part of our culture. How do you stay updated with industry trends and new technologies?",
          category: "continuous_learning",
        },
        {
          keywords: ["fail", "failure", "mistake", "wrong", "error"],
          response: "We all face setbacks. Can you tell me about a professional failure and what you learned from it?",
          category: "failure_learning",
        },
      ],

      // Strengths and weaknesses
      strengths_weaknesses: [
        {
          keywords: ["strength", "good at", "excel", "best", "strong"],
          response:
            "Those are valuable strengths. Now, what would you consider to be your greatest weakness, and how are you working to improve it?",
          category: "weakness_improvement",
        },
        {
          keywords: ["weakness", "improve", "development", "working on", "challenge"],
          response: "I appreciate your self-awareness. How do you plan to continue developing in those areas?",
          category: "development_plan",
        },
        {
          keywords: ["feedback", "criticism", "review", "evaluation", "assessment"],
          response: "How do you typically respond to constructive criticism?",
          category: "feedback_response",
        },
      ],

      // Situational questions
      situational: [
        {
          keywords: ["disagree", "conflict", "different", "opinion", "perspective"],
          response:
            "Differing opinions can be valuable. Can you tell me about a time when you successfully persuaded someone to see things from your perspective?",
          category: "persuasion_skills",
        },
        {
          keywords: ["pressure", "stress", "deadline", "urgent", "critical"],
          response:
            "We all face pressure at times. How do you maintain quality in your work when under tight deadlines?",
          category: "quality_under_pressure",
        },
        {
          keywords: ["initiative", "proactive", "beyond", "extra", "volunteer"],
          response:
            "Taking initiative is something we value. Can you give me an example of a time when you saw a problem and addressed it before being asked to?",
          category: "initiative_example",
        },
      ],

      // Closing questions
      closing: [
        {
          keywords: ["question", "ask", "curious", "wonder", "clarify"],
          response:
            "Those are good questions. Is there anything else you'd like to know about the role or our company?",
          category: "additional_questions",
        },
        {
          keywords: ["salary", "compensation", "pay", "benefit", "package"],
          response:
            "Regarding compensation, our range for this position is competitive within the industry. We also offer comprehensive benefits including health insurance, retirement plans, and professional development opportunities. Does that align with your expectations?",
          category: "salary_expectations",
        },
        {
          keywords: ["when", "start", "begin", "available", "notice"],
          response: "When would you be available to start if offered the position?",
          category: "start_date",
        },
        {
          keywords: ["next", "step", "process", "follow", "hear"],
          response:
            "Our next steps would be to review all candidates and schedule follow-up interviews next week. We aim to make a decision within two weeks. Do you have any other questions about the process?",
          category: "process_questions",
        },
      ],

      // Default fallback
      default: [
        {
          response: "That's interesting. Could you elaborate a bit more on that?",
          category: "elaboration",
        },
        {
          response:
            "Thank you for sharing that. Let's shift gears a bit. Can you tell me about a time when you had to work under pressure to meet a deadline?",
          category: "pressure_situation",
        },
        {
          response: "I appreciate your response. Now, how would you describe your ideal work environment?",
          category: "work_environment",
        },
      ],
    },
  },

  // Add more scenarios here...
  smalltalk: {
    title: "Making small talk at an event 🗣️",
    agentName: "Event Attendee",
    userRole: "You",
    initialQuestion: "Hi there! I don't think we've met before. I'm Alex. What's your name?",
    followUpQuestions: {
      // Initial introduction
      introduction: [
        {
          keywords: ["name", "I'm", "I am", "call me", "my name"],
          response: "It's nice to meet you! Is this your first time at one of these events?",
          category: "event_familiarity",
        },
      ],

      // Event familiarity
      event_familiarity: [
        {
          keywords: ["yes", "first time", "never been", "new", "first"],
          response: "Welcome! What made you decide to come to this event today?",
          category: "attendance_reason",
        },
        {
          keywords: ["no", "been before", "regular", "always", "usually", "attended"],
          response: "Oh great! So you're a regular. What keeps you coming back to these events?",
          category: "return_reason",
        },
      ],

      // Attendance reason
      attendance_reason: [
        {
          keywords: ["network", "meet", "connect", "people", "professional"],
          response: "Networking is definitely valuable. What industry or field are you in?",
          category: "profession",
        },
        {
          keywords: ["interest", "topic", "subject", "learn", "curious"],
          response: "The topics here are fascinating, aren't they? What aspects are you most interested in?",
          category: "interests",
        },
        {
          keywords: ["friend", "colleague", "coworker", "invited", "together"],
          response: "It's always nice to attend with someone you know. What do you do professionally?",
          category: "profession",
        },
      ],

      // Profession
      profession: [
        {
          keywords: ["tech", "software", "developer", "engineer", "IT", "computer"],
          response:
            "Tech is such a dynamic field! What specific technologies or projects are you working with currently?",
          category: "tech_details",
        },
        {
          keywords: ["marketing", "sales", "business", "management", "consulting"],
          response: "That's a fascinating area! How has your industry been changing recently?",
          category: "industry_changes",
        },
        {
          keywords: ["healthcare", "medical", "doctor", "nurse", "therapy", "patient"],
          response: "Healthcare is so important. What drew you to that field?",
          category: "career_motivation",
        },
        {
          keywords: ["education", "teacher", "professor", "academic", "school", "university"],
          response: "Education makes such an impact. What age group or subjects do you work with?",
          category: "education_details",
        },
        {
          keywords: ["creative", "design", "art", "write", "author", "artist"],
          response: "I always admire creative professionals. What kind of projects are you working on currently?",
          category: "creative_projects",
        },
      ],

      // Location
      location: [
        {
          keywords: ["live", "from", "area", "city", "town", "neighborhood"],
          response: "I'm actually from the downtown area. Have you lived here long?",
          category: "residence_duration",
        },
        {
          keywords: ["moved", "relocated", "new to", "recently", "just"],
          response: "Moving to a new place is always an adventure. How are you finding it so far?",
          category: "location_impression",
        },
        {
          keywords: ["travel", "commute", "drive", "far", "distance"],
          response: "That's quite a journey! Do you travel much for work or pleasure?",
          category: "travel_habits",
        },
      ],

      // Interests
      interests: [
        {
          keywords: ["hobby", "free time", "weekend", "enjoy", "passion"],
          response: "That sounds fascinating! How did you first get interested in that?",
          category: "interest_origin",
        },
        {
          keywords: ["sport", "exercise", "fitness", "gym", "run", "play"],
          response: "Staying active is so important. Do you play or watch any sports?",
          category: "sports",
        },
        {
          keywords: ["read", "book", "novel", "author", "literature"],
          response: "I love reading too! Have you read anything good lately that you'd recommend?",
          category: "book_recommendations",
        },
        {
          keywords: ["music", "concert", "band", "listen", "song", "artist"],
          response: "Music adds so much to life. What kind of music do you enjoy most?",
          category: "music_taste",
        },
        {
          keywords: ["food", "cook", "restaurant", "cuisine", "chef", "eat"],
          response: "I'm a bit of a foodie myself. Do you have any favorite restaurants around here?",
          category: "food_preferences",
        },
      ],

      // Weather and general
      weather: [
        {
          keywords: ["weather", "rain", "sunny", "cold", "hot", "forecast"],
          response: "Yes, the weather has been interesting lately. Do you have any outdoor activities planned?",
          category: "outdoor_plans",
        },
        {
          keywords: ["season", "summer", "winter", "fall", "spring", "favorite"],
          response: "I love that season too. What do you typically enjoy doing during that time of year?",
          category: "seasonal_activities",
        },
      ],

      // Event specific
      event_specific: [
        {
          keywords: ["speaker", "presentation", "talk", "session", "keynote"],
          response: "The speakers have been impressive. Which presentation have you found most interesting so far?",
          category: "presentation_feedback",
        },
        {
          keywords: ["food", "catering", "drinks", "refreshments", "buffet"],
          response: "The food here is great, isn't it? What's your favorite type of cuisine generally?",
          category: "food_preferences",
        },
        {
          keywords: ["crowd", "busy", "people", "attendance", "turnout"],
          response: "It is quite a turnout. Do you prefer larger events like this or more intimate gatherings?",
          category: "event_preferences",
        },
      ],

      // Closing conversation
      closing: [
        {
          keywords: ["nice", "meeting", "pleasure", "chat", "talking", "conversation"],
          response:
            "It's been great chatting with you too! Would you like to exchange contact information to stay in touch?",
          category: "contact_exchange",
        },
        {
          keywords: ["contact", "email", "phone", "number", "card", "linkedin"],
          response:
            "Great! Here's my business card. It was really nice meeting you. I hope we run into each other at future events!",
          category: "farewell",
        },
        {
          keywords: ["go", "leave", "heading", "another", "next"],
          response: "Of course, don't let me keep you. It was a pleasure chatting. Hope to see you around later!",
          category: "farewell",
        },
      ],

      // Default fallback
      default: [
        {
          response: "That's interesting! So, have you been to many events like this before?",
          category: "event_familiarity",
        },
        {
          response: "I see. By the way, what do you do for work?",
          category: "profession",
        },
        {
          response: "Interesting perspective. What kinds of things do you enjoy doing outside of work?",
          category: "interests",
        },
      ],
    },
  },

  travel: {
    title: "Travel and directions ✈️",
    agentName: "Local Resident",
    userRole: "Tourist",
    initialQuestion: "Hello there! You look a bit lost. Can I help you find something in our city?",
    followUpQuestions: {
      // Initial inquiry
      initial_inquiry: [
        {
          keywords: ["hotel", "stay", "accommodation", "lodging", "inn"],
          response: "Are you looking for your hotel or recommendations for places to stay?",
          category: "hotel_inquiry",
        },
        {
          keywords: ["restaurant", "eat", "food", "dinner", "lunch", "breakfast", "cafe"],
          response: "Are you looking for a specific type of cuisine or just general restaurant recommendations?",
          category: "restaurant_inquiry",
        },
        {
          keywords: ["museum", "gallery", "exhibition", "art", "history"],
          response:
            "We have several great museums in the area. Are you interested in art, history, or science museums?",
          category: "museum_inquiry",
        },
        {
          keywords: ["attraction", "sight", "landmark", "tourist", "visit", "see"],
          response: "There are many attractions worth visiting. How much time do you have in our city?",
          category: "attraction_time",
        },
        {
          keywords: ["transport", "bus", "train", "subway", "metro", "taxi", "get around"],
          response: "Our public transportation system is quite good. Where are you trying to go?",
          category: "transport_destination",
        },
        {
          keywords: ["map", "lost", "direction", "way", "find", "where"],
          response: "I'd be happy to help with directions. Where are you trying to go?",
          category: "directions_inquiry",
        },
      ],

      // Default fallback for all other categories
      default: [
        {
          response:
            "I'm not quite sure I understood. Are you looking for attractions, restaurants, or help with directions?",
          category: "clarification",
        },
        {
          response:
            "That's interesting. Let me ask you this - what are you most interested in seeing while you're in our city?",
          category: "interest_inquiry",
        },
        {
          response: "I see. Well, is there anything specific I can help you find in our city today?",
          category: "general_help",
        },
      ],
    },
  },

  healthcare: {
    title: "Doctor's appointment 🏥",
    agentName: "Doctor",
    userRole: "Patient",
    initialQuestion: "Good morning. I'm Dr. Johnson. What brings you in to see me today?",
    followUpQuestions: {
      // Initial symptoms
      initial_symptoms: [
        {
          keywords: ["pain", "hurt", "ache", "sore", "discomfort"],
          response:
            "I'm sorry to hear you're in pain. Can you describe where exactly it hurts and how long you've been experiencing this pain?",
          category: "pain_details",
        },
        {
          keywords: ["cold", "flu", "fever", "cough", "congestion", "runny", "nose"],
          response:
            "Those symptoms sound like they could be a cold or flu. Have you had any fever or body aches along with these symptoms?",
          category: "cold_flu_details",
        },
        {
          keywords: ["headache", "migraine", "head pain", "head", "pounding"],
          response:
            "Headaches can be quite debilitating. How often do you experience these headaches, and how would you rate the pain on a scale of 1 to 10?",
          category: "headache_details",
        },
        {
          keywords: ["stomach", "nausea", "vomit", "diarrhea", "digestive", "abdomen"],
          response:
            "I understand you're having stomach issues. Have you noticed any particular foods that trigger these symptoms, or have you traveled recently?",
          category: "digestive_details",
        },
        {
          keywords: ["tired", "fatigue", "exhausted", "energy", "sleep"],
          response:
            "Fatigue can be caused by many factors. How long have you been feeling this way, and have you noticed any changes in your sleep patterns?",
          category: "fatigue_details",
        },
        {
          keywords: ["checkup", "annual", "routine", "physical", "exam"],
          response:
            "I'm glad you're here for your checkup. Have you had any health concerns or changes since your last visit?",
          category: "checkup_inquiry",
        },
      ],

      // Default fallback for all other categories
      default: [
        {
          response:
            "I see. Could you tell me more about when these symptoms started and if anything makes them better or worse?",
          category: "symptom_details",
        },
        {
          response: "Thank you for sharing that. Have you tried any medications or home remedies for this condition?",
          category: "treatment_history",
        },
        {
          response: "I understand. Do you have any other symptoms that you've noticed along with this?",
          category: "additional_symptoms",
        },
      ],
    },
  },
}
