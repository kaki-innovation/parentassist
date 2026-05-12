const features = [
  {
    emoji: '🍛',
    title: 'Smart Meal Planning',
    description:
      'AI-powered suggestions based on your diet, spice preferences, and what\'s already in your pantry. From quick weeknight dals to full Sunday feasts.',
  },
  {
    emoji: '🎨',
    title: 'Kids Activities',
    description:
      'Age-appropriate, culturally rich activities for children 2–12. Craft, cook, and create together — safely, with step-by-step guidance.',
  },
  {
    emoji: '🪔',
    title: 'Festival Planning',
    description:
      'Complete plans for Diwali, Holi, Navratri, and 12+ more festivals — recipes, decorations, kids activities, and shopping lists in one tap.',
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-heading text-4xl text-center text-neutral-900 mb-4">
          Everything a busy mum needs
        </h2>
        <p className="text-center text-neutral-500 mb-16 max-w-lg mx-auto">
          Three problems solved, every single day.
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f) => (
            <div key={f.title} className="bg-cream-50 rounded-2xl p-8 text-center">
              <div className="text-5xl mb-4">{f.emoji}</div>
              <h3 className="font-heading text-xl font-bold text-neutral-800 mb-3">{f.title}</h3>
              <p className="text-neutral-600 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
