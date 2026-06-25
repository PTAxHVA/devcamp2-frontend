import type { ReactNode } from 'react'
import { Link } from 'react-router'

interface LegalPageProps {
  title: string
  updated: string
  children: ReactNode
}

function LegalPage({ title, updated, children }: LegalPageProps) {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <Link to="/" className="text-sm text-indigo-600 hover:underline">
        ← Back to home
      </Link>
      <h1 className="text-text-primary mt-4 text-3xl font-extrabold">{title}</h1>
      <p className="text-text-muted mt-1 text-sm">Last updated: {updated}</p>
      <div className="text-text-secondary mt-6 flex flex-col gap-4 text-sm leading-relaxed">
        {children}
      </div>
    </div>
  )
}

export function TermsPage() {
  return (
    <LegalPage title="Terms of Service" updated="June 2026">
      <p>
        VORA (Verified Online Roadmap Advisor) is a learning platform built as an educational
        capstone project for GDG on Campus DevCamp 2. By creating an account you agree to use the
        service for personal, non-commercial learning.
      </p>
      <p>
        Learning content and roadmaps are curated for educational purposes and provided as-is,
        without warranty. We may update or remove content as the curriculum evolves.
      </p>
      <p>
        You are responsible for keeping your account credentials secure. Please do not misuse the
        service, attempt to disrupt it, or access data belonging to other users.
      </p>
      <p>
        Accounts that violate these terms may be suspended. For any questions, contact the VORA
        team.
      </p>
    </LegalPage>
  )
}

export function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="June 2026">
      <p>
        VORA collects only the data needed to run your learning experience: your account email and
        username, your onboarding questionnaire answers, and your roadmap and quiz progress.
      </p>
      <p>
        Passwords are stored hashed with bcrypt and are never readable by us. Authentication uses a
        JSON Web Token kept in your browser. We do not sell your data.
      </p>
      <p>
        Your questionnaire answers may be sent to Google Gemini to personalize roadmap suggestions.
        No identifying information beyond those answers is shared for this purpose, and the core
        learning experience works even when AI is unavailable.
      </p>
      <p>
        You can request deletion of your account data by contacting the VORA team. This is an
        educational project, not a commercial service.
      </p>
    </LegalPage>
  )
}
