import {
  RiTimeLine,
  RiBriefcaseLine,
  RiBookOpenLine,
  RiCloudLine,
  RiStackLine,
  RiGlobalLine,
  RiTerminalBoxLine,
  RiQuestionnaireLine,
  RiArrowDownSLine,
} from 'react-icons/ri'

export const StepPreferences = () => {
  return (
    <div className="w-full">
      <div className="mb-10 text-left">
        <h1 className="text-4xl font-bold text-slate-900 mb-3">
          Personalize your learning experience
        </h1>
        <p className="text-lg text-slate-600 font-medium max-w-2xl">
          Answer a few question to VORA can tailor your roadmap, recommend the right resources, and
          help you reach your goal faster.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
        {/* 1. Weekly time available */}
        <div className="flex gap-4">
          <div className="mt-1">
            <div className="w-12 h-12 rounded-xl bg-brand-purple-50 text-brand-purple-600 flex items-center justify-center">
              <RiTimeLine className="w-6 h-6" />
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-lg font-bold text-slate-900 mb-1">
              Weekly time available
            </label>
            <p className="text-sm text-slate-400 mb-3">
              How many hours can you dedicate to learning each week?
            </p>
            <div className="relative">
              <select className="w-full appearance-none rounded-lg border border-slate-200 px-4 py-3 text-slate-700 bg-white focus:outline-none focus:border-brand-purple-400 focus:ring-1 focus:ring-brand-purple-400 cursor-pointer">
                <option value="">Select time...</option>
                <option value="0-5">0-5 hours</option>
                <option value="5-10">5-10 hours</option>
                <option value="10-20">10-20 hours</option>
                <option value="20+">20+ hours</option>
              </select>
              <RiArrowDownSLine className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* 2. Project type */}
        <div className="flex gap-4">
          <div className="mt-1">
            <div className="w-12 h-12 rounded-xl bg-brand-purple-50 text-brand-purple-600 flex items-center justify-center">
              <RiBriefcaseLine className="w-6 h-6" />
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-lg font-bold text-slate-900 mb-1">Project type</label>
            <p className="text-sm text-slate-400 mb-3">What type of projects interest you most?</p>
            <div className="relative">
              <select className="w-full appearance-none rounded-lg border border-slate-200 px-4 py-3 text-slate-700 bg-white focus:outline-none focus:border-brand-purple-400 focus:ring-1 focus:ring-brand-purple-400 cursor-pointer">
                <option value="">Select project type...</option>
                <option value="web">Web Applications</option>
                <option value="mobile">Mobile Apps</option>
                <option value="data">Data Science / AI</option>
              </select>
              <RiArrowDownSLine className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* 3. Learning style */}
        <div className="flex gap-4">
          <div className="mt-1">
            <div className="w-12 h-12 rounded-xl bg-brand-purple-50 text-brand-purple-600 flex items-center justify-center">
              <RiBookOpenLine className="w-6 h-6" />
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-lg font-bold text-slate-900 mb-1">Learning style</label>
            <p className="text-sm text-slate-400 mb-3">How do you prefer to learn?</p>
            <div className="relative">
              <select className="w-full appearance-none rounded-lg border border-slate-200 px-4 py-3 text-slate-700 bg-white focus:outline-none focus:border-brand-purple-400 focus:ring-1 focus:ring-brand-purple-400 cursor-pointer">
                <option value="">Select style...</option>
                <option value="video">Video Tutorials</option>
                <option value="reading">Reading Documentation</option>
                <option value="interactive">Interactive Coding</option>
              </select>
              <RiArrowDownSLine className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* 4. Target timeline */}
        <div className="flex gap-4">
          <div className="mt-1">
            <div className="w-12 h-12 rounded-xl bg-brand-purple-50 text-brand-purple-600 flex items-center justify-center">
              <RiCloudLine className="w-6 h-6" />
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-lg font-bold text-slate-900 mb-1">Target timeline</label>
            <p className="text-sm text-slate-400 mb-3">When do you want to achieve your goal?</p>
            <div className="relative">
              <select className="w-full appearance-none rounded-lg border border-slate-200 px-4 py-3 text-slate-700 bg-white focus:outline-none focus:border-brand-purple-400 focus:ring-1 focus:ring-brand-purple-400 cursor-pointer">
                <option value="">Select timeline...</option>
                <option value="1-3">1-3 months</option>
                <option value="3-6">3-6 months</option>
                <option value="6-12">6-12 months</option>
              </select>
              <RiArrowDownSLine className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* 5. Framework preference */}
        <div className="flex gap-4">
          <div className="mt-1">
            <div className="w-12 h-12 rounded-xl bg-brand-purple-50 text-brand-purple-600 flex items-center justify-center">
              <RiStackLine className="w-6 h-6" />
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-lg font-bold text-slate-900 mb-1">
              Framework preference
            </label>
            <p className="text-sm text-slate-400 mb-3">
              Which frontend framework would you like to focus on?
            </p>
            <div className="relative">
              <select className="w-full appearance-none rounded-lg border border-slate-200 px-4 py-3 text-slate-700 bg-white focus:outline-none focus:border-brand-purple-400 focus:ring-1 focus:ring-brand-purple-400 cursor-pointer">
                <option value="">Select framework...</option>
                <option value="react">React</option>
                <option value="vue">Vue</option>
                <option value="angular">Angular</option>
              </select>
              <RiArrowDownSLine className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* 6. Operating system */}
        <div className="flex gap-4">
          <div className="mt-1">
            <div className="w-12 h-12 rounded-xl bg-brand-purple-50 text-brand-purple-600 flex items-center justify-center">
              <RiGlobalLine className="w-6 h-6" />
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-lg font-bold text-slate-900 mb-1">Operating system</label>
            <p className="text-sm text-slate-400 mb-3">
              What operating system do you primarily use?
            </p>
            <div className="relative">
              <select className="w-full appearance-none rounded-lg border border-slate-200 px-4 py-3 text-slate-700 bg-white focus:outline-none focus:border-brand-purple-400 focus:ring-1 focus:ring-brand-purple-400 cursor-pointer">
                <option value="">Select OS...</option>
                <option value="windows">Windows</option>
                <option value="mac">macOS</option>
                <option value="linux">Linux</option>
              </select>
              <RiArrowDownSLine className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* 7. CLI comfort level */}
        <div className="flex gap-4">
          <div className="mt-1">
            <div className="w-12 h-12 rounded-xl bg-brand-purple-50 text-brand-purple-600 flex items-center justify-center">
              <RiTerminalBoxLine className="w-6 h-6" />
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-lg font-bold text-slate-900 mb-1">CLI comfort level</label>
            <p className="text-sm text-slate-400 mb-3">
              How comfortable are you using the command line?
            </p>
            <div className="relative">
              <select className="w-full appearance-none rounded-lg border border-slate-200 px-4 py-3 text-slate-700 bg-white focus:outline-none focus:border-brand-purple-400 focus:ring-1 focus:ring-brand-purple-400 cursor-pointer">
                <option value="">Select comfort level...</option>
                <option value="beginner">Beginner (Never used)</option>
                <option value="intermediate">Intermediate (Can run basic commands)</option>
                <option value="advanced">Advanced (Very comfortable)</option>
              </select>
              <RiArrowDownSLine className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* 8. Anything else (Textarea) */}
        <div className="flex gap-4">
          <div className="mt-1">
            <div className="w-12 h-12 rounded-xl bg-brand-purple-50 text-brand-purple-600 flex items-center justify-center">
              <RiQuestionnaireLine className="w-6 h-6" />
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-lg font-bold text-slate-900 mb-1">Anything else?</label>
            <p className="text-sm text-slate-400 mb-3">
              Share anything else we should know to personalize your roadmap
            </p>
            <textarea
              rows={3}
              placeholder="E.g., I have a background in design..."
              className="w-full rounded-lg border border-slate-200 px-4 py-3 text-slate-700 bg-white focus:outline-none focus:border-brand-purple-400 focus:ring-1 focus:ring-brand-purple-400 resize-none"
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  )
}
