import {
  RiArrowRightSLine,
  RiTimeLine,
  RiBarChartBoxLine,
  RiBookOpenLine,
  RiCheckboxCircleLine,
  RiExternalLinkLine,
  RiInformationLine,
  RiArrowLeftLine,
  RiArrowRightLine,
  RiSparklingFill,
} from 'react-icons/ri'

import { TopicDataMock } from './topic-detail-data'

const TopicDetailComponent = () => {
  const { stats, outcomes, materials, navigation } = TopicDataMock

  return (
    <div className="mx-auto max-w-6xl">
      {/* Breadcrumbs */}
      <div className="mb-8 flex flex-wrap items-center gap-2 text-sm font-medium">
        <button className="text-purple-600 transition-colors hover:text-purple-800">Learn</button>
        <RiArrowRightSLine className="text-slate-400" />
        <button className="text-purple-600 transition-colors hover:text-purple-800">
          Web Fundamentals
        </button>
        <RiArrowRightSLine className="text-slate-400" />
        <button className="text-purple-600 transition-colors hover:text-purple-800">
          HTML & CSS
        </button>
        <RiArrowRightSLine className="text-slate-400" />
        <span className="text-slate-600">Section {TopicDataMock.TopicNumber}</span>
      </div>

      {/* Header */}
      <div className="mb-8 flex flex-col items-start justify-between gap-8 lg:flex-row">
        <div className="flex flex-1 gap-5">
          <div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-full border-2 border-purple-200 bg-purple-50 text-purple-700">
            <span className="text-3xl font-bold">{TopicDataMock.TopicNumber}</span>
            {/* <RiTerminalBoxLine className="text-lg" /> */}
          </div>
          <div>
            <h1 className="mb-2 text-3xl font-bold text-slate-900">{TopicDataMock.title}</h1>
            <p className="max-w-2xl text-sm leading-relaxed text-slate-600 md:text-base">
              {TopicDataMock.description}
            </p>
          </div>
        </div>

        {/* Stats Card */}
        <div className="w-full shrink-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:w-80">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-3 text-slate-600">
                <RiTimeLine className="text-lg text-purple-600" />
                <span className="font-medium">Duration</span>
              </div>
              <span className="font-semibold text-slate-900">{stats.duration}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-3 text-slate-600">
                <RiBarChartBoxLine className="text-lg text-purple-600" />
                <span className="font-medium">Difficulty</span>
              </div>
              <span className="font-semibold text-slate-900">{stats.difficulty}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-3 text-slate-600">
                <RiBookOpenLine className="text-lg text-purple-600" />
                <span className="font-medium">Topic</span>
              </div>
              <span className="font-semibold text-slate-900">{stats.topic}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Split Content */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Outcomes */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-lg font-bold text-slate-900">Learning outcomes</h2>
          <p className="mb-6 text-sm text-slate-600">
            By the end of this Topic, you will be able to:
          </p>
          <ul className="space-y-5">
            {outcomes.map((outcome, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <RiCheckboxCircleLine className="mt-0.5 shrink-0 text-xl text-purple-600" />
                <span
                  className="text-sm font-medium text-slate-700"
                  dangerouslySetInnerHTML={{
                    __html: outcome.replace(
                      /<([a-z]+)>/g,
                      '<code class="bg-slate-100 text-slate-800 px-1 py-0.5 rounded text-xs">&lt;$1&gt;</code>',
                    ),
                  }}
                />
              </li>
            ))}
          </ul>
        </div>

        {/* Materials */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-lg font-bold text-slate-900">Learning materials</h2>
          <p className="mb-6 text-sm text-slate-600">
            Review the resources below to prepare for the quiz.
          </p>
          <div className="space-y-3">
            {materials.map((mat, idx) => {
              const Icon = mat.icon
              return (
                <a
                  key={idx}
                  href="#"
                  className="group flex items-center gap-4 rounded-xl border border-slate-200 p-4 transition-all hover:border-purple-300 hover:shadow-sm"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                    <Icon className="text-xl" />
                  </div>
                  <div className="flex-1">
                    <p className="mb-0.5 text-xs font-medium text-slate-500">{mat.type}</p>
                    <p className="text-sm font-bold text-slate-900 transition-colors group-hover:text-purple-700">
                      {mat.title}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-slate-500">{mat.duration}</span>
                    <RiExternalLinkLine className="text-slate-400 transition-colors group-hover:text-purple-600" />
                  </div>
                </a>
              )
            })}
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="mb-10 flex items-center gap-3 rounded-xl border border-purple-100 bg-purple-50/50 p-4 text-purple-800">
        <RiInformationLine className="shrink-0 text-xl" />
        <p className="text-sm font-medium">
          You must pass the quiz with at least 70% to complete this Topic and continue to the next
          one.
        </p>
      </div>

      {/* Footer Navigation */}
      <div className="flex flex-col items-center justify-between gap-6 border-t border-slate-200 pb-10 pt-6 sm:flex-row">
        {/* Previous */}
        <button className="group flex w-full items-center gap-4 text-left sm:w-auto">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-colors group-hover:border-slate-300">
            <RiArrowLeftLine />
          </div>
          <div>
            <p className="mb-0.5 text-xs font-bold uppercase tracking-wider text-slate-500">
              Previous Topic
            </p>
            <p className="text-sm font-semibold text-slate-900 transition-colors group-hover:text-purple-700">
              {navigation.previous.Topic}
              <br />
              <span className="font-medium text-slate-600 transition-colors group-hover:text-purple-600">
                {navigation.previous.title}
              </span>
            </p>
          </div>
        </button>

        {/* Next & Quiz */}
        <div className="flex w-full items-center justify-between gap-6 sm:w-auto sm:justify-end">
          <div className="hidden text-right md:block">
            <p className="mb-0.5 text-xs font-bold uppercase tracking-wider text-slate-500">
              {navigation.next.Topic}
            </p>
            <p className="text-sm font-medium text-slate-600">{navigation.next.title}</p>
          </div>

          <div className="flex w-full flex-col gap-2 sm:w-auto">
            <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-2.5 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50 sm:w-auto">
              Next Section <RiArrowRightLine />
            </button>
            <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0B1221] px-6 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-slate-800 sm:w-auto">
              <RiSparklingFill className="text-brand-purple-300" /> Start Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopicDetailComponent
