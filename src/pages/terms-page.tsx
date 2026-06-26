export default function TermsPage() {
  return (
    <div className="bg-bg-soft min-h-screen px-4 py-16">
      <div className="border-border-soft mx-auto flex max-w-3xl flex-col gap-8 rounded-2xl border bg-white p-10">
        <div>
          <h1 className="text-text-primary mb-2 text-3xl font-extrabold">Terms of Service</h1>
          <p className="text-text-muted text-sm">Last updated: June 2026</p>
        </div>
        {[
          {
            title: '1. Acceptance of Terms',
            content:
              'By accessing and using VORA, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.',
          },
          {
            title: '2. Use of Service',
            content:
              'VORA provides personalized tech learning roadmaps. You agree to use the service only for lawful purposes and in accordance with these terms. You are responsible for maintaining the confidentiality of your account credentials.',
          },
          {
            title: '3. User Accounts',
            content:
              'You must provide accurate and complete information when creating an account. You are responsible for all activities that occur under your account. VORA reserves the right to terminate accounts that violate these terms.',
          },
          {
            title: '4. Intellectual Property',
            content:
              'All content on VORA, including roadmaps, learning materials, and platform design, is the property of VORA and is protected by applicable intellectual property laws.',
          },
          {
            title: '5. Limitation of Liability',
            content:
              'VORA is provided "as is" without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from your use of the platform.',
          },
          {
            title: '6. Changes to Terms',
            content:
              'VORA reserves the right to modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the new terms.',
          },
          {
            title: '7. Contact',
            content:
              'If you have questions about these Terms of Service, please contact us at support@vora.dev.',
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
