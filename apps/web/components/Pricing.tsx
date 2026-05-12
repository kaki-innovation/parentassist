const tiers = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    highlight: false,
    features: [
      '5 AI meal suggestions/day',
      'Basic festival content',
      'Voice cook mode',
      'Gentle day flow (limited)',
      'Kids activity basics',
    ],
    cta: 'Get started free',
  },
  {
    name: 'Premium',
    price: '$4.99',
    period: '/month · or $39/year',
    highlight: true,
    features: [
      'Unlimited AI suggestions',
      'Full festival library (15+ festivals)',
      '100+ age-personalised kids activities',
      'Weekly meal planner',
      'Smart grocery lists',
      'Pantry photo upload',
      'Pair meals + activities',
    ],
    cta: 'Start 14-day free trial',
  },
  {
    name: 'Family',
    price: '$12.99',
    period: '/month · or $99/year',
    highlight: false,
    features: [
      'Everything in Premium',
      'Up to 4 family profiles',
      'Per-child preferences',
      'Shared meal plans',
    ],
    cta: 'Start 14-day free trial',
  },
];

export default function Pricing() {
  return (
    <section className="py-20 px-6 bg-cream-50">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-heading text-4xl text-center text-neutral-900 mb-4">Simple pricing</h2>
        <p className="text-center text-neutral-500 mb-16">Start free. Upgrade when you\'re ready.</p>
        <div className="grid md:grid-cols-3 gap-6 items-start">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-2xl p-8 ${
                tier.highlight
                  ? 'bg-saffron-500 text-white ring-4 ring-saffron-300 scale-105 shadow-xl'
                  : 'bg-white text-neutral-800 border border-neutral-200'
              }`}
            >
              <h3 className="font-heading text-2xl font-bold mb-1">{tier.name}</h3>
              <div className="mb-1">
                <span className="text-3xl font-bold">{tier.price}</span>
                <span className={`text-sm ml-1 ${tier.highlight ? 'text-saffron-100' : 'text-neutral-500'}`}>
                  {tier.period}
                </span>
              </div>
              <ul className="my-6 space-y-2">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <span className="mt-0.5">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#"
                className={`block text-center py-3 px-6 rounded-xl font-semibold transition-colors ${
                  tier.highlight
                    ? 'bg-white text-saffron-600 hover:bg-cream-100'
                    : 'bg-saffron-500 text-white hover:bg-saffron-600'
                }`}
              >
                {tier.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
