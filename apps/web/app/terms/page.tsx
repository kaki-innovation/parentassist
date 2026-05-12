import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service — ParentAssist',
};

export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="font-heading text-4xl text-neutral-900 mb-8">Terms of Service</h1>
      <p className="text-sm text-neutral-500 mb-8">Last updated: May 2026</p>

      <div className="space-y-8 text-neutral-700 leading-relaxed">
        <section>
          <h2 className="font-heading text-2xl text-neutral-800 mb-3">1. Acceptance of terms</h2>
          <p>
            By downloading or using ParentAssist, you agree to these Terms of Service. If you do not agree,
            please do not use the app.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl text-neutral-800 mb-3">2. What ParentAssist provides</h2>
          <p>
            ParentAssist provides AI-generated suggestions for meal planning, children&rsquo;s activities, and
            festival planning. These suggestions are for informational purposes. Always use your own judgement
            when preparing food or planning activities for your children.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl text-neutral-800 mb-3">3. Subscriptions and payments</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Free tier: limited to 5 AI queries per day.</li>
            <li>Premium ($4.99/month or $39/year) and Family ($12.99/month or $99/year) plans include unlimited AI access.</li>
            <li>14-day free trial available. Cancel before trial ends to avoid charges.</li>
            <li>Payments are processed by Apple App Store or Google Play. Refund requests follow Apple&rsquo;s and Google&rsquo;s respective refund policies.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-2xl text-neutral-800 mb-3">4. Acceptable use</h2>
          <p>You agree not to:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Use the app for any unlawful purpose.</li>
            <li>Attempt to reverse-engineer, scrape, or abuse the API.</li>
            <li>Share your account credentials with others.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-2xl text-neutral-800 mb-3">5. AI content disclaimer</h2>
          <p>
            AI-generated content may occasionally be inaccurate. ParentAssist is not liable for any harm
            resulting from following AI suggestions. Always supervise children during activities and verify
            ingredient suitability for dietary requirements.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl text-neutral-800 mb-3">6. Governing law</h2>
          <p>These terms are governed by the laws of Victoria, Australia.</p>
        </section>

        <section>
          <h2 className="font-heading text-2xl text-neutral-800 mb-3">7. Contact</h2>
          <p>
            Questions? Email us at{' '}
            <a href="mailto:support@parentassist.app" className="text-saffron-600 hover:underline">support@parentassist.app</a>.
          </p>
        </section>
      </div>
    </main>
  );
}
