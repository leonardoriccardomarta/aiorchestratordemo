import React, { useState } from 'react';
import { tiers, trialConfig, addOns } from '../data/pricing';

const Pricing: React.FC = () => {
  const [isYearly, setIsYearly] = useState(false);

  const handleTrialStart = (planName: string) => {
    // Analytics tracking
    if (window.gtag) {
      window.gtag('event', 'trial_start_click', {
        plan_name: planName,
        billing_cycle: isYearly ? 'yearly' : 'monthly',
      });
    }
    
    // Redirect to trial signup
    window.location.href = `/trial?plan=${planName.toLowerCase()}&billing=${isYearly ? 'yearly' : 'monthly'}`;
  };

  const handleContactSales = () => {
    // Analytics tracking
    if (window.gtag) {
      window.gtag('event', 'enterprise_contact_click', {
        plan_name: 'Enterprise',
        source: 'pricing_page',
      });
    }
    
    // Open contact form or calendar
    window.open('https://calendly.com/your-calendar', '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Build AI Chatbots That Sell
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Join 2,000+ businesses increasing sales 40% with AI-powered conversations. 
            Choose the plan that fits your business.
          </p>
          
          {/* Trial Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="font-semibold text-blue-700">Free Trial Available</span>
            </div>
            <p className="text-sm text-gray-600">
              {trialConfig.duration} days of complete Pro access • No commitment • Cancel anytime
            </p>
          </div>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`text-sm font-medium ${!isYearly ? 'text-blue-600' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isYearly ? 'bg-blue-600' : 'bg-gray-200'
              }`}
              aria-label="Toggle between monthly and yearly billing"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isYearly ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${isYearly ? 'text-blue-600' : 'text-gray-500'}`}>
              Yearly
            </span>
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
              Save 20%
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {tiers.map((tier) => {
            const currentPrice = isYearly && tier.yearlyPrice ? tier.yearlyPrice : tier.price;
            const isEnterprise = tier.name === 'Enterprise';
            
            return (
              <div
                key={tier.name}
                className={`relative bg-white rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                  tier.popular ? 'border-blue-500 shadow-lg scale-105' : 'border-gray-200'
                }`}
              >
                {/* Badge */}
                {(tier.badge || tier.popular) && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      {tier.badge || 'Most Popular'}
                    </span>
                  </div>
                )}

                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-2xl font-semibold mb-2">{tier.name}</h3>
                  
                  {/* Price Display */}
                  <div className="mb-6">
                    <div className="flex items-baseline">
                      <span className={`text-4xl font-bold ${tier.popular ? 'text-blue-600' : 'text-gray-900'}`}>
                        €{currentPrice}
                      </span>
                      {!isEnterprise && (
                        <span className="text-lg text-gray-500 ml-1">
                          /mo
                        </span>
                      )}
                    </div>
                    
                    {/* Yearly Discount */}
                    {isYearly && tier.yearlyDiscount && !isEnterprise && (
                      <div className="mt-2">
                        <span className="text-sm text-gray-500 line-through">
                          €{tier.price}/mo
                        </span>
                        <span className="ml-2 text-sm font-semibold text-green-600">
                          Save {tier.yearlyDiscount}%
                        </span>
                      </div>
                    )}
                    
                    {/* Enterprise pricing note */}
                    {isEnterprise && (
                      <p className="text-sm text-gray-500 mt-2">
                        Custom quote based on your needs
                      </p>
                    )}
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => isEnterprise ? handleContactSales() : handleTrialStart(tier.name)}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
                      tier.popular
                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {isEnterprise ? 'Contact Sales' : 'Start Free Trial'}
                  </button>
                  
                  {/* Trial note */}
                  {!isEnterprise && (
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      7-day free trial • No commitment • Cancel anytime
                    </p>
                  )}
                </div>

                <div className="p-6">
                  <p className="font-semibold mb-4 text-sm uppercase tracking-wide text-gray-700">
                    Features
                  </p>
                  <ul className="space-y-3">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {/* Usage limits for non-enterprise plans */}
                  {tier.limits && !isEnterprise && (
                    <div className="border-t border-gray-200 pt-4 mt-6">
                      <p className="font-semibold text-sm mb-2 text-gray-700">Usage Limits</p>
                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                        <div>Messages: {tier.limits.messages.toLocaleString()}</div>
                        <div>Chatbots: {tier.limits.chatbots === 999 ? 'Unlimited' : tier.limits.chatbots}</div>
                        <div>Team: {tier.limits.teamMembers}</div>
                        <div>Channels: {tier.limits.channels}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Add-ons Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Add-ons & Extras</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Extra Channels */}
            <div>
              <h3 className="font-semibold mb-3">Extra Channels</h3>
              <div className="space-y-2 text-sm">
                {Object.entries(addOns.extraChannels).map(([key, channel]) => (
                  <div key={key} className="flex justify-between">
                    <span>{channel.name}</span>
                    <span className="font-medium">€{channel.price}/mo</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Premium Features */}
            <div>
              <h3 className="font-semibold mb-3">Premium Features</h3>
              <div className="space-y-2 text-sm">
                {Object.entries(addOns.premiumFeatures).map(([key, feature]) => (
                  <div key={key} className="flex justify-between">
                    <span>{feature.name}</span>
                    <span className="font-medium">€{feature.price}/mo</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Usage */}
            <div>
              <h3 className="font-semibold mb-3">Extra Usage</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Message Overage</span>
                  <span className="font-medium">€{addOns.messageOverage.price} per message</span>
                </div>
                <div className="flex justify-between">
                  <span>Team Members</span>
                  <span className="font-medium">€{addOns.teamMembers.pricePerUser}/user/mo</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enterprise CTA */}
        <div className="text-center bg-gray-900 text-white rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-4">Need a Custom Solution?</h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Enterprise customers with 500k+ messages/month get custom pricing, 
            dedicated infrastructure, and white-glove support.
          </p>
          <button 
            onClick={handleContactSales}
            className="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Schedule a Call
          </button>
        </div>
        
        {/* Trust Signals */}
        <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
            <span>99.9% Uptime SLA</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
            <span>GDPR Compliant</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
            <span>24/7 Support</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
            <span>Setup in 24 hours</span>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-2">How does the 7-day trial work?</h3>
              <p className="text-gray-600 text-sm">
                You get complete access to Pro plan features for 7 days. No restrictions, 
                no hidden limitations. Cancel anytime during the trial at no cost.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Can I change plans anytime?</h3>
              <p className="text-gray-600 text-sm">
                Yes! You can upgrade or downgrade your plan at any time. 
                Changes take effect immediately with prorated billing.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">What happens if I exceed my message limit?</h3>
              <p className="text-gray-600 text-sm">
                We'll notify you before you reach your limit. You can upgrade your plan 
                or purchase additional messages at €0.003 per message.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Is there a setup fee?</h3>
              <p className="text-gray-600 text-sm">
                No setup fees for any plan. We provide free onboarding assistance 
                to help you get started quickly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;