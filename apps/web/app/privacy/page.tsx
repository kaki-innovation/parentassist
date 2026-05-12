import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — ParentAssist',
};

export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="font-heading text-4xl text-neutral-900 mb-8">Privacy Policy</h1>
      <p className="text-sm text-neutral-500 mb-8">Last updated: May 2026</p>

      <div className="prose prose-neutral max-w-none space-y-8 text-neutral-700 leading-relaxed">
        <section>
          <h2 className="font-heading text-2xl text-neutral-800 mb-3">1. Who we are</h2>
          <p>
            ParentAssist is operated by an individual developer based in Australia. We are subject to the
            Australian Privacy Act 1988 and the Australian Privacy Principles (APPs).
          </p>
          <p className="mt-2">Contact: <a href="mailto:privacy@parentassist.app" className="text-saffron-600 hover:underline">privacy@parentassist.app</a></p>
        </section>

        <section>
          <h2 className="font-heading text-2xl text-neutral-800 mb-3">2. What data we collect</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Account data:</strong> Email address, display name, and authentication provider (Google or Apple).</li>
            <li><strong>Preferences:</strong> Dietary preferences, spice levels, city, children&rsquo;s birth years (not names or photos).</li>
            <li><strong>Usage data:</strong> Features used, AI queries made, in-app events (via PostHog, anonymised).</li>
            <li><strong>Device data:</strong> Device type, OS version, app version — for crash reporting (Sentry).</li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-2xl text-neutral-800 mb-3">3. How we use your data</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>To provide personalised meal suggestions, kids activities, and festival plans.</li>
            <li>To improve our AI prompts and recommendation quality.</li>
            <li>To manage your subscription and process payments via RevenueCat.</li>
            <li>To send optional push notifications you opt into.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-2xl text-neutral-800 mb-3">4. AI and your data</h2>
          <p>
            When you make an AI request, your preferences (diet, spice level, children&rsquo;s ages) are sent to
            our backend, which calls Anthropic&rsquo;s Claude API. <strong>Your name, email, and any personally
            identifiable information are never sent to the AI.</strong> We replace your user ID with an
            anonymous token before each AI call.
          </p>
          <p className="mt-2">
            Anthropic&rsquo;s privacy policy governs their handling of API inputs: <a href="https://www.anthropic.com/privacy" className="text-saffron-600 hover:underline" target="_blank" rel="noopener noreferrer">anthropic.com/privacy</a>
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl text-neutral-800 mb-3">5. Children&rsquo;s privacy</h2>
          <p>
            ParentAssist is designed for use by parents. We collect only the birth year of children
            (to personalise age-appropriate content) — never their names, photos, or other identifying information.
            We do not knowingly collect personal information directly from children.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl text-neutral-800 mb-3">6. Data retention and deletion</h2>
          <p>
            You can delete your account at any time from the app settings. We will delete your personal data
            within 30 days of an account deletion request. Anonymised, aggregated analytics data may be retained
            indefinitely.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl text-neutral-800 mb-3">7. Third-party services</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Supabase</strong> — Database and authentication (Sydney region, AWS)</li>
            <li><strong>Anthropic</strong> — AI model API</li>
            <li><strong>RevenueCat</strong> — Subscription and payment management</li>
            <li><strong>PostHog</strong> — Product analytics (GDPR-compliant, EU hosting)</li>
            <li><strong>Sentry</strong> — Error monitoring (anonymised)</li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-2xl text-neutral-800 mb-3">8. Contact us</h2>
          <p>
            For privacy inquiries or data access requests, contact us at{' '}
            <a href="mailto:privacy@parentassist.app" className="text-saffron-600 hover:underline">privacy@parentassist.app</a>.
          </p>
        </section>
      </div>
    </main>
  );
}
