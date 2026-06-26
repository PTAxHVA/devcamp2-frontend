export default function PrivacyPage() {
  return (
    <div className="bg-bg-soft min-h-screen px-4 py-16">
      <div className="border-border-soft mx-auto flex max-w-3xl flex-col gap-8 rounded-2xl border bg-white p-10">
        <div>
          <h1 className="text-text-primary mb-2 text-3xl font-extrabold">Privacy Policy</h1>
          <p className="text-text-muted text-sm">Last updated: June 2026</p>
        </div>
        {[
          {
            title: '1. Information We Collect',
            content:
              'We collect information you provide when creating an account (name, email, password) and information about how you use VORA (learning progress, quiz results, roadmap preferences).',
          },
          {
            title: '2. How We Use Your Information',
            content:
              'We use your information to provide and improve our services, personalize your learning experience, send important account notifications, and analyze platform usage to enhance features.',
          },
          {
            title: '3. Data Storage',
            content:
              'Your data is stored securely on our servers. We use industry-standard encryption to protect your personal information. We do not sell your personal data to third parties.',
          },
          {
            title: '4. Cookies',
            content:
              'VORA uses cookies and similar technologies to maintain your session, remember your preferences, and improve your experience on the platform.',
          },
          {
            title: '5. Your Rights',
            content:
              'You have the right to access, correct, or delete your personal data. You can deactivate your account at any time through the Settings page. Contact us to request data deletion.',
          },
          {
            title: '6. Third-Party Services',
            content:
              'VORA may use third-party services for analytics and infrastructure. These services have their own privacy policies and we encourage you to review them.',
          },
          {
            title: '7. Contact',
            content:
              'If you have questions about this Privacy Policy, please contact us at privacy@vora.dev.',
          },
        ].map((section) => (
          <div key={section.title} className="flex flex-col gap-2">
            <h2 className="text-text-primary text-base font-bold">{section.title}</h2>
            <p className="text-text-secondary text-sm leading-relaxed">{section.content}</p>
          </div>
        ))}
        <div className="border-border-soft border-t pt-4">
          <a href="/" className="text-brand-purple-500 text-sm font-semibold hover:underline">
            ← Back to VORA
          </a>
        </div>
      </div>
    </div>
  )
}
