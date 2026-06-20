import { useState } from 'react'
import { useParams, useNavigate, Link, useSearchParams } from 'react-router'
import type { IconType } from 'react-icons'
import {
  RiArrowRightSLine,
  RiTimeLine,
  RiBarChartBoxLine,
  RiBookOpenLine,
  RiCheckboxCircleLine,
  RiInformationLine,
  RiArrowLeftLine,
  RiArrowRightLine,
  RiSparklingFill,
  RiAlertLine,
  RiFileTextLine,
  RiPlayCircleLine,
  RiCodeSSlashLine,
  RiFileList2Line,
} from 'react-icons/ri'
import DOMPurify from 'dompurify'
import toast from 'react-hot-toast'

import { useSectionDetail } from './hooks/use-section-detail'
import { useTopicDetail } from '@/features/topic/hooks/use-topic-detail'
import { useSectionQuiz } from './hooks/use-section-quiz'
import { QUIZ_PASS_THRESHOLD } from '@/constants/learning'

// Resource icon helper
const getResourceIcon = (type: string): IconType => {
  switch (type.toLowerCase()) {
    case 'video':
      return RiPlayCircleLine
    case 'docs':
    case 'documentation':
      return RiBookOpenLine
    case 'interactive':
    case 'project':
      return RiCodeSSlashLine
    case 'lesson':
      return RiFileTextLine
    case 'cheat sheet':
    default:
      return RiFileList2Line
  }
}

// Resource type label mapper
const getResourceTypeLabel = (type: string): string => {
  switch (type.toLowerCase()) {
    case 'video':
      return 'Video'
    case 'docs':
    case 'documentation':
      return 'Documentation'
    case 'interactive':
      return 'Interactive Demo'
    case 'project':
      return 'Practice Project'
    case 'lesson':
      return 'Lesson'
    case 'cheat sheet':
      return 'Cheat Sheet'
    default:
      return type.charAt(0).toUpperCase() + type.slice(1)
  }
}

