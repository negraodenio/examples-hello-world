export const PRICING_TIERS = {
  FREE: {
    name: "Starter",
    price: 0,
    credits: 100,
    features: [
      "100 articles/month",
      "Basic AI journalists",
      "Standard news sources",
      "Manual publishing",
      "Basic analytics",
    ],
  },

  PRO: {
    name: "Professional",
    price: 49,
    credits: 1000,
    features: [
      "1,000 articles/month",
      "All AI journalists",
      "Premium news sources",
      "Multi-platform publishing",
      "Advanced analytics",
      "API access",
      "Priority support",
    ],
  },

  ENTERPRISE: {
    name: "Enterprise",
    price: 199,
    credits: 5000,
    features: [
      "Unlimited articles",
      "Custom AI journalists",
      "White-label solution",
      "Dedicated support",
      "Custom integrations",
      "Multi-user accounts",
      "SLA guarantee",
    ],
  },
} as const

export const API_PRICING = {
  generateArticle: 0.25,
  rewriteNews: 0.15,
  optimizeSEO: 0.1,
  searchNews: 0.05,
  multiPublish: 0.2,
} as const

export type PricingTier = keyof typeof PRICING_TIERS
