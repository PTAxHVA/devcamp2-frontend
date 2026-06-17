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
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <span className="loading loading-spinner loading-lg text-purple-600"></span>
          <p className="text-sm font-medium text-slate-500">Loading section details...</p>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-slate-50 text-center">
        <RiAlertLine className="text-5xl text-red-500 animate-pulse" />
        <p className="text-lg font-bold text-slate-800">Failed to load section details.</p>
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
      // Simulate API call as backend endpoint is not yet available
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success('Section completed successfully! (Mocked)')
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
          className="text-purple-600 transition-colors hover:text-purple-800 cursor-pointer"
        >
          Learn
        </Link>
        <RiArrowRightSLine className="text-slate-400" />
        <Link
          to={`/my-learning/topics/${topicId}${qRoadmap}`}
          className="text-purple-600 transition-colors hover:text-purple-800 cursor-pointer"
        >
          {topic.name}
        </Link>
        <RiArrowRightSLine className="text-slate-400" />
        <span className="text-slate-600">Section {sectionNumber}</span>
      </div>

      {/* Header */}
      <div className="mb-8 flex flex-col items-start justify-between gap-8 lg:flex-row">
        <div className="flex flex-1 gap-5">
          <div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-full border-2 border-purple-200 bg-purple-50 text-purple-700">
            <span className="text-3xl font-bold">{sectionNumber}</span>
          </div>
          <div>
            <h1 className="mb-2 text-3xl font-bold text-slate-900">{section.title}</h1>
            <p className="max-w-2xl text-sm leading-relaxed text-slate-600 md:text-base">
              Understand the core specifications, methods, and practical aspects of this section.
            </p>
          </div>
        </div>

        {/* Stats Card */}
        <div className="w-full shrink-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:w-80 xl:w-96">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-3 text-slate-600">
                <RiTimeLine className="text-lg text-purple-600" />
                <span className="font-medium">Duration</span>
              </div>
              <span className="font-semibold text-slate-900">{durationText}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-3 text-slate-600">
                <RiBarChartBoxLine className="text-lg text-purple-600" />
                <span className="font-medium">Difficulty</span>
              </div>
              <span className="font-semibold text-slate-900">Beginner</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-3 text-slate-600">
                <RiBookOpenLine className="text-lg text-purple-600" />
                <span className="font-medium">Topic</span>
              </div>
              <span className="font-semibold text-slate-900">{topic.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Split Content */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
        {/* Outcomes */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <h2 className="mb-2 text-lg font-bold text-slate-900">Learning outcomes</h2>
          <p className="mb-6 text-sm text-slate-600">
            By the end of this section, you will be able to:
          </p>
          <ul className="space-y-5">
            {outcomes.map((outcome) => (
              <li key={outcome} className="flex items-start gap-3">
                <RiCheckboxCircleLine className="mt-0.5 shrink-0 text-xl text-purple-600" />
                <span
                  className="text-sm font-medium text-slate-700"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(
                      outcome.replace(
                        /<([a-z]+)>/g,
                        '<code class="bg-slate-100 text-slate-800 px-1 py-0.5 rounded text-xs">&lt;$1&gt;</code>',
                      ),
                    ),
                  }}
                />
              </li>
            ))}
          </ul>
        </div>

        {/* Materials */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <h2 className="mb-2 text-lg font-bold text-slate-900">Learning materials</h2>
          <p className="mb-6 text-sm text-slate-600">
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
                  className="group flex items-center gap-4 rounded-xl border border-slate-200 p-4 transition-all hover:border-purple-300 hover:shadow-sm"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                    <Icon className="text-xl" />
                  </div>
                  <div className="flex-1">
                    <p className="mb-0.5 text-xs font-bold uppercase tracking-wider text-slate-400">
                      {getResourceTypeLabel(mat.type)}
                    </p>
                    <p className="text-sm font-bold text-slate-900 transition-colors group-hover:text-purple-700">
                      {mat.title}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs font-medium text-slate-500">
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
        <div className="mb-10 flex items-center gap-3 rounded-xl border border-brand-purple-100 bg-brand-purple-50/50 p-4 text-brand-purple-800">
          <RiInformationLine className="shrink-0 text-xl text-brand-purple-600" />
          <p className="text-sm font-medium">
            You must pass the quiz with at least {quiz?.minPassScore || QUIZ_PASS_THRESHOLD}% to
            complete this section and continue to the next one.
          </p>
        </div>
      )}

      {/* Navigation Footer */}
      <div className="flex flex-col items-center justify-between gap-6 border-t border-slate-200 pb-10 pt-6 sm:flex-row">
        {/* Previous */}
        {prevSection ? (
          <button
            onClick={() =>
              navigate(`/my-learning/topics/${topicId}/sections/${prevSection._id}${qRoadmap}`)
            }
            className="group flex w-full items-center gap-4 text-left sm:w-auto cursor-pointer"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-colors group-hover:border-slate-300">
              <RiArrowLeftLine />
            </div>
            <div>
              <p className="mb-0.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                Previous Section
              </p>
              <p className="text-sm font-semibold text-slate-900 transition-colors group-hover:text-purple-700">
                Section {currentIdx}
                <br />
                <span className="font-medium text-slate-600 transition-colors group-hover:text-purple-600">
                  {prevSection.name}
                </span>
              </p>
            </div>
          </button>
        ) : (
          <Link
            to={`/my-learning/topics/${topicId}${qRoadmap}`}
            className="group flex w-full items-center gap-4 text-left sm:w-auto cursor-pointer"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-colors group-hover:border-slate-300">
              <RiArrowLeftLine />
            </div>
            <div>
              <p className="mb-0.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                Topic Details
              </p>
              <p className="text-sm font-semibold text-slate-900 transition-colors group-hover:text-purple-700">
                Back to topic overview
              </p>
            </div>
          </Link>
        )}

        <div className="flex w-full items-center justify-between gap-6 sm:w-auto sm:justify-end">
          {nextSection && (
            <div className="hidden text-right md:block">
              <p className="mb-0.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                Next Section
              </p>
              <p className="text-sm font-medium text-slate-600">{nextSection.name}</p>
            </div>
          )}

          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            {nextSection && (
              <button
                onClick={() =>
                  navigate(`/my-learning/topics/${topicId}/sections/${nextSection._id}${qRoadmap}`)
                }
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-2.5 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50 sm:w-auto cursor-pointer"
              >
                Next Section <RiArrowRightLine />
              </button>
            )}

            {section.hasQuiz ? (
              <button
                onClick={handleStartQuiz}
                disabled={isQuizLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0B1221] px-6 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-slate-800 sm:w-auto cursor-pointer disabled:opacity-50"
              >
                <RiSparklingFill className="text-brand-purple-300 animate-pulse" /> Start Quiz
              </button>
            ) : (
              <button
                onClick={handleMarkAsComplete}
                disabled={isCompleting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0B1221] px-6 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-slate-800 sm:w-auto cursor-pointer disabled:opacity-50"
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