export default function SectionDetailPage() {
  const { topicId, sectionId } = useParams<{ topicId: string; sectionId: string }>()
  const navigate = useNavigate()

  const [searchParams] = useSearchParams()
  const roadmapId = searchParams.get('roadmapId')
  const qRoadmap = roadmapId ? `?roadmapId=${roadmapId}` : ''

  // Fetch Section details
  const {
    data: section,
    isLoading: isSecLoading,
    isError: isSecError,
  } = useSectionDetail(sectionId ?? '')

  // Fetch Parent Topic details for navigation and breadcrumbs
  const { data: topic, isLoading: isTopicLoading } = useTopicDetail(topicId ?? '')

  // Fetch Quiz details if section indicates it has a quiz
  const { data: quiz, isLoading: isQuizLoading } = useSectionQuiz(
    sectionId ?? '',
    !!section?.hasQuiz,
  )

  const isLoading = isSecLoading || isTopicLoading
  const isError = isSecError || !section || !topic

  const [isCompleting, setIsCompleting] = useState(false)

  if (isLoading) {
    return (
      <div className="bg-bg-section flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="loading loading-spinner loading-lg text-brand-purple-600"></span>
          <p className="text-text-muted text-sm font-medium">Loading section details...</p>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="bg-bg-section flex h-screen flex-col items-center justify-center gap-4 text-center">
        <RiAlertLine className="text-error-text animate-pulse text-5xl" />
        <p className="text-text-primary text-lg font-bold">Failed to load section details.</p>
        <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </button>
      </div>
    )
  }

  // Sibling calculations
  const sectionList = topic.sectionList || []
  const currentIdx = sectionList.findIndex((s) => s._id === sectionId)
  const sectionNumber = currentIdx !== -1 ? currentIdx + 1 : 1

  const prevSection = currentIdx > 0 ? sectionList[currentIdx - 1] : null
  const nextSection =
    currentIdx !== -1 && currentIdx < sectionList.length - 1 ? sectionList[currentIdx + 1] : null

  // Mock outcomes to be very short and concise
  const outcomes = [
    section.contentOverview
      ? section.contentOverview
          .split('\n')
          .find((o) => o.trim().length > 0)
          ?.replace(/[*`]/g, '')
          ?.replace(/^[0-9.]+\s*/, '')
          ?.trim() || `Explain the core concepts of ${section.title}`
      : `Explain the core concepts of ${section.title}`,
  ]

  // Mock materials as requested

  // Duration
  const totalMinutes = (section.resourceList || []).reduce(
    (sum, r) => sum + (r.estimatedMinutes || 0),
    0,
  )
  const durationText = totalMinutes > 0 ? `${totalMinutes} min` : '15 min'

  const handleStartQuiz = () => {
    if (!quiz?.quizId) {
      toast.error('Quiz details are still loading. Please try again.')
      return
    }
    navigate(`/quizzes/${quiz.quizId}/attempt`)
  }

  const handleMarkAsComplete = async () => {
    setIsCompleting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success('Section completed!')
    } finally {
      setIsCompleting(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-400 p-6 lg:p-8">
      {/* Breadcrumbs */}
      <div className="mb-8 flex flex-wrap items-center gap-2 text-sm font-medium">
        <Link
          to="/dashboard"
          className="text-brand-purple-600 hover:text-brand-purple-700 cursor-pointer transition-colors"
        >
          Learn
        </Link>
        <RiArrowRightSLine className="text-text-placeholder" />
        <Link
          to={`/my-learning/topics/${topicId}${qRoadmap}`}
          className="text-brand-purple-600 hover:text-brand-purple-700 cursor-pointer transition-colors"
        >
          {topic.name}
        </Link>
        <RiArrowRightSLine className="text-text-placeholder" />
        <span className="text-text-secondary">Section {sectionNumber}</span>
      </div>

      {/* Header */}
      <div className="mb-8 flex flex-col items-start justify-between gap-8 lg:flex-row">
        <div className="flex flex-1 gap-5">
          <div className="border-border-purple bg-bg-lavender text-brand-purple-700 flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-full border-2">
            <span className="text-3xl font-bold">{sectionNumber}</span>
          </div>
          <div>
            <h1 className="text-text-primary mb-2 text-3xl font-bold">{section.title}</h1>
            <p className="text-text-secondary max-w-2xl text-sm leading-relaxed md:text-base">
              Understand the core specifications, methods, and practical aspects of this section.
            </p>
          </div>
        </div>

        {/* Stats Card */}
        <div className="border-border-soft w-full shrink-0 rounded-2xl border bg-white p-5 shadow-sm lg:w-80 xl:w-96">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <div className="text-text-secondary flex items-center gap-3">
                <RiTimeLine className="text-brand-purple-600 text-lg" />
                <span className="font-medium">Duration</span>
              </div>
              <span className="text-text-primary font-semibold">{durationText}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="text-text-secondary flex items-center gap-3">
                <RiBarChartBoxLine className="text-brand-purple-600 text-lg" />
                <span className="font-medium">Difficulty</span>
              </div>
              <span className="text-text-primary font-semibold">Beginner</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="text-text-secondary flex items-center gap-3">
                <RiBookOpenLine className="text-brand-purple-600 text-lg" />
                <span className="font-medium">Topic</span>
              </div>
              <span className="text-text-primary font-semibold">{topic.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Split Content */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
        {/* Outcomes */}
        <div className="border-border-soft rounded-2xl border bg-white p-6 shadow-sm md:p-8">
          <h2 className="text-text-primary mb-2 text-lg font-bold">Learning outcomes</h2>
          <p className="text-text-secondary mb-6 text-sm">
            By the end of this section, you will be able to:
          </p>
          <ul className="space-y-5">
            {outcomes.map((outcome) => (
              <li key={outcome} className="flex items-start gap-3">
                <RiCheckboxCircleLine className="text-brand-purple-600 mt-0.5 shrink-0 text-xl" />
                <span
                  className="text-text-secondary text-sm font-medium"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(
                      outcome.replace(
                        /<([a-z]+)>/g,
                        '<code class="bg-bg-section text-text-primary px-1 py-0.5 rounded text-xs">&lt;$1&gt;</code>',
                      ),
                    ),
                  }}
                />
              </li>
            ))}
          </ul>
        </div>

        {/* Materials */}
        <div className="border-border-soft rounded-2xl border bg-white p-6 shadow-sm md:p-8">
          <h2 className="text-text-primary mb-2 text-lg font-bold">Learning materials</h2>
          <p className="text-text-secondary mb-6 text-sm">
            Review the resources below to prepare for the quiz.
          </p>
          <div className="space-y-3">
            {(section.resourceList || []).map((mat) => {
              const Icon = getResourceIcon(mat.type)
              return (
                <a
                  key={mat.url || mat.title}
                  href={mat.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group border-border-soft hover:border-border-purple flex items-center gap-4 rounded-xl border p-4 transition-all hover:shadow-sm"
                >
                  <div className="bg-bg-lavender text-brand-purple-600 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                    <Icon className="text-xl" />
                  </div>
                  <div className="flex-1">
                    <p className="text-text-placeholder mb-0.5 text-xs font-bold tracking-wider uppercase">
                      {getResourceTypeLabel(mat.type)}
                    </p>
                    <p className="text-text-primary group-hover:text-brand-purple-700 text-sm font-bold transition-colors">
                      {mat.title}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-text-muted text-xs font-medium">
                      {mat.estimatedMinutes ? `${mat.estimatedMinutes} min` : 'External'}
                    </span>
                  </div>
                </a>
              )
            })}
          </div>
        </div>
      </div>

      {/* Info Banner */}
      {section.hasQuiz && (
        <div className="border-brand-purple-100 bg-bg-lavender/50 text-brand-purple-800 mb-10 flex items-center gap-3 rounded-xl border p-4">
          <RiInformationLine className="text-brand-purple-600 shrink-0 text-xl" />
          <p className="text-sm font-medium">
            You must pass the quiz with at least {quiz?.minPassScore || QUIZ_PASS_THRESHOLD}% to
            complete this section and continue to the next one.
          </p>
        </div>
      )}

      {/* Navigation Footer */}
      <div className="border-border-soft flex flex-col items-center justify-between gap-6 border-t pt-6 pb-10 sm:flex-row">
        {/* Previous */}
        {prevSection ? (
          <button
            onClick={() =>
              navigate(`/my-learning/topics/${topicId}/sections/${prevSection._id}${qRoadmap}`)
            }
            className="group flex w-full cursor-pointer items-center gap-4 text-left sm:w-auto"
          >
            <div className="border-border-soft text-text-secondary group-hover:border-border-input flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border bg-white transition-colors">
              <RiArrowLeftLine />
            </div>
            <div>
              <p className="text-text-muted mb-0.5 text-xs font-bold tracking-wider uppercase">
                Previous Section
              </p>
              <p className="text-text-primary group-hover:text-brand-purple-700 text-sm font-semibold transition-colors">
                Section {currentIdx}
                <br />
                <span className="text-text-secondary group-hover:text-brand-purple-600 font-medium transition-colors">
                  {prevSection.name}
                </span>
              </p>
            </div>
          </button>
        ) : (
          <Link
            to={`/my-learning/topics/${topicId}${qRoadmap}`}
            className="group flex w-full cursor-pointer items-center gap-4 text-left sm:w-auto"
          >
            <div className="border-border-soft text-text-secondary group-hover:border-border-input flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border bg-white transition-colors">
              <RiArrowLeftLine />
            </div>
            <div>
              <p className="text-text-muted mb-0.5 text-xs font-bold tracking-wider uppercase">
                Topic Details
              </p>
              <p className="text-text-primary group-hover:text-brand-purple-700 text-sm font-semibold transition-colors">
                Back to topic overview
              </p>
            </div>
          </Link>
        )}

        <div className="flex w-full items-center justify-between gap-6 sm:w-auto sm:justify-end">
          {nextSection && (
            <div className="hidden text-right md:block">
              <p className="text-text-muted mb-0.5 text-xs font-bold tracking-wider uppercase">
                Next Section
              </p>
              <p className="text-text-secondary text-sm font-medium">{nextSection.name}</p>
            </div>
          )}

          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            {nextSection && (
              <button
                onClick={() =>
                  navigate(`/my-learning/topics/${topicId}/sections/${nextSection._id}${qRoadmap}`)
                }
                className="border-border-soft text-text-secondary hover:bg-bg-section flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border bg-white px-6 py-2.5 text-sm font-bold transition-colors sm:w-auto"
              >
                Next Section <RiArrowRightLine />
              </button>
            )}

            {section.hasQuiz ? (
              <button
                onClick={handleStartQuiz}
                disabled={isQuizLoading}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#0B1221] px-6 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-slate-800 disabled:opacity-50 sm:w-auto"
              >
                <RiSparklingFill className="text-brand-purple-300 animate-pulse" /> Start Quiz
              </button>
            ) : (
              <button
                onClick={handleMarkAsComplete}
                disabled={isCompleting}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#0B1221] px-6 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-slate-800 disabled:opacity-50 sm:w-auto"
              >
                {isCompleting ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  <RiCheckboxCircleLine className="text-emerald-400" />
                )}
                {isCompleting ? 'Completing...' : 'Complete Section'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
