export interface PricingTier {
  name: string;
  price: number;
  originalPrice?: number;
  yearlyPrice?: number;
  yearlyDiscount?: number;
  popular?: boolean;
  badge?: string;
  features: string[];
  limits?: {
    messages: number;
    chatbots: number;
    teamMembers: number;
    channels: number;
  };
}

export const tiers: PricingTier[] = [
  {
    name: 'Starter',
    price: 149,
    originalPrice: 149,
    yearlyPrice: 119,
    yearlyDiscount: 20,
    popular: false,
    features: [
      '15,000 messages per month',
      '5 AI chatbots',
      'Complete analytics dashboard',
      'Email + chat support',
      'Remove branding',
      'Basic Shopify integration',
      'Mobile responsive design',
      'Basic templates',
    ],
    limits: {
      messages: 15000,
      chatbots: 5,
      teamMembers: 3,
      channels: 1,
    }
  },
  {
    name: 'Pro',
    price: 299,
    originalPrice: 299,
    yearlyPrice: 239,
    yearlyDiscount: 20,
    popular: true,
    badge: 'Most Popular',
    features: [
      '75,000 messages per month',
      'Unlimited AI chatbots',
      'Multi-channel (Shopify, WhatsApp, Telegram, Facebook)',
      'Advanced analytics + custom reports',
      'Complete API + webhooks',
      'Priority support',
      'A/B testing framework',
      'Custom integrations',
      'Advanced AI training',
    ],
    limits: {
      messages: 75000,
      chatbots: 999,
      teamMembers: 10,
      channels: 4,
    }
  },
  {
    name: 'Business',
    price: 599,
    originalPrice: 599,
    yearlyPrice: 479,
    yearlyDiscount: 20,
    popular: false,
    features: [
      '300,000 messages per month',
      'Everything in Pro +',
      'Team management (up to 25 users)',
      'Complete white-label solution',
      'Advanced A/B testing + ML optimization',
      'Dedicated account manager',
      'Custom integrations (up to 5)',
      'SLA 99.5% uptime guarantee',
      'Advanced security features',
      'Custom training & onboarding',
    ],
    limits: {
      messages: 300000,
      chatbots: 999,
      teamMembers: 25,
      channels: 8,
    }
  },
  {
    name: 'Enterprise',
    price: 1500,
    originalPrice: 1500,
    yearlyPrice: 1200,
    yearlyDiscount: 20,
    popular: false,
    badge: 'Contact Sales',
    features: [
      'Unlimited message volume',
      'Dedicated infrastructure',
      'On-premise deployment option',
      'SLA 99.9% with penalty clauses',
      'Unlimited custom integrations',
      'Dedicated development team',
      'Advanced security & compliance',
      'Multi-tenant isolation',
      'Custom AI model training',
      'White-glove implementation',
    ],
    limits: {
      messages: 999999,
      chatbots: 999,
      teamMembers: 999,
      channels: 999,
    }
  },
];

export const trialConfig = {
  duration: 7, // days
  planIncluded: 'Pro', // Plan included in trial
  requiresCreditCard: true,
  autoUpgrade: true,
  features: [
    'Complete access to Pro plan features',
    'Setup assistance included',
    'No volume limitations during trial',
    'Cancel anytime during trial period',
    'Instant activation',
    'Full feature access',
  ]
};

export const addOns = {
  messageOverage: {
    price: 0.003,
    currency: '€',
    unit: 'per message',
    description: 'Additional messages beyond your plan limit',
  },
  extraChannels: {
    whatsappBusiness: { price: 89, name: 'WhatsApp Business API' },
    telegram: { price: 39, name: 'Telegram Premium' },
    facebookMessenger: { price: 69, name: 'Facebook Messenger' },
    instagram: { price: 59, name: 'Instagram Direct' },
    customAPI: { price: 149, name: 'Custom API Integration' },
    voiceSupport: { price: 199, name: 'Voice Assistant & Phone' },
    sms: { price: 79, name: 'SMS Integration' },
    slack: { price: 49, name: 'Slack Integration' },
  },
  teamMembers: {
    pricePerUser: 39,
    currency: '€',
    unit: 'per user/month',
    minimumUsers: 3,
    description: 'Additional team members beyond plan limit',
  },
  premiumFeatures: {
    gpt4Upgrade: { price: 149, name: 'GPT-4 Turbo Upgrade', description: 'Access to latest AI model' },
    advancedMLOptimization: { price: 199, name: 'Advanced ML Optimization', description: 'AI-powered pricing & optimization' },
    customBrandingPro: { price: 299, name: 'Complete White-label', description: 'Full brand customization' },
    premiumAnalytics: { price: 179, name: 'Premium Analytics Suite', description: 'Advanced reporting & insights' },
    dedicatedSupport: { price: 399, name: '24/7 Dedicated Support', description: 'Phone + dedicated manager' },
    compliancePack: { price: 499, name: 'Compliance Pack', description: 'GDPR + SOC2 + HIPAA ready' },
  }
};

export const conversionTriggers = {
  landingPage: {
    headline: "Build AI Chatbots That Sell - 7 Days Free",
    subheadline: "Join 2,000+ businesses increasing sales 40% with AI",
    socialProof: ["Trusted by Shopify stores", "99.9% uptime", "24h setup"],
    trustSignals: ["No Setup Fees", "Cancel Anytime", "GDPR Compliant"],
    urgency: "Limited time: Save 20% on yearly plans",
  },
  trial: {
    day1: {
      title: "Welcome to Your AI Journey!",
      goal: "Set up your first chatbot in 15 minutes",
      cta: "Start Setup Wizard",
      message: "Your Pro trial is now active. Let's get you started!",
    },
    day3: {
      title: "How's Your AI Performing?",
      message: "Check your analytics and see the magic happen",
      cta: "View Analytics Dashboard",
      tip: "Tip: Most customers see 30% more engagement by day 3",
    },
    day5: {
      title: "Loving the Results?",
      message: "Secure your plan with 20% off first 3 months",
      cta: "Upgrade Now",
      urgency: "Trial expires in 2 days",
      discount: "Limited time: 20% off for early adopters",
    },
    day7: {
      title: "Your Trial Ends Today",
      message: "Continue your AI success story",
      cta: "Continue with Pro",
      urgency: "Don't lose your progress - upgrade now",
    },
  },
  recovery: {
    failed: "Update your payment method to keep your AI working",
    winback: "We miss you! Come back with 50% off your first month",
    reminder: "Your AI chatbots are waiting - reactivate your account",
  },
  social: {
    proof: [
      "2,000+ businesses trust our AI",
      "40% average sales increase",
      "99.9% customer satisfaction",
      "24/7 expert support",
    ],
    testimonials: [
      "Increased our conversion rate by 45% in just 2 weeks",
      "The AI handles 80% of our customer inquiries automatically",
      "ROI positive within the first month",
    ]
  }
};